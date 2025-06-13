import { Action, EvmWalletBase } from "agentix";
import { playRoulette } from "../tools/roulette";
import { RouletteSchema } from "../types";

export const rouletteAction: Action<EvmWalletBase> = {
    name: "BETSWIRL_ROULETTE",
    similes: [
        "play roulette on BetSwirl",
        "bet on roulette game",
        "gamble with roulette",
        "place roulette bet",
        "spin the roulette wheel"
    ],
    description: "Play Roulette on BetSwirl casino. You're betting that the ball will land on one of your chosen numbers.",
    examples: [
        [
            {
                input: {
                    numbers: [1, 3, 5, 7, 9, 11],
                    betAmount: "0.01",
                    token: "ETH"
                },
                output: {
                    status: "success",
                    message: "Successfully placed bet on numbers: 1, 3, 5, 7, 9, 11",
                    result: {
                        id: "12345",
                        input: "1,3,5,7,9,11",
                        isWin: true,
                        betAmount: "0.01 ETH",
                        payout: "0.06 ETH",
                        rolled: "5",
                        // Additional bet details...
                    }
                },
                explanation: "Place a bet of 0.01 ETH on the roulette ball landing on one of the odd numbers from 1 to 11",
            },
        ],
    ],
    schema: RouletteSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await playRoulette({
                agent,
                numbers: input.numbers,
                betAmount: input.betAmount,
                token: input.token,
                betCount: input.betCount,
                stopGain: input.stopGain,
                stopLoss: input.stopLoss,
                receiver: input.receiver,
                theGraphKey: agent.config.theGraphKey
            });

            return {
                status: "success",
                message: `Successfully placed bet on numbers: ${input.numbers.join(", ")}`,
                result
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 