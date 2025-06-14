import AmmImpl from "@mercurial-finance/dynamic-amm-sdk";
import { CustomizableParams } from "@mercurial-finance/dynamic-amm-sdk/dist/cjs/src/amm/types/index";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import type { Agentix, SolanaWalletBase } from "agentix";
import { signOrSendTX } from "agentix";

/**
 * Create Meteora Dynamic AMM pool
 * @param agent Agentix instance
 * @param tokenAMint Token A mint
 * @param tokenBMint Token B mint
 * @param tokenAAmount Token A amount in lamport units
 * @param tokenBAmount Token B amount in lamport units
 * @param customizableParams Parameters to create Dynamic AMM pool
 *        tradeFeeNumerator (number): Trade fee numerator, with default denominator is 100000
 *        activationType (enum): Should be ActivationType.Timestamp or ActivationType.Slot
 *        activationPoint (BN | null): Activation point depending on activation type, or null if pool doesn't have an activation point
 *        hasAlphaVault (boolean): Whether the pool has Meteora alpha vault or not
 *        padding (Array<number>): Should be set to value Array(90).fill(0)
 * @returns Transaction signature
 */
export async function createMeteoraDynamicAMMPool(
  agent: Agentix<SolanaWalletBase>,
  tokenAMint: PublicKey,
  tokenBMint: PublicKey,
  tokenAAmount: BN,
  tokenBAmount: BN,
  customizableParams: CustomizableParams,
) {
  const initPoolTx =
    await AmmImpl.createCustomizablePermissionlessConstantProductPool(
      agent.wallet.getConnection(),
      new PublicKey(agent.wallet.getAddress()),
      tokenAMint,
      tokenBMint,
      tokenAAmount,
      tokenBAmount,
      customizableParams,
    );
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  initPoolTx.recentBlockhash = blockhash;

  return await signOrSendTX(agent, initPoolTx, undefined, "max");
}
