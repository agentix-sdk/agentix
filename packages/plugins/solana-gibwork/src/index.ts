import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import createGibworkTaskAction from "./actions/createGibworkTask";
import { createGibworkTask } from "./tools";

class GibworkPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            createGibworkTask,
        };

        const actions = [
            createGibworkTaskAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("gibwork", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default GibworkPlugin;
