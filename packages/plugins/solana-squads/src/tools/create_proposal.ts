import { PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { Agentix, SolanaWalletBase, signOrSendTX } from "agentix";
const { Multisig } = multisig.accounts;

/**
 * Creates a proposal for a multisig transaction.
 *
 * @param {Agentix} agent - The Solana agent kit instance.
 * @param {number | bigint} [transactionIndex] - Optional transaction index. If not provided, the current transaction index will be used.
 * @throws {Error} - Throws an error if the proposal creation fails.
 */
export async function multisig_create_proposal(
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
    const multisigTx = multisig.transactions.proposalCreate({
      blockhash: (await agent.wallet.getConnection().getLatestBlockhash())
        .blockhash,
      feePayer: new PublicKey(agent.wallet.getAddress()),
      multisigPda,
      transactionIndex,
      creator: new PublicKey(agent.wallet.getAddress()),
    });
    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    multisigTx.message.recentBlockhash = blockhash;

    return await signOrSendTX(agent, multisigTx);
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error}`);
  }
}
