import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import { erc20Abi, maxUint256, concat, numberToHex, size, Hex } from "viem";

/**
 * Make a request to the 0x API with the specified path and query parameters
 * @param apiKey The 0x API key
 * @param path The API path to call
 * @param queryParams Query parameters for the API call
 * @returns The API response
 */
async function makeRequest(apiKey: string, path: string, queryParams: Record<string, string | undefined>) {
    const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v !== undefined),
    ) as Record<string, string>;

    const url = new URL(`https://api.0x.org${path}?${new URLSearchParams(filteredParams).toString()}`);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "0x-api-key": apiKey,
            "0x-version": "v2",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${JSON.stringify(await response.text(), null, 2)}`);
    }

    return response.json();
}

/**
 * Get the price of a token pair
 * @returns The price details
 */
export async function getPrice({
    agent,
    sellToken,
    buyToken,
    sellAmount,
    slippageBps
}: {
    agent: Agentix<EvmWalletBase>,
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    slippageBps?: number,
}) {
    const walletClient = agent.wallet;
    const referrer = agent.config.referrer;
    const apiKey = agent.config.apiKey;

    const queryParams = {
        chainId: walletClient.getChain().id.toString(),
        sellToken: sellToken,
        buyToken: buyToken,
        sellAmount: sellAmount,
        taker: walletClient.getAddress(),
        txOrigin: walletClient.getAddress(),
        slippageBps: slippageBps?.toString(),
        ...(referrer && {
            swapFeeBps: referrer.swapFeeBps.toString(),
            swapFeeToken: sellToken,
            swapFeeRecipient: referrer.swapFeeRecipient,
        }),
    };

    return await makeRequest(apiKey, "/swap/permit2/price", queryParams);
}

/**
 * Swap tokens using 0x
 * @returns Transaction signature
 */
export async function swap({
    agent,
    sellToken,
    buyToken,
    sellAmount,
    slippageBps
}: {
    agent: Agentix<EvmWalletBase>,
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    slippageBps?: number,
}) {
    const price = await getPrice({
        agent,
        sellToken,
        buyToken,
        sellAmount,
        slippageBps
    });

    const walletClient = agent.wallet;
    const referrer = agent.config.referrer;
    const apiKey = agent.config.apiKey;

    if (price.issues.allowance !== null) {
        await walletClient.sendTransaction({
            to: price.issues.allowance.spender,
            abi: erc20Abi,
            functionName: "approve",
            args: [price.issues.allowance.spender, maxUint256],
        });
    }

    const quote = await makeRequest(apiKey, "/swap/permit2/quote", {
        chainId: walletClient.getChain().id.toString(),
        sellToken: sellToken,
        buyToken: buyToken,
        sellAmount: sellAmount,
        taker: walletClient.getAddress(),
        txOrigin: walletClient.getAddress(),
        slippageBps: slippageBps?.toString(),
        ...(referrer && {
            swapFeeBps: referrer.swapFeeBps.toString(),
            swapFeeToken: sellToken,
            swapFeeRecipient: referrer.swapFeeRecipient,
        }),
    });

    let signature: Hex | undefined;

    if (quote.permit2?.eip712) {
        const signResult = await walletClient.signTypedData({
            domain: quote.permit2.eip712.domain,
            types: quote.permit2.eip712.types,
            primaryType: quote.permit2.eip712.primaryType,
            message: quote.permit2.eip712.message,
        });
        
        signature = signResult.signature as Hex;

        const signatureLengthInHex = numberToHex(size(signature), {
            signed: false,
            size: 32,
        });

        const transactionData = quote.transaction.data as Hex;
        const sigLengthHex = signatureLengthInHex as Hex;
        const sig = signature as Hex;

        quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
    }

    const transaction = quote.transaction;

    const tx = await walletClient.sendTransaction({
        to: transaction.to,
        value: transaction.value,
        data: transaction.data,
    });

    return tx.hash;
}