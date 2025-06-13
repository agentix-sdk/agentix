import { Action, EvmWalletBase } from "agentix";
import { COINTOSS_FACE } from "@betswirl/sdk-core";
import { playCoinToss } from "../tools/cointoss";
import { CoinTossSchema } from "../types";

export const coinTossAction: Action<EvmWalletBase> = {
    name: "BETSWIRL_COINTOSS",
    similes: [
        "play coin toss on BetSwirl",
        "flip a coin on BetSwirl",
        "bet on coin flip",
        "gamble with coin toss",
        "play heads or tails on BetSwirl"
    ],
    description: "Play Coin Toss on BetSwirl casino. Bet on either heads or tails.",
    examples: [
        [
            {
                input: {
                    face: "HEADS",
                    betAmount: "0.01",
                    token: "ETH"
                },
                output: {
                    status: "success",
                    message: "Successfully placed bet on HEADS",
                    result: {
                        id: "12345",
                        input: "HEADS",
                        isWin: true,
                        betAmount: "0.01 ETH",
                        payout: "0.019 ETH",
                        rolled: "HEADS",
                        // Additional bet details...
                    }
                },
                explanation: "Place a bet of 0.01 ETH on HEADS in BetSwirl's Coin Toss game",
            },
        ],
    ],
    schema: CoinTossSchema,
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await playCoinToss({
                agent,
                face: input.face as COINTOSS_FACE,
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
                message: `Successfully placed bet on ${input.face}`,
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