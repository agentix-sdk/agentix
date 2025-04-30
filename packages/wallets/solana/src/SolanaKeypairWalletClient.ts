import {
    type Keypair,
    SendOptions,
    type Transaction,
    TransactionSignature,
    VersionedTransaction
} from "@solana/web3.js";
import nacl from "tweetnacl";
import { type SolanWalletClientCtorParams, SolanaWalletClient } from "./SolanaWalletClient";

export type SolanaKeypairWalletClientCtorParams = SolanWalletClientCtorParams & {
    keypair: Keypair;
};

/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */
export const isVersionedTransaction = (
  tx: Transaction | VersionedTransaction,
): tx is VersionedTransaction => {
  return "version" in tx;
};

export class SolanaKeypairWalletClient extends SolanaWalletClient {
    #keypair: Keypair;

    constructor(params: SolanaKeypairWalletClientCtorParams) {
        const { keypair, connection } = params;
        super({ connection });
        this.#keypair = keypair;
    }

    getAddress() {
        return this.#keypair.publicKey.toBase58();
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
    ): Promise<T> {
      if (isVersionedTransaction(transaction)) {
        transaction.sign([this.#keypair]);
      } else {
        transaction.partialSign(this.#keypair);
      }
  
      return transaction;
    }
  
    async signAllTransactions<T extends Transaction | VersionedTransaction>(
      txs: T[],
    ): Promise<T[]> {
      return txs.map((t) => {
        if (isVersionedTransaction(t)) {
          t.sign([this.#keypair]);
        } else {
          t.partialSign(this.#keypair);
        }
        return t;
      });
    }

    async sendTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
    ): Promise<string> {
      const connection = this.connection;
  
      if (transaction instanceof VersionedTransaction) {
        transaction.sign([this.#keypair]);
      } else {
        transaction.partialSign(this.#keypair);
      }
  
      return await connection.sendRawTransaction(transaction.serialize());
    }
  
    async signMessage(message: string) {
        const messageBytes = Buffer.from(message);
        const signature = nacl.sign.detached(messageBytes, this.#keypair.secretKey);
        return {
            signature: Buffer.from(signature).toString("hex"),
        };
    }
  
    async signAndSendTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
      options?: SendOptions,
    ): Promise<{ signature: TransactionSignature }> {
      const connection = this.connection;
      if (transaction instanceof VersionedTransaction) {
        transaction.sign([this.#keypair]);
      } else {
        transaction.partialSign(this.#keypair);
      }
  
      const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        options,
      );
      return { signature };
    }
}

export const solanaKeypair = (params: SolanaKeypairWalletClientCtorParams) => new SolanaKeypairWalletClient(params);
