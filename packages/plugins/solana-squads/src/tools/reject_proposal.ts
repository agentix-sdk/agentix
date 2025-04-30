import { PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { Agentix, SolanaWalletBase, signOrSendTX } from "agentix";
const { Multisig } = multisig.accounts;

/**
 * Rejects a proposal in a Solana multisig setup.
 *
 * @param agent - The Agentix instance containing the wallet and connection.
 * @param transactionIndex - Optional. The index of the transaction to reject. If not provided, the current transaction index will be used.
 * @returns A promise that resolves to the transaction ID of the rejection transaction.
 * @throws Will throw an error if the transaction fails.
 */
export async function multisig_reject_proposal(
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
    // const [proposalPda, proposalBump] = multisig.getProposalPda({
    //   multisigPda,
    //   transactionIndex,
    // });
    const multisigTx = multisig.transactions.proposalReject({
      blockhash: (await agent.wallet.getConnection().getLatestBlockhash())
        .blockhash,
      feePayer: new PublicKey(agent.wallet.getAddress()),
      multisigPda,
      transactionIndex: transactionIndex,
      member: new PublicKey(agent.wallet.getAddress()),
    });
    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    multisigTx.message.recentBlockhash = blockhash;

    return await signOrSendTX(agent, multisigTx);
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error}`);
  }
}
