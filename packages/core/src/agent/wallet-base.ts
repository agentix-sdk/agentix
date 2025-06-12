import { z } from "zod";
import { Chain } from "../types/chain";

export type Signature = {
    signature: string;
};

export abstract class WalletBase {
    abstract getAddress(): string;
    abstract getChain(): Chain;
    abstract signMessage(message: string): Promise<Signature>;
}
