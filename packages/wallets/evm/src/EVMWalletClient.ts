import { type EvmChain, type Signature, EvmWalletBase } from "agentix";
import type { EVMReadRequest, EVMReadResult, EVMTransaction, EVMTypedData } from "./types";

export type EVMWalletClientCtorParams = {};

export abstract class EVMWalletClient extends EvmWalletBase {
    constructor(params: EVMWalletClientCtorParams) {
        super();
    }

    getChain() {
        return {
            type: "evm",
        } as EvmChain;
    }

    abstract sendTransaction(transaction: EVMTransaction): Promise<{ hash: string }>;
    abstract read(request: EVMReadRequest): Promise<EVMReadResult>;
    abstract signTypedData(data: EVMTypedData): Promise<Signature>;
}
