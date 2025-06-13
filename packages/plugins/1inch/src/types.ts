export interface TokenBalance {
    balance: string;
    allowance: string;
}

export interface AggregatedBalancesAndAllowancesResponse {
    [tokenAddress: string]: TokenBalance;
}

export type GetBalancesParams = {
    walletAddress?: string;
};
