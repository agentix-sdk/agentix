import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

// Import regular CoinGecko tools
import * as coinGeckoTools from "./tools/coingecko";
import * as coinGeckoProTools from "./tools/coingecko-pro";

// Import actions
import {
    getTrendingCoinsAction,
    getCoinPricesAction,
    searchCoinsAction,
    getCoinPriceByContractAddressAction,
    getCoinDataAction,
    getHistoricalDataAction,
    getOHLCDataAction,
    getTrendingCoinCategoriesAction,
    getCoinCategoriesAction
} from "./actions/coingecko";

import {
    getPoolDataByPoolAddressAction,
    getTrendingPoolsAction,
    getTrendingPoolsByNetworkAction,
    getTopGainersLosersAction,
    getTokenDataByTokenAddressAction,
    getTokensInfoByPoolAddressAction
} from "./actions/coingecko-pro";

/**
 * Options for initializing the CoinGecko plugin
 */
export interface CoinGeckoPluginOptions {
    apiKey: string;
    isPro?: boolean;
}

/**
 * CoinGecko plugin for cryptocurrency price and market data
 */
class CoinGeckoPlugin extends PluginBase<EvmWalletBase> {
    constructor(options: CoinGeckoPluginOptions) {
        const { apiKey, isPro = false } = options;
        
        // Register methods for tool access
        const methods: Record<string, Function> = {
            getTrendingCoins: coinGeckoTools.getTrendingCoins,
            getCoinPrices: coinGeckoTools.getCoinPrices,
            searchCoins: coinGeckoTools.searchCoins,
            getCoinPriceByContractAddress: coinGeckoTools.getCoinPriceByContractAddress,
            getCoinData: coinGeckoTools.getCoinData,
            getHistoricalData: coinGeckoTools.getHistoricalData,
            getOHLCData: coinGeckoTools.getOHLCData,
            getTrendingCoinCategories: coinGeckoTools.getTrendingCoinCategories,
            getCoinCategories: coinGeckoTools.getCoinCategories
        };
        
        // Add pro methods if enabled
        if (isPro) {
            methods.getPoolDataByPoolAddress = coinGeckoProTools.getPoolDataByPoolAddress;
            methods.getTrendingPools = coinGeckoProTools.getTrendingPools;
            methods.getTrendingPoolsByNetwork = coinGeckoProTools.getTrendingPoolsByNetwork;
            methods.getTopGainersLosers = coinGeckoProTools.getTopGainersLosers;
            methods.getTokenDataByTokenAddress = coinGeckoProTools.getTokenDataByTokenAddress;
            methods.getTokensInfoByPoolAddress = coinGeckoProTools.getTokensInfoByPoolAddress;
        }
        
        // Register actions
        const actions: any[] = [
            getTrendingCoinsAction,
            getCoinPricesAction,
            searchCoinsAction,
            getCoinPriceByContractAddressAction,
            getCoinDataAction,
            getHistoricalDataAction,
            getOHLCDataAction,
            getTrendingCoinCategoriesAction,
            getCoinCategoriesAction
        ];
        
        // Add pro actions if enabled
        if (isPro) {
            actions.push(
                getPoolDataByPoolAddressAction,
                getTrendingPoolsAction,
                getTrendingPoolsByNetworkAction,
                getTopGainersLosersAction,
                getTokenDataByTokenAddressAction,
                getTokensInfoByPoolAddressAction
            );
        }
        
        // Support all EVM chains
        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];
        
        super("coingecko", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
    
    setup(agentConfig: Record<string, any>) {
        // Set up CoinGecko API key in agent config
        if (!agentConfig.coingeckoApiKey) {
            agentConfig.coingeckoApiKey = this.getOptions().apiKey;
        }
        
        // Set isPro flag
        if (!agentConfig.coingeckoIsPro) {
            agentConfig.coingeckoIsPro = this.getOptions().isPro || false;
        }
    }
    
    private getOptions(): CoinGeckoPluginOptions {
        return {
            apiKey: (this as any).options?.apiKey || "",
            isPro: (this as any).options?.isPro || false
        };
    }
}

/**
 * Create a new CoinGecko plugin instance
 */
export function coingecko(options: CoinGeckoPluginOptions) {
    return new CoinGeckoPlugin(options);
}

export default coingecko;
