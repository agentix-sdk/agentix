import { Action, WalletBase } from "agentix";
import { z } from "zod";
import { 
    getChainInfo, 
    getChainByNameLookup, 
    getChainsByTypeLookup, 
    getAllChains,
    getEvmChains,
    getSupportedChainTypes,
    searchChains,
    getChainNativeCurrency
} from "../tools/chain-lookup";

export const getChainInfoAction: Action<WalletBase> = {
    name: "GET_CHAIN_INFO",
    similes: [
        "get chain info",
        "get chain information",
        "chain details",
        "lookup chain",
        "find chain",
        "chain by id"
    ],
    description: "Get detailed information about a specific blockchain by ID",
    examples: [
        [
            {
                input: {
                    chainId: "1"
                },
                output: {
                    success: true,
                    chain: {
                        id: 1,
                        name: "Ethereum",
                        type: "evm",
                        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                        rpcUrls: ["https://eth.public-rpc.com"],
                        blockExplorerUrls: ["https://etherscan.io"]
                    }
                },
                explanation: "Get detailed information about Ethereum mainnet"
            }
        ]
    ],
    schema: z.object({
        chainId: z.union([z.string(), z.number()]).describe("Chain ID to get information for"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getChainInfo({
                agent,
                chainId: input.chainId
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                chain: null
            };
        }
    }
};

export const getChainByNameAction: Action<WalletBase> = {
    name: "GET_CHAIN_BY_NAME",
    similes: [
        "get chain by name",
        "find chain by name",
        "lookup chain name",
        "search chain name",
        "chain by name"
    ],
    description: "Get blockchain information by name",
    examples: [
        [
            {
                input: {
                    name: "Ethereum"
                },
                output: {
                    success: true,
                    chain: {
                        id: 1,
                        name: "Ethereum",
                        type: "evm",
                        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }
                    }
                },
                explanation: "Get Ethereum chain information by name"
            }
        ]
    ],
    schema: z.object({
        name: z.string().describe("Chain name to search for (e.g., Ethereum, Polygon, Solana)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getChainByNameLookup({
                agent,
                name: input.name
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                chain: null
            };
        }
    }
};

export const getChainsByTypeAction: Action<WalletBase> = {
    name: "GET_CHAINS_BY_TYPE",
    similes: [
        "get chains by type",
        "get evm chains",
        "get solana chains",
        "list chains by type",
        "chains for type"
    ],
    description: "Get all blockchains of a specific type",
    examples: [
        [
            {
                input: {
                    type: "evm"
                },
                output: {
                    success: true,
                    chains: [
                        {
                            id: 1,
                            name: "Ethereum",
                            type: "evm",
                            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }
                        }
                    ],
                    count: 1
                },
                explanation: "Get all EVM-compatible chains"
            }
        ]
    ],
    schema: z.object({
        type: z.string().describe("Chain type (evm, solana, aptos, sui, etc.)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getChainsByTypeLookup({
                agent,
                type: input.type
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

export const getAllSupportedChainsAction: Action<WalletBase> = {
    name: "GET_ALL_SUPPORTED_CHAINS",
    similes: [
        "get all chains",
        "list all chains",
        "supported chains",
        "all blockchains",
        "available chains"
    ],
    description: "Get information about all supported blockchains",
    examples: [
        [
            {
                input: {},
                output: {
                    success: true,
                    chains: [
                        {
                            id: 1,
                            name: "Ethereum",
                            type: "evm",
                            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }
                        }
                    ],
                    count: 1
                },
                explanation: "Get all supported blockchains"
            }
        ]
    ],
    schema: z.object({}),
    handler: async (agent, input) => {
        try {
            const result = await getAllChains({ agent });
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

export const getEvmChainsAction: Action<WalletBase> = {
    name: "GET_EVM_CHAINS",
    similes: [
        "get evm chains",
        "list evm chains",
        "ethereum compatible chains",
        "evm blockchains",
        "ethereum chains"
    ],
    description: "Get all EVM-compatible blockchains",
    examples: [
        [
            {
                input: {},
                output: {
                    success: true,
                    chains: [
                        {
                            id: 1,
                            name: "Ethereum",
                            type: "evm",
                            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }
                        }
                    ],
                    count: 1
                },
                explanation: "Get all EVM-compatible chains"
            }
        ]
    ],
    schema: z.object({}),
    handler: async (agent, input) => {
        try {
            const result = await getEvmChains({ agent });
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

export const getSupportedChainTypesAction: Action<WalletBase> = {
    name: "GET_SUPPORTED_CHAIN_TYPES",
    similes: [
        "get chain types",
        "supported chain types",
        "blockchain types",
        "available chain types",
        "what chain types"
    ],
    description: "Get all supported blockchain types",
    examples: [
        [
            {
                input: {},
                output: {
                    success: true,
                    types: ["evm", "solana", "aptos", "sui"],
                    count: 4
                },
                explanation: "Get all supported blockchain types"
            }
        ]
    ],
    schema: z.object({}),
    handler: async (agent, input) => {
        try {
            const result = await getSupportedChainTypes({ agent });
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                types: []
            };
        }
    }
};

export const getChainNativeCurrencyAction: Action<WalletBase> = {
    name: "GET_CHAIN_NATIVE_CURRENCY",
    similes: [
        "get native currency",
        "get chain native token",
        "native currency for chain",
        "chain's native currency",
        "native token info"
    ],
    description: "Get the native currency information for a specific chain",
    examples: [
        [
            {
                input: {
                    chainId: "1"
                },
                output: {
                    success: true,
                    currency: {
                        name: "Ether",
                        symbol: "ETH",
                        decimals: 18
                    }
                },
                explanation: "Get native currency (ETH) for Ethereum mainnet"
            }
        ]
    ],
    schema: z.object({
        chainId: z.union([z.string(), z.number()]).describe("Chain ID to get native currency for"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getChainNativeCurrency({
                agent,
                chainId: input.chainId
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                currency: null
            };
        }
    }
}; 