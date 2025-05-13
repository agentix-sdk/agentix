export type Referrer = {
    swapFeeBps: number;
    swapFeeRecipient: string;
};

export type GetPriceParams = {
    sellToken: string;
    buyToken: string;
    sellAmount: string;
    slippageBps?: number;
}; 