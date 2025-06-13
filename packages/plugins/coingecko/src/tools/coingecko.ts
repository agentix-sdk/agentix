import { Agentix, EvmWalletBase } from "agentix";
import { CoinGeckoAPI } from "../api";
import {
    NoParams,
    GetCoinPricesParams,
    SearchCoinsParams,
    GetCoinPriceByContractAddressParams,
    GetCoinDataParams,
    GetHistoricalDataParams,
    GetOHLCParams,
    GetTrendingCoinCategoriesParams
} from "../types";

/**
 * Get the list of trending coins from CoinGecko
 */
export async function getTrendingCoins({
    agent
}: {
    agent: Agentix<EvmWalletBase>;
}) {
    const api = initCoinGeckoAPI(agent);
    return api.request("search/trending", {});
}

/**
 * Get the prices of specific coins from CoinGecko
 */
export async function getCoinPrices({
    agent,
    coinIds,
    vsCurrency,
    includeMarketCap,
    include24hrVol,
    include24hrChange,
    includeLastUpdatedAt
}: {
    agent: Agentix<EvmWalletBase>;
} & GetCoinPricesParams) {
    const api = initCoinGeckoAPI(agent);
    return api.request("simple/price", {
        ids: coinIds.join(","),
        vs_currencies: vsCurrency,
        include_market_cap: includeMarketCap,
        include_24hr_vol: include24hrVol,
        include_24hr_change: include24hrChange,
        include_last_updated_at: includeLastUpdatedAt,
    });
}

/**
 * Search for coins by keyword
 */
export async function searchCoins({
    agent,
    query
}: {
    agent: Agentix<EvmWalletBase>;
} & SearchCoinsParams) {
    const api = initCoinGeckoAPI(agent);
    return api.request("search", {
        query,
    });
}

/**
 * Get coin price by contract address
 */
export async function getCoinPriceByContractAddress({
    agent,
    id,
    contractAddresses,
    vsCurrency,
    includeMarketCap,
    include24hrVol,
    include24hrChange,
    includeLastUpdatedAt
}: {
    agent: Agentix<EvmWalletBase>;
} & GetCoinPriceByContractAddressParams) {
    const api = initCoinGeckoAPI(agent);
    return api.request(`simple/token_price/${id}`, {
        contract_addresses: contractAddresses.join(","),
        vs_currencies: vsCurrency,
        include_market_cap: includeMarketCap,
        include_24hr_vol: include24hrVol,
        include_24hr_change: include24hrChange,
        include_last_updated_at: includeLastUpdatedAt,
    });
}

/**
 * Get detailed coin data by ID (including contract address, market data, community data, developer stats, and more)
 */
export async function getCoinData({
    agent,
    id,
    localization,
    tickers,
    marketData,
    communityData,
    developerData,
    sparkline
}: {
    agent: Agentix<EvmWalletBase>;
} & GetCoinDataParams) {
    const api = initCoinGeckoAPI(agent);
    return api.request(`coins/${id}`, {
        localization,
        tickers,
        market_data: marketData,
        community_data: communityData,
        developer_data: developerData,
        sparkline,
    });
}

/**
 * Get historical data for a coin by ID
 */
export async function getHistoricalData({
    agent,
    id,
    date,
    localization
}: {
    agent: Agentix<EvmWalletBase>;
} & GetHistoricalDataParams) {
    const api = initCoinGeckoAPI(agent);
    return api.request(`coins/${id}/history`, {
        date,
        localization,
    });
}

/**
 * Get OHLC chart data for a coin by ID
 */
export async function getOHLCData({
    agent,
    id,
    vsCurrency,
    days
}: {
    agent: Agentix<EvmWalletBase>;
} & GetOHLCParams) {
    const api = initCoinGeckoAPI(agent);
    return api.request(`coins/${id}/ohlc`, {
        vs_currency: vsCurrency,
        days,
    });
}

/**
 * Get trending coin categories
 */
export async function getTrendingCoinCategories({
    agent,
    vsCurrency,
    ids,
    category,
    order,
    perPage,
    page,
    sparkline,
    priceChangePercentage,
    locale
}: {
    agent: Agentix<EvmWalletBase>;
} & GetTrendingCoinCategoriesParams) {
    const api = initCoinGeckoAPI(agent);
    return api.request("coins/markets", {
        vs_currency: vsCurrency,
        ids: ids.join(","),
        category,
        order,
        per_page: perPage,
        page,
        sparkline,
        price_change_percentage: priceChangePercentage,
        locale,
    });
}

/**
 * Get all coin categories
 */
export async function getCoinCategories({
    agent
}: {
    agent: Agentix<EvmWalletBase>;
}) {
    const api = initCoinGeckoAPI(agent);
    return api.request("coins/categories", {});
}

// Helper function to initialize CoinGecko API from agent config
function initCoinGeckoAPI(agent: Agentix<EvmWalletBase>): CoinGeckoAPI {
    const apiKey = agent.config.coingeckoApiKey;
    const isPro = agent.config.coingeckoIsPro || false;
    
    if (!apiKey) {
        throw new Error("CoinGecko API key is required in agent config");
    }
    
    return new CoinGeckoAPI(apiKey, isPro);
} 