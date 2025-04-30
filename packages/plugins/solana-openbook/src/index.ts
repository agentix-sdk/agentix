import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import createOpenbookMarketAction from "./actions/createOpenbookMarket";
import { openbookCreateMarket } from "./tools"; 

class OpenbookPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            openbookCreateMarket,
        };

        const actions = [
            createOpenbookMarketAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("openbook", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default OpenbookPlugin;
