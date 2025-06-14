import { ComputeBudgetProgram, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { PoolConfig, Side } from "flash-sdk";
import type { Agentix, SolanaWalletBase } from "agentix";
import type { FlashCloseTradeParams } from "../types";
import {
  CLOSE_POSITION_CU,
  createPerpClient,
  fetchOraclePrice,
  getNftTradingAccountInfo,
  get_flash_privilege,
  marketSdkInfo,
  marketTokenMap,
} from "./utils/flashUtils";

/**
 * Closes an existing position on Flash.Trade
 * @param agent Agentix instance
 * @param params Trade parameters
 * @returns Transaction signature
 */
export async function flashCloseTrade(
  agent: Agentix<SolanaWalletBase>,
  params: FlashCloseTradeParams,
): Promise<string> {
  try {
    const { token, side } = params;

    // Get market ID from token and side using marketTokenMap
    const tokenMarkets = marketTokenMap[token];
    if (!tokenMarkets) {
      throw new Error(`Token ${token} not supported for trading`);
    }

    const sideEntry = tokenMarkets[side];
    if (!sideEntry) {
      throw new Error(`${side} side not available for ${token}`);
    }

    const market = sideEntry.marketID;

    // Validate market data using marketSdkInfo
    const marketData = marketSdkInfo[market];
    if (!marketData) {
      throw new Error(`Invalid market configuration for ${token}/${side}`);
    }

    // Get token information
    const [targetSymbol, collateralSymbol] = marketData.tokenPair.split("/");

    // Fetch oracle prices
    const [targetPrice] = await Promise.all([
      fetchOraclePrice(targetSymbol),
      fetchOraclePrice(collateralSymbol),
    ]);

    // Initialize pool configuration and perpClient
    const poolConfig = PoolConfig.fromIdsByName(
      marketData.pool,
      "mainnet-beta",
    );
    const perpClient = createPerpClient(agent);

    // Calculate price after slippage
    const slippageBpsBN = new BN(100); // 1% slippage
    const sideEnum = side === "long" ? Side.Long : Side.Short;
    const priceWithSlippage = perpClient.getPriceAfterSlippage(
      false, // isEntry = false for closing position
      slippageBpsBN,
      targetPrice.price,
      sideEnum,
    );

    // Get NFT trading account info
    const tradingAccounts = await getNftTradingAccountInfo(
      new PublicKey(agent.wallet.getAddress()),
      perpClient,
      poolConfig,
      collateralSymbol,
    );

    if (
      !tradingAccounts.nftTradingAccountPk ||
      !tradingAccounts.nftReferralAccountPK ||
      !tradingAccounts.nftOwnerRebateTokenAccountPk
    ) {
      throw new Error("Required NFT trading accounts not found");
    }

    // Build and send transaction
    const { instructions, additionalSigners } = await perpClient.closePosition(
      targetSymbol,
      collateralSymbol,
      priceWithSlippage,
      sideEnum,
      poolConfig,
      get_flash_privilege(agent),
      tradingAccounts.nftTradingAccountPk,
      tradingAccounts.nftReferralAccountPK,
      tradingAccounts.nftOwnerRebateTokenAccountPk,
    );

    const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: CLOSE_POSITION_CU,
    });

    return await perpClient.sendTransaction(
      [computeBudgetIx, ...instructions],
      {
        additionalSigners: additionalSigners,
        alts: perpClient.addressLookupTables,
        prioritizationFee: 5000000,
      },
    );
  } catch (error) {
    throw new Error(`Flash trade close failed: ${error}`);
  }
}
