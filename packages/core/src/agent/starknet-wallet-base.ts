import type { RpcProvider } from "starknet";
import type { StarknetTransaction } from "@/types/wallet";
import { WalletBase } from "./wallet-base";
import { StarknetChain } from "@/types/chain";

export abstract class StarknetWalletBase extends WalletBase {
    abstract getClient(): RpcProvider;
    abstract getChain(): StarknetChain;

    abstract sendTransaction(transaction: StarknetTransaction): Promise<{ hash: string }>;
}
