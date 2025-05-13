import { SupportedChain } from "../types";

/**
 * BirdEye API client for making requests to the BirdEye public API
 */
export class BirdeyeApi {
    public readonly baseUrl = "https://public-api.birdeye.so";

    constructor(private readonly apiKey: string) {}

    /**
     * Make a request to the BirdEye API
     * @param endpoint API endpoint to call
     * @param chain Chain name (defaults to "solana")
     * @param options Additional fetch options
     * @returns Response data from the API
     */
    async makeRequest(endpoint: string, chain: SupportedChain = "solana", options: RequestInit = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                "X-API-KEY": this.apiKey,
                "x-chain": chain,
            },
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("BirdEye API rate limit exceeded");
            }
            throw new Error(`BirdEye API request failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.data;
    }
} 