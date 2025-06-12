import { WalletBase } from "./wallet-base";
import { SolanaChain } from "../types/chain";
import { SendTransactionOptions } from "../types/wallet";
import { Connection, type SendOptions, type Transaction, type TransactionSignature, type VersionedTransaction } from "@solana/web3.js";

export abstract class SolanaWalletBase extends WalletBase {
    abstract getConnection(): Connection;
    abstract getChain(): SolanaChain;

    abstract signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>
    abstract signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>
    abstract sendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, connection: Connection, options?: SendTransactionOptions): Promise<TransactionSignature>
    abstract signAndSendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, options?: SendOptions): Promise<{ signature: TransactionSignature }>
}
