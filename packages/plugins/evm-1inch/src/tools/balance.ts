import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import { AggregatedBalancesAndAllowancesResponse } from "../types";

/**
 * Get the balances and allowances for a wallet address on a specific chain
 * @returns The balances and allowances for the wallet address
 */
export async function getAggregatedBalancesAndAllowances({
    agent,
    walletAddress
}: {
    agent: Agentix<EvmWalletBase>,
    walletAddress?: string,
}): Promise<AggregatedBalancesAndAllowancesResponse> {
    const walletClient = agent.wallet;
    const apiKey = agent.config.oneInchApiKey;
    const baseUrl = "https://api.1inch.dev";
    const chainId = walletClient.getChain().id;

    const url = new URL(
        `${baseUrl}/balance/v1.2/${chainId}/balances/${walletAddress ?? walletClient.getAddress()}`,
    );

    const response = await fetch(url.toString(), {
        headers: {
            Accept: "application/json",
            ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch balances: ${response.statusText}`);
    }

    return await response.json();
} 