import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import getCoingeckoLatestPoolsAction from "./actions/getCoingeckoLatestPools";
import getCoingeckoTokenInfoAction from "./actions/getCoingeckoTokenInfo";
import getCoingeckoTokenPriceDataAction from "./actions/getCoingeckoTokenPriceData";
import getCoingeckoTopGainersAction from "./actions/getCoingeckoTopGainers";
import getCoingeckoTrendingPoolsAction from "./actions/getCoingeckoTrendingPools";
import getCoingeckoTrendingTokensAction from "./actions/getCoingeckoTrendingTokens";
import {
    getLatestPools,
    getTokenInfo,
    getTokenPriceData,
    getTopGainers,
    getTrendingPools,
    getTrendingTokens,
  } from "./tools";

class CoingeckoPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            getLatestPools,
            getTokenInfo,
            getTokenPriceData,
            getTopGainers,
            getTrendingPools,
            getTrendingTokens,
        };

        const actions = [
            getCoingeckoLatestPoolsAction,
            getCoingeckoTokenInfoAction,
            getCoingeckoTokenPriceDataAction,
            getCoingeckoTopGainersAction,
            getCoingeckoTrendingPoolsAction,
            getCoingeckoTrendingTokensAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("coingecko", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default CoingeckoPlugin;
