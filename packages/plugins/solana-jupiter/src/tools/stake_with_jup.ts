import { VersionedTransaction } from "@solana/web3.js";
import { Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

/**
 * Stake SOL with Jup validator
 * @param agent Agentix instance
 * @param amount Amount of SOL to stake
 * @returns Transaction signature
 */
export async function stakeWithJup(agent: Agentix<SolanaWalletBase>, amount: number) {
  try {
    const res = await fetch(
      `https://worker.jup.ag/blinks/swap/So11111111111111111111111111111111111111112/jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v/${amount}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: agent.wallet.getAddress(),
        }),
      },
    );

    const data = await res.json();

    const txn = VersionedTransaction.deserialize(
      Buffer.from(data.transaction, "base64"),
    );

    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    txn.message.recentBlockhash = blockhash;

    // Sign or send transaction
    return await signOrSendTX(agent, txn);
  } catch (error: any) {
    console.error(error);
    throw new Error(`jupSOL staking failed: ${error.message}`);
  }
}
