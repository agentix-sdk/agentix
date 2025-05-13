import { Signature, WalletBase } from "./wallet-base";
import { EvmChain } from "../types/chain";
import type { EVMReadRequest, EVMReadResult, EVMTransaction, EVMTypedData } from "../types/wallet";

export abstract class EvmWalletBase extends WalletBase {
    abstract getChain(): EvmChain;
    abstract sendTransaction(transaction: EVMTransaction): Promise<{ hash: string }>;
    abstract read(request: EVMReadRequest): Promise<EVMReadResult>;
    abstract signTypedData(data: EVMTypedData): Promise<Signature>;
}