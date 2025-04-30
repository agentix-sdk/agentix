export interface PumpFunTokenOptions {
    twitter?: string;
    telegram?: string;
    website?: string;
    initialLiquiditySOL?: number;
    slippageBps?: number;
    priorityFee?: number;
}
  
export interface PumpfunLaunchResponse {
    signature: string;
    mint: string;
    metadataUri?: string;
    error?: string;
}