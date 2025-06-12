import { Chain } from "agentix";

export type Token = {
    decimals: number;
    symbol: string;
    name: string;
    chains: Record<string, { 
        contractAddress?: `0x${string}` | string; 
        native?: boolean;
        coingeckoId?: string;
    }>;
};

export type ChainSpecificToken = {
    chainId: string | number;
    chainType: string;
    decimals: number;
    symbol: string;
    name: string;
    contractAddress?: `0x${string}` | string;
    native?: boolean;
    coingeckoId?: string;
};

export type ChainInfo = {
    id: string | number;
    name: string;
    type: Chain["type"];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls?: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[];
    evmId?: number; // For chains that also support EVM
};

export type TokenSearchParams = {
    symbol?: string;
    name?: string;
    chainId?: string | number;
    chainType?: Chain["type"];
    contractAddress?: string;
};

export type ChainSearchParams = {
    id?: string | number;
    name?: string;
    type?: Chain["type"];
};
