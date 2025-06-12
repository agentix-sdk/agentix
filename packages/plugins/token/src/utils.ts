import { ChainSpecificToken, Token, TokenSearchParams, ChainSearchParams } from "./types";
import { getChainById, getChainByName, getAllSupportedChains } from "./chains";
import { DEFAULT_TOKENS } from "./default-tokens";

export function getTokensForNetwork(chainId: string | number, tokens: Token[] = DEFAULT_TOKENS): ChainSpecificToken[] {
    const result: ChainSpecificToken[] = [];
    const chainIdStr = chainId.toString();
    const chainInfo = getChainById(chainIdStr);

    if (!chainInfo) return result;

    for (const token of tokens) {
        const chainData = token.chains[chainIdStr];
        if (chainData) {
            result.push({
                chainId: chainId,
                chainType: chainInfo.type,
                decimals: token.decimals,
                symbol: token.symbol,
                name: token.name,
                contractAddress: chainData.contractAddress,
                native: chainData.native || false,
                coingeckoId: chainData.coingeckoId,
            });
        }
    }

    return result;
}

export function searchTokens(params: TokenSearchParams, tokens: Token[] = DEFAULT_TOKENS): ChainSpecificToken[] {
    let results: ChainSpecificToken[] = [];

    for (const token of tokens) {
        for (const [chainId, chainData] of Object.entries(token.chains)) {
            const chainInfo = getChainById(chainId);
            if (!chainInfo) continue;

            // Filter by parameters
            if (params.symbol && token.symbol.toLowerCase() !== params.symbol.toLowerCase()) continue;
            if (params.name && !token.name.toLowerCase().includes(params.name.toLowerCase())) continue;
            if (params.chainId && chainId !== params.chainId.toString()) continue;
            if (params.chainType && chainInfo.type !== params.chainType) continue;
            if (params.contractAddress && chainData.contractAddress?.toLowerCase() !== params.contractAddress.toLowerCase()) continue;

            results.push({
                chainId,
                chainType: chainInfo.type,
                decimals: token.decimals,
                symbol: token.symbol,
                name: token.name,
                contractAddress: chainData.contractAddress,
                native: chainData.native || false,
                coingeckoId: chainData.coingeckoId,
            });
        }
    }

    return results;
}

export function getTokenBySymbol(symbol: string, chainId?: string | number, tokens: Token[] = DEFAULT_TOKENS): ChainSpecificToken | undefined {
    const results = searchTokens({ 
        symbol, 
        chainId: chainId?.toString() 
    }, tokens);
    
    return results[0];
}

export function getTokenByAddress(contractAddress: string, chainId?: string | number, tokens: Token[] = DEFAULT_TOKENS): ChainSpecificToken | undefined {
    const results = searchTokens({ 
        contractAddress, 
        chainId: chainId?.toString() 
    }, tokens);
    
    return results[0];
}

export function getNativeTokenForChain(chainId: string | number): ChainSpecificToken | undefined {
    const results = searchTokens({ 
        chainId: chainId.toString() 
    });
    
    return results.find(token => token.native);
}

export function getTokensByChainType(chainType: string, tokens: Token[] = DEFAULT_TOKENS): ChainSpecificToken[] {
    return searchTokens({ chainType: chainType as any }, tokens);
}

export function getSupportedChainsForToken(tokenSymbol: string, tokens: Token[] = DEFAULT_TOKENS): string[] {
    const token = tokens.find(t => t.symbol.toLowerCase() === tokenSymbol.toLowerCase());
    if (!token) return [];
    
    return Object.keys(token.chains);
}

export function isTokenSupportedOnChain(tokenSymbol: string, chainId: string | number, tokens: Token[] = DEFAULT_TOKENS): boolean {
    const token = tokens.find(t => t.symbol.toLowerCase() === tokenSymbol.toLowerCase());
    if (!token) return false;
    
    return chainId.toString() in token.chains;
}

export function formatTokenAmount(amount: string | number, decimals: number): string {
    const divisor = Math.pow(10, decimals);
    const formatted = (Number(amount) / divisor).toString();
    return formatted;
}

export function parseTokenAmount(amount: string | number, decimals: number): string {
    const multiplier = Math.pow(10, decimals);
    const parsed = (Number(amount) * multiplier).toString();
    return parsed;
}

export function getChainInfo(params: ChainSearchParams) {
    const allChains = getAllSupportedChains();
    
    if (params.id) {
        return getChainById(params.id);
    }
    
    if (params.name) {
        return getChainByName(params.name);
    }
    
    if (params.type) {
        return allChains.filter(chain => chain.type === params.type);
    }
    
    return allChains;
}
