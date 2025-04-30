import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import {
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Agentix, PriorityFeeResponse, SolanaWalletBase } from "agentix";

/**
 * Sends a transaction with an estimated priority fee using the provided Agentix.
 *
 * @param agent         An instance of Agentix containing connection, wallet, etc.
 * @param priorityLevel The priority level (e.g., "Min", "Low", "Medium", "High", "VeryHigh", or "UnsafeMax").
 * @param amount        The amount of SOL to send (in SOL, not lamports).
 * @param to            The recipient's PublicKey.
 * @returns             The transaction signature (string) once confirmed along with the fee used.
 */
export async function sendTransactionWithPriorityFee(
  agent: Agentix<SolanaWalletBase>,
  priorityLevel: string,
  amount: number,
  to: PublicKey,
  splmintAddress?: PublicKey,
): Promise<{ transactionId: string; fee: number }> {
  try {
    if (!splmintAddress) {
      const transaction = new Transaction();
      const { blockhash, lastValidBlockHeight } =
        await agent.wallet.getConnection().getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = new PublicKey(agent.wallet.getAddress());

      const transferIx = SystemProgram.transfer({
        fromPubkey: new PublicKey(agent.wallet.getAddress()),
        toPubkey: to,
        lamports: amount * LAMPORTS_PER_SOL,
      });

      transaction.add(transferIx);
      const signedTx = await agent.wallet.signTransaction(transaction);

      const response = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${agent.config?.HELIUS_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getPriorityFeeEstimate",
            params: [
              {
                transaction: bs58.encode(signedTx.serialize()),
                options: { priorityLevel: priorityLevel },
              },
            ],
            } as PriorityFeeResponse),
        },
      );

      const data = await response.json();
      if (data.error) {
        throw new Error("Error fetching priority fee:");
      }
      const feeEstimate: number = data.result.priorityFeeEstimate;

      // Set the priority fee if applicable
      const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: feeEstimate,
      });
      transaction.add(computePriceIx);

      if (agent.config.signOnly) {
        throw new Error("Sign only mode is enabled. Transaction not sent.");
      }
      if (!agent.wallet.signAndSendTransaction) {
        throw new Error(
          "Wallet does not support signAndSendTransaction please implement it manually or use the signOnly option",
        );
      }

      const txSignature =
        await agent.wallet.signAndSendTransaction(transaction);

      return {
        transactionId: txSignature.signature,
        fee: feeEstimate,
      };
    } else {
      const fromAta = await getAssociatedTokenAddress(
        splmintAddress,
        new PublicKey(agent.wallet.getAddress()),
      );
      const toAta = await getAssociatedTokenAddress(splmintAddress, to);

      const mintInfo = await getMint(agent.wallet.getConnection(), splmintAddress);
      const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

      const transaction = new Transaction();
      const { blockhash, lastValidBlockHeight } =
        await agent.wallet.getConnection().getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = new PublicKey(agent.wallet.getAddress());

      const response = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${agent.config?.HELIUS_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getPriorityFeeEstimate",
            params: [
              {
                transaction: bs58.encode(transaction.serialize()),
                options: { priorityLevel: priorityLevel },
              },
            ],
          } as PriorityFeeResponse),
        },
      );

      const data = await response.json();
      if (data.error) {
        throw new Error("Error fetching priority fee:");
      }
      const feeEstimate: number = data.result.priorityFeeEstimate;

      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: feeEstimate,
        }),
      );

      transaction.add(
        createAssociatedTokenAccountInstruction(
          new PublicKey(agent.wallet.getAddress()),
          toAta,
          to,
          splmintAddress,
        ),
      );

      transaction.add(
        createTransferInstruction(
          fromAta,
          toAta,
          new PublicKey(agent.wallet.getAddress()),
          adjustedAmount,
        ),
      );

      if (agent.config.signOnly) {
        throw new Error("Sign only mode is enabled. Transaction not sent.");
      }
      if (!agent.wallet.signAndSendTransaction) {
        throw new Error(
          "Wallet does not support signAndSendTransaction please implement it manually or use the signOnly option",
        );
      }

      const txSignature =
        await agent.wallet.signAndSendTransaction(transaction);

      return {
        transactionId: txSignature.signature,
        fee: feeEstimate,
      };
    }
  } catch (error: any) {
    throw new Error(`Failed to process transaction: ${error.message}`);
  }
}
