import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  type TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import type { Agentix, SolanaWalletBase } from "agentix";
import { DEFAULT_OPTIONS, TOKENS } from "./utils/constants";

import { signOrSendTX } from "agentix";
import AdrenaClient from "./utils/anchor/AdrenaClient";

const PRICE_DECIMALS = 10;
const ADRENA_PROGRAM_ID = new PublicKey(
  "13gDzEXCdocbj8iAiqrScGo47NiSuYENGsRqi3SEAwet",
);

// i.e percentage = -2 (for -2%)
// i.e percentage = 5 (for 5%)
function applySlippage(nb: BN, percentage: number): BN {
  const negative = percentage < 0;

  // Do x10_000 so percentage can be up to 4 decimals
  const percentageBN = new BN(
    (negative ? percentage * -1 : percentage) * 10_000,
  );

  const delta = nb.mul(percentageBN).divRound(new BN(10_000 * 100));

  return negative ? nb.sub(delta) : nb.add(delta);
}

/**
 * Close short trade on Adrena
 * @returns Transaction signature
 */
export async function closePerpTradeShort({
  agent,
  price,
  tradeMint,
}: {
  agent: Agentix<SolanaWalletBase>;
  price: number;
  tradeMint: PublicKey;
}) {
  const client = await AdrenaClient.load(agent);

  const owner = agent.wallet.getAddress();
  const publicKey = new PublicKey(owner);

  const custody = client.getCustodyByMint(tradeMint);
  const collateralCustody = client.getCustodyByMint(TOKENS.USDC);

  const stakingRewardTokenCustodyAccount = client.getCustodyByMint(
    AdrenaClient.stakingRewardTokenMint,
  );

  const stakingRewardTokenCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(
      AdrenaClient.stakingRewardTokenMint,
    );

  const position = AdrenaClient.findPositionAddress(
    publicKey,
    custody.pubkey,
    "long",
  );

  const userProfilePda = AdrenaClient.getUserProfilePda(publicKey);

  const userProfile =
    await client.program.account.userProfile.fetchNullable(userProfilePda);

  const receivingAccount = AdrenaClient.findATAAddressSync(
    publicKey,
    collateralCustody.mint,
  );

  const preInstructions: TransactionInstruction[] = [];

  const collateralCustodyOracle = collateralCustody.oracle;
  const collateralCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(collateralCustody.mint);

  if (
    !(await AdrenaClient.isAccountInitialized(
      agent.wallet.getConnection(),
      receivingAccount,
    ))
  ) {
    preInstructions.push(
      AdrenaClient.createATAInstruction({
        ataAddress: receivingAccount,
        mint: collateralCustody.mint,
        owner: publicKey,
      }),
    );
  }

  const instruction = await client.program.methods
    .closePositionShort({
      price: new BN(price * 10 ** PRICE_DECIMALS),
    })
    .accountsStrict({
      owner: publicKey,
      receivingAccount,
      transferAuthority: AdrenaClient.transferAuthority,
      pool: AdrenaClient.mainPool,
      position: position,
      custody: custody.pubkey,
      custodyTradeOracle: custody.tradeOracle,
      tokenProgram: TOKEN_PROGRAM_ID,
      lmStaking: AdrenaClient.lmStaking,
      lpStaking: AdrenaClient.lpStaking,
      cortex: AdrenaClient.cortex,
      stakingRewardTokenCustody: stakingRewardTokenCustodyAccount.pubkey,
      stakingRewardTokenCustodyOracle: stakingRewardTokenCustodyAccount.oracle,
      stakingRewardTokenCustodyTokenAccount,
      lmStakingRewardTokenVault: AdrenaClient.lmStakingRewardTokenVault,
      lpStakingRewardTokenVault: AdrenaClient.lpStakingRewardTokenVault,
      lpTokenMint: AdrenaClient.lpTokenMint,
      protocolFeeRecipient: client.cortex.protocolFeeRecipient,
      adrenaProgram: AdrenaClient.programId,
      userProfile: userProfile ? userProfilePda : null,
      caller: owner,
      collateralCustody: collateralCustody.pubkey,
      collateralCustodyOracle,
      collateralCustodyTokenAccount,
    })
    .instruction();

  return signOrSendTX(agent, [...preInstructions, instruction]);
}

/**
 * Close long trade on Adrena
 * @returns Transaction signature
 */
export async function closePerpTradeLong({
  agent,
  price,
  tradeMint,
}: {
  agent: Agentix<SolanaWalletBase>;
  price: number;
  tradeMint: PublicKey;
}) {
  const client = await AdrenaClient.load(agent);

  const owner = agent.wallet.getAddress();
  const publicKey = new PublicKey(owner);

  const custody = client.getCustodyByMint(tradeMint);

  const custodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(tradeMint);

  const stakingRewardTokenCustodyAccount = client.getCustodyByMint(
    AdrenaClient.stakingRewardTokenMint,
  );

  const stakingRewardTokenCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(
      AdrenaClient.stakingRewardTokenMint,
    );

  const position = AdrenaClient.findPositionAddress(
    publicKey,
    custody.pubkey,
    "long",
  );

  const userProfilePda = AdrenaClient.getUserProfilePda(publicKey);

  const userProfile =
    await client.program.account.userProfile.fetchNullable(userProfilePda);

  const receivingAccount = AdrenaClient.findATAAddressSync(
    publicKey,
    custody.mint,
  );

  const preInstructions: TransactionInstruction[] = [];

  if (
    !(await AdrenaClient.isAccountInitialized(
      agent.wallet.getConnection(),
      receivingAccount,
    ))
  ) {
    preInstructions.push(
      AdrenaClient.createATAInstruction({
        ataAddress: receivingAccount,
        mint: custody.mint,
        owner: publicKey,
      }),
    );
  }

  const instruction = await client.program.methods
    .closePositionLong({
      price: new BN(price * 10 ** PRICE_DECIMALS),
    })
    .accountsStrict({
      owner: publicKey,
      receivingAccount,
      transferAuthority: AdrenaClient.transferAuthority,
      pool: AdrenaClient.mainPool,
      position: position,
      custody: custody.pubkey,
      custodyTokenAccount,
      custodyOracle: custody.oracle,
      custodyTradeOracle: custody.tradeOracle,
      tokenProgram: TOKEN_PROGRAM_ID,
      lmStaking: AdrenaClient.lmStaking,
      lpStaking: AdrenaClient.lpStaking,
      cortex: AdrenaClient.cortex,
      stakingRewardTokenCustody: stakingRewardTokenCustodyAccount.pubkey,
      stakingRewardTokenCustodyOracle: stakingRewardTokenCustodyAccount.oracle,
      stakingRewardTokenCustodyTokenAccount,
      lmStakingRewardTokenVault: AdrenaClient.lmStakingRewardTokenVault,
      lpStakingRewardTokenVault: AdrenaClient.lpStakingRewardTokenVault,
      lpTokenMint: AdrenaClient.lpTokenMint,
      protocolFeeRecipient: client.cortex.protocolFeeRecipient,
      adrenaProgram: AdrenaClient.programId,
      userProfile: userProfile ? userProfilePda : null,
      caller: owner,
    })
    .instruction();

  return signOrSendTX(agent, [...preInstructions, instruction]);
}

/**
 * Open long trade on Adrena
 *
 * Note: provide the same token as collateralMint and as tradeMint to avoid swap
 * @returns Transaction signature
 */
export async function openPerpTradeLong({
  agent,
  price,
  collateralAmount,
  collateralMint = TOKENS.jitoSOL,
  leverage = DEFAULT_OPTIONS.LEVERAGE_BPS,
  tradeMint = TOKENS.jitoSOL,
  slippage = 0.3,
}: {
  agent: Agentix<SolanaWalletBase>;
  price: number;
  collateralAmount: number;
  collateralMint?: PublicKey;
  leverage?: number;
  tradeMint?: PublicKey;
  slippage?: number;
}) {
  const client = await AdrenaClient.load(agent);

  const owner = agent.wallet.getAddress();
  const publicKey = new PublicKey(owner);

  const collateralAccount = AdrenaClient.findATAAddressSync(
    publicKey,
    tradeMint,
  );
  const fundingAccount = AdrenaClient.findATAAddressSync(
    publicKey,
    collateralMint,
  );

  const receivingCustody = AdrenaClient.findCustodyAddress(collateralMint);
  const receivingCustodyOracle = client.getCustodyByMint(collateralMint).oracle;
  const receivingCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(collateralMint);

  // Principal custody is the custody of the targeted token
  // i.e open a 1 ETH long position, principal custody is ETH
  const principalCustody = AdrenaClient.findCustodyAddress(tradeMint);
  const principalCustodyAccount = client.getCustodyByMint(tradeMint);
  const principalCustodyOracle = principalCustodyAccount.oracle;
  const principalCustodyTradeOracle = principalCustodyAccount.tradeOracle;
  const principalCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(tradeMint);

  const stakingRewardTokenCustodyAccount = client.getCustodyByMint(
    AdrenaClient.stakingRewardTokenMint,
  );

  const stakingRewardTokenCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(
      AdrenaClient.stakingRewardTokenMint,
    );

  const position = AdrenaClient.findPositionAddress(
    publicKey,
    principalCustody,
    "long",
  );

  const userProfilePda = AdrenaClient.getUserProfilePda(publicKey);

  const userProfile =
    await client.program.account.userProfile.fetchNullable(userProfilePda);

  const priceWithSlippage = applySlippage(
    new BN(price * 10 ** PRICE_DECIMALS),
    slippage,
  );

  const scaledCollateralAmount = new BN(
    collateralAmount * 10 ** client.getCustodyByMint(collateralMint).decimals,
  );

  const preInstructions: TransactionInstruction[] = [];

  if (
    !(await AdrenaClient.isAccountInitialized(
      agent.wallet.getConnection(),
      collateralAccount,
    ))
  ) {
    preInstructions.push(
      AdrenaClient.createATAInstruction({
        ataAddress: collateralAccount,
        mint: tradeMint,
        owner: publicKey,
      }),
    );
  }

  const instruction = await client.program.methods
    .openOrIncreasePositionWithSwapLong({
      price: priceWithSlippage,
      collateral: scaledCollateralAmount,
      leverage,
      referrer: null,
    })
    .accountsStrict({
      owner: publicKey,
      payer: owner,
      fundingAccount,
      collateralAccount,
      receivingCustody,
      receivingCustodyOracle,
      receivingCustodyTokenAccount,
      principalCustody,
      principalCustodyOracle,
      principalCustodyTradeOracle,
      principalCustodyTokenAccount,
      transferAuthority: AdrenaClient.transferAuthority,
      cortex: AdrenaClient.cortex,
      lmStaking: AdrenaClient.lmStaking,
      lpStaking: AdrenaClient.lpStaking,
      pool: AdrenaClient.mainPool,
      position,
      stakingRewardTokenCustody: stakingRewardTokenCustodyAccount.pubkey,
      stakingRewardTokenCustodyOracle: stakingRewardTokenCustodyAccount.oracle,
      stakingRewardTokenCustodyTokenAccount,
      lmStakingRewardTokenVault: AdrenaClient.lmStakingRewardTokenVault,
      lpStakingRewardTokenVault: AdrenaClient.lpStakingRewardTokenVault,
      lpTokenMint: AdrenaClient.lpTokenMint,
      userProfile: userProfile ? userProfilePda : null,
      protocolFeeRecipient: client.cortex.protocolFeeRecipient,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      adrenaProgram: ADRENA_PROGRAM_ID,
    })
    .instruction();

  return signOrSendTX(agent, [...preInstructions, instruction]);
}

/**
 * Open short trade on Adrena
 *
 * Note: provide USDC as collateralMint to avoid swap
 * @returns Transaction signature
 */
export async function openPerpTradeShort({
  agent,
  price,
  collateralAmount,
  collateralMint = TOKENS.USDC,
  leverage = DEFAULT_OPTIONS.LEVERAGE_BPS,
  tradeMint = TOKENS.jitoSOL,
  slippage = 0.3,
}: {
  agent: Agentix<SolanaWalletBase>;
  price: number;
  collateralAmount: number;
  collateralMint?: PublicKey;
  leverage?: number;
  tradeMint?: PublicKey;
  slippage?: number;
}) {
  const client = await AdrenaClient.load(agent);

  const owner = agent.wallet.getAddress();
  const publicKey = new PublicKey(owner);

  const collateralAccount = AdrenaClient.findATAAddressSync(
    publicKey,
    tradeMint,
  );
  const fundingAccount = AdrenaClient.findATAAddressSync(
    publicKey,
    collateralMint,
  );

  const receivingCustody = AdrenaClient.findCustodyAddress(collateralMint);
  const receivingCustodyOracle = client.getCustodyByMint(collateralMint).oracle;
  const receivingCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(collateralMint);

  // Principal custody is the custody of the targeted token
  // i.e open a 1 BTC short position, principal custody is BTC
  const principalCustody = AdrenaClient.findCustodyAddress(tradeMint);
  const principalCustodyAccount = client.getCustodyByMint(tradeMint);
  const principalCustodyTradeOracle = principalCustodyAccount.tradeOracle;
  const principalCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(tradeMint);

  const usdcAta = AdrenaClient.findATAAddressSync(publicKey, TOKENS.USDC);

  const preInstructions: TransactionInstruction[] = [];

  if (!(await AdrenaClient.isAccountInitialized(agent.wallet.getConnection(), usdcAta))) {
    preInstructions.push(
      AdrenaClient.createATAInstruction({
        ataAddress: usdcAta,
        mint: TOKENS.USDC,
        owner: publicKey,
      }),
    );
  }

  // Custody used to provide collateral when opening the position
  // Should be a stable token, by default, use USDC
  const instructionCollateralMint = TOKENS.USDC;

  const collateralCustody = AdrenaClient.findCustodyAddress(
    instructionCollateralMint,
  );
  const collateralCustodyOracle = client.getCustodyByMint(
    instructionCollateralMint,
  ).oracle;

  const collateralCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(instructionCollateralMint);

  const stakingRewardTokenCustodyAccount = client.getCustodyByMint(
    AdrenaClient.stakingRewardTokenMint,
  );

  const stakingRewardTokenCustodyTokenAccount =
    AdrenaClient.findCustodyTokenAccountAddress(
      AdrenaClient.stakingRewardTokenMint,
    );

  const position = AdrenaClient.findPositionAddress(
    publicKey,
    principalCustody,
    "long",
  );

  const userProfilePda = AdrenaClient.getUserProfilePda(publicKey);

  const userProfile =
    await client.program.account.userProfile.fetchNullable(userProfilePda);

  const priceWithSlippage = applySlippage(
    new BN(price * 10 ** PRICE_DECIMALS),
    slippage,
  );

  const scaledCollateralAmount = new BN(
    collateralAmount * 10 ** client.getCustodyByMint(collateralMint).decimals,
  );

  const instruction = await client.program.methods
    .openOrIncreasePositionWithSwapShort({
      price: priceWithSlippage,
      collateral: scaledCollateralAmount,
      leverage,
      referrer: null,
    })
    .accountsStrict({
      owner,
      payer: owner,
      fundingAccount,
      collateralAccount,
      receivingCustody,
      receivingCustodyOracle,
      receivingCustodyTokenAccount,
      principalCustody,
      principalCustodyTradeOracle,
      principalCustodyTokenAccount,
      collateralCustody,
      collateralCustodyOracle,
      collateralCustodyTokenAccount,
      transferAuthority: AdrenaClient.transferAuthority,
      cortex: AdrenaClient.cortex,
      lmStaking: AdrenaClient.lmStaking,
      lpStaking: AdrenaClient.lpStaking,
      pool: AdrenaClient.mainPool,
      position,
      stakingRewardTokenCustody: stakingRewardTokenCustodyAccount.pubkey,
      stakingRewardTokenCustodyOracle: stakingRewardTokenCustodyAccount.oracle,
      stakingRewardTokenCustodyTokenAccount,
      lmStakingRewardTokenVault: AdrenaClient.lmStakingRewardTokenVault,
      lpStakingRewardTokenVault: AdrenaClient.lpStakingRewardTokenVault,
      lpTokenMint: AdrenaClient.lpTokenMint,
      userProfile: userProfile ? userProfilePda : null,
      protocolFeeRecipient: client.cortex.protocolFeeRecipient,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      adrenaProgram: ADRENA_PROGRAM_ID,
    })
    .instruction();

  return signOrSendTX(agent, [...preInstructions, instruction]);
}
