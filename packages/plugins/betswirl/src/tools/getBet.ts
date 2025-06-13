import { Agentix, EvmWalletBase } from "agentix";
import { Hex } from "viem";
import { GetBetParams } from "../types";
import { getBet as getBetUtil } from "../utils/betswirl";

/**
 * Get a bet by its transaction hash
 * @returns The bet details
 */
export async function getBetByHash({
    agent,
    hash,
    theGraphKey
}: {
    agent: Agentix<EvmWalletBase>,
    hash: string,
    theGraphKey?: string
}) {
    return await getBetUtil(agent, hash as Hex, theGraphKey);
} 