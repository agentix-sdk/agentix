import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { Agentix, SolanaWalletBase, signOrSendTX } from "agentix";
const { Multisig } = multisig.accounts;

/**
 * Transfer SOL or SPL tokens to a recipient from a multisig vault.
 * @param agent - Agentix instance.
 * @param amount - Amount to transfer.
 * @param to - Recipient's public key.
 * @param vaultIndex - Optional vault index, default is 0.
 * @param mint - Optional mint address for SPL tokens.
 * @returns Transaction signature.
 */
export async function multisig_transfer_from_treasury(
  agent: Agentix<SolanaWalletBase>,
  amount: number,
  to: PublicKey,
  vaultIndex: number = 0,
  mint?: PublicKey,
) {
  try {
    let transferInstruction: TransactionInstruction;

    const [multisigPda] = multisig.getMultisigPda({
      createKey: new PublicKey(agent.wallet.getAddress()),
    });
    const multisigInfo = await Multisig.fromAccountAddress(
      agent.wallet.getConnection(),
      multisigPda,
    );
    const currentTransactionIndex = Number(multisigInfo.transactionIndex);
    const transactionIndex = BigInt(currentTransactionIndex + 1);
    const [vaultPda] = multisig.getVaultPda({
      multisigPda,
      index: vaultIndex,
    });

    if (!mint) {
      // Transfer native SOL
      transferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(agent.wallet.getAddress()),
        toPubkey: to,
        lamports: amount * LAMPORTS_PER_SOL,
      });
    } else {
      // Transfer SPL token
      const fromAta = await getAssociatedTokenAddress(mint, vaultPda, true);
      const toAta = await getAssociatedTokenAddress(mint, to, true);
      const mintInfo = await getMint(agent.wallet.getConnection(), mint);
      const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

      transferInstruction = createTransferInstruction(
        fromAta,
        toAta,
        new PublicKey(agent.wallet.getAddress()),
        adjustedAmount,
      );
    }

    const transferMessage = new TransactionMessage({
      payerKey: vaultPda,
      recentBlockhash: (await agent.wallet.getConnection().getLatestBlockhash())
        .blockhash,
      instructions: [transferInstruction],
    });

    const multisigTx = multisig.transactions.vaultTransactionCreate({
      blockhash: (await agent.wallet.getConnection().getLatestBlockhash())
        .blockhash,
      feePayer: new PublicKey(agent.wallet.getAddress()),
      multisigPda,
      transactionIndex,
      creator: new PublicKey(agent.wallet.getAddress()),
      vaultIndex: 0,
      ephemeralSigners: 0,
      transactionMessage: transferMessage,
    });
    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    multisigTx.message.recentBlockhash = blockhash;

    return await signOrSendTX(agent, multisigTx);
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error}`);
  }
}
