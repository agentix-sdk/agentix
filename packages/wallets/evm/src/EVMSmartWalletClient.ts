import { EvmWalletClient } from "./EvmWalletClient";
import type { EVMTransaction } from "./types";

export abstract class EvmSmartWalletClient extends EvmWalletClient {
    abstract sendBatchOfTransactions(transactions: EVMTransaction[]): Promise<{ hash: string }>;
}
