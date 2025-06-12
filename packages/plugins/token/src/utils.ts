import { ChainSpecificToken, Token } from "./types";

export function getTokensForNetwork(chainId: number, tokens: Token[]): ChainSpecificToken[] {
    const result: ChainSpecificToken[] = [];

    for (const token of tokens) {
        const chainData = token.chains[chainId];
        if (chainData) {
            result.push({
                chainId: chainId,
                decimals: token.decimals,
                symbol: token.symbol,
                name: token.name,
                contractAddress: chainData.contractAddress,
            });
        }
    }

    return result;
}
