import * as anchor from "@coral-xyz/anchor";
import {
  BASE_PRECISION,
  BigNum,
  BulkAccountLoader,
  DRIFT_PROGRAM_ID,
  DriftClient,
  FUNDING_RATE_BUFFER_PRECISION,
  FUNDING_RATE_PRECISION_EXP,
  FastSingleTxSender,
  type IWallet,
  JupiterClient,
  MainnetPerpMarkets,
  MainnetSpotMarkets,
  PERCENTAGE_PRECISION,
  PRICE_PRECISION,
  PositionDirection,
  PostOnlyParams,
  QUOTE_PRECISION,
  User,
  calculateDepositRate,
  calculateEstimatedEntryPriceWithL2,
  calculateInterestRate,
  calculateLongShortFundingRateAndLiveTwaps,
  convertToNumber,
  getInsuranceFundStakeAccountPublicKey,
  getLimitOrderParams,
  getMarketOrderParams,
  getTokenAmount,
  getUserAccountPublicKeySync,
  isVariant,
  numberToSafeBN,
} from "@drift-labs/sdk";
import { IDL, VAULT_PROGRAM_ID, VaultClient } from "@drift-labs/vaults-sdk";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import { ComputeBudgetProgram } from "@solana/web3.js";
import type { Agentix, SolanaWalletBase } from "agentix";
import type { RawL2Output } from "./types";
import { MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS } from "./utils/contants";

export async function initClients(
  agent: Agentix<SolanaWalletBase>,
  params?: {
    authority: PublicKey;
    activeSubAccountId: number;
    subAccountIds: number[];
  },
) {
  const wallet: IWallet = {
    publicKey: new PublicKey(agent.wallet.getAddress()),
    signAllTransactions: async (txs) => {
      return (await agent.wallet.signAllTransactions(txs)) as Transaction[];
    },
    signTransaction: async (tx) => {
      return (await agent.wallet.signTransaction(tx)) as Transaction;
    },
  };

  const driftClient = new DriftClient({
    connection: agent.wallet.getConnection(),
    wallet,
    env: "mainnet-beta",
    authority: params?.authority,
    activeSubAccountId: params?.activeSubAccountId,
    subAccountIds: params?.subAccountIds,
    txParams: {
      computeUnitsPrice: MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
    },
    accountSubscription: {
      type: "polling",
      accountLoader: new BulkAccountLoader(agent.wallet.getConnection(), "processed", 10),
    },
    txSender: new FastSingleTxSender({
      connection: agent.wallet.getConnection(),
      wallet,
      timeout: 30000,
      blockhashRefreshInterval: 1000,
      opts: {
        commitment: agent.wallet.getConnection().commitment ?? "confirmed",
        skipPreflight: false,
        preflightCommitment: agent.wallet.getConnection().commitment ?? "confirmed",
      },
    }),
  });
  const vaultProgram = new anchor.Program(
    IDL,
    VAULT_PROGRAM_ID,
    driftClient.provider,
  );
  const vaultClient = new VaultClient({
    driftClient: driftClient as any,
    // @ts-expect-error - type mismatch due to different dep versions
    program: vaultProgram,
    cliMode: false,
  });
  await driftClient.subscribe();

  async function cleanUp() {
    await driftClient.unsubscribe();
  }

  return { driftClient, vaultClient, cleanUp };
}

/**
 * Create a drift user account provided an amount
 * @param amount amount of the token to deposit
 * @param symbol symbol of the token to deposit
 */
export async function createDriftUserAccount(
  agent: Agentix<SolanaWalletBase>,
  amount: number,
  symbol: string,
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const user = new User({
      driftClient,
      userAccountPublicKey: getUserAccountPublicKeySync(
        new PublicKey(DRIFT_PROGRAM_ID),
        new PublicKey(agent.wallet.getAddress()),
      ),
    });
    const userAccountExists = await user.exists();
    const token = MainnetSpotMarkets.find(
      (v) => v.symbol === symbol.toUpperCase(),
    );

    if (!token) {
      throw new Error(`Token with symbol ${symbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
        (v) => v.symbol,
      ).join(", ")}
      `);
    }

    if (!userAccountExists) {
      const depositAmount = numberToSafeBN(amount, token.precision);
      const [txSignature, account] =
        await driftClient.initializeUserAccountAndDepositCollateral(
          depositAmount,
          getAssociatedTokenAddressSync(token.mint, new PublicKey(agent.wallet.getAddress())),
        );

      await cleanUp();
      return { txSignature, account };
    }

    await cleanUp();
    return {
      message: "User account already exists",
      account: user.userAccountPublicKey,
    };
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to create user account: ${e.message}`);
  }
}

/**
 * Deposit to your drift user account
 * @param agent
 * @param amount
 * @param symbol
 * @param isRepay
 * @returns
 */
export async function depositToDriftUserAccount(
  agent: Agentix<SolanaWalletBase>,
  amount: number,
  symbol: string,
  isRepay = false,
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const publicKey = new PublicKey(agent.wallet.getAddress());
    const user = new User({
      driftClient,
      userAccountPublicKey: getUserAccountPublicKeySync(
        new PublicKey(DRIFT_PROGRAM_ID),
        publicKey,
      ),
    });
    const userAccountExists = await user.exists();
    const token = MainnetSpotMarkets.find(
      (v) => v.symbol === symbol.toUpperCase(),
    );

    if (!token) {
      throw new Error(
        `Token with symbol ${symbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    if (!userAccountExists) {
      throw new Error("You need to create a Drift user account first.");
    }

    const depositAmount = numberToSafeBN(amount, token.precision);

    const [depInstruction, latestBlockhash] = await Promise.all([
      driftClient.getDepositTxnIx(
        depositAmount,
        token.marketIndex,
        getAssociatedTokenAddressSync(token.mint, publicKey),
        undefined,
        isRepay,
      ),
      driftClient.connection.getLatestBlockhash(),
    ]);

    const tx = new Transaction().add(...depInstruction).add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
      }),
    );
    tx.recentBlockhash = latestBlockhash.blockhash;
    const signedTx = await agent.wallet.signTransaction(tx);
    const txSignature = await driftClient.txSender.sendRawTransaction(
      signedTx.serialize(),
      { ...driftClient.opts },
    );

    await cleanUp();
    return txSignature;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to deposit to user account: ${e.message}`);
  }
}

export async function withdrawFromDriftUserAccount(
  agent: Agentix<SolanaWalletBase>,
  amount: number,
  symbol: string,
  isBorrow = false,
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const user = new User({
      driftClient,
      userAccountPublicKey: getUserAccountPublicKeySync(
        new PublicKey(DRIFT_PROGRAM_ID),
        new PublicKey(agent.wallet.getAddress()),
      ),
    });
    const userAccountExists = await user.exists();

    if (!userAccountExists) {
      throw new Error("You need to create a Drift user account first.");
    }

    const token = MainnetSpotMarkets.find(
      (v) => v.symbol === symbol.toUpperCase(),
    );

    if (!token) {
      throw new Error(
        `Token with symbol ${symbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    const withdrawAmount = numberToSafeBN(amount, token.precision);

    const [withdrawInstruction, latestBlockhash] = await Promise.all([
      driftClient.getWithdrawalIxs(
        withdrawAmount,
        token.marketIndex,
        getAssociatedTokenAddressSync(token.mint, new PublicKey(agent.wallet.getAddress())),
        !isBorrow,
      ),
      driftClient.connection.getLatestBlockhash(),
    ]);

    const tx = new Transaction().add(...withdrawInstruction).add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
      }),
    );
    tx.recentBlockhash = latestBlockhash.blockhash;
    const signedTx = await agent.wallet.signTransaction(tx);

    const txSignature = await driftClient.txSender.sendRawTransaction(
      signedTx.serialize(),
      { ...driftClient.opts },
    );

    await cleanUp();
    return txSignature;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to withdraw from user account: ${e.message}`);
  }
}

/**
 * Open a perpetual trade on drift
 * @param agent
 * @param params.amount
 * @param params.symbol
 * @param params.action
 * @param params.type
 * @param params.price this should only be supplied if type is limit
 * @param params.reduceOnly
 */
export async function driftPerpTrade(
  agent: Agentix<SolanaWalletBase>,
  params: {
    amount: number;
    symbol: string;
    action: "long" | "short";
    type: "market" | "limit";
    price?: number | undefined;
  },
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const user = new User({
      driftClient,
      userAccountPublicKey: getUserAccountPublicKeySync(
        new PublicKey(DRIFT_PROGRAM_ID),
        new PublicKey(agent.wallet.getAddress()),
      ),
    });
    const userAccountExists = await user.exists();

    if (!userAccountExists) {
      throw new Error("You need to create a Drift user account first.");
    }

    const market = driftClient.getMarketIndexAndType(
      `${params.symbol.toUpperCase()}-PERP`,
    );

    if (!market) {
      throw new Error(
        `Token with symbol ${params.symbol} not found. Here's a list of available perp markets: ${MainnetPerpMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    const baseAssetPrice = driftClient.getOracleDataForPerpMarket(
      market.marketIndex,
    );
    const convertedAmount =
      params.amount / convertToNumber(baseAssetPrice.price, PRICE_PRECISION);

    let signature: anchor.web3.TransactionSignature;

    if (params.type === "limit") {
      if (!params.price) {
        throw new Error("Price is required for limit orders");
      }

      signature = await driftClient.placePerpOrder(
        getLimitOrderParams({
          baseAssetAmount: numberToSafeBN(convertedAmount, BASE_PRECISION),
          reduceOnly: false,
          direction:
            params.action === "long"
              ? PositionDirection.LONG
              : PositionDirection.SHORT,
          marketIndex: market.marketIndex,
          price: numberToSafeBN(params.price, PRICE_PRECISION),
          postOnly: PostOnlyParams.SLIDE,
        }),
        {
          computeUnitsPrice: 0.000001 * 1000000 * 1000000,
        },
      );
    } else {
      signature = await driftClient.placePerpOrder(
        getMarketOrderParams({
          baseAssetAmount: numberToSafeBN(convertedAmount, BASE_PRECISION),
          reduceOnly: false,
          direction:
            params.action === "long"
              ? PositionDirection.LONG
              : PositionDirection.SHORT,
          marketIndex: market.marketIndex,
        }),
        {
          computeUnitsPrice: MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
        },
      );
    }

    if (!signature) {
      throw new Error("Failed to place order. Please make sure ");
    }

    await cleanUp();
    return signature;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to place order: ${e.message}`);
  }
}

/**
 * Check if a user has a drift account
 * @param agent
 */
export async function doesUserHaveDriftAccount(agent: Agentix<SolanaWalletBase>) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const user = new User({
      driftClient,
      userAccountPublicKey: getUserAccountPublicKeySync(
        new PublicKey(DRIFT_PROGRAM_ID),
        new PublicKey(agent.wallet.getAddress()),
      ),
    });
    await user.subscribe();
    user.getActivePerpPositions();
    const userAccountExists = await user.exists();
    await cleanUp();
    await user.unsubscribe();
    return {
      hasAccount: userAccountExists,
      account: user.userAccountPublicKey,
    };
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to check user account: ${e.message}`);
  }
}

/**
 * Get account info for a drift User
 * @param agent
 * @returns
 */
export async function driftUserAccountInfo(agent: Agentix<SolanaWalletBase>) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const userPublicKey = getUserAccountPublicKeySync(
      new PublicKey(DRIFT_PROGRAM_ID),
      new PublicKey(agent.wallet.getAddress()),
    );

    const user = new User({
      driftClient,
      userAccountPublicKey: userPublicKey,
    });
    const userAccountExists = await user.exists();

    if (!userAccountExists) {
      throw new Error("User account does not exist");
    }
    await user.subscribe();
    const account = user.getUserAccount();

    const perpPositions = account.perpPositions.map((pos) => ({
      market: MainnetPerpMarkets[pos.marketIndex].symbol,
      baseAssetAmount: convertToNumber(pos.baseAssetAmount, BASE_PRECISION),
      quoteAssetAmount: convertToNumber(
        pos.quoteAssetAmount.abs(),
        QUOTE_PRECISION,
      ),
      quoteEntryAmount: convertToNumber(
        pos.quoteEntryAmount.abs(),
        QUOTE_PRECISION,
      ),
      quoteBreakEvenAmount: convertToNumber(
        pos.quoteBreakEvenAmount.abs(),
        QUOTE_PRECISION,
      ),
      settledPnl: convertToNumber(pos.settledPnl, QUOTE_PRECISION),
      openAsks: pos.openAsks.toNumber(),
      openBids: pos.openBids.toNumber(),
      openOrders: pos.openOrders,
      positionType:
        convertToNumber(pos.baseAssetAmount, BASE_PRECISION) > 0
          ? "long"
          : "short",
    }));
    const spotPositions = account.spotPositions.map((pos) => {
      const spotMarketAccount = driftClient.getSpotMarketAccount(
        pos.marketIndex,
      );

      if (!spotMarketAccount) {
        return;
      }

      const tokenBalance = getTokenAmount(
        pos.scaledBalance,
        spotMarketAccount,
        pos.balanceType,
      );

      return {
        availableBalance:
          (isVariant(pos.balanceType, "borrow") ? -1 : 1) *
          convertToNumber(
            tokenBalance,
            MainnetSpotMarkets[pos.marketIndex].precision,
          ),
        symbol: MainnetSpotMarkets[pos.marketIndex].symbol,
        openAsks: pos.openAsks.toNumber(),
        openBids: pos.openBids.toNumber(),
        openOrders: pos.openOrders,
        type: isVariant(pos.balanceType, "borrow") ? "borrow" : "deposit",
      };
    });

    const overallUserBalance = user.getNetSpotMarketValue();
    const unrealizedPnl = user.getUnrealizedPNL(true);
    const netUSDValue = convertToNumber(
      overallUserBalance.add(unrealizedPnl),
      QUOTE_PRECISION,
    );

    await cleanUp();
    await user.unsubscribe();

    return {
      name: account.name,
      accountAddress: userPublicKey.toBase58(),
      authority: account.authority,
      overallBalance: netUSDValue,
      settledPerpPnl: `$${convertToNumber(account.settledPerpPnl, QUOTE_PRECISION)}`,
      lastActiveSlot: account.lastActiveSlot.toNumber(),
      perpPositions: perpPositions.filter((pos) => pos.baseAssetAmount !== 0),
      spotPositions: spotPositions.filter((pos) => pos?.availableBalance !== 0),
    };
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to check user account: ${e.message}`);
  }
}

/**
 * Get available spot markets on drift protocol
 */
export function getAvailableDriftSpotMarkets() {
  return MainnetSpotMarkets;
}

/**
 * Get available perp markets on drift protocol
 */
export function getAvailableDriftPerpMarkets() {
  return MainnetPerpMarkets;
}

/**
 * Stake a token to the drift insurance fund
 * @param agent
 * @param amount
 * @param symbol
 */
export async function stakeToDriftInsuranceFund(
  agent: Agentix<SolanaWalletBase>,
  amount: number,
  symbol: string,
) {
  try {
    const { cleanUp, driftClient } = await initClients(agent);
    const token = MainnetSpotMarkets.find(
      (v) => v.symbol === symbol.toUpperCase(),
    );

    if (!token) {
      throw new Error(
        `Token with symbol ${symbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    const deriveInsuranceFundStakeAccount =
      getInsuranceFundStakeAccountPublicKey(
        driftClient.program.programId,
        new PublicKey(agent.wallet.getAddress()),
        token.marketIndex,
      );
    let shouldCreateAccount = false;

    try {
      await driftClient.connection.getAccountInfo(
        deriveInsuranceFundStakeAccount,
      );
    } catch (e) {
      // @ts-expect-error - error message is a string
      if (e.message.includes("Account not found")) {
        shouldCreateAccount = true;
      }
    }

    const signature = await driftClient.addInsuranceFundStake({
      amount: numberToSafeBN(amount, token.precision),
      marketIndex: token.marketIndex,
      collateralAccountPublicKey: getAssociatedTokenAddressSync(
        token.mint,
        new PublicKey(agent.wallet.getAddress()),
      ),
      initializeStakeAccount: shouldCreateAccount,
      txParams: {
        computeUnitsPrice: MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
      },
    });

    await cleanUp();
    return signature;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to get APYs: ${e.message}`);
  }
}

/**
 * Request an unstake from the drift insurance fund
 * @param agent
 * @param amount
 * @param symbol
 */
export async function requestUnstakeFromDriftInsuranceFund(
  agent: Agentix<SolanaWalletBase>,
  amount: number,
  symbol: string,
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const token = MainnetSpotMarkets.find(
      (v) => v.symbol === symbol.toUpperCase(),
    );

    if (!token) {
      throw new Error(
        `Token with symbol ${symbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    const signature = await driftClient.requestRemoveInsuranceFundStake(
      token.marketIndex,
      numberToSafeBN(amount, token.precision),
      { computeUnitsPrice: MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS },
    );

    await cleanUp();
    return signature;
  } catch (e) {
    // @ts-expect-error error message is a string
    throw new Error(`Failed to unstake from insurance fund: ${e.message}`);
  }
}

/**
 * Unstake requested funds from the drift insurance fund once cool down period is elapsed
 * @param agent
 * @param symbol
 */
export async function unstakeFromDriftInsuranceFund(
  agent: Agentix<SolanaWalletBase>,
  symbol: string,
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const token = MainnetSpotMarkets.find(
      (v) => v.symbol === symbol.toUpperCase(),
    );

    if (!token) {
      throw new Error(
        `Token with symbol ${symbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    const signature = await driftClient.removeInsuranceFundStake(
      token.marketIndex,
      getAssociatedTokenAddressSync(token.mint, new PublicKey(agent.wallet.getAddress())),
      {
        computeUnitsPrice: MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
      },
    );

    await cleanUp();
    return signature;
  } catch (e) {
    // @ts-expect-error error message is a string
    throw new Error(`Failed to unstake from insurance fund: ${e.message}`);
  }
}

/**
 * Swap a spot token for another on drift
 * @param agent
 * @param params
 * @param params.fromSymbol symbol of the token to deposit
 * @param params.toSymbol symbol of the token to receive
 * @param params.fromAmount amount of the token to deposit
 * @param params.toAmount amount of the token to receive
 * @param params.slippage slippage tolerance in percentage
 */
export async function swapSpotToken(
  agent: Agentix<SolanaWalletBase>,
  params: {
    fromSymbol: string;
    toSymbol: string;
    slippage?: number | undefined;
  } & (
    | {
        fromAmount: number;
      }
    | {
        toAmount: number;
      }
  ),
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const fromToken = MainnetSpotMarkets.find(
      (v) => v.symbol === params.fromSymbol.toUpperCase(),
    );
    const toToken = MainnetSpotMarkets.find(
      (v) => v.symbol === params.toSymbol.toUpperCase(),
    );

    if (!fromToken) {
      throw new Error(
        `Token with symbol ${params.fromSymbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    if (!toToken) {
      throw new Error(
        `Token with symbol ${params.toSymbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    let txSig: string;

    // @ts-expect-error - false undefined type conflict
    if (params.fromAmount) {
      const jupiterClient = new JupiterClient({ connection: agent.wallet.getConnection() });
      // @ts-expect-error - false undefined type conflict
      const fromAmount = numberToSafeBN(params.fromAmount, fromToken.precision);
      const res = await (
        await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${fromAmount.toNumber()}&slippageBps=${(params.slippage ?? 0.5) * 100}&swapMode=ExactIn`,
        )
      ).json();
      const signature = await driftClient.swap({
        amount: fromAmount,
        inMarketIndex: fromToken.marketIndex,
        outMarketIndex: toToken.marketIndex,
        jupiterClient: jupiterClient,
        v6: {
          quote: res,
        },
        slippageBps: (params.slippage ?? 0.5) * 100,
        swapMode: "ExactIn",
      });

      txSig = signature;
    }

    // @ts-expect-error - false undefined type conflict
    if (params.toAmount) {
      const jupiterClient = new JupiterClient({ connection: agent.wallet.getConnection() });
      // @ts-expect-error - false undefined type conflict
      const toAmount = numberToSafeBN(params.toAmount, toToken.precision);
      const res = await (
        await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${toAmount.toNumber()}&slippageBps=${(params.slippage ?? 0.5) * 100}&swapMode=ExactOut`,
        )
      ).json();
      const signature = await driftClient.swap({
        amount: toAmount,
        inMarketIndex: toToken.marketIndex,
        outMarketIndex: fromToken.marketIndex,
        jupiterClient: jupiterClient,
        v6: {
          quote: res,
        },
        slippageBps: (params.slippage ?? 0.5) * 100,
        swapMode: "ExactOut",
      });

      txSig = signature;
    }

    await cleanUp();

    // @ts-expect-error - false use before assignment
    if (txSig) {
      return txSig;
    }

    throw new Error("Either fromAmount or toAmount must be provided");
  } catch (e) {
    // @ts-expect-error error message is a string
    throw new Error(`Failed to swap token: ${e.message}`);
  }
}

/**
 * To get funding rate as a percentage, you need to multiply by the funding rate buffer precision
 * @param rawFundingRate
 */
export function getFundingRateAsPercentage(rawFundingRate: anchor.BN) {
  return BigNum.from(
    rawFundingRate.mul(FUNDING_RATE_BUFFER_PRECISION),
    FUNDING_RATE_PRECISION_EXP,
  ).toNum();
}

/**
 * Calculate the funding rate for a perpetual market
 * @param agent
 * @param marketSymbol
 */
export async function calculatePerpMarketFundingRate(
  agent: Agentix<SolanaWalletBase>,
  marketSymbol: `${string}-PERP`,
  period: "year" | "hour",
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const market = driftClient.getMarketIndexAndType(
      `${marketSymbol.toUpperCase()}`,
    );

    if (!market) {
      throw new Error(
        `This market isn't available on the Drift Protocol. Here's a list of markets that are: ${MainnetPerpMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    const marketAccount = driftClient.getPerpMarketAccount(market.marketIndex);

    if (!marketAccount) {
      throw new Error("Market account not found");
    }

    const [, , longFundingRate, shortFundingRate] =
      await calculateLongShortFundingRateAndLiveTwaps(
        marketAccount,
        driftClient.getOracleDataForPerpMarket(market.marketIndex),
        undefined,
        new anchor.BN(Date.now()),
      );

    await cleanUp();

    let longFundingRateNum = getFundingRateAsPercentage(longFundingRate);
    let shortFundingRateNum = getFundingRateAsPercentage(shortFundingRate);

    if (period === "year") {
      const paymentsPerYear = 24 * 365.25;

      longFundingRateNum *= paymentsPerYear;
      shortFundingRateNum *= paymentsPerYear;
    }

    const longsArePaying = longFundingRateNum > 0;
    const shortsArePaying = !(shortFundingRateNum > 0);

    const longsAreString = longsArePaying ? "pay" : "receive";
    const shortsAreString = !shortsArePaying ? "receive" : "pay";

    const absoluteLongFundingRateNum = Math.abs(longFundingRateNum);
    const absoluteShortFundingRateNum = Math.abs(shortFundingRateNum);

    const formattedLongRatePct = absoluteLongFundingRateNum.toFixed(
      period === "hour" ? 5 : 2,
    );
    const formattedShortRatePct = absoluteShortFundingRateNum.toFixed(
      period === "hour" ? 5 : 2,
    );

    const paymentUnit = period === "year" ? "% APR" : "%";

    const friendlyString = `At this rate, longs would ${longsAreString} ${formattedLongRatePct} ${paymentUnit} and shorts would ${shortsAreString} ${formattedShortRatePct} ${paymentUnit} at the end of the hour.`;

    return {
      longRate: longsArePaying
        ? -absoluteLongFundingRateNum
        : absoluteLongFundingRateNum,
      shortRate: shortsArePaying
        ? -absoluteShortFundingRateNum
        : absoluteShortFundingRateNum,
      friendlyString,
    };
  } catch (e) {
    throw new Error(
      // @ts-expect-error e.message is a string
      `Something went wrong while trying to get the market's funding rate. Here's some more context: ${e.message}`,
    );
  }
}

export async function getL2OrderBook(marketSymbol: `${string}-PERP`) {
  try {
    const serializedOrderbook: RawL2Output = await (
      await fetch(
        `https://dlob.drift.trade/l2?marketName=${marketSymbol.toUpperCase()}&includeOracle=true`,
      )
    ).json();

    return {
      asks: serializedOrderbook.asks.map((ask) => ({
        price: new anchor.BN(ask.price),
        size: new anchor.BN(ask.size),
        sources: Object.entries(ask.sources).reduce((previous, [key, val]) => {
          return {
            ...(previous ?? {}),
            [key]: new anchor.BN(val),
          };
        }, {}),
      })),
      bids: serializedOrderbook.bids.map((bid) => ({
        price: new anchor.BN(bid.price),
        size: new anchor.BN(bid.size),
        sources: Object.entries(bid.sources).reduce((previous, [key, val]) => {
          return {
            ...(previous ?? {}),
            [key]: new anchor.BN(val),
          };
        }, {}),
      })),
      oracleData: {
        price: serializedOrderbook.oracleData.price
          ? new anchor.BN(serializedOrderbook.oracleData.price)
          : undefined,
        slot: serializedOrderbook.oracleData.slot
          ? new anchor.BN(serializedOrderbook.oracleData.slot)
          : undefined,
        confidence: serializedOrderbook.oracleData.confidence
          ? new anchor.BN(serializedOrderbook.oracleData.confidence)
          : undefined,
        hasSufficientNumberOfDataPoints:
          serializedOrderbook.oracleData.hasSufficientNumberOfDataPoints,
        twap: serializedOrderbook.oracleData.twap
          ? new anchor.BN(serializedOrderbook.oracleData.twap)
          : undefined,
        twapConfidence: serializedOrderbook.oracleData.twapConfidence
          ? new anchor.BN(serializedOrderbook.oracleData.twapConfidence)
          : undefined,
        maxPrice: serializedOrderbook.oracleData.maxPrice
          ? new anchor.BN(serializedOrderbook.oracleData.maxPrice)
          : undefined,
      },
      slot: serializedOrderbook.slot,
    };
  } catch (e) {
    throw new Error(`Failed to get ${marketSymbol} order book: ${e}`);
  }
}

/**
 * Get the estimated entry quote of a perp trade
 * @param agent
 * @param marketSymbol
 * @param amount
 * @param type
 */
export async function getEntryQuoteOfPerpTrade(
  marketSymbol: `${string}-PERP`,
  amount: number,
  type: "long" | "short",
) {
  try {
    const l2OrderBookData = await getL2OrderBook(marketSymbol);
    const estimatedEntryPriceData = calculateEstimatedEntryPriceWithL2(
      "quote",
      numberToSafeBN(amount, BASE_PRECISION),
      type === "long" ? PositionDirection.LONG : PositionDirection.SHORT,
      BASE_PRECISION,
      l2OrderBookData,
    );

    return {
      entryPrice: convertToNumber(
        estimatedEntryPriceData.entryPrice,
        QUOTE_PRECISION,
      ),
      priceImpact: convertToNumber(
        estimatedEntryPriceData.priceImpact,
        QUOTE_PRECISION,
      ),
      bestPrice: convertToNumber(
        estimatedEntryPriceData.bestPrice,
        QUOTE_PRECISION,
      ),
      worstPrice: convertToNumber(
        estimatedEntryPriceData.worstPrice,
        QUOTE_PRECISION,
      ),
    };
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to get entry quote: ${e.message}`);
  }
}

/**
 * Get the APY for lending and borrowing a specific token on drift protocol
 * @param agent
 * @param symbol
 */
export async function getLendingAndBorrowAPY(
  agent: Agentix<SolanaWalletBase>,
  symbol: string,
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent);
    const token = MainnetSpotMarkets.find(
      (v) => v.symbol === symbol.toUpperCase(),
    );

    if (!token) {
      throw new Error(
        `Token with symbol ${symbol} not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map(
          (v) => v.symbol,
        ).join(", ")}`,
      );
    }

    const marketAccount = driftClient.getSpotMarketAccount(token.marketIndex);

    if (!marketAccount) {
      throw new Error("Market account not found");
    }

    const lendAPY = calculateDepositRate(marketAccount);
    const borrowAPY = calculateInterestRate(marketAccount);

    await cleanUp();

    return {
      lendingAPY: convertToNumber(lendAPY, PERCENTAGE_PRECISION) * 100, // convert to percentage
      borrowAPY: convertToNumber(borrowAPY, PERCENTAGE_PRECISION) * 100, // convert to percentage
    };
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to get APYs: ${e.message}`);
  }
}
