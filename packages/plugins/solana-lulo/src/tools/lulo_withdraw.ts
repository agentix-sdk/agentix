import { VersionedTransaction } from "@solana/web3.js";
import { type Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

/**
 * Withdraw tokens for yields using Lulo
 * @param agent Agentix instance
 * @param mintAddress SPL Mint address
 * @param amount Amount to withdraw
 * @returns Transaction signature
 */
export async function luloWithdraw(
  agent: Agentix<SolanaWalletBase>,
  mintAddress: string,
  amount: number,
) {
  try {
    if (!agent.config?.FLEXLEND_API_KEY) {
      throw new Error("Lulo API key not found in agent configuration");
    }

    const response = await fetch(
      `https://api.flexlend.fi/generate/account/withdraw?priorityFee=50000`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-pubkey": agent.wallet.getAddress(),
          "x-api-key": agent.config?.FLEXLEND_API_KEY,
        },
        body: JSON.stringify({
          owner: agent.wallet.getAddress(),
          mintAddress: mintAddress,
          depositAmount: amount,
        }),
      },
    );

    const {
      data: { transactionMeta },
    } = await response.json();

    // Deserialize the transaction
    const luloTxn = VersionedTransaction.deserialize(
      Buffer.from(transactionMeta[0].transaction, "base64"),
    );

    // Get a recent blockhash and set it
    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    luloTxn.message.recentBlockhash = blockhash;

    return signOrSendTX(agent, luloTxn);
  } catch (error: any) {
    throw new Error(`Lending failed: ${error.message}`);
  }
}
