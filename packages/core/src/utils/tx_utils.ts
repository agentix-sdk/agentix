import {
    type Keypair,
    PublicKey,
    type SendOptions,
    type Signer,
    Transaction,
    type TransactionInstruction,
    TransactionMessage,
    type TransactionSignature,
    VersionedTransaction,
} from "@solana/web3.js";

import { ComputeBudgetProgram } from "@solana/web3.js";
import bs58 from "bs58";
import type { Agentix } from "../agent";
import type { PriorityFeeResponse } from "../types";
import { SolanaWalletBase } from "@/agent/solana-wallet-base";

export const feeTiers = {
    min: 0.01,
    mid: 0.5,
    max: 0.95,
};

/**
 * Get priority fees for the current block
 * @param connection - Solana RPC connection
 * @returns Priority fees statistics and instructions for different fee levels
 */
export async function getComputeBudgetInstructions(
    agent: Agentix<SolanaWalletBase>,
    instructions: TransactionInstruction[],
    feeTier: keyof typeof feeTiers,
): Promise<{
    computeBudgetLimitInstruction: TransactionInstruction;
    computeBudgetPriorityFeeInstructions: TransactionInstruction;
}> {
    const wallet = agent.wallet;
    const connection = wallet.getConnection();
    const payer = new PublicKey(wallet.getAddress());
    const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions: instructions,
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    const simulatedTx = await connection.simulateTransaction(transaction);
    const estimatedComputeUnits = simulatedTx.value.unitsConsumed;
    const safeComputeUnits = Math.ceil(
        estimatedComputeUnits
        ? Math.max(estimatedComputeUnits + 100000, estimatedComputeUnits * 1.2)
        : 200000,
    );
    const computeBudgetLimitInstruction =
        ComputeBudgetProgram.setComputeUnitLimit({
        units: safeComputeUnits,
        });

    let priorityFee: number;

    if (agent.config?.HELIUS_API_KEY) {
        // Create and set up a legacy transaction for Helius fee estimation
        const legacyTransaction = new Transaction();
        legacyTransaction.recentBlockhash = blockhash;
        legacyTransaction.lastValidBlockHeight = lastValidBlockHeight;
        legacyTransaction.feePayer = payer;

        // Add the compute budget instruction and original instructions
        legacyTransaction.add(computeBudgetLimitInstruction, ...instructions);

        // Sign the transaction
        const signedTransaction =
        await wallet.signTransaction(legacyTransaction);

        // Use Helius API for priority fee calculation
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
                transaction: bs58.encode(
                    signedTransaction.serialize() as Uint8Array,
                ),
                options: {
                    priorityLevel:
                    feeTier === "min"
                        ? "Min"
                        : feeTier === "mid"
                        ? "Medium"
                        : "High",
                },
                },
            ],
            } as PriorityFeeResponse),
        },
        );

        const data = await response.json();
        if (data.error) {
        throw new Error("Error fetching priority fee from Helius API");
        }
        priorityFee = data.result.priorityFeeEstimate;
    } else {
        // Use default implementation for priority fee calculation
        priorityFee = await connection
        .getRecentPrioritizationFees()
        .then(
            (fees) =>
            fees.sort((a, b) => a.prioritizationFee - b.prioritizationFee)[
                Math.floor(fees.length * feeTiers[feeTier])
            ].prioritizationFee,
        );
    }

    const computeBudgetPriorityFeeInstructions =
        ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee,
        });

    return {
        computeBudgetLimitInstruction,
        computeBudgetPriorityFeeInstructions,
    };
}
  
/**
 * Send a transaction with priority fees
 * @param agent - SolanaAgentKit instance
 * @param tx - Transaction to send
 * @returns Transaction ID
 */
export async function sendTx(
    agent: Agentix<SolanaWalletBase>,
    instructions: TransactionInstruction[],
    otherKeypairs?: Keypair[],
    feeTier?: keyof typeof feeTiers,
) {
    const wallet = agent.wallet;
    const connection = wallet.getConnection();
    const ixComputeBudget = await getComputeBudgetInstructions(
        agent,
        instructions,
        feeTier ?? "mid",
    );
    const allInstructions = [
        ixComputeBudget.computeBudgetLimitInstruction,
        ixComputeBudget.computeBudgetPriorityFeeInstructions,
        ...instructions,
    ];
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(wallet.getAddress()),
        recentBlockhash: blockhash,
        instructions: allInstructions,
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([...(otherKeypairs ?? [])] as Signer[]);
    const signedTransaction = await wallet.signTransaction(transaction);

    const timeoutMs = 90000;
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
        const transactionStartTime = Date.now();

        const signature = await connection.sendTransaction(
            signedTransaction as VersionedTransaction,
            {
                maxRetries: 0,
                skipPreflight: false,
            },
        );

        const statuses = await connection.getSignatureStatuses([signature]);
        if (statuses.value[0]) {
        if (!statuses.value[0].err) {
            return signature;
        }
        throw new Error(
            `Transaction failed: ${statuses.value[0].err.toString()}`,
        );
        }

        const elapsedTime = Date.now() - transactionStartTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
    }
    throw new Error("Transaction timeout");
}  

export async function signOrSendTX(
    agent: Agentix<SolanaWalletBase>,
    instructionsOrTransaction:
      | TransactionInstruction[]
      | Transaction
      | VersionedTransaction
      | Transaction[]
      | VersionedTransaction[],
    otherKeypairs?: Keypair[],
    feeTier?: keyof typeof feeTiers,
  ): Promise<
    | string
    | Transaction
    | VersionedTransaction
    | Transaction[]
    | VersionedTransaction[]
  > {
    const wallet = agent.wallet;
    const connection = wallet.getConnection();
    const payer = new PublicKey(wallet.getAddress());
    if (
      Array.isArray(instructionsOrTransaction) &&
      (instructionsOrTransaction[0] instanceof Transaction ||
        instructionsOrTransaction[0] instanceof VersionedTransaction)
    ) {
      if (agent.config.signOnly) {
        return await wallet.signAllTransactions(
          instructionsOrTransaction as Transaction[],
        );
      }
  
      for (const tx of instructionsOrTransaction) {
        if (wallet.signAndSendTransaction) {
          const { signature } = await wallet.signAndSendTransaction(
            tx as Transaction,
          );
          return signature;
        }
        throw new Error(
          "Wallet does not support signAndSendTransaction please implement it manually or use the signOnly option",
        );
      }
    }
  
    if (
      instructionsOrTransaction instanceof Transaction ||
      instructionsOrTransaction instanceof VersionedTransaction
    ) {
      if (agent.config.signOnly) {
        return await wallet.signTransaction(instructionsOrTransaction);
      }
  
      if (!wallet.signAndSendTransaction) {
        throw new Error(
          "Wallet does not support signAndSendTransaction please implement it manually or use the signOnly option",
        );
      }
  
      return (
        await wallet.signAndSendTransaction(instructionsOrTransaction)
      ).signature;
    }
  
    const ixComputeBudget = await getComputeBudgetInstructions(
      agent,
      instructionsOrTransaction as TransactionInstruction[],
      feeTier ?? "mid",
    );
    const allInstructions = [
      ixComputeBudget.computeBudgetLimitInstruction,
      ixComputeBudget.computeBudgetPriorityFeeInstructions,
      ...instructionsOrTransaction,
    ];
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash,
      instructions: allInstructions as TransactionInstruction[],
    }).compileToV0Message();
  
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([...(otherKeypairs ?? [])] as Signer[]);
    const signedTransaction = await wallet.signTransaction(transaction);
  
    if (agent.config.signOnly) {
      return signedTransaction;
    }
  
    return sendTx(
      agent,
      instructionsOrTransaction as TransactionInstruction[],
      otherKeypairs,
      feeTier,
    );
  }
  