import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import simulateFeedAction from "./actions/simulateFeed";
import { simulate_switchboard_feed } from "./tools";

class SwitchboardPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            simulate_switchboard_feed,
        };

        const actions = [
            simulateFeedAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("switchboard", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default SwitchboardPlugin;
