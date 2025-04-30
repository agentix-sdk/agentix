import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import createMeteoraDLMMPoolAction from "./actions/createMeteoraDLMMPool";
import createMeteoraDynamicAMMPoolAction from "./actions/createMeteoraDynamicAMMPool";
import {
  createMeteoraDlmmPool,
  createMeteoraDynamicAMMPool,
} from "./tools";

class MeteoraPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            createMeteoraDlmmPool,
            createMeteoraDynamicAMMPool,
        };

        const actions = [
            createMeteoraDLMMPoolAction,
            createMeteoraDynamicAMMPoolAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("meteora", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default MeteoraPlugin;
