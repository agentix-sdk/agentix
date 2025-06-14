import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import axios from "redaxios";
import { Agentix, signOrSendTX, SolanaWalletBase } from "agentix";
import { SANCTUM_TRADE_API_URI } from "../constants";

/**
 * Add Liquidity to a Sanctum infinite-LST pool
 * @param agent Agentix instance
 * @param lstMint mint address of the LST
 * @param amount amount of LST to add
 * @param quotedAmount amount of the INF token to mint
 * @param priorityFee priority fee for the transaction
 * @return transaction signature
 */

export async function sanctumAddLiquidity(
  agent: Agentix<SolanaWalletBase>,
  lstMint: string,
  amount: string,
  quotedAmount: string,
  priorityFee: number,
) {
  try {
    const client = axios.create({
      baseURL: SANCTUM_TRADE_API_URI,
    });

    const response = await client.post("/v1/liquidity/add", {
      amount,
      dstLstAcc: null,
      lstMint,
      priorityFee: {
        Auto: {
          max_unit_price_micro_lamports: priorityFee,
          unit_limit: 300000,
        },
      },
      quotedAmount,
      signer: agent.wallet.getAddress(),
      srcLstAcc: null,
    });

    const txBuffer = Buffer.from(response.data.tx, "base64");
    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();

    const tx = VersionedTransaction.deserialize(txBuffer);

    const messages = tx.message;

    const instructions = messages.compiledInstructions.map((ix) => {
      return new TransactionInstruction({
        programId: messages.staticAccountKeys[ix.programIdIndex],
        keys: ix.accountKeyIndexes.map((i) => ({
          pubkey: messages.staticAccountKeys[i],
          isSigner: messages.isAccountSigner(i),
          isWritable: messages.isAccountWritable(i),
        })),
        data: Buffer.from(ix.data as any, "base64"),
      });
    });

    const newMessage = new TransactionMessage({
      payerKey: new PublicKey(agent.wallet.getAddress()),
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const newTx = new VersionedTransaction(newMessage);

    return await signOrSendTX(agent, newTx);
  } catch (error: any) {
    throw new Error(`Failed to add liquidity: ${error.message}`);
  }
}
