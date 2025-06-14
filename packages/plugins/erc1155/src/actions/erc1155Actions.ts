import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import {
    getBalanceOfBySymbol,
    getBalanceOfBatchBySymbol,
    safeTransferFromERC1155,
    safeBatchTransferFromERC1155,
    setApprovalForAllERC1155,
    isApprovedForAllERC1155,
    getTokenInfoBySymbol,
} from "../tools/erc1155";

export const erc1155GetBalanceAction: Action<EvmWalletBase> = {
    name: "ERC1155_GET_BALANCE",
    similes: [
        "get ERC1155 balance",
        "check ERC1155 balance",
        "get multi-token balance",
        "check token balance by ID",
        "ERC1155 balance of address",
    ],
    description: "Get the balance of a specific ERC1155 token ID for a wallet address. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    owner: "0x1234567890123456789012345678901234567890",
                    tokenId: "1",
                    tokenSymbol: "OPENSEA"
                },
                output: {
                    success: true,
                    balance: "5"
                },
                explanation: "Get balance of OpenSea token ID 1 for the specified wallet address"
            }
        ]
    ],
    schema: z.object({
        owner: z.string().describe("The wallet address to check balance for"),
        tokenId: z.string().describe("The token ID to check balance for"),
        tokenSymbol: z.string().describe("The ERC1155 token symbol (e.g., OPENSEA, ENS-METADATA)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getBalanceOfBySymbol(agent, input as any);
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc1155GetBatchBalanceAction: Action<EvmWalletBase> = {
    name: "ERC1155_GET_BATCH_BALANCE",
    similes: [
        "get batch ERC1155 balance",
        "check multiple token balances",
        "get multi-token batch balance",
        "bulk check ERC1155 balance",
        "batch balance check",
    ],
    description: "Get balances of multiple ERC1155 token IDs for multiple wallet addresses. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    owners: ["0x1234567890123456789012345678901234567890", "0x2345678901234567890123456789012345678901"],
                    tokenIds: ["1", "2"],
                    tokenSymbol: "OPENSEA"
                },
                output: {
                    success: true,
                    balances: ["5", "3"]
                },
                explanation: "Get balances of OpenSea token IDs 1 and 2 for the specified wallet addresses"
            }
        ]
    ],
    schema: z.object({
        owners: z.array(z.string()).describe("Array of wallet addresses to check balances for"),
        tokenIds: z.array(z.string()).describe("Array of token IDs to check balances for"),
        tokenSymbol: z.string().describe("The ERC1155 token symbol (e.g., OPENSEA, ENS-METADATA)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getBalanceOfBatchBySymbol(agent, input as any);
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc1155SafeTransferAction: Action<EvmWalletBase> = {
    name: "ERC1155_SAFE_TRANSFER",
    similes: [
        "transfer ERC1155",
        "send ERC1155 token",
        "transfer multi-token",
        "send ERC1155",
        "transfer specific token ID amount",
    ],
    description: "Safely transfer a specific amount of ERC1155 tokens to another address. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    from: "0x1111111111111111111111111111111111111111",
                    to: "0x2222222222222222222222222222222222222222",
                    tokenId: "1",
                    amount: "3",
                    tokenSymbol: "OPENSEA"
                },
                output: {
                    success: true,
                    hash: "0xabcdef..."
                },
                explanation: "Transfer 3 units of OpenSea token ID 1 to the specified address"
            }
        ]
    ],
    schema: z.object({
        from: z.string().describe("The sender address"),
        to: z.string().describe("The recipient address"),
        tokenId: z.string().describe("The token ID to transfer"),
        amount: z.string().describe("The amount of tokens to transfer"),
        tokenSymbol: z.string().describe("The ERC1155 token symbol (e.g., OPENSEA, ENS-METADATA)"),
        data: z.string().optional().describe("Additional data to send with transfer (optional)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await safeTransferFromERC1155(agent, input as any);
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc1155SafeBatchTransferAction: Action<EvmWalletBase> = {
    name: "ERC1155_SAFE_BATCH_TRANSFER",
    similes: [
        "batch transfer ERC1155",
        "transfer multiple ERC1155 tokens",
        "bulk transfer multi-tokens",
        "send multiple token IDs",
        "batch transfer token amounts",
    ],
    description: "Safely transfer multiple ERC1155 tokens with different IDs and amounts to another address. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    from: "0x1111111111111111111111111111111111111111",
                    to: "0x2222222222222222222222222222222222222222",
                    tokenIds: ["1", "2"],
                    amounts: ["3", "5"],
                    tokenSymbol: "OPENSEA"
                },
                output: {
                    success: true,
                    hash: "0xabcdef..."
                },
                explanation: "Transfer 3 units of token ID 1 and 5 units of token ID 2 to the specified address"
            }
        ]
    ],
    schema: z.object({
        from: z.string().describe("The sender address"),
        to: z.string().describe("The recipient address"),
        tokenIds: z.array(z.string()).describe("Array of token IDs to transfer"),
        amounts: z.array(z.string()).describe("Array of amounts to transfer (must match tokenIds length)"),
        tokenSymbol: z.string().describe("The ERC1155 token symbol (e.g., OPENSEA, ENS-METADATA)"),
        data: z.string().optional().describe("Additional data to send with transfer (optional)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await safeBatchTransferFromERC1155(agent, input as any);
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc1155SetApprovalForAllAction: Action<EvmWalletBase> = {
    name: "ERC1155_SET_APPROVAL_FOR_ALL",
    similes: [
        "approve all ERC1155",
        "set approval for all tokens",
        "grant operator permissions",
        "approve ERC1155 operator",
        "enable token management",
    ],
    description: "Set or unset approval for an operator to manage all ERC1155 tokens of a contract. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    operator: "0x1234567890123456789012345678901234567890",
                    approved: true,
                    tokenSymbol: "OPENSEA"
                },
                output: {
                    success: true,
                    hash: "0xabcdef..."
                },
                explanation: "Grant the operator permission to manage all OpenSea tokens"
            }
        ]
    ],
    schema: z.object({
        operator: z.string().describe("The address of the operator to grant/revoke approval to"),
        approved: z.boolean().describe("Whether to grant (true) or revoke (false) approval"),
        tokenSymbol: z.string().describe("The ERC1155 token symbol (e.g., OPENSEA, ENS-METADATA)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await setApprovalForAllERC1155(agent, input as any);
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc1155IsApprovedForAllAction: Action<EvmWalletBase> = {
    name: "ERC1155_IS_APPROVED_FOR_ALL",
    similes: [
        "check ERC1155 approval",
        "check if approved for all",
        "verify operator permissions",
        "check token management approval",
        "is operator approved",
    ],
    description: "Check if an operator is approved to manage all ERC1155 tokens for an owner. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    owner: "0x1111111111111111111111111111111111111111",
                    operator: "0x2222222222222222222222222222222222222222",
                    tokenSymbol: "OPENSEA"
                },
                output: {
                    success: true,
                    approved: true
                },
                explanation: "Check if the operator is approved to manage all OpenSea tokens for the owner"
            }
        ]
    ],
    schema: z.object({
        owner: z.string().describe("The address of the token owner"),
        operator: z.string().describe("The address of the operator to check approval for"),
        tokenSymbol: z.string().describe("The ERC1155 token symbol (e.g., OPENSEA, ENS-METADATA)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await isApprovedForAllERC1155(agent, input as any);
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc1155GetTokenInfoAction: Action<EvmWalletBase> = {
    name: "ERC1155_GET_TOKEN_INFO",
    similes: [
        "get ERC1155 token info",
        "get token information",
        "check token details",
        "get contract info",
        "token info by symbol",
    ],
    description: "Get ERC1155 token information by symbol including contract address and name. The AI should first resolve the token symbol using the token plugin to get comprehensive token information.",
    examples: [
        [
            {
                input: {
                    tokenSymbol: "OPENSEA"
                },
                output: {
                    success: true,
                    info: {
                        symbol: "OPENSEA",
                        name: "OpenSea Shared Storefront",
                        contractAddress: "0x495f947276749Ce646f68AC8c248420045cb7b5e"
                    }
                },
                explanation: "Get information about the OpenSea token contract"
            }
        ]
    ],
    schema: z.object({
        tokenSymbol: z.string().describe("The ERC1155 token symbol to get info for"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTokenInfoBySymbol(input.tokenSymbol);
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
}; 