import { Agentix, EvmWalletBase } from "agentix";
import { CASINO_GAME_TYPE } from "@betswirl/sdk-core";
import { Hex } from "viem";
import { GetBetsParams } from "../types";
import { getBets as getBetsUtil } from "../utils/betswirl";

/**
 * Get bets for a player or game
 * @returns Array of bets
 */
export async function getBetsList({
    agent,
    bettor,
    game,
    theGraphKey
}: {
    agent: Agentix<EvmWalletBase>,
    bettor?: string,
    game?: CASINO_GAME_TYPE,
    theGraphKey?: string
}) {
    return await getBetsUtil(
        agent, 
        bettor as Hex | undefined, 
        game, 
        theGraphKey
    );
} 