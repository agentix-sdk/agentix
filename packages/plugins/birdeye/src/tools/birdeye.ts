import { Agentix, EvmWalletBase, SolanaWalletBase } from "agentix";
import { BirdeyeApi } from "../utils/api";

/**
 * Initialize BirdEye API client
 */
function initBirdeyeApi(apiKey: string): BirdeyeApi {
    return new BirdeyeApi(apiKey);
}

/**
 * Get price information for one or multiple tokens
 */
export async function getTokenPrice({
    agent,
    list_address,
    chain,
    include_liquidity
}: {
    agent: Agentix<EvmWalletBase | SolanaWalletBase>,
    list_address: string[],
    chain: string,
    include_liquidity?: boolean
}) {
    const apiKey = agent.config.birdeyeApiKey;
    if (!apiKey) {
        throw new Error("BirdEye API key is required");
    }
    
    const birdeyeApi = initBirdeyeApi(apiKey);
    
    const endpoint = `/defi/multi_price?&addresses=${list_address.join(
        ",",
    )}${include_liquidity ? "&include_liquidity=true" : ""}`;
    
    return await birdeyeApi.makeRequest(endpoint, chain as any);
}

/**
 * Get historical price line chart for a token
 */
export async function getTokenHistoryPrice({
    agent,
    address,
    address_type = "token",
    type,
    time_from,
    time_to,
    chain
}: {
    agent: Agentix<EvmWalletBase | SolanaWalletBase>,
    address: string,
    address_type?: "token" | "pair",
    type: string,
    time_from?: number,
    time_to?: number,
    chain: string
}) {
    const apiKey = agent.config.birdeyeApiKey;
    if (!apiKey) {
        throw new Error("BirdEye API key is required");
    }
    
    const birdeyeApi = initBirdeyeApi(apiKey);
    
    // except chain, transform all params in query string
    const params: Record<string, any> = {
        address,
        address_type,
        type,
        time_from,
        time_to
    };
    
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    const endpoint = `/defi/history_price?${queryString}`;
    
    return await birdeyeApi.makeRequest(endpoint, chain as any);
}

/**
 * Get OHLCV price of a token
 */
export async function getOhlcv({
    agent,
    address,
    type,
    time_from,
    time_to,
    chain
}: {
    agent: Agentix<EvmWalletBase | SolanaWalletBase>,
    address: string,
    type: string,
    time_from?: number,
    time_to?: number,
    chain: string
}) {
    const apiKey = agent.config.birdeyeApiKey;
    if (!apiKey) {
        throw new Error("BirdEye API key is required");
    }
    
    const birdeyeApi = initBirdeyeApi(apiKey);
    
    const params: Record<string, any> = {
        address,
        type,
        time_from,
        time_to
    };
    
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    const endpoint = `/defi/ohlcv?${queryString}`;
    
    return await birdeyeApi.makeRequest(endpoint, chain as any);
}

/**
 * Get OHLCV price of a pair
 */
export async function getOhlcvPair({
    agent,
    pair_address,
    type,
    limit,
    chain
}: {
    agent: Agentix<EvmWalletBase | SolanaWalletBase>,
    pair_address: string,
    type: string,
    limit?: number,
    chain: string
}) {
    const apiKey = agent.config.birdeyeApiKey;
    if (!apiKey) {
        throw new Error("BirdEye API key is required");
    }
    
    const birdeyeApi = initBirdeyeApi(apiKey);
    
    const params: Record<string, any> = {
        pair_address,
        type,
        limit
    };
    
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    
    const endpoint = `/defi/ohlcv/pair?${queryString}`;
    
    return await birdeyeApi.makeRequest(endpoint, chain as any);
}

/**
 * Get security information of a token
 */
export async function getTokenSecurity({
    agent,
    address,
    chain
}: {
    agent: Agentix<EvmWalletBase | SolanaWalletBase>,
    address: string,
    chain: string
}) {
    const apiKey = agent.config.birdeyeApiKey;
    if (!apiKey) {
        throw new Error("BirdEye API key is required");
    }
    
    const birdeyeApi = initBirdeyeApi(apiKey);
    
    const endpoint = `/defi/token_security?address=${address}`;
    
    return await birdeyeApi.makeRequest(endpoint, chain as any);
}

/**
 * Get trending tokens
 */
export async function getTrendingTokens({
    agent,
    chain,
    sort_by,
    sort_type,
    offset,
    limit
}: {
    agent: Agentix<EvmWalletBase | SolanaWalletBase>,
    chain: string,
    sort_by: string,
    sort_type: string,
    offset?: number,
    limit?: number
}) {
    const apiKey = agent.config.birdeyeApiKey;
    if (!apiKey) {
        throw new Error("BirdEye API key is required");
    }
    
    const birdeyeApi = initBirdeyeApi(apiKey);
    
    const params: Record<string, any> = {
        sort_by,
        sort_type,
        offset,
        limit
    };
    
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    
    const endpoint = `/defi/trending_tokens?${queryString}`;
    
    return await birdeyeApi.makeRequest(endpoint, chain as any);
}

/**
 * Search for a token
 */
export async function searchToken({
    agent,
    keyword,
    chain,
    sort_by,
    sort_type,
    verify_token,
    markets,
    offset,
    limit
}: {
    agent: Agentix<EvmWalletBase | SolanaWalletBase>,
    keyword: string,
    chain: string,
    sort_by: string,
    sort_type: string,
    verify_token?: boolean,
    markets?: string[],
    offset?: number,
    limit?: number
}) {
    const apiKey = agent.config.birdeyeApiKey;
    if (!apiKey) {
        throw new Error("BirdEye API key is required");
    }
    
    const birdeyeApi = initBirdeyeApi(apiKey);
    
    const params: Record<string, any> = {
        keyword,
        sort_by,
        sort_type,
        verify_token,
        markets: markets ? markets.join(",") : undefined,
        offset,
        limit
    };
    
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    
    const endpoint = `/defi/v3/search?${queryString}`;
    
    return await birdeyeApi.makeRequest(endpoint, chain as any);
} 