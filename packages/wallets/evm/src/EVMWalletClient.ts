import { type EvmChain, type Signature, EvmWalletBase } from "agentix";
import type { EVMReadRequest, EVMReadResult, EVMTransaction, EVMTypedData } from "./types";

export type EvmWalletClientCtorParams = {
    chainId: number;
};

export abstract class EvmWalletClient extends EvmWalletBase {
    public _chainId: number;

    constructor(params: EvmWalletClientCtorParams) {
        super();
        this._chainId = params.chainId;
    }

    getChain() {
        return {
            type: "evm",
            id: this._chainId,
        } as EvmChain;
    }

    abstract sendTransaction(transaction: EVMTransaction): Promise<{ hash: string }>;
    abstract read(request: EVMReadRequest): Promise<EVMReadResult>;
    abstract signTypedData(data: EVMTypedData): Promise<Signature>;
}
