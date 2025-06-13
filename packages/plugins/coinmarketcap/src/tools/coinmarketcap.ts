import { Agentix, EvmWalletBase } from "agentix";
import { CoinmarketcapApi } from "../api";
import {
    CryptocurrencyListingsParams,
    CryptocurrencyQuotesLatestParams,
    ExchangeListingsParams,
    ExchangeQuotesLatestParams,
    ContentLatestParams,
    CryptocurrencyMapParams,
    CryptocurrencyOHLCVLatestParams,
    CryptocurrencyTrendingLatestParams,
    CryptocurrencyTrendingMostVisitedParams,
    CryptocurrencyTrendingGainersLosersParams
} from "../types";

/**
 * Initialize CoinMarketCap API client from agent configuration
 */
function initCoinMarketCapApi(agent: Agentix<EvmWalletBase>): CoinmarketcapApi {
    const apiKey = agent.config.coinmarketcapApiKey;
    if (!apiKey) {
        throw new Error("CoinMarketCap API key is required in agent config");
    }
    return new CoinmarketcapApi(apiKey);
}

/**
 * Fetch the latest cryptocurrency listings with market data
 */
export async function getCryptocurrencyListings({
    agent,
    start,
    limit,
    sort,
    sort_dir,
    cryptocurrency_type,
    tag,
    aux,
    convert
}: {
    agent: Agentix<EvmWalletBase>;
} & CryptocurrencyListingsParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/v1/cryptocurrency/listings/latest", {
            start,
            limit,
            sort,
            sort_dir,
            cryptocurrency_type,
            tag,
            aux: aux?.join(","),
            convert
        });
    } catch (error) {
        throw new Error(`Failed to fetch cryptocurrency listings: ${error}`);
    }
}

/**
 * Get the latest market quotes for cryptocurrencies
 */
export async function getCryptocurrencyQuotes({
    agent,
    id,
    symbol,
    convert,
    aux
}: {
    agent: Agentix<EvmWalletBase>;
} & CryptocurrencyQuotesLatestParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/v2/cryptocurrency/quotes/latest", {
            id: id?.join(","),
            symbol: symbol?.join(","),
            convert,
            aux: aux?.join(",")
        });
    } catch (error) {
        throw new Error(`Failed to fetch cryptocurrency quotes: ${error}`);
    }
}

/**
 * Fetch the latest cryptocurrency exchange listings
 */
export async function getExchangeListings({
    agent,
    start,
    limit,
    sort,
    sort_dir,
    market_type,
    aux,
    convert
}: {
    agent: Agentix<EvmWalletBase>;
} & ExchangeListingsParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/v1/exchange/listings/latest", {
            start,
            limit,
            sort,
            sort_dir,
            market_type,
            aux: aux?.join(","),
            convert
        });
    } catch (error) {
        throw new Error(`Failed to fetch exchange listings: ${error}`);
    }
}

/**
 * Get the latest market data for exchanges
 */
export async function getExchangeQuotes({
    agent,
    id,
    slug,
    convert,
    aux
}: {
    agent: Agentix<EvmWalletBase>;
} & ExchangeQuotesLatestParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/v1/exchange/quotes/latest", {
            id: id?.join(","),
            slug: slug?.join(","),
            convert,
            aux: aux?.join(",")
        });
    } catch (error) {
        throw new Error(`Failed to fetch exchange quotes: ${error}`);
    }
}

/**
 * Fetch the latest cryptocurrency news and content
 */
export async function getContent({
    agent,
    start,
    limit,
    id,
    slug,
    symbol,
    news_type,
    content_type,
    category,
    language
}: {
    agent: Agentix<EvmWalletBase>;
} & ContentLatestParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/v1/content/latest", {
            start,
            limit,
            id: id?.join(","),
            slug: slug?.join(","),
            symbol: symbol?.join(","),
            news_type,
            content_type,
            category,
            language
        });
    } catch (error) {
        throw new Error(`Failed to fetch content: ${error}`);
    }
}

/**
 * Get a mapping of all cryptocurrencies with unique IDs
 */
export async function getCryptocurrencyMap({
    agent,
    listing_status,
    start,
    limit,
    sort,
    symbol,
    aux
}: {
    agent: Agentix<EvmWalletBase>;
} & CryptocurrencyMapParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/v1/cryptocurrency/map", {
            listing_status,
            start,
            limit,
            sort,
            symbol: symbol?.join(","),
            aux: aux?.join(",")
        });
    } catch (error) {
        throw new Error(`Failed to fetch cryptocurrency map: ${error}`);
    }
}

/**
 * Get the latest OHLCV values for cryptocurrencies
 */
export async function getCryptocurrencyOHLCV({
    agent,
    id,
    symbol,
    convert,
    convert_id,
    skip_invalid
}: {
    agent: Agentix<EvmWalletBase>;
} & CryptocurrencyOHLCVLatestParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/v2/cryptocurrency/ohlcv/latest", {
            id: id?.join(","),
            symbol: symbol?.join(","),
            convert,
            convert_id,
            skip_invalid
        });
    } catch (error) {
        throw new Error(`Failed to fetch cryptocurrency OHLCV data: ${error}`);
    }
}

/**
 * Get the latest trending cryptocurrencies
 */
export async function getCryptocurrencyTrending({
    agent,
    start,
    limit,
    time_period,
    convert,
    convert_id
}: {
    agent: Agentix<EvmWalletBase>;
} & CryptocurrencyTrendingLatestParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/cryptocurrency/trending/latest", {
            start,
            limit,
            time_period,
            convert,
            convert_id
        });
    } catch (error) {
        throw new Error(`Failed to fetch trending cryptocurrencies: ${error}`);
    }
}

/**
 * Get the most visited cryptocurrencies
 */
export async function getCryptocurrencyMostVisited({
    agent,
    start,
    limit,
    time_period,
    convert,
    convert_id
}: {
    agent: Agentix<EvmWalletBase>;
} & CryptocurrencyTrendingMostVisitedParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/cryptocurrency/trending/most-visited", {
            start,
            limit,
            time_period,
            convert,
            convert_id
        });
    } catch (error) {
        throw new Error(`Failed to fetch most visited cryptocurrencies: ${error}`);
    }
}

/**
 * Get the top gaining and losing cryptocurrencies
 */
export async function getCryptocurrencyGainersLosers({
    agent,
    start,
    limit,
    time_period,
    convert,
    convert_id,
    sort,
    sort_dir
}: {
    agent: Agentix<EvmWalletBase>;
} & CryptocurrencyTrendingGainersLosersParams) {
    try {
        const api = initCoinMarketCapApi(agent);
        return await api.makeRequest("/cryptocurrency/trending/gainers-losers", {
            start,
            limit,
            time_period,
            convert,
            convert_id,
            sort,
            sort_dir
        });
    } catch (error) {
        throw new Error(`Failed to fetch cryptocurrency gainers and losers: ${error}`);
    }
} 