import { Connection, type SendOptions, type Transaction, type TransactionSignature, type VersionedTransaction } from "@solana/web3.js";
import { WalletBase } from "./wallet-base";
import { SendTransactionOptions } from "@/types/wallet";

export abstract class SolanaWalletBase extends WalletBase {
    abstract getConnection(): Connection;
    abstract getAddress(): string;

    abstract signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>

    abstract signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>

    abstract sendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, connection: Connection, options?: SendTransactionOptions): Promise<TransactionSignature>

    abstract signAndSendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, options?: SendOptions): Promise<{ signature: TransactionSignature }>
}
