import { EVMTransaction, EVMTypedData, Signature } from "agentix";
import { EvmWalletClient, EvmWalletClientCtorParams } from "./EvmWalletClient";
import { EVMReadRequest, EVMReadResult } from "./types";

export type EvmAdaptorWalletClientCtorParams = EvmWalletClientCtorParams & {
    address: string;
    sendTransaction: (transaction: EVMTransaction) => Promise<{ hash: string }>;
    read: (request: EVMReadRequest) => Promise<EVMReadResult>;
    signTypedData: (data: EVMTypedData) => Promise<Signature>;
    signMessage: (message: string) => Promise<Signature>;
};

export class EvmAdaptorWalletClient extends EvmWalletClient {
    public _address: string;
    public _sendTransaction: (transaction: EVMTransaction) => Promise<{ hash: string }>;
    public _read: (request: EVMReadRequest) => Promise<EVMReadResult>;
    public _signTypedData: (data: EVMTypedData) => Promise<Signature>;
    public _signMessage: (message: string) => Promise<Signature>;
    

    constructor(params: EvmAdaptorWalletClientCtorParams) {
        const { address, sendTransaction, read, signMessage, signTypedData } = params;
        super({ chainId: params.chainId });
        this._sendTransaction = sendTransaction;
        this._read = read;
        this._signTypedData = signTypedData;
        this._signMessage = signMessage;
        this._address = address;

        /** bind outward-facing methods exactly once */
        this.sendTransaction = this.sendTransaction.bind(this);
        this.read = this.read.bind(this);
        this.signTypedData = this.signTypedData.bind(this);
        this.signMessage = this.signMessage.bind(this);
        this.getAddress = this.getAddress.bind(this);
    }

    public sendTransaction(transaction: EVMTransaction): Promise<{ hash: string }> {
        return this._sendTransaction(transaction);
    }

    public read(request: EVMReadRequest): Promise<EVMReadResult> {
        return this._read(request);
    }

    public signTypedData(data: EVMTypedData): Promise<Signature> {
        return this._signTypedData(data);
    }

    public signMessage(message: string): Promise<Signature> {
        return this._signMessage(message);
    }

    public getAddress(): string {
        return this._address;
    }
}

export const evmAdaptor = (params: EvmAdaptorWalletClientCtorParams) => new EvmAdaptorWalletClient(params);