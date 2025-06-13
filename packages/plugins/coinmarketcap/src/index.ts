import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

import * as cmcTools from "./tools/coinmarketcap";

import {
    getCryptocurrencyListingsAction,
    getCryptocurrencyQuotesAction,
    getExchangeListingsAction,
    getExchangeQuotesAction,
    getContentAction,
    getCryptocurrencyMapAction,
    getCryptocurrencyOHLCVAction,
    getCryptocurrencyTrendingAction,
    getCryptocurrencyMostVisitedAction,
    getCryptocurrencyGainersLosersAction
} from "./actions/coinmarketcap";

class CoinmarketcapPlugin extends PluginBase<EvmWalletBase> {

    constructor() {
        const methods: Record<string, Function> = {
            getCryptocurrencyListings: cmcTools.getCryptocurrencyListings,
            getCryptocurrencyQuotes: cmcTools.getCryptocurrencyQuotes,
            getExchangeListings: cmcTools.getExchangeListings,
            getExchangeQuotes: cmcTools.getExchangeQuotes,
            getContent: cmcTools.getContent,
            getCryptocurrencyMap: cmcTools.getCryptocurrencyMap,
            getCryptocurrencyOHLCV: cmcTools.getCryptocurrencyOHLCV,
            getCryptocurrencyTrending: cmcTools.getCryptocurrencyTrending,
            getCryptocurrencyMostVisited: cmcTools.getCryptocurrencyMostVisited,
            getCryptocurrencyGainersLosers: cmcTools.getCryptocurrencyGainersLosers
        };

        const actions = [
            getCryptocurrencyListingsAction,
            getCryptocurrencyQuotesAction,
            getExchangeListingsAction,
            getExchangeQuotesAction,
            getContentAction,
            getCryptocurrencyMapAction,
            getCryptocurrencyOHLCVAction,
            getCryptocurrencyTrendingAction,
            getCryptocurrencyMostVisitedAction,
            getCryptocurrencyGainersLosersAction
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("coinmarketcap", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default CoinmarketcapPlugin;
