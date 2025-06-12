import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import {
    getTokenBalance,
    transfer,
    getTokenTotalSupply,
    getTokenAllowance,
    approve,
    revokeApproval,
    transferFrom,
    convertToBaseUnit,
    convertFromBaseUnit,
    getTokenInfo,
    getTokenDecimals,
    getTokenSymbol,
    getTokenName
} from "../tools/erc20-operations";

export const getTokenBalanceAction: Action<EvmWalletBase> = {
    name: "GET_ERC20_TOKEN_BALANCE",
    similes: [
        "get token balance",
        "get erc20 balance",
        "check token balance",
        "token balance",
        "balance of token",
        "how much token do I have"
    ],
    description: "Get the balance of an ERC20 token for a wallet address",
    examples: [
        [
            {
                input: {
                    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    wallet: "0x1234567890123456789012345678901234567890"
                },
                output: {
                    success: true,
                    value: "1000000000"
                },
                explanation: "Get USDC balance for the specified wallet address"
            }
        ]
    ],
    schema: z.object({
        tokenAddress: z.string().describe("The ERC20 token contract address"),
        wallet: z.string().optional().describe("Wallet address to check balance for (defaults to current wallet)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTokenBalance({
                agent,
                tokenAddress: input.tokenAddress as `0x${string}`,
                wallet: input.wallet as `0x${string}` | undefined
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const transferTokenAction: Action<EvmWalletBase> = {
    name: "TRANSFER_ERC20_TOKEN",
    similes: [
        "transfer token",
        "send token",
        "transfer erc20",
        "send erc20",
        "move tokens",
        "transfer tokens"
    ],
    description: "Transfer ERC20 tokens to another address",
    examples: [
        [
            {
                input: {
                    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    to: "0x1234567890123456789012345678901234567890",
                    amount: "1000000"
                },
                output: {
                    success: true,
                    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
                },
                explanation: "Transfer 1 USDC to the specified address"
            }
        ]
    ],
    schema: z.object({
        tokenAddress: z.string().describe("The ERC20 token contract address"),
        to: z.string().describe("Recipient address"),
        amount: z.string().describe("Amount to transfer in base units (wei for 18 decimal tokens)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await transfer({
                agent,
                tokenAddress: input.tokenAddress as `0x${string}`,
                to: input.to as `0x${string}`,
                amount: input.amount
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const getTokenTotalSupplyAction: Action<EvmWalletBase> = {
    name: "GET_ERC20_TOTAL_SUPPLY",
    similes: [
        "get total supply",
        "total supply",
        "token total supply",
        "how many tokens exist",
        "total token amount"
    ],
    description: "Get the total supply of an ERC20 token",
    examples: [
        [
            {
                input: {
                    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                },
                output: {
                    success: true,
                    value: "24000000000000000"
                },
                explanation: "Get total supply of USDC"
            }
        ]
    ],
    schema: z.object({
        tokenAddress: z.string().describe("The ERC20 token contract address"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTokenTotalSupply({
                agent,
                tokenAddress: input.tokenAddress as `0x${string}`
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const getTokenAllowanceAction: Action<EvmWalletBase> = {
    name: "GET_ERC20_ALLOWANCE",
    similes: [
        "get allowance",
        "check allowance",
        "token allowance",
        "spending allowance",
        "approved amount"
    ],
    description: "Get the allowance amount that a spender can spend on behalf of an owner",
    examples: [
        [
            {
                input: {
                    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    owner: "0x1234567890123456789012345678901234567890",
                    spender: "0x0987654321098765432109876543210987654321"
                },
                output: {
                    success: true,
                    value: "1000000000"
                },
                explanation: "Get USDC allowance for spender from owner"
            }
        ]
    ],
    schema: z.object({
        tokenAddress: z.string().describe("The ERC20 token contract address"),
        owner: z.string().describe("Owner address"),
        spender: z.string().describe("Spender address"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTokenAllowance({
                agent,
                tokenAddress: input.tokenAddress as `0x${string}`,
                owner: input.owner as `0x${string}`,
                spender: input.spender as `0x${string}`
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const approveTokenAction: Action<EvmWalletBase> = {
    name: "APPROVE_ERC20_TOKEN",
    similes: [
        "approve token",
        "approve spending",
        "allow spending",
        "grant permission",
        "authorize spender"
    ],
    description: "Approve a spender to spend tokens on your behalf",
    examples: [
        [
            {
                input: {
                    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    spender: "0x0987654321098765432109876543210987654321",
                    amount: "1000000000"
                },
                output: {
                    success: true,
                    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
                },
                explanation: "Approve spender to spend 1000 USDC"
            }
        ]
    ],
    schema: z.object({
        tokenAddress: z.string().describe("The ERC20 token contract address"),
        spender: z.string().describe("Spender address to approve"),
        amount: z.string().describe("Amount to approve in base units"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await approve({
                agent,
                tokenAddress: input.tokenAddress as `0x${string}`,
                spender: input.spender as `0x${string}`,
                amount: input.amount
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const revokeApprovalAction: Action<EvmWalletBase> = {
    name: "REVOKE_ERC20_APPROVAL",
    similes: [
        "revoke approval",
        "remove approval",
        "cancel approval",
        "revoke permission",
        "remove authorization"
    ],
    description: "Revoke approval for a spender to spend tokens",
    examples: [
        [
            {
                input: {
                    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    spender: "0x0987654321098765432109876543210987654321"
                },
                output: {
                    success: true,
                    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
                },
                explanation: "Revoke USDC spending approval for spender"
            }
        ]
    ],
    schema: z.object({
        tokenAddress: z.string().describe("The ERC20 token contract address"),
        spender: z.string().describe("Spender address to revoke approval from"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await revokeApproval({
                agent,
                tokenAddress: input.tokenAddress as `0x${string}`,
                spender: input.spender as `0x${string}`
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const transferFromAction: Action<EvmWalletBase> = {
    name: "TRANSFER_FROM_ERC20",
    similes: [
        "transfer from",
        "transfer on behalf",
        "spend allowance",
        "transfer approved tokens",
        "move tokens from"
    ],
    description: "Transfer tokens from one address to another using allowance",
    examples: [
        [
            {
                input: {
                    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    from: "0x1234567890123456789012345678901234567890",
                    to: "0x0987654321098765432109876543210987654321",
                    amount: "1000000"
                },
                output: {
                    success: true,
                    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
                },
                explanation: "Transfer 1 USDC from one address to another using allowance"
            }
        ]
    ],
    schema: z.object({
        tokenAddress: z.string().describe("The ERC20 token contract address"),
        from: z.string().describe("Source address"),
        to: z.string().describe("Destination address"),
        amount: z.string().describe("Amount to transfer in base units"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await transferFrom({
                agent,
                tokenAddress: input.tokenAddress as `0x${string}`,
                from: input.from as `0x${string}`,
                to: input.to as `0x${string}`,
                amount: input.amount
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const convertToBaseUnitAction: Action<EvmWalletBase> = {
    name: "CONVERT_TO_BASE_UNIT",
    similes: [
        "convert to wei",
        "convert to base unit",
        "to base units",
        "parse token amount",
        "convert decimal to base"
    ],
    description: "Convert a token amount to its base unit (like wei for ETH)",
    examples: [
        [
            {
                input: {
                    amount: 1,
                    decimals: 18
                },
                output: {
                    success: true,
                    value: "1000000000000000000"
                },
                explanation: "Convert 1 token with 18 decimals to base unit"
            }
        ]
    ],
    schema: z.object({
        amount: z.number().describe("Token amount in decimal units"),
        decimals: z.number().describe("Number of decimals the token has"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await convertToBaseUnit({
                amount: input.amount,
                decimals: input.decimals
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const convertFromBaseUnitAction: Action<EvmWalletBase> = {
    name: "CONVERT_FROM_BASE_UNIT",
    similes: [
        "convert from wei",
        "convert from base unit",
        "from base units",
        "format token amount",
        "convert base to decimal"
    ],
    description: "Convert a token amount from its base unit to decimal units",
    examples: [
        [
            {
                input: {
                    amount: "1000000000000000000",
                    decimals: 18
                },
                output: {
                    success: true,
                    value: "1"
                },
                explanation: "Convert base unit amount to 1 token with 18 decimals"
            }
        ]
    ],
    schema: z.object({
        amount: z.string().describe("Token amount in base units"),
        decimals: z.number().describe("Number of decimals the token has"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await convertFromBaseUnit({
                amount: input.amount,
                decimals: input.decimals
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export const getTokenInfoAction: Action<EvmWalletBase> = {
    name: "GET_ERC20_TOKEN_INFO",
    similes: [
        "get token info",
        "token information",
        "token details",
        "token metadata",
        "token properties"
    ],
    description: "Get comprehensive information about an ERC20 token",
    examples: [
        [
            {
                input: {
                    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                },
                output: {
                    success: true,
                    tokenInfo: {
                        name: "USD Coin",
                        symbol: "USDC",
                        decimals: 6,
                        totalSupply: "24000000000000000"
                    }
                },
                explanation: "Get complete information about USDC token"
            }
        ]
    ],
    schema: z.object({
        tokenAddress: z.string().describe("The ERC20 token contract address"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTokenInfo({
                agent,
                tokenAddress: input.tokenAddress as `0x${string}`
            });
            
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}; 