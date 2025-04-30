import DLMM, { ActivationType } from "@meteora-ag/dlmm";
import { getMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import type { Agentix, SolanaWalletBase } from "agentix";
import { sendTx, signOrSendTX } from "agentix";

/**
 * Create Meteora DLMM pool
 * @param agent Agentix instance
 * @param binStep DLMM pool bin step
 * @param tokenAMint Token A mint
 * @param tokenBMint Token B mint
 * @param initialPrice Initial pool price in ratio tokenA / tokenB
 * @param priceRoundingUp Whether to rounding up the initial pool price
 * @param feeBps Pool trading fee in BPS
 * @param activationType Pool activation type (ActivationType.Timestamp or ActivationType.Slot)
 * @param hasAlphaVault Whether the pool has Meteora alpha vault or not
 * @param activationPoint Activation point depending on activation type, or null if pool doesn't have an activation point
 * @returns Transaction signature
 */
export async function createMeteoraDlmmPool(
  agent: Agentix<SolanaWalletBase>,
  binStep: number,
  tokenAMint: PublicKey,
  tokenBMint: PublicKey,
  initialPrice: number,
  priceRoundingUp: boolean,
  feeBps: number,
  activationType: ActivationType,
  hasAlphaVault: boolean,
  activationPoint: BN | undefined,
) {
  const tokenAMintInfo = await getMint(agent.wallet.getConnection(), tokenAMint);
  const tokenBMintInfo = await getMint(agent.wallet.getConnection(), tokenBMint);

  const initPrice = DLMM.getPricePerLamport(
    tokenAMintInfo.decimals,
    tokenBMintInfo.decimals,
    initialPrice,
  );

  const activateBinId = DLMM.getBinIdFromPrice(
    initPrice,
    binStep,
    !priceRoundingUp,
  );

  const initPoolTx = await DLMM.createCustomizablePermissionlessLbPair(
    agent.wallet.getConnection(),
    new BN(binStep),
    tokenAMint,
    tokenBMint,
    new BN(activateBinId.toString()),
    new BN(feeBps),
    activationType,
    hasAlphaVault,
    new PublicKey(agent.wallet.getAddress()),
    activationPoint,
    {
      cluster: "mainnet-beta",
    } as any,
  );
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  initPoolTx.recentBlockhash = blockhash;

  return signOrSendTX(agent, initPoolTx, undefined, "max");
}
