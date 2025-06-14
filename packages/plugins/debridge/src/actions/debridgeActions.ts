import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { getBridgeQuote, createBridgeOrder, executeBridgeTransaction, getTokenInfo, getSupportedChains, checkTransactionStatus } from "../tools/debridge_bridge";

export const debridgeBridgeAction: Action<EvmWalletBase> = {
    name: "DEBRIDGE_BRIDGE",
    similes: [
        "bridge tokens using debridge",
        "cross-chain transfer with debridge",
        "bridge tokens across chains",
        "use debridge to bridge tokens",
        "transfer tokens cross-chain"
    ],
    description: "Bridge tokens across chains using the DeBridge protocol",
    examples: [
        [
            {
                input: {
                    srcChainId: "1",
                    srcChainTokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                    srcChainTokenInAmount: "1000000000000000000",
                    dstChainId: "7565164",
                    dstChainTokenOut: "DBRiDgJAMsM95moTzJs7M9LnkGErpbv9v6CUR1DXnUu5",
                    dstChainTokenOutRecipient: "9ZNXcG5SgqKwQj6uGt9DjmBwzJAhbX9qQH5pHhDFKxJc"
                },
                output: {
                    status: "success",
                    message: "Successfully bridged 1 WETH from Ethereum to Solana",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Bridge 1 WETH from Ethereum mainnet to DBR token on Solana",
            },
        ],
    ],
    schema: z.object({
        srcChainId: z.string().describe("Source chain ID (e.g., '1' for Ethereum)"),
        srcChainTokenIn: z.string().describe("Token address on source chain to bridge"),
        srcChainTokenInAmount: z.string().describe("Amount to bridge in base units (wei)"),
        dstChainId: z.string().describe("Destination chain ID (e.g., '7565164' for Solana)"),
        dstChainTokenOut: z.string().describe("Token address on destination chain"),
        dstChainTokenOutRecipient: z.string().describe("Recipient address on destination chain"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const senderAddress = agent.wallet.getAddress();
            
            const order = await createBridgeOrder({
                agent,
                srcChainId: input.srcChainId,
                srcChainTokenIn: input.srcChainTokenIn,
                srcChainTokenInAmount: input.srcChainTokenInAmount,
                dstChainId: input.dstChainId,
                dstChainTokenOut: input.dstChainTokenOut,
                dstChainTokenOutRecipient: input.dstChainTokenOutRecipient,
                senderAddress,
            });

            const txHash = await executeBridgeTransaction({
                agent,
                txData: order.tx,
            });

            return {
                status: "success",
                message: `Bridge transaction executed successfully`,
                transactionHash: txHash,
                orderData: order,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const debridgeGetQuoteAction: Action<EvmWalletBase> = {
    name: "DEBRIDGE_GET_QUOTE",
    similes: [
        "get bridge quote from debridge",
        "get debridge bridge price",
        "get cross-chain quote",
        "estimate bridge cost",
        "check bridge rates"
    ],
    description: "Get a quote for bridging tokens across chains using DeBridge",
    examples: [
        [
            {
                input: {
                    srcChainId: "1",
                    srcChainTokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                    srcChainTokenInAmount: "1000000000000000000",
                    dstChainId: "7565164",
                    dstChainTokenOut: "DBRiDgJAMsM95moTzJs7M9LnkGErpbv9v6CUR1DXnUu5"
                },
                output: {
                    status: "success",
                    message: "Successfully got bridge quote",
                    quote: {},
                },
                explanation: "Get a quote for bridging 1 WETH from Ethereum to DBR on Solana",
            },
        ],
    ],
    schema: z.object({
        srcChainId: z.string().describe("Source chain ID"),
        srcChainTokenIn: z.string().describe("Token address on source chain"),
        srcChainTokenInAmount: z.string().describe("Amount to bridge in base units"),
        dstChainId: z.string().describe("Destination chain ID"),
        dstChainTokenOut: z.string().describe("Token address on destination chain"),
        slippage: z.string().optional().describe("Slippage tolerance"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const quote = await getBridgeQuote({
                agent,
                srcChainId: input.srcChainId,
                srcChainTokenIn: input.srcChainTokenIn,
                srcChainTokenInAmount: input.srcChainTokenInAmount,
                dstChainId: input.dstChainId,
                dstChainTokenOut: input.dstChainTokenOut,
                slippage: input.slippage,
            });

            return {
                status: "success",
                message: `Successfully got bridge quote`,
                quote,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const debridgeGetTokenInfoAction: Action<EvmWalletBase> = {
    name: "DEBRIDGE_GET_TOKEN_INFO",
    similes: [
        "get token info from debridge",
        "search tokens on chain",
        "find token address",
        "get token details",
        "lookup token"
    ],
    description: "Get token information from a specific chain using DeBridge",
    examples: [
        [
            {
                input: {
                    chainId: "7565164",
                    search: "DBR"
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved token information",
                    tokens: {},
                },
                explanation: "Search for DBR token on Solana",
            },
        ],
    ],
    schema: z.object({
        chainId: z.string().describe("Chain ID to get tokens for"),
        tokenAddress: z.string().optional().describe("Specific token address to query"),
        search: z.string().optional().describe("Search term to filter tokens"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getTokenInfo({
                agent,
                chainId: input.chainId,
                tokenAddress: input.tokenAddress,
                search: input.search,
            });

            return {
                status: "success",
                message: `Successfully retrieved token information`,
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

export const debridgeGetSupportedChainsAction: Action<EvmWalletBase> = {
    name: "DEBRIDGE_GET_SUPPORTED_CHAINS",
    similes: [
        "get supported chains from debridge",
        "list debridge chains",
        "show available chains",
        "get chain list",
        "show supported networks"
    ],
    description: "Get list of chains supported by DeBridge protocol",
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    message: "Successfully retrieved supported chains",
                    chains: [],
                },
                explanation: "Get all chains supported by DeBridge",
            },
        ],
    ],
    schema: z.object({}),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await getSupportedChains({ agent });

            return {
                status: "success",
                message: `Successfully retrieved supported chains`,
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

export const debridgeCheckStatusAction: Action<EvmWalletBase> = {
    name: "DEBRIDGE_CHECK_STATUS",
    similes: [
        "check bridge status",
        "check transaction status",
        "check bridge progress",
        "get order status",
        "track bridge transaction"
    ],
    description: "Check the status of a bridge transaction using DeBridge",
    examples: [
        [
            {
                input: {
                    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved transaction status",
                    statuses: [],
                },
                explanation: "Check status of a bridge transaction",
            },
        ],
    ],
    schema: z.object({
        txHash: z.string().describe("Transaction hash to check status for"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const statuses = await checkTransactionStatus({
                agent,
                txHash: input.txHash,
            });

            return {
                status: "success",
                message: `Successfully retrieved transaction status`,
                statuses,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 