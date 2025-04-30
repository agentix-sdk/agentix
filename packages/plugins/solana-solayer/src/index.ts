import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import stakeWithSolayerAction from "./actions/stakeWithSolayer";

import { stakeWithSolayer } from "./tools";

class SolayerPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            stakeWithSolayer,
        };

        const actions = [
            stakeWithSolayerAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("solayer", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default SolayerPlugin;
