import { Agentix, EvmWalletBase } from "agentix";
import { CASINO_GAME_TYPE, Roulette } from "@betswirl/sdk-core";
import { Hex } from "viem";
import { RouletteParams } from "../types";
import { getBet, getBetAmountInWei, getBetToken, placeBet } from "../utils/betswirl";

/**
 * Play Roulette on BetSwirl
 * @returns The bet result
 */
export async function playRoulette({
    agent,
    numbers,
    betAmount,
    token,
    betCount = 1,
    stopGain,
    stopLoss,
    receiver,
    theGraphKey
}: {
    agent: Agentix<EvmWalletBase>,
    numbers: number[],
    betAmount: string,
    token?: string,
    betCount?: number,
    stopGain?: string,
    stopLoss?: string,
    receiver?: string,
    theGraphKey?: string
}) {
    // Get the bet token from the user input
    const selectedToken = await getBetToken(agent, token);

    // Validate the bet amount
    const betAmountInWei = getBetAmountInWei(betAmount, selectedToken);

    // Calculate stopGain and stopLoss as bigint
    const stopGainBigInt = stopGain ? getBetAmountInWei(stopGain, selectedToken) : 0n;
    const stopLossBigInt = stopLoss ? getBetAmountInWei(stopLoss, selectedToken) : 0n;

    // Get the receiver address or use the wallet address
    const walletClient = agent.wallet;
    const receiverAddress = receiver ? (receiver as Hex) : (walletClient.getAddress() as Hex);

    // Place the bet
    const hash = await placeBet(
        agent,
        CASINO_GAME_TYPE.ROULETTE,
        Roulette.encodeInput(numbers),
        Roulette.getMultiplier(numbers),
        {
            betAmount: betAmountInWei,
            betToken: selectedToken,
            betCount,
            receiver: receiverAddress,
            stopGain: stopGainBigInt,
            stopLoss: stopLossBigInt,
        },
    );

    // Get the bet result
    return await getBet(agent, hash, theGraphKey);
} 