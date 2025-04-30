import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import askMessariAiAction from "./actions/askMessariAi";
import { askMessariAi } from "./tools";

class MessariPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            askMessariAi,
        };

        const actions = [
            askMessariAiAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("messari", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default MessariPlugin;
