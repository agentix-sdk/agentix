import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import raydiumCreateAmmV4Action from "./actions/raydiumCreateAmmV4";
import raydiumCreateClmmAction from "./actions/raydiumCreateClmm";
import raydiumCreateCpmmAction from "./actions/raydiumCreateCpmm";

import { raydiumCreateAmmV4 } from './raydium_create_ammV4'
import { raydiumCreateClmm } from './raydium_create_clmm'
import { raydiumCreateCpmm } from './raydium_create_cpmm'

class RaydiumPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            raydiumCreateAmmV4,
            raydiumCreateClmm,
            raydiumCreateCpmm,
        };

        const actions = [
            raydiumCreateAmmV4Action,
            raydiumCreateClmmAction,
            raydiumCreateCpmmAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("raydium", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default RaydiumPlugin;
