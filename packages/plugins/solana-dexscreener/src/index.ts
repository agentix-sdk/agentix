import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import getTokenDataAction from "./actions/getTokenData";
import {
    getTokenAddressFromTicker,
    getTokenDataByAddress,
  } from "./tools";

class DexscreenerPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            getTokenAddressFromTicker,
            getTokenDataByAddress,
        };

        const actions = [
            getTokenDataAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("dexscreener", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default DexscreenerPlugin;
