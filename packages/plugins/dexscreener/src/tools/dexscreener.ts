import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import { GetPairsByChainAndPairParams, SearchPairsParams, GetTokenPairsParams, PairInfo } from "../types";

const BASE_URL = "https://api.dexscreener.com/latest/dex";

async function fetchDexscreener(url: string, action: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to ${action}: ${error}`);
    }
}

export async function getPairsByChainAndPair({
    agent,
    chainId,
    pairId
}: {
    agent: Agentix<EvmWalletBase>;
} & GetPairsByChainAndPairParams): Promise<{ pairs: PairInfo[] }> {
    const url = `${BASE_URL}/pairs/${chainId}/${pairId}`;
    return await fetchDexscreener(url, "fetch pairs");
}

export async function searchPairs({
    agent,
    query
}: {
    agent: Agentix<EvmWalletBase>;
} & SearchPairsParams): Promise<{ pairs: PairInfo[] }> {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
    return await fetchDexscreener(url, "search pairs");
}

export async function getTokenPairsByTokenAddress({
    agent,
    tokenAddresses
}: {
    agent: Agentix<EvmWalletBase>;
} & GetTokenPairsParams): Promise<{ pairs: PairInfo[] }> {
    if (tokenAddresses.length > 30) {
        throw new Error("Maximum of 30 token addresses allowed per request");
    }
    const addresses = tokenAddresses.join(",");
    const url = `${BASE_URL}/tokens/${addresses}`;
    return await fetchDexscreener(url, "get token pairs");
} 