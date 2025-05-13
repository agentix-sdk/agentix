import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

// Import tools
import * as cmcTools from "./tools/coinmarketcap";

// Import actions
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

/**
 * Options for initializing the CoinMarketCap plugin
 */
export interface CoinmarketcapPluginOptions {
    apiKey: string;
}

/**
 * CoinMarketCap plugin for cryptocurrency data
 */
class CoinmarketcapPlugin extends PluginBase<EvmWalletBase> {
    private readonly options: CoinmarketcapPluginOptions;

    constructor(options: CoinmarketcapPluginOptions) {
        // Register methods for tool access
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

        // Register actions
        const actions: any[] = [
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

        // This plugin supports all EVM chains (it's an API wrapper)
        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("coinmarketcap", methods, actions, supportedChains);
        
        this.options = options;
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }

    setup(agentConfig: Record<string, any>) {
        // Set up CoinMarketCap API key in agent config
        if (!agentConfig.coinmarketcapApiKey) {
            agentConfig.coinmarketcapApiKey = this.options.apiKey;
        }
    }
}

/**
 * Create a new CoinMarketCap plugin instance
 */
export function coinmarketcap(options: CoinmarketcapPluginOptions) {
    return new CoinmarketcapPlugin(options);
}

export default coinmarketcap;
