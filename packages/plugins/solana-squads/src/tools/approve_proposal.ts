import { PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { Agentix, SolanaWalletBase, signOrSendTX } from "agentix";
const { Multisig } = multisig.accounts;

/**
 * Approves a proposal in a Solana multisig wallet.
 *
 * @param {Agentix} agent - The Solana agent kit instance.
 * @param {number | bigint} [transactionIndex] - The index of the transaction to approve. If not provided, the current transaction index will be used.
 * @throws {Error} - Throws an error if the approval process fails.
 */
export async function multisig_approve_proposal(
  agent: Agentix<SolanaWalletBase>,
  transactionIndex?: number | bigint,
) {
  try {
    const [multisigPda] = multisig.getMultisigPda({
      createKey: new PublicKey(agent.wallet.getAddress()),
    });
    const multisigInfo = await Multisig.fromAccountAddress(
      agent.wallet.getConnection(),
      multisigPda,
    );
    const currentTransactionIndex = Number(multisigInfo.transactionIndex);
    if (!transactionIndex) {
      transactionIndex = BigInt(currentTransactionIndex);
    } else if (typeof transactionIndex !== "bigint") {
      transactionIndex = BigInt(transactionIndex);
    }

    const multisigTx = multisig.transactions.proposalApprove({
      blockhash: (await agent.wallet.getConnection().getLatestBlockhash())
        .blockhash,
      feePayer: new PublicKey(agent.wallet.getAddress()),
      multisigPda,
      transactionIndex: transactionIndex,
      member: new PublicKey(agent.wallet.getAddress()),
    });
    multisigTx.message.recentBlockhash = (
      await agent.wallet.getConnection().getLatestBlockhash()
    ).blockhash;

    return await signOrSendTX(agent, multisigTx);
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error}`);
  }
}
