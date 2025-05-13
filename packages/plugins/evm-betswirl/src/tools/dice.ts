import { Agentix, EvmWalletBase } from "agentix";
import { CASINO_GAME_TYPE, Dice } from "@betswirl/sdk-core";
import { Hex } from "viem";
import { DiceParams } from "../types";
import { getBet, getBetAmountInWei, getBetToken, placeBet } from "../utils/betswirl";

/**
 * Play Dice on BetSwirl
 * @returns The bet result
 */
export async function playDice({
    agent,
    number,
    betAmount,
    token,
    betCount = 1,
    stopGain,
    stopLoss,
    receiver,
    theGraphKey
}: {
    agent: Agentix<EvmWalletBase>,
    number: number,
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
        CASINO_GAME_TYPE.DICE,
        Dice.encodeInput(number),
        Dice.getMultiplier(number),
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