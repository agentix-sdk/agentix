import { assets, chains } from "chain-registry";

/**
 * Get chain information based on chain ID
 */
export async function getChainInfo(cosmosWallet: any): Promise<{ 
    chain: any; 
    asset: any;
}> {
    const id = await cosmosWallet.getChainId();
    const chain = chains.find((ch) => ch.chain_id === id);

    if (!chain) throw new Error("Network data is unavailable");

    const asset = assets.find((ast) => ast.chain_name === chain?.chain_name);
    return {
        chain: chain,
        asset: asset,
    };
}

/**
 * Convert from decimal units to base units (multiply by 10^decimals)
 */
export function convertToBaseUnit(amount: number, decimals: number): number {
    const baseUnit = amount * 10 ** decimals;
    return Number(baseUnit);
}

/**
 * Convert from base units to decimal units (divide by 10^decimals)
 */
export function convertFromBaseUnit(amount: number, decimals: number): number {
    const decimalUnit = amount / 10 ** decimals;
    return Number(decimalUnit);
}