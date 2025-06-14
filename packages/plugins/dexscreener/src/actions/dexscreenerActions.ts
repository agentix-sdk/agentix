import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { getPairsByChainAndPair, searchPairs, getTokenPairsByTokenAddress } from "../tools/dexscreener";

export const dexscreenerGetPairsByChainAndPairAction: Action<EvmWalletBase> = {
    name: "DEXSCREENER_GET_PAIRS_BY_CHAIN_AND_PAIR",
    similes: [
        "get pair by chain and pair id",
        "fetch pair data from dexscreener",
        "get specific pair info",
        "lookup pair by chain and address",
        "get pair details"
    ],
    description: "Fetch pairs by chainId and pairId from Dexscreener",
    examples: [
        [
            {
                input: {
                    chainId: "ethereum",
                    pairId: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"
                },
                output: {
                    status: "success",
                    message: "Successfully fetched pair data",
                    pairs: [],
                },
                explanation: "Fetch specific pair data by chain ID and pair address",
            },
        ],
    ],
    schema: z.object({
        chainId: z.string().describe("The chain ID of the pair (e.g., 'ethereum', 'bsc', 'polygon')"),
        pairId: z.string().describe("The pair ID/address to fetch"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getPairsByChainAndPair({
                agent,
                chainId: input.chainId,
                pairId: input.pairId,
            });

            return {
                status: "success",
                message: `Successfully fetched pair data for ${input.chainId}/${input.pairId}`,
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const dexscreenerSearchPairsAction: Action<EvmWalletBase> = {
    name: "DEXSCREENER_SEARCH_PAIRS",
    similes: [
        "search pairs on dexscreener",
        "find pairs by query",
        "search for trading pairs",
        "lookup pairs by name",
        "search dex pairs"
    ],
    description: "Search for DEX pairs matching a query string on Dexscreener",
    examples: [
        [
            {
                input: {
                    query: "USDC ETH"
                },
                output: {
                    status: "success",
                    message: "Successfully searched for pairs",
                    pairs: [],
                },
                explanation: "Search for pairs containing USDC and ETH",
            },
        ],
    ],
    schema: z.object({
        query: z.string().describe("The search query string (token symbols, names, or addresses)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await searchPairs({
                agent,
                query: input.query,
            });

            return {
                status: "success",
                message: `Successfully searched for pairs matching "${input.query}"`,
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const dexscreenerGetTokenPairsAction: Action<EvmWalletBase> = {
    name: "DEXSCREENER_GET_TOKEN_PAIRS",
    similes: [
        "get pairs by token address",
        "find pairs for token",
        "get token trading pairs",
        "lookup pairs by token address",
        "get all pairs for token"
    ],
    description: "Get all DEX pairs for given token addresses (up to 30) from Dexscreener",
    examples: [
        [
            {
                input: {
                    tokenAddresses: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]
                },
                output: {
                    status: "success",
                    message: "Successfully fetched token pairs",
                    pairs: [],
                },
                explanation: "Get all trading pairs for USDC token",
            },
        ],
    ],
    schema: z.object({
        tokenAddresses: z.array(z.string()).max(30).describe("List of up to 30 token addresses"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getTokenPairsByTokenAddress({
                agent,
                tokenAddresses: input.tokenAddresses,
            });

            return {
                status: "success",
                message: `Successfully fetched pairs for ${input.tokenAddresses.length} token(s)`,
                data: result,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 