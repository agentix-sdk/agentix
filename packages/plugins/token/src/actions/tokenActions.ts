import { Action, WalletBase } from "agentix";
import { z } from "zod";
import { 
    searchTokensByParams, 
    getTokenBySymbolAndChain, 
    getTokenByContractAddress, 
    getNativeToken,
    getTokensByChain,
    getSupportedChains,
    checkTokenSupport
} from "../tools/token-lookup";

export const searchTokensAction: Action<WalletBase> = {
    name: "SEARCH_TOKENS",
    similes: [
        "search for tokens",
        "find tokens",
        "look up tokens",
        "get token information",
        "find token by symbol",
        "search token database"
    ],
    description: "Search for tokens across multiple chains with various filters",
    examples: [
        [
            {
                input: {
                    symbol: "USDC",
                    chainId: "1"
                },
                output: {
                    success: true,
                    tokens: [
                        {
                            chainId: "1",
                            chainType: "evm",
                            decimals: 6,
                            symbol: "USDC",
                            name: "USD Coin",
                            contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                        }
                    ],
                    count: 1
                },
                explanation: "Search for USDC token on Ethereum mainnet"
            }
        ]
    ],
    schema: z.object({
        symbol: z.string().optional().describe("Token symbol to search for (e.g., USDC, ETH, BTC)"),
        name: z.string().optional().describe("Token name to search for (partial match)"),
        chainId: z.union([z.string(), z.number()]).optional().describe("Chain ID to filter by"),
        chainType: z.string().optional().describe("Chain type to filter by (evm, solana, etc.)"),
        contractAddress: z.string().optional().describe("Contract address to search for"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await searchTokensByParams({
                agent,
                searchParams: input
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                tokens: [],
                count: 0
            };
        }
    }
};

export const getTokenAction: Action<WalletBase> = {
    name: "GET_TOKEN",
    similes: [
        "get token",
        "get token by symbol",
        "find token",
        "lookup token",
        "get token info",
        "token details"
    ],
    description: "Get specific token information by symbol and optionally chain",
    examples: [
        [
            {
                input: {
                    symbol: "ETH",
                    chainId: "1"
                },
                output: {
                    success: true,
                    token: {
                        chainId: "1",
                        chainType: "evm",
                        decimals: 18,
                        symbol: "ETH",
                        name: "Ether",
                        native: true
                    }
                },
                explanation: "Get ETH token information on Ethereum mainnet"
            }
        ]
    ],
    schema: z.object({
        symbol: z.string().describe("Token symbol (e.g., ETH, USDC, SOL)"),
        chainId: z.union([z.string(), z.number()]).optional().describe("Specific chain ID to get token from"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTokenBySymbolAndChain({
                agent,
                symbol: input.symbol,
                chainId: input.chainId
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                token: null
            };
        }
    }
};

export const getTokenByAddressAction: Action<WalletBase> = {
    name: "GET_TOKEN_BY_ADDRESS",
    similes: [
        "get token by address",
        "find token by contract",
        "lookup token by contract address",
        "get token from address",
        "token by contract"
    ],
    description: "Get token information by contract address",
    examples: [
        [
            {
                input: {
                    contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    chainId: "1"
                },
                output: {
                    success: true,
                    token: {
                        chainId: "1",
                        chainType: "evm",
                        decimals: 6,
                        symbol: "USDC",
                        name: "USD Coin",
                        contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                explanation: "Get USDC token information by contract address on Ethereum"
            }
        ]
    ],
    schema: z.object({
        contractAddress: z.string().describe("Contract address of the token"),
        chainId: z.union([z.string(), z.number()]).optional().describe("Specific chain ID to search on"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTokenByContractAddress({
                agent,
                contractAddress: input.contractAddress,
                chainId: input.chainId
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                token: null
            };
        }
    }
};

export const getNativeTokenAction: Action<WalletBase> = {
    name: "GET_NATIVE_TOKEN",
    similes: [
        "get native token",
        "get chain native token",
        "get native currency",
        "native token for chain",
        "chain's native token"
    ],
    description: "Get the native token for a specific chain",
    examples: [
        [
            {
                input: {
                    chainId: "1"
                },
                output: {
                    success: true,
                    token: {
                        chainId: "1",
                        chainType: "evm",
                        decimals: 18,
                        symbol: "ETH",
                        name: "Ether",
                        native: true
                    }
                },
                explanation: "Get native token (ETH) for Ethereum mainnet"
            }
        ]
    ],
    schema: z.object({
        chainId: z.union([z.string(), z.number()]).describe("Chain ID to get native token for"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getNativeToken({
                agent,
                chainId: input.chainId
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                token: null
            };
        }
    }
};

export const getTokensByChainTypeAction: Action<WalletBase> = {
    name: "GET_TOKENS_BY_CHAIN_TYPE",
    similes: [
        "get tokens by chain type",
        "get evm tokens",
        "get solana tokens",
        "tokens for chain type",
        "list tokens by chain"
    ],
    description: "Get all tokens available for a specific chain type",
    examples: [
        [
            {
                input: {
                    chainType: "evm"
                },
                output: {
                    success: true,
                    tokens: [
                        {
                            chainId: "1",
                            chainType: "evm",
                            decimals: 18,
                            symbol: "ETH",
                            name: "Ether",
                            native: true
                        }
                    ],
                    count: 1
                },
                explanation: "Get all tokens available on EVM chains"
            }
        ]
    ],
    schema: z.object({
        chainType: z.string().describe("Chain type (evm, solana, aptos, etc.)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTokensByChain({
                agent,
                chainType: input.chainType
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                tokens: [],
                count: 0
            };
        }
    }
};

export const getSupportedChainsForTokenAction: Action<WalletBase> = {
    name: "GET_SUPPORTED_CHAINS_FOR_TOKEN",
    similes: [
        "get supported chains for token",
        "which chains support token",
        "token supported chains",
        "where is token available",
        "token chain support"
    ],
    description: "Get all chains that support a specific token",
    examples: [
        [
            {
                input: {
                    tokenSymbol: "USDC"
                },
                output: {
                    success: true,
                    chains: ["1", "10", "137", "8453", "84532", "11155111", "34443", "42161", "solana-mainnet"],
                    count: 9
                },
                explanation: "Get all chains that support USDC token"
            }
        ]
    ],
    schema: z.object({
        tokenSymbol: z.string().describe("Token symbol to check support for"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getSupportedChains({
                agent,
                tokenSymbol: input.tokenSymbol
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                chains: []
            };
        }
    }
};

export const checkTokenSupportAction: Action<WalletBase> = {
    name: "CHECK_TOKEN_SUPPORT",
    similes: [
        "check token support",
        "is token supported",
        "token supported on chain",
        "check if token available",
        "verify token support"
    ],
    description: "Check if a specific token is supported on a specific chain",
    examples: [
        [
            {
                input: {
                    tokenSymbol: "USDC",
                    chainId: "1"
                },
                output: {
                    success: true,
                    supported: true,
                    message: "Token USDC is supported on chain 1"
                },
                explanation: "Check if USDC is supported on Ethereum mainnet"
            }
        ]
    ],
    schema: z.object({
        tokenSymbol: z.string().describe("Token symbol to check"),
        chainId: z.union([z.string(), z.number()]).describe("Chain ID to check support on"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await checkTokenSupport({
                agent,
                tokenSymbol: input.tokenSymbol,
                chainId: input.chainId
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                supported: false
            };
        }
    }
}; 