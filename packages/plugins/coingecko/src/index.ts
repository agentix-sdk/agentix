import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

import * as coinGeckoTools from "./tools/coingecko";
import * as coinGeckoProTools from "./tools/coingecko-pro";

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

class CoinGeckoPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        
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
        
        methods.getPoolDataByPoolAddress = coinGeckoProTools.getPoolDataByPoolAddress;
        methods.getTrendingPools = coinGeckoProTools.getTrendingPools;
        methods.getTrendingPoolsByNetwork = coinGeckoProTools.getTrendingPoolsByNetwork;
        methods.getTopGainersLosers = coinGeckoProTools.getTopGainersLosers;
        methods.getTokenDataByTokenAddress = coinGeckoProTools.getTokenDataByTokenAddress;
        methods.getTokensInfoByPoolAddress = coinGeckoProTools.getTokensInfoByPoolAddress;
        
        // Register actions
        const actions = [
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
        
        actions.push(
            getPoolDataByPoolAddressAction,
            getTrendingPoolsAction,
            getTrendingPoolsByNetworkAction,
            getTopGainersLosersAction,
            getTokenDataByTokenAddressAction,
            getTokensInfoByPoolAddressAction
        );
        
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
}

export default CoinGeckoPlugin;
