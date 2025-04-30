import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import mayanSwapAction from "./actions/swap";
import { swap as mayanSwap } from "./tools";

class MayanPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            mayanSwap,
        };

        const actions = [
            mayanSwapAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("mayan", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default MayanPlugin;
