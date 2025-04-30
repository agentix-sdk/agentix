import { registerDomainNameV2 } from "@bonfida/spl-name-service";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Agentix, SolanaWalletBase, signOrSendTX } from "agentix";
import { TOKENS } from "./utils/constant";

/**
 * Register a .sol domain name using Bonfida Name Service
 * @param agent Agentix instance
 * @param name Domain name to register (without .sol)
 * @param spaceKB Space allocation in KB (max 10KB)
 * @returns Transaction signature
 */
export async function registerDomain(
  agent: Agentix<SolanaWalletBase>,
  name: string,
  spaceKB: number = 1,
) {
  try {
    // Validate space size
    if (spaceKB > 10) {
      throw new Error("Maximum domain size is 10KB");
    }

    // Convert KB to bytes
    const space = spaceKB * 1_000;

    const buyerTokenAccount = getAssociatedTokenAddressSync(
      new PublicKey(agent.wallet.getAddress()),
      TOKENS.USDC,
    );

    // Create registration instruction
    const instruction = await registerDomainNameV2(
      agent.wallet.getConnection(),
      name,
      space,
      new PublicKey(agent.wallet.getAddress()),
      buyerTokenAccount,
    );

    // Create and sign transaction
    const transaction = new Transaction().add(...instruction);
    transaction.recentBlockhash = (
      await agent.wallet.getConnection().getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = new PublicKey(agent.wallet.getAddress());

    // Sign or send transaction
    return await signOrSendTX(agent, transaction);
  } catch (error: any) {
    throw new Error(`Domain registration failed: ${error.message}`);
  }
}
