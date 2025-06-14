import { VersionedTransaction } from "@solana/web3.js";
import { type Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

/**
 * Stake SOL with Solayer
 * @param agent Agentix instance
 * @param amount Amount of SOL to stake
 * @returns Transaction signature
 */
export async function stakeWithSolayer(agent: Agentix<SolanaWalletBase>, amount: number) {
  try {
    const response = await fetch(
      `https://app.solayer.org/api/action/restake/ssol?amount=${amount}`,
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Staking request failed");
    }

    const data = await response.json();

    // Deserialize and prepare transaction
    const txn = VersionedTransaction.deserialize(
      Buffer.from(data.transaction, "base64"),
    );

    // Update blockhash
    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    txn.message.recentBlockhash = blockhash;

    return await signOrSendTX(agent, txn);
  } catch (error: any) {
    console.error(error);
    throw new Error(`Solayer sSOL staking failed: ${error.message}`);
  }
}
