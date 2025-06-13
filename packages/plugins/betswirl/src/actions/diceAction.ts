import { Action, EvmWalletBase } from "agentix";
import { playDice } from "../tools/dice";
import { DiceSchema } from "../types";

export const diceAction: Action<EvmWalletBase> = {
    name: "BETSWIRL_DICE",
    similes: [
        "play dice on BetSwirl",
        "roll dice for betting",
        "gamble with dice on BetSwirl",
        "bet on dice game",
        "play dice betting game"
    ],
    description: "Play Dice on BetSwirl casino. You're betting that the rolled number will be greater than your chosen number.",
    examples: [
        [
            {
                input: {
                    number: 50,
                    betAmount: "0.01",
                    token: "ETH"
                },
                output: {
                    status: "success",
                    message: "Successfully placed dice bet on number 50",
                    result: {
                        id: "12345",
                        input: "50",
                        isWin: true,
                        betAmount: "0.01 ETH",
                        payout: "0.02 ETH",
                        rolled: "75",
                        // Additional bet details...
                    }
                },
                explanation: "Place a bet of 0.01 ETH on the dice roll being greater than 50",
            },
        ],
    ],
    schema: DiceSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await playDice({
                agent,
                number: input.number,
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
                message: `Successfully placed dice bet on number ${input.number}`,
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