import { Percentage } from "@orca-so/common-sdk";
import {
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil,
  WhirlpoolContext,
  buildWhirlpoolClient,
} from "@orca-so/whirlpools-sdk";
import {
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import type { Agentix, SolanaWalletBase } from "agentix";
import { sendTx } from "agentix";

/**
 * # Closes a Liquidity Position in an Orca Whirlpool
 *
 * This function closes an existing liquidity position in a specified Orca Whirlpool. The user provides
 * the position's mint address.
 *
 * ## Parameters
 * - `agent`: The `Agentix` instance representing the wallet and connection details.
 * - `positionMintAddress`: The mint address of the liquidity position to close.
 *
 * ## Returns
 * A `Promise` that resolves to a `string` containing the transaction ID of the transaction
 *
 * ## Notes
 * - The function uses Orca’s SDK to interact with the specified Whirlpool and close the liquidity position.
 * - A maximum slippage of 1% is assumed for liquidity provision during the position closing.
 * - The function automatically fetches the associated Whirlpool address and position details using the provided mint address.
 *
 * ## Throws
 * An error will be thrown if:
 * - The specified position mint address is invalid or inaccessible.
 * - The transaction fails to send.
 * - Any required position or Whirlpool data cannot be fetched.
 *
 * @param agent - The `Agentix` instance representing the wallet and connection.
 * @param positionMintAddress - The mint address of the liquidity position to close.
 * @returns A promise resolving to the transaction ID (`string`).
 */
export async function orcaClosePosition(
  agent: Agentix<SolanaWalletBase>,
  positionMintAddress: PublicKey,
): Promise<string> {
  try {
    const ctx = WhirlpoolContext.from(
      agent.wallet.getConnection(),
      {
        publicKey: new PublicKey(agent.wallet.getAddress()),
        signAllTransactions: agent.wallet.signAllTransactions,
        signTransaction: agent.wallet.signTransaction,
      },
      ORCA_WHIRLPOOL_PROGRAM_ID,
    );
    const client = buildWhirlpoolClient(ctx);

    const positionAddress = PDAUtil.getPosition(
      ORCA_WHIRLPOOL_PROGRAM_ID,
      positionMintAddress,
    );
    const position = await client.getPosition(positionAddress.publicKey);
    const whirlpoolAddress = position.getData().whirlpool;
    const whirlpool = await client.getPool(whirlpoolAddress);
    const txBuilder = await whirlpool.closePosition(
      positionAddress.publicKey,
      Percentage.fromFraction(1, 100),
    );
    const txPayload = await txBuilder[0].build();
    const txPayloadDecompiled = TransactionMessage.decompile(
      (txPayload.transaction as VersionedTransaction).message,
    );
    const instructions = txPayloadDecompiled.instructions;
    const signers = txPayload.signers as Keypair[];

    const txId = await sendTx(agent, instructions, signers);
    return txId;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
