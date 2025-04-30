import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import launchPumpfunTokenAction from "./actions/launchPumpfunToken";
import { launchPumpFunToken } from "./tools";

class PumpfunPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            launchPumpFunToken,
        };

        const actions = [
            launchPumpfunTokenAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("pumpfun", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default PumpfunPlugin;
