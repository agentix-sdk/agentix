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
    public _publicKey: PublicKey;
    public _sendTransaction: (transaction: Transaction | VersionedTransaction, connection: Connection, options?: SendTransactionOptions) => Promise<TransactionSignature>
    public _signAllTransactions: (<T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>)
    public _signMessage: ((message: Uint8Array) => Promise<Uint8Array>)
    public _signTransaction: (<T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>)

    constructor(params: SolanaAdaptorWalletClientCtorParams) {
      const { publicKey, sendTransaction, signAllTransactions, signMessage, signTransaction, connection } = params;
      super({ connection });
      this._publicKey = publicKey;
      this._sendTransaction = sendTransaction;
      this._signAllTransactions = signAllTransactions;
      this._signMessage = signMessage;
      this._signTransaction = signTransaction;

      /** bind outward-facing methods exactly once */
      this.getAddress = this.getAddress.bind(this);
      this.signTransaction = this.signTransaction.bind(this);
      this.signAllTransactions = this.signAllTransactions.bind(this);
      this.sendTransaction = this.sendTransaction.bind(this);
      this.signMessage = this.signMessage.bind(this);
      this.signAndSendTransaction = this.signAndSendTransaction.bind(this);
    }

    getAddress() {
      return this._publicKey.toBase58();
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
    ): Promise<T> {
      return this._signTransaction(transaction)
    }
  
    async signAllTransactions<T extends Transaction | VersionedTransaction>(
      txs: T[],
    ): Promise<T[]> {
      return this._signAllTransactions(txs)
    }

    async sendTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
    ): Promise<string> {
      return this._sendTransaction(transaction, this.connection)
    }
  
    async signMessage(message: string) {
        const messageBytes = Buffer.from(message);
        const signature = await this._signMessage(messageBytes);
        return {
            signature: Buffer.from(signature).toString("hex"),
        };
    }
  
    async signAndSendTransaction<T extends Transaction | VersionedTransaction>(
      transaction: T,
      options?: SendOptions,
    ): Promise<{ signature: TransactionSignature }> {
      const signature = await this._sendTransaction(await this._signTransaction(transaction), this.connection, options);
  
      return { signature };
    }
}

export const solanaAdaptor = (params: SolanaAdaptorWalletClientCtorParams) => new SolanaAdaptorWalletClient(params);
