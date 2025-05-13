import { CASINO_GAME_TYPE, COINTOSS_FACE, maxGameBetCountByType } from "@betswirl/sdk-core";
import { z } from "zod";

export const hexAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "The address must be a valid EVM address");

export const casinoBetParams = {
    betAmount: z.string().describe("The bet amount"),
    token: z.string().describe("Token symbol").optional().describe("The token to bet with"),
    stopGain: z.string().optional().describe("The profit amount to stop betting"),
    stopLoss: z.string().optional().describe("The loss amount to stop betting"),
    receiver: hexAddress.optional().describe("The payout receiver address"),
};

export function getMaxBetCountParam(game: CASINO_GAME_TYPE) {
    return {
        betCount: z
            .number()
            .positive()
            .max(maxGameBetCountByType[game])
            .default(1)
            .optional()
            .describe("The number of bets to place"),
    };
}

// Coin Toss parameters
export const CoinTossSchema = z.object({
    face: z.nativeEnum(COINTOSS_FACE).describe("The face of the coin"),
    ...casinoBetParams,
    ...getMaxBetCountParam(CASINO_GAME_TYPE.COINTOSS),
});

export type CoinTossParams = z.infer<typeof CoinTossSchema>;

// Dice parameters
export const MIN_SELECTABLE_DICE_NUMBER = 2;
export const MAX_SELECTABLE_DICE_NUMBER = 96;

export const DiceSchema = z.object({
    number: z
        .number()
        .gte(MIN_SELECTABLE_DICE_NUMBER)
        .lte(MAX_SELECTABLE_DICE_NUMBER)
        .describe("The number to bet on"),
    ...casinoBetParams,
    ...getMaxBetCountParam(CASINO_GAME_TYPE.DICE),
});

export type DiceParams = z.infer<typeof DiceSchema>;

// Roulette parameters
export const MIN_SELECTABLE_ROULETTE_NUMBER = 0;
export const MAX_SELECTABLE_ROULETTE_NUMBER = 36;

export const RouletteSchema = z.object({
    numbers: z
        .number()
        .gte(MIN_SELECTABLE_ROULETTE_NUMBER)
        .lte(MAX_SELECTABLE_ROULETTE_NUMBER)
        .array()
        .min(1)
        .max(MAX_SELECTABLE_ROULETTE_NUMBER)
        .describe("The numbers to bet on"),
    ...casinoBetParams,
    ...getMaxBetCountParam(CASINO_GAME_TYPE.ROULETTE),
});

export type RouletteParams = z.infer<typeof RouletteSchema>;

// Get Bet parameters
export const GetBetSchema = z.object({
    hash: z.string().describe("The bet hash"),
});

export type GetBetParams = z.infer<typeof GetBetSchema>;

// Get Bets parameters
export const GetBetsSchema = z.object({
    bettor: hexAddress.optional().describe("The bettor address"),
    game: z.nativeEnum(CASINO_GAME_TYPE).optional().describe("The game to get the bets for"),
});

export type GetBetsParams = z.infer<typeof GetBetsSchema>;
