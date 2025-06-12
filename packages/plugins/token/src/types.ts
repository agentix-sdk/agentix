export type Token = {
    decimals: number;
    symbol: string;
    name: string;
    chains: Record<number, { contractAddress: `0x${string}` }>;
};

export type ChainSpecificToken = {
    chainId: number;
    decimals: number;
    symbol: string;
    name: string;
    contractAddress: `0x${string}`;
};
