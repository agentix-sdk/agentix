import { SolanaWalletBase } from "agentix";
import {
    Connection,
    PublicKey,
  } from "@solana/web3.js";
import { formatUnits } from "viem";

export type SolanWalletClientCtorParams = {
    connection: Connection;
};

export abstract class SolanaWalletClient extends SolanaWalletBase {
    public connection: Connection;

    constructor(params: SolanWalletClientCtorParams) {
        super();
        this.connection = params.connection;
    }

    getChain() {
        return {
            type: "solana",
        } as const;
    }

    getConnection() {
        return this.connection;
    }

    async balanceOf(address: string) {
        const pubkey = new PublicKey(address);
        const balance = await this.connection.getBalance(pubkey);

        return {
            decimals: 9,
            symbol: "SOL",
            name: "Solana",
            value: formatUnits(BigInt(balance), 9),
            inBaseUnits: balance.toString(),
        };
    }
}
