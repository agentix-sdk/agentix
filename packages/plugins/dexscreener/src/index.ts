import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

import { 
    dexscreenerGetPairsByChainAndPairAction,
    dexscreenerSearchPairsAction,
    dexscreenerGetTokenPairsAction
} from "./actions/dexscreenerActions";

import { 
    getPairsByChainAndPair,
    searchPairs,
    getTokenPairsByTokenAddress
} from "./tools/dexscreener";

class DexscreenerPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            dexscreenerGetPairsByChainAndPair: getPairsByChainAndPair,
            dexscreenerSearchPairs: searchPairs,
            dexscreenerGetTokenPairsByTokenAddress: getTokenPairsByTokenAddress,
        };

        const actions = [
            dexscreenerGetPairsByChainAndPairAction,
            dexscreenerSearchPairsAction,
            dexscreenerGetTokenPairsAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("dexscreener", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default DexscreenerPlugin;
