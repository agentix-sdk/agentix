import { Action, EvmWalletBase } from "agentix";
import { CASINO_GAME_TYPE } from "@betswirl/sdk-core";
import { getBetByHash, getBetsList } from "../tools";
import { GetBetSchema, GetBetsSchema } from "../types";

export const getBetAction: Action<EvmWalletBase> = {
    name: "BETSWIRL_GET_BET",
    similes: [
        "lookup bet details on BetSwirl",
        "find bet by hash on BetSwirl",
        "retrieve bet information",
        "check bet status on BetSwirl",
        "get bet details by transaction hash"
    ],
    description: "Get details of a specific bet from BetSwirl using its transaction hash",
    examples: [
        [
            {
                input: {
                    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved bet details",
                    bet: {
                        id: "12345",
                        input: "HEADS",
                        isWin: true,
                        betAmount: "0.01 ETH",
                        payout: "0.019 ETH",
                        rolled: "HEADS",
                        // Additional bet details...
                    }
                },
                explanation: "Get the details of a specific bet using its transaction hash",
            },
        ],
    ],
    schema: GetBetSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const bet = await getBetByHash({
                agent,
                hash: input.hash,
                theGraphKey: agent.config.theGraphKey
            });

            return {
                status: "success",
                message: "Successfully retrieved bet details",
                bet
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
};

export const getBetsAction: Action<EvmWalletBase> = {
    name: "BETSWIRL_GET_BETS",
    similes: [
        "list bets on BetSwirl",
        "view betting history on BetSwirl",
        "get all bets from BetSwirl",
        "check player bets on BetSwirl",
        "retrieve betting records"
    ],
    description: "Get a list of bets from BetSwirl, optionally filtered by player address or game type",
    examples: [
        [
            {
                input: {
                    bettor: "0x1234567890abcdef1234567890abcdef12345678",
                    game: "DICE"
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved bets list",
                    bets: [
                        {
                            id: "12345",
                            input: "50",
                            isWin: true,
                            betAmount: "0.01 ETH",
                            // Additional bet details...
                        },
                        // More bets...
                    ]
                },
                explanation: "Get a list of DICE bets made by a specific player",
            },
        ],
    ],
    schema: GetBetsSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const bets = await getBetsList({
                agent,
                bettor: input.bettor,
                game: input.game as CASINO_GAME_TYPE | undefined,
                theGraphKey: agent.config.theGraphKey
            });

            return {
                status: "success",
                message: "Successfully retrieved bets list",
                bets
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 