export interface AlloraInferenceData {
    network_inference: string;
    network_inference_normalized: string;
    confidence_interval_percentiles: string[];
    confidence_interval_percentiles_normalized: string[];
    confidence_interval_values: string[];
    confidence_interval_values_normalized: string[];
    topic_id: string;
    timestamp: number;
    extra_data: string;
}

export interface AlloraAPIResponse {
    request_id: string;
    status: boolean;
    data: {
        signature: string;
        inference_data: AlloraInferenceData;
    };
}

export enum AlloraPricePredictionToken {
    BTC = "BTC",
    ETH = "ETH",
}

export enum AlloraPricePredictionTimeframe {
    "5m" = "5m",
    "8h" = "8h",
}

export enum AlloraPricePredictionSignatureFormat {
    EthereumSepolia = "ethereum-11155111",
}

export type GetPricePredictionParams = {
    ticker: AlloraPricePredictionToken;
    timeframe: AlloraPricePredictionTimeframe;
};
