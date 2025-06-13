import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import { buildSDK, QuoteRequest } from "@balmy/sdk";

/**
 * Initialize the Balmy SDK
 */
function initBalmySDK() {
    return buildSDK();
}

/**
 * Get quotes for a token swap using Balmy
 * @returns The best quote for the swap
 */
export async function getQuote({
    agent,
    tokenIn,
    tokenOut,
    order,
    slippagePercentage,
    takerAddress
}: {
    agent: Agentix<EvmWalletBase>,
    tokenIn: string,
    tokenOut: string,
    order: {
        type: "sell" | "buy",
        amount: string
    },
    slippagePercentage: number,
    takerAddress?: string
}) {
    const walletClient = agent.wallet;
    const chainId = walletClient.getChain().id;
    const sdk = initBalmySDK();

    const request: QuoteRequest = {
        chainId,
        sellToken: tokenIn,
        buyToken: tokenOut,
        order: order.type === "sell"
            ? {
                type: "sell",
                sellAmount: order.amount,
            }
            : {
                type: "buy",
                buyAmount: order.amount,
            },
        slippagePercentage,
        takerAddress: takerAddress || "0x0000000000000000000000000000000000000000",
    };

    const quotes = await sdk.quoteService.getAllQuotesWithTxs({
        request: request,
        config: {
            timeout: "10s",
        },
    });

    // Convert BigInt values to strings for logging and return
    const quotesForLog = quotes.map((quote) => ({
        ...quote,
        sellAmount: {
            ...quote.sellAmount,
            amount: quote.sellAmount.amount.toString(),
        },
        buyAmount: {
            ...quote.buyAmount,
            amount: quote.buyAmount.amount.toString(),
        },
        maxSellAmount: {
            ...quote.maxSellAmount,
            amount: quote.maxSellAmount.amount.toString(),
        },
        minBuyAmount: {
            ...quote.minBuyAmount,
            amount: quote.minBuyAmount.amount.toString(),
        },
        gas: {
            ...quote?.gas,
            estimatedGas: quote?.gas?.estimatedGas?.toString() ?? "0",
            estimatedCost: quote?.gas?.estimatedCost?.toString() ?? "0",
        },
        tx: {
            ...quote.tx,
            value: (quote.tx?.value ?? 0n).toString(),
        },
        customData: {
            ...quote.customData,
            tx: {
                ...quote.customData.tx,
                value: (quote.customData.tx?.value ?? 0n).toString(),
            },
        },
    }));

    return quotesForLog[0];
}

/**
 * Execute a swap using the best quote from Balmy
 * @returns The transaction hash
 */
export async function executeSwap({
    agent,
    tokenIn,
    tokenOut,
    order,
    slippagePercentage,
    takerAddress
}: {
    agent: Agentix<EvmWalletBase>,
    tokenIn: string,
    tokenOut: string,
    order: {
        type: "sell" | "buy",
        amount: string
    },
    slippagePercentage: number,
    takerAddress?: string
}) {
    const walletClient = agent.wallet;
    
    const bestQuote = await getQuote({
        agent,
        tokenIn,
        tokenOut,
        order,
        slippagePercentage,
        takerAddress
    });

    const data = bestQuote.tx.data as `0x${string}`;

    const swapTx = await walletClient.sendTransaction({
        to: bestQuote.tx.to,
        value: BigInt(bestQuote.tx.value),
        data: data,
    });

    return swapTx.hash;
} 