import {
    Connection,
    PublicKey,
    SendOptions,
    Signer,
    type Transaction,
    TransactionSignature,
    VersionedTransaction
} from "@solana/web3.js";
import { type SolanWalletClientCtorParams, SolanaWalletClient } from "./SolanaWalletClient";

export interface SendTransactionOptions extends SendOptions {
    signers?: Signer[];
}

export type SolanaAdaptorWalletClientCtorParams = SolanWalletClientCtorParams & {
    publicKey: PublicKey;
    sendTransaction: (transaction: Transaction | VersionedTransaction, connection: Connection, options?: SendTransactionOptions) => Promise<TransactionSignature>
    signAllTransactions: (<T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>)
    signMessage: ((message: Uint8Array) => Promise<Uint8Array>)
    signTransaction: (<T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>)
};

export class SolanaAdaptorWalletClient extends SolanaWalletClient {
    #publicKey: PublicKey;
    #sendTransaction: (transaction: Transaction | VersionedTransaction, connection: Connection, options?: SendTransactionOptions) => Promise<TransactionSignature>
    #signAllTransactions: (<T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>)
    #signMessage: ((message: Uint8Array) => Promise<Uint8Array>)
    #signTransaction: (<T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>)

    constructor(params: SolanaAdaptorWalletClientCtorParams) {
        const { publicKey, sendTransaction, signAllTransactions, signMessage, signTransaction, connection } = params;
        super({ connection });
        this.#publicKey = publicKey;
        this.#sendTransaction = sendTransaction;
        this.#signAllTransactions = signAllTransactions;
        this.#signMessage = signMessage;
        this.#signTransaction = signTransaction;
    }

    getAddress() {
        return this.#publicKey.toBase58();
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
    ): Promise<T> {
      return this.#signTransaction(transaction)
    }
  
    async signAllTransactions<T extends Transaction | VersionedTransaction>(
      txs: T[],
    ): Promise<T[]> {
      return this.#signAllTransactions(txs)
    }

    async sendTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
    ): Promise<string> {
      return this.#sendTransaction(transaction, this.connection)
    }
  
    async signMessage(message: string) {
        const messageBytes = Buffer.from(message);
        const signature = await this.#signMessage(messageBytes);
        return {
            signature: Buffer.from(signature).toString("hex"),
        };
    }
  
    async signAndSendTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
      options?: SendOptions,
    ): Promise<{ signature: TransactionSignature }> {
      const signature = await this.#sendTransaction(await this.#signTransaction(transaction), this.connection, options);
  
      return { signature };
    }
}

export const solanaAdaptor = (params: SolanaAdaptorWalletClientCtorParams) => new SolanaAdaptorWalletClient(params);
