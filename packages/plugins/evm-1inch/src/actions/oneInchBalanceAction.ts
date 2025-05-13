import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { getAggregatedBalancesAndAllowances } from "../tools/balance";

export const oneInchBalanceAction: Action<EvmWalletBase> = {
    name: "ONE_INCH_GET_BALANCES",
    similes: [
        "get token balances using 1inch",
        "fetch wallet balances with 1inch",
        "check balances via 1inch",
        "retrieve token balances from 1inch",
        "view wallet balances on 1inch"
    ],
    description: "Get the balances and allowances of tokens for a wallet on various EVM chains using 1inch",
    examples: [
        [
            {
                input: {
                    walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved token balances",
                    balances: {
                        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": {
                            balance: "5000000000000000000",
                            allowance: "0"
                        },
                        // ... other token balances
                    }
                },
                explanation: "Get token balances for a specific wallet address on Ethereum mainnet",
            },
        ],
    ],
    schema: z.object({
        walletAddress: z.string().optional().describe("The wallet address to check balances for. If not provided, the connected wallet address will be used."),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const balances = await getAggregatedBalancesAndAllowances({
                agent,
                walletAddress: input.walletAddress,
            });

            return {
                status: "success",
                message: "Successfully retrieved token balances",
                balances,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 