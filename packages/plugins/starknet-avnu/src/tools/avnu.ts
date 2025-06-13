import { StarknetWalletBase } from "agentix";
import { Agentix } from "agentix";
import { fetchQuotes, executeSwap, type Quote } from "@avnu/avnu-sdk";

/**
 * Get the best quote for a token swap on Avnu
 * @returns An array of quotes
 */
async function getQuote(params: {
    sellTokenAddress: string;
    buyTokenAddress: string;
    sellAmount: string;
    baseUrl?: string;
}): Promise<Quote[]> {
    try {
        const sellAmountBigInt = BigInt(params.sellAmount);
        const options = {
            baseUrl: params.baseUrl || "https://starknet.api.avnu.fi",
        };

        const quotes = await fetchQuotes(
            {
                sellTokenAddress: params.sellTokenAddress,
                buyTokenAddress: params.buyTokenAddress,
                sellAmount: sellAmountBigInt,
            },
            options,
        );

        if (!quotes || quotes.length === 0) {
            throw new Error("No quotes found");
        }

        return quotes;
    } catch (error) {
        if (error instanceof Error && error.message.includes("BigInt")) {
            throw new Error(`Invalid sellAmount format: ${params.sellAmount}`);
        }
        throw error instanceof Error 
            ? new Error(`Error fetching quotes: ${error.message}`)
            : new Error(`Error fetching quotes: ${error}`);
    }
}

/**
 * Execute a token swap on Avnu DEX
 * @returns The swap transaction response
 */
export async function executeTokenSwap({
    agent,
    sellTokenAddress,
    buyTokenAddress,
    sellAmount,
    slippage = 0.3
}: {
    agent: Agentix<StarknetWalletBase>,
    sellTokenAddress: string,
    buyTokenAddress: string,
    sellAmount: string,
    slippage?: number,
}) {
    try {
        const walletClient = agent.wallet;
        const baseUrl = agent.config.avnuBaseUrl || "https://starknet.api.avnu.fi";
        
        const quotes = await getQuote({
            sellTokenAddress,
            buyTokenAddress,
            sellAmount,
            baseUrl
        });
        
        const bestQuote = quotes[0];

        const swapResponse = await executeSwap(
            walletClient.getAccount(),
            bestQuote,
            {
                executeApprove: true,
                slippage,
            },
            { baseUrl }
        );
        
        return swapResponse;
    } catch (error) {
        throw error instanceof Error
            ? new Error(`Error executing swap: ${error.message}`)
            : new Error(`Error executing swap: ${error}`);
    }
} 