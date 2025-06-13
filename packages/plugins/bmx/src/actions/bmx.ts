import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import * as tools from "../tools/bmx";

export const openIncreasePositionAction: Action<EvmWalletBase> = {
    name: "BMX_OPEN_POSITION",
    similes: [
        "open a position on BMX",
        "create a long position on BMX",
        "create a short position on BMX",
        "increase a position on BMX",
        "leverage trade on BMX"
    ],
    description: "Open or increase a long or short position on BMX with specified parameters",
    examples: [
        [
            {
                input: {
                    indexToken: "0xETHADDRESS",
                    amountIn: "1000000000", // 1 USDC with 6 decimals
                    leverage: 2,
                    isLong: true
                },
                output: {
                    status: "success",
                    message: "Position creation transaction submitted",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                },
                explanation: "Open a 2x long position on WETH with 1 USDC as collateral"
            }
        ]
    ],
    schema: z.object({
        indexToken: z.string().describe("Token address to long or short (e.g., WETH, WBTC, MODE)"),
        amountIn: z.string().describe("Amount of collateral token to use in base units of collateral token"),
        leverage: z.number().min(2).max(50).default(2).describe("Desired leverage (2-50x)"),
        isLong: z.boolean().default(true).describe("Position direction (true for long, false for short)"),
        executionFee: z.string().optional().describe("Execution fee in native token"),
        referralCode: z.string().optional().describe("Referral code if any")
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await tools.openIncreasePosition({
                agent,
                indexToken: input.indexToken,
                amountIn: input.amountIn,
                leverage: input.leverage,
                isLong: input.isLong,
                executionFee: input.executionFee,
                referralCode: input.referralCode
            });

            // Extract the transaction hash from the result string
            const txHash = result.split("Hash: ")[1];

            return {
                status: "success",
                message: "Position creation transaction submitted",
                transactionHash: txHash
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const closeDecreasePositionAction: Action<EvmWalletBase> = {
    name: "BMX_CLOSE_POSITION",
    similes: [
        "close a position on BMX",
        "decrease a position on BMX",
        "reduce leverage on BMX",
        "exit a position on BMX",
        "take profit on BMX position"
    ],
    description: "Close or decrease a long or short position on BMX with specified parameters",
    examples: [
        [
            {
                input: {
                    indexToken: "0xETHADDRESS",
                    percentage: 100,
                    isLong: true
                },
                output: {
                    status: "success",
                    message: "Position decrease transaction submitted",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                },
                explanation: "Fully close a long position on WETH"
            }
        ]
    ],
    schema: z.object({
        indexToken: z.string().describe("Token address of the position to decrease/close"),
        percentage: z.number().min(1).max(100).describe("Percentage of position to close (1-100)"),
        isLong: z.boolean().describe("Position direction (true for long, false for short)"),
        referralCode: z.string().optional().describe("Referral code if any")
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await tools.closeDecreasePosition({
                agent,
                indexToken: input.indexToken,
                percentage: input.percentage,
                isLong: input.isLong,
                referralCode: input.referralCode
            });

            // Extract the transaction hash from the result string
            const txHash = result.split("Hash: ")[1];

            return {
                status: "success",
                message: "Position decrease transaction submitted",
                transactionHash: txHash
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getPositionAction: Action<EvmWalletBase> = {
    name: "BMX_GET_POSITION",
    similes: [
        "view BMX position",
        "check BMX position",
        "get position details on BMX",
        "get leverage position info",
        "show my BMX trades"
    ],
    description: "View current position details for a specific token on BMX",
    examples: [
        [
            {
                input: {
                    indexToken: "0xETHADDRESS",
                    isLong: true
                },
                output: {
                    status: "success",
                    details: {
                        size: "1000 USD",
                        collateral: "500 USD",
                        averagePrice: "1800 USD",
                        realisedPnl: "0 USD",
                        lastIncreasedTime: "2023-06-01T12:00:00.000Z",
                        hasProfit: true
                    }
                },
                explanation: "Get details of a long ETH position"
            }
        ]
    ],
    schema: z.object({
        indexToken: z.string().describe("Token address to check position (e.g., MODE, WETH)"),
        isLong: z.boolean().describe("Position direction (true for long, false for short)")
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await tools.getPosition({
                agent,
                indexToken: input.indexToken,
                isLong: input.isLong
            });

            // Parse the JSON string from the result
            const positionDetails = JSON.parse(result.replace("Position Details - ", ""));

            return {
                status: "success",
                details: positionDetails
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
}; 