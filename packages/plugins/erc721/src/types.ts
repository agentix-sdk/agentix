export interface GetBalanceParams {
    wallet: string;
}

export interface TransferParams {
    to: string;
    tokenId: string;
    tokenSymbol: string;
}

export interface ApproveParams {
    spender: string;
    tokenId: string;
    tokenSymbol: string;
}

export interface TransferFromParams {
    from: string;
    to: string;
    tokenId: string;
    tokenSymbol: string;
}

export interface OwnerOfParams {
    tokenId: string;
    tokenSymbol: string;
}

export interface GetBalanceBySymbolParams {
    wallet: string;
    tokenSymbol: string;
}

export interface GetTotalSupplyBySymbolParams {
    tokenSymbol: string;
}
