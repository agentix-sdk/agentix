// ERC1155 Plugin Types - Token symbol-based parameters for use with @/token plugin

export interface BalanceOfParams {
    tokenSymbol: string;
    owner: string;
    tokenId: string;
}

export interface BalanceOfBatchParams {
    tokenSymbol: string;
    owners: string[];
    tokenIds: string[];
}

export interface SafeTransferFromParams {
    tokenSymbol: string;
    from: string;
    to: string;
    tokenId: string;
    amount: string;
    data?: string;
}

export interface SafeBatchTransferFromParams {
    tokenSymbol: string;
    from: string;
    to: string;
    tokenIds: string[];
    amounts: string[];
    data?: string;
}

export interface SetApprovalForAllParams {
    tokenSymbol: string;
    operator: string;
    approved: boolean;
}

export interface IsApprovedForAllParams {
    tokenSymbol: string;
    owner: string;
    operator: string;
}

export interface GetTokenInfoBySymbolParams {
    tokenSymbol: string;
}

export interface GetBalanceBySymbolParams {
    tokenSymbol: string;
    owner: string;
    tokenId: string;
}

export interface GetApprovalBySymbolParams {
    tokenSymbol: string;
    owner: string;
    operator: string;
}

// ERC1155 Token Contract mapping for known tokens
export interface ERC1155TokenContract {
    symbol: string;
    name: string;
    contractAddress: `0x${string}`;
    chainId: number;
}

// Response types
export interface ERC1155TokenInfo {
    symbol: string;
    name: string;
    contractAddress: `0x${string}`;
    chainId: number;
}

export interface ERC1155Balance {
    tokenSymbol: string;
    owner: string;
    tokenId: string;
    balance: string;
}

export interface ERC1155BatchBalance {
    tokenSymbol: string;
    owners: string[];
    tokenIds: string[];
    balances: string[];
}

export interface ERC1155TransferResult {
    tokenSymbol: string;
    from: string;
    to: string;
    tokenId: string;
    amount: string;
    transactionHash: string;
}

export interface ERC1155BatchTransferResult {
    tokenSymbol: string;
    from: string;
    to: string;
    tokenIds: string[];
    amounts: string[];
    transactionHash: string;
}

export interface ERC1155ApprovalResult {
    tokenSymbol: string;
    owner: string;
    operator: string;
    approved: boolean;
    transactionHash?: string;
}
