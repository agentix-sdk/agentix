import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { 
    buyCurvesToken, 
    getBuyPrice, 
    sellCurvesToken, 
    getSellPrice,
    getCurvesERC20,
    getCurvesBalance,
    withdrawCurves,
    depositCurves,
    mintCurvesERC20
} from "../tools/curves";

export const buyCurvesTokenAction: Action<EvmWalletBase> = {
    name: "BUY_CURVES_TOKEN",
    similes: [
        "buy curves tokens",
        "purchase curves tokens",
        "get curves tokens for subject",
        "buy tokens on curves",
        "invest in curves subject"
    ],
    description: "Buy curves tokens for a specific subject",
    examples: [
        [
            {
                input: {
                    subject: "0x1234567890abcdef1234567890abcdef12345678",
                    amount: 1,
                },
                output: {
                    status: "success",
                    message: "Successfully bought 1 curves token for subject",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Buy 1 curves token for the specified subject address",
            },
        ],
    ],
    schema: z.object({
        subject: z.string().describe("The subject address to buy curves tokens for"),
        amount: z.number().optional().default(1).describe("Number of tokens to buy (default: 1)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const txHash = await buyCurvesToken({
                agent,
                subject: input.subject,
                amount: input.amount,
            });

            return {
                status: "success",
                message: `Successfully bought ${input.amount} curves token(s) for subject ${input.subject}`,
                transactionHash: txHash,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const getBuyPriceAction: Action<EvmWalletBase> = {
    name: "GET_CURVES_BUY_PRICE",
    similes: [
        "get curves buy price",
        "get curves token price",
        "check curves buy price",
        "what's the price to buy curves",
        "curves token buy cost"
    ],
    description: "Get the buy price for curves tokens of a specific subject",
    examples: [
        [
            {
                input: {
                    subject: "0x1234567890abcdef1234567890abcdef12345678",
                    amount: 1,
                    unit: "eth",
                },
                output: {
                    status: "success",
                    message: "Buy price for 1 curves token: 0.1 ETH",
                    price: "0.1 ETH",
                },
                explanation: "Get the buy price for 1 curves token in ETH",
            },
        ],
    ],
    schema: z.object({
        subject: z.string().describe("The subject address to get buy price for"),
        amount: z.number().optional().default(1).describe("Number of tokens to get price for (default: 1)"),
        unit: z.enum(["wei", "gwei", "eth"]).optional().default("eth").describe("Price unit (default: eth)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const price = await getBuyPrice({
                agent,
                subject: input.subject,
                amount: input.amount,
                unit: input.unit,
            });

            return {
                status: "success",
                message: `Buy price for ${input.amount} curves token(s): ${price}`,
                price: price,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const sellCurvesTokenAction: Action<EvmWalletBase> = {
    name: "SELL_CURVES_TOKEN",
    similes: [
        "sell curves tokens",
        "sell curves tokens for subject",
        "dispose curves tokens",
        "liquidate curves position",
        "exit curves position"
    ],
    description: "Sell curves tokens for a specific subject",
    examples: [
        [
            {
                input: {
                    subject: "0x1234567890abcdef1234567890abcdef12345678",
                    amount: 1,
                },
                output: {
                    status: "success",
                    message: "Successfully sold 1 curves token for subject",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Sell 1 curves token for the specified subject address",
            },
        ],
    ],
    schema: z.object({
        subject: z.string().describe("The subject address to sell curves tokens for"),
        amount: z.number().optional().default(1).describe("Number of tokens to sell (default: 1)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const txHash = await sellCurvesToken({
                agent,
                subject: input.subject,
                amount: input.amount,
            });

            return {
                status: "success",
                message: `Successfully sold ${input.amount} curves token(s) for subject ${input.subject}`,
                transactionHash: txHash,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const getSellPriceAction: Action<EvmWalletBase> = {
    name: "GET_CURVES_SELL_PRICE",
    similes: [
        "get curves sell price",
        "get curves token sell price",
        "check curves sell value",
        "what can I get for selling curves",
        "curves token sell value"
    ],
    description: "Get the sell price for curves tokens of a specific subject",
    examples: [
        [
            {
                input: {
                    subject: "0x1234567890abcdef1234567890abcdef12345678",
                    amount: 1,
                    unit: "eth",
                },
                output: {
                    status: "success",
                    message: "Sell price for 1 curves token: 0.08 ETH",
                    price: "0.08 ETH",
                },
                explanation: "Get the sell price for 1 curves token in ETH",
            },
        ],
    ],
    schema: z.object({
        subject: z.string().describe("The subject address to get sell price for"),
        amount: z.number().optional().default(1).describe("Number of tokens to get price for (default: 1)"),
        unit: z.enum(["wei", "gwei", "eth"]).optional().default("eth").describe("Price unit (default: eth)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const price = await getSellPrice({
                agent,
                subject: input.subject,
                amount: input.amount,
                unit: input.unit,
            });

            return {
                status: "success",
                message: `Sell price for ${input.amount} curves token(s): ${price}`,
                price: price,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const getCurvesERC20Action: Action<EvmWalletBase> = {
    name: "GET_CURVES_ERC20",
    similes: [
        "get curves erc20 info",
        "get curves token details",
        "check curves erc20 token",
        "curves token information",
        "get curves erc20 metadata"
    ],
    description: "Get Curves minted ERC20 token information for a subject",
    examples: [
        [
            {
                input: {
                    subject: "0x1234567890abcdef1234567890abcdef12345678",
                },
                output: {
                    status: "success",
                    message: "ERC20 Token Details retrieved",
                    tokenInfo: "ERC20 Token Details:\nName: MyToken\nSymbol: MTK\nContract Address: 0xabc...",
                },
                explanation: "Get the ERC20 token details for the specified subject",
            },
        ],
    ],
    schema: z.object({
        subject: z.string().optional().describe("The subject address (optional, defaults to your address)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const tokenInfo = await getCurvesERC20({
                agent,
                subject: input.subject,
            });

            return {
                status: "success",
                message: "ERC20 Token Details retrieved",
                tokenInfo: tokenInfo,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const getCurvesBalanceAction: Action<EvmWalletBase> = {
    name: "GET_CURVES_BALANCE",
    similes: [
        "get curves balance",
        "check curves token balance",
        "my curves tokens",
        "curves balance for subject",
        "how many curves tokens"
    ],
    description: "Get curves token balance for a specific subject",
    examples: [
        [
            {
                input: {
                    subject: "0x1234567890abcdef1234567890abcdef12345678",
                },
                output: {
                    status: "success",
                    message: "Curves Token Balance for 0x1234...: 5 tokens",
                    balance: "5 tokens",
                },
                explanation: "Get your curves token balance for the specified subject",
            },
        ],
    ],
    schema: z.object({
        subject: z.string().describe("The subject address to get balance for"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const balance = await getCurvesBalance({
                agent,
                subject: input.subject,
            });

            return {
                status: "success",
                message: balance,
                balance: balance,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const withdrawCurvesAction: Action<EvmWalletBase> = {
    name: "WITHDRAW_CURVES",
    similes: [
        "withdraw curves tokens",
        "convert curves to erc20",
        "withdraw curves to erc20",
        "curves withdrawal",
        "convert curves tokens"
    ],
    description: "Withdraw curves tokens to ERC20 tokens",
    examples: [
        [
            {
                input: {
                    subject: "0x1234567890abcdef1234567890abcdef12345678",
                    amount: 1,
                },
                output: {
                    status: "success",
                    message: "Successfully withdrew 1 curves token to ERC20 for subject",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Withdraw 1 curves token to ERC20 format for the specified subject",
            },
        ],
    ],
    schema: z.object({
        subject: z.string().describe("The subject address to withdraw curves tokens for"),
        amount: z.number().optional().default(1).describe("Number of tokens to withdraw (default: 1)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const txHash = await withdrawCurves({
                agent,
                subject: input.subject,
                amount: input.amount,
            });

            return {
                status: "success",
                message: `Successfully withdrew ${input.amount} curves token(s) to ERC20 for subject ${input.subject}`,
                transactionHash: txHash,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const depositCurvesAction: Action<EvmWalletBase> = {
    name: "DEPOSIT_CURVES",
    similes: [
        "deposit to curves",
        "convert erc20 to curves",
        "deposit erc20 to curves",
        "curves deposit",
        "convert erc20 tokens"
    ],
    description: "Deposit ERC20 tokens to curves tokens",
    examples: [
        [
            {
                input: {
                    subject: "0x1234567890abcdef1234567890abcdef12345678",
                    amount: "1.5",
                },
                output: {
                    status: "success",
                    message: "Successfully deposited 1.5 ERC20 tokens to curves for subject",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Deposit 1.5 ERC20 tokens to curves format for the specified subject",
            },
        ],
    ],
    schema: z.object({
        subject: z.string().describe("The subject address to deposit ERC20 tokens for"),
        amount: z.string().optional().default("1").describe("Amount of ERC20 tokens to deposit (e.g., '1.5')"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const txHash = await depositCurves({
                agent,
                subject: input.subject,
                amount: input.amount,
            });

            return {
                status: "success",
                message: `Successfully deposited ${input.amount} ERC20 tokens to curves for subject ${input.subject}`,
                transactionHash: txHash,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const mintCurvesERC20Action: Action<EvmWalletBase> = {
    name: "MINT_CURVES_ERC20",
    similes: [
        "mint curves erc20",
        "create curves erc20 token",
        "set curves token metadata",
        "mint my curves token",
        "create curves erc20"
    ],
    description: "Set name and symbol for your ERC20 token and mint it",
    examples: [
        [
            {
                input: {
                    name: "My Curves Token",
                    symbol: "MCT",
                },
                output: {
                    status: "success",
                    message: "Successfully minted ERC20 token with name 'My Curves Token' and symbol 'MCT'",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                explanation: "Create and mint an ERC20 token with the specified name and symbol",
            },
        ],
    ],
    schema: z.object({
        name: z.string().describe("The name for your ERC20 token"),
        symbol: z.string().describe("The symbol for your ERC20 token"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const txHash = await mintCurvesERC20({
                agent,
                name: input.name,
                symbol: input.symbol,
            });

            return {
                status: "success",
                message: `Successfully minted ERC20 token with name '${input.name}' and symbol '${input.symbol}'`,
                transactionHash: txHash,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 