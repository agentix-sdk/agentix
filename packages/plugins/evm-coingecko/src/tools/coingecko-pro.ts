import { Agentix, EvmWalletBase } from "agentix";
import { CoinGeckoAPI } from "../api";
import {
    GetPoolDataByPoolAddressParams,
    GetTrendingPoolsByNetworkParams,
    GetTrendingPoolsParams,
    TopGainersLosersParams,
    GetTokenDataByTokenAddressParams,
    GetTokensInfoByPoolAddressParams
} from "../types";

/**
 * Get data for a specific pool by its address
 */
export async function getPoolDataByPoolAddress({
    agent,
    network,
    addresses
}: {
    agent: Agentix<EvmWalletBase>;
} & GetPoolDataByPoolAddressParams) {
    const api = initCoinGeckoProAPI(agent);
    return api.request(`coins/${network}/pools/multi/${addresses.join(",")}`, {});
}

/**
 * Get trending pools across all networks
 */
export async function getTrendingPools({
    agent,
    include,
    page,
    duration
}: {
    agent: Agentix<EvmWalletBase>;
} & GetTrendingPoolsParams) {
    const api = initCoinGeckoProAPI(agent);
    return api.request("onchain/networks/trending_pools", {
        include: include.join(","),
        page,
        duration,
    });
}

/**
 * Get trending pools for a specific network
 */
export async function getTrendingPoolsByNetwork({
    agent,
    network
}: {
    agent: Agentix<EvmWalletBase>;
} & GetTrendingPoolsByNetworkParams) {
    const api = initCoinGeckoProAPI(agent);
    return api.request(`onchain/networks/${network}/trending_pools`, {});
}

/**
 * Get top gainers and losers for a specific duration
 */
export async function getTopGainersLosers({
    agent,
    vsCurrency,
    duration,
    topCoins
}: {
    agent: Agentix<EvmWalletBase>;
} & TopGainersLosersParams) {
    const api = initCoinGeckoProAPI(agent);
    return api.request("coins/top_gainers_losers", {
        vs_currency: vsCurrency,
        duration,
        top_coins: topCoins,
    });
}

/**
 * Get data for a specific token by its address
 */
export async function getTokenDataByTokenAddress({
    agent,
    network,
    address
}: {
    agent: Agentix<EvmWalletBase>;
} & GetTokenDataByTokenAddressParams) {
    const api = initCoinGeckoProAPI(agent);
    return api.request(`onchain/networks/${network}/tokens/${address}/info`, {});
}

/**
 * Get data for all tokens in a specific pool by its address
 */
export async function getTokensInfoByPoolAddress({
    agent,
    network,
    poolAddress
}: {
    agent: Agentix<EvmWalletBase>;
} & GetTokensInfoByPoolAddressParams) {
    const api = initCoinGeckoProAPI(agent);
    return api.request(`onchain/networks/${network}/pools/${poolAddress}/tokens`, {});
}

// Helper function to initialize CoinGecko Pro API from agent config
function initCoinGeckoProAPI(agent: Agentix<EvmWalletBase>): CoinGeckoAPI {
    const apiKey = agent.config.coingeckoApiKey;
    
    if (!apiKey) {
        throw new Error("CoinGecko API key is required in agent config");
    }
    
    return new CoinGeckoAPI(apiKey, true);
} 