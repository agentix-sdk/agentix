import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import {
    AlloraAPIResponse,
    AlloraInferenceData,
    AlloraPricePredictionSignatureFormat,
    AlloraPricePredictionTimeframe,
    AlloraPricePredictionToken,
} from "../types";
import axios from "axios";

/**
 * Client for interacting with the Allora API
 */
class AlloraAPIClient {
    private apiKey: string | null | undefined;
    private apiRoot: string;

    constructor(apiKey?: string, apiRoot?: string) {
        this.apiKey = apiKey;
        const root = apiRoot || "https://api.upshot.xyz/v2/allora";
        this.apiRoot = root[root.length - 1] === "/" ? root.slice(0, root.length - 1) : root;
    }

    /**
     * Fetch a price prediction from the Allora API
     */
    public async fetchAlloraPricePrediction(
        asset: AlloraPricePredictionToken,
        timeframe: AlloraPricePredictionTimeframe,
        signatureFormat: AlloraPricePredictionSignatureFormat = AlloraPricePredictionSignatureFormat.EthereumSepolia,
    ): Promise<Partial<AlloraInferenceData>> {
        const url = `consumer/price/${signatureFormat}/${asset}/${timeframe}`;
        const resp = await this.fetchAlloraAPIData(url);
        if (!resp?.data?.inference_data) {
            throw new Error(`API response missing data: ${JSON.stringify(resp)}`);
        }
        return resp.data.inference_data;
    }

    /**
     * Make a request to the Allora API
     */
    private async fetchAlloraAPIData(endpoint: string): Promise<Partial<AlloraAPIResponse>> {
        const cleanEndpoint = endpoint[0] === "/" ? endpoint.slice(1) : endpoint;
        const url = `${this.apiRoot}/${cleanEndpoint}`;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
        if (this.apiKey) {
            headers["x-api-key"] = this.apiKey;
        }

        const response = await axios.get(url, { headers });
        if (response.status >= 400) {
            throw new Error(
                `Allora plugin: error requesting price prediction: url=${url} status=${
                    response.status
                } body=${JSON.stringify(response.data, null, 4)}`,
            );
        }

        return response.data;
    }
}

/**
 * Get a price prediction for a cryptocurrency from Allora Network
 * @returns The price prediction data
 */
export async function getPricePrediction({
    agent,
    ticker,
    timeframe
}: {
    agent: Agentix<EvmWalletBase>,
    ticker: AlloraPricePredictionToken,
    timeframe: AlloraPricePredictionTimeframe,
}): Promise<Partial<AlloraInferenceData>> {
    const apiKey = agent.config.alloraApiKey;
    const apiRoot = agent.config.alloraApiRoot;
    
    const client = new AlloraAPIClient(apiKey, apiRoot);
    
    return await client.fetchAlloraPricePrediction(ticker, timeframe);
} 