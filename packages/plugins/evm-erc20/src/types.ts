// ERC20 ABI for token operations
export const ERC20_ABI = [
    {
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "_owner", "type": "address"},
            {"name": "_spender", "type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "_spender", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "_from", "type": "address"},
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

// Parameter types for ERC20 operations
export interface GetTokenBalanceParameters {
    tokenAddress: `0x${string}`;
    wallet: `0x${string}`;
}

export interface TransferParameters {
    tokenAddress: `0x${string}`;
    to: `0x${string}`;
    amount: bigint;
}

export interface GetTokenTotalSupplyParameters {
    tokenAddress: `0x${string}`;
}

export interface GetTokenAllowanceParameters {
    tokenAddress: `0x${string}`;
    owner: `0x${string}`;
    spender: `0x${string}`;
}

export interface ApproveParameters {
    tokenAddress: `0x${string}`;
    spender: `0x${string}`;
    amount: bigint;
}

export interface RevokeApprovalParameters {
    tokenAddress: `0x${string}`;
    spender: `0x${string}`;
}

export interface TransferFromParameters {
    tokenAddress: `0x${string}`;
    from: `0x${string}`;
    to: `0x${string}`;
    amount: bigint;
}

export interface ConvertToBaseUnitParameters {
    amount: number;
    decimals: number;
}

export interface ConvertFromBaseUnitParameters {
    amount: bigint | number;
    decimals: number;
}

export interface GetTokenInfoParameters {
    tokenAddress: `0x${string}`;
}

// Response types
export interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
}

export interface ERC20OperationResult {
    success: boolean;
    transactionHash?: string;
    error?: string;
    value?: string;
}
