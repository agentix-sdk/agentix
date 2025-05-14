import type { RpcProvider } from "starknet";
import type { StarknetTransaction } from "@/types/wallet";
import { WalletBase } from "./wallet-base";

export abstract class StarknetWalletBase extends WalletBase {
    abstract getClient(): RpcProvider;
    abstract getAddress(): string;

    abstract signMessage(message: string): Promise<{ signature: string }>;

    abstract sendTransaction(transaction: StarknetTransaction): Promise<{ hash: string }>;
}
