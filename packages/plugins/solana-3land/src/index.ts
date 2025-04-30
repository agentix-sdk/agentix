import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import create3LandCollectibleAction from "./actions/create3LandCollectibleAction";
import {
    createCollection,
    createSingle,
  } from "./tools/create_3land_collectible";

class ThreeLandPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            createCollection,
            createSingle,
        };

        const actions = [
            create3LandCollectibleAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("3land", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default ThreeLandPlugin;
