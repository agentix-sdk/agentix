import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { getPricePrediction } from "../tools/allora";
import { AlloraPricePredictionTimeframe, AlloraPricePredictionToken } from "../types";

export const alloraPricePredictionAction: Action<EvmWalletBase> = {
    name: "ALLORA_PRICE_PREDICTION",
    similes: [
        "get crypto price prediction from Allora",
        "predict future price with Allora",
        "fetch Allora price forecast",
        "get price prediction for cryptocurrency",
        "check Allora price prediction"
    ],
    description: "Fetch a future price prediction for a crypto asset from Allora Network",
    examples: [
        [
            {
                input: {
                    ticker: "BTC",
                    timeframe: "5m"
                },
                output: {
                    status: "success",
                    message: "Successfully retrieved price prediction for BTC in 5 minutes",
                    prediction: {
                        network_inference: "23456.78",
                        network_inference_normalized: "0.89",
                        confidence_interval_percentiles: ["0.05", "0.95"],
                        confidence_interval_values: ["23000.00", "24000.00"],
                        timestamp: 1625097600000
                    }
                },
                explanation: "Get a price prediction for Bitcoin 5 minutes into the future",
            },
        ],
    ],
    schema: z.object({
        ticker: z.enum([AlloraPricePredictionToken.BTC, AlloraPricePredictionToken.ETH])
            .describe("The ticker of the currency for which to fetch a price prediction (BTC or ETH)"),
        timeframe: z.enum([AlloraPricePredictionTimeframe["5m"], AlloraPricePredictionTimeframe["8h"]])
            .describe("The timeframe for the prediction (5m for 5 minutes or 8h for 8 hours)"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const prediction = await getPricePrediction({
                agent,
                ticker: input.ticker as AlloraPricePredictionToken,
                timeframe: input.timeframe as AlloraPricePredictionTimeframe,
            });

            const timeframeText = input.timeframe === "5m" ? "5 minutes" : "8 hours";

            return {
                status: "success",
                message: `Successfully retrieved price prediction for ${input.ticker} in ${timeframeText}`,
                prediction,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 