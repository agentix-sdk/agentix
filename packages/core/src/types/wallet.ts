import type { Abi, TypedDataDomain } from "abitype";
import type { Call, InvocationsDetails } from "starknet";

export type EVMReadRequest = {
    address: string;
    functionName: string;
    args?: unknown[];
    abi: Abi;
};


export type EVMTransaction = {
    to: string;
    functionName?: string;
    args?: unknown[];
    value?: bigint;
    abi?: Abi;
    options?: EVMTransactionOptions;
    data?: `0x${string}`;
};

export type EVMTransactionOptions = {
    paymaster?: {
        address: `0x${string}`;
        input: `0x${string}`;
    };
};

export type EVMTypedData = {
    domain: TypedDataDomain;
    types: Record<string, unknown>;
    primaryType: string;
    message: Record<string, unknown>;
};

export type EVMReadResult = {
    value: unknown;
};

export type StarknetTransaction = {
    calls: Call[];
    transactionDetails?: InvocationsDetails;
};