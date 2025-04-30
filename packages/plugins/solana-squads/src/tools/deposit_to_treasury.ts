import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { Agentix, SolanaWalletBase, signOrSendTX } from "agentix";

/**
 * Transfer SOL or SPL tokens to a multisig vault.
 * @param agent Agentix instance
 * @param amount Amount to transfer
 * @param vaultIndex Optional vault index, default is 0
 * @param mint Optional mint address for SPL tokens
 * @returns Transaction signature
 */
export async function multisig_deposit_to_treasury(
  agent: Agentix<SolanaWalletBase>,
  amount: number,
  vaultIndex?: number,
  mint?: PublicKey,
) {
  try {
    let tx: Awaited<ReturnType<typeof signOrSendTX>>;
    if (!vaultIndex) {
      vaultIndex = 0;
    }
    const [multisigPda] = multisig.getMultisigPda({
      createKey: new PublicKey(agent.wallet.getAddress()),
    });
    const [vaultPda] = multisig.getVaultPda({
      multisigPda,
      index: vaultIndex,
    });
    const to = vaultPda;
    if (!mint) {
      // Transfer native SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(agent.wallet.getAddress()),
          toPubkey: to,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      );
      const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      tx = await signOrSendTX(agent, transaction);
    } else {
      // Transfer SPL token
      const fromAta = await getAssociatedTokenAddress(
        mint,
        new PublicKey(agent.wallet.getAddress()),
      );
      const transaction = new Transaction();
      const toAta = await getAssociatedTokenAddress(mint, to, true);
      const toTokenAccountInfo = await agent.wallet.getConnection().getAccountInfo(toAta);
      // Create associated token account if it doesn't exist
      if (!toTokenAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            new PublicKey(agent.wallet.getAddress()),
            toAta,
            to,
            mint,
          ),
        );
      }
      // Get mint info to determine decimals
      const mintInfo = await getMint(agent.wallet.getConnection(), mint);
      const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

      transaction.add(
        createTransferInstruction(
          fromAta,
          toAta,
          new PublicKey(agent.wallet.getAddress()),
          adjustedAmount,
        ),
      );

      transaction.recentBlockhash = (
        await agent.wallet.getConnection().getLatestBlockhash()
      ).blockhash;

      tx = await signOrSendTX(agent, transaction);
    }

    return tx;
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error}`);
  }
}
