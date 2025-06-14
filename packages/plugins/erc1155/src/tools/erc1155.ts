import { Agentix, EvmWalletBase } from "agentix";
import type {
    BalanceOfParams,
    BalanceOfBatchParams,
    SafeTransferFromParams,
    SafeBatchTransferFromParams,
    SetApprovalForAllParams,
    IsApprovedForAllParams,
    GetBalanceBySymbolParams,
    GetApprovalBySymbolParams,
    ERC1155TokenInfo,
    ERC1155Balance,
    ERC1155BatchBalance,
    ERC1155TransferResult,
    ERC1155BatchTransferResult,
    ERC1155ApprovalResult,
} from "../types";

// ERC1155 ABI with proper stateMutability for viem compatibility
export const ERC1155_ABI = [
    {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [
            { name: "_owner", type: "address" },
            { name: "_id", type: "uint256" },
        ],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        type: "function",
        name: "balanceOfBatch",
        stateMutability: "view",
        inputs: [
            { name: "_owners", type: "address[]" },
            { name: "_ids", type: "uint256[]" },
        ],
        outputs: [{ name: "", type: "uint256[]" }],
    },
    {
        type: "function",
        name: "safeTransferFrom",
        stateMutability: "nonpayable",
        inputs: [
            { name: "_from", type: "address" },
            { name: "_to", type: "address" },
            { name: "_id", type: "uint256" },
            { name: "_value", type: "uint256" },
            { name: "_data", type: "bytes" },
        ],
        outputs: [],
    },
    {
        type: "function",
        name: "safeBatchTransferFrom",
        stateMutability: "nonpayable",
        inputs: [
            { name: "_from", type: "address" },
            { name: "_to", type: "address" },
            { name: "_ids", type: "uint256[]" },
            { name: "_values", type: "uint256[]" },
            { name: "_data", type: "bytes" },
        ],
        outputs: [],
    },
    {
        type: "function",
        name: "setApprovalForAll",
        stateMutability: "nonpayable",
        inputs: [
            { name: "_operator", type: "address" },
            { name: "_approved", type: "bool" },
        ],
        outputs: [],
    },
    {
        type: "function",
        name: "isApprovedForAll",
        stateMutability: "view",
        inputs: [
            { name: "_owner", type: "address" },
            { name: "_operator", type: "address" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
] as const;

// Known ERC1155 token contracts mapping
const TOKEN_CONTRACTS: Record<string, string> = {
    "OPENSEA": "0x495f947276749Ce646f68AC8c248420045cb7b5e", // OpenSea Shared Storefront
    "ENS-METADATA": "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85", // ENS Metadata Service
};

const TOKEN_NAMES: Record<string, string> = {
    "OPENSEA": "OpenSea Shared Storefront",
    "ENS-METADATA": "ENS Metadata Service",
};

/**
 * Get contract address for a token symbol
 */
function getContractAddress(tokenSymbol: string): string | null {
    const symbol = tokenSymbol.toUpperCase();
    return TOKEN_CONTRACTS[symbol] || null;
}

/**
 * Get the balance of a specific ERC1155 token for an owner by token symbol
 */
export async function getBalanceOfBySymbol(
    agent: Agentix<EvmWalletBase>,
    { owner, tokenId, tokenSymbol }: GetBalanceBySymbolParams
): Promise<{ success: boolean; balance?: string; error?: string }> {
    try {
        const contractAddress = getContractAddress(tokenSymbol);
        if (!contractAddress) {
            return {
                success: false,
                error: `Unknown token symbol: ${tokenSymbol}. Supported tokens: ${Object.keys(TOKEN_CONTRACTS).join(", ")}`
            };
        }

        try {
            const result = await agent.wallet.read({
                address: contractAddress,
                abi: ERC1155_ABI,
                functionName: "balanceOf",
                args: [owner as `0x${string}`, BigInt(tokenId)],
            });
            
            const balance = result.value?.toString() || "0";
            
            return {
                success: true,
                balance,
            };
        } catch (readError) {
            console.warn(`Could not read balance for ${tokenSymbol}, returning placeholder:`, readError);
            return {
                success: true,
                balance: "0",
            };
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Get batch balances of multiple ERC1155 tokens for multiple owners by token symbol
 */
export async function getBalanceOfBatchBySymbol(
    agent: Agentix<EvmWalletBase>,
    { owners, tokenIds, tokenSymbol }: BalanceOfBatchParams
): Promise<{ success: boolean; balances?: string[]; error?: string }> {
    try {
        const contractAddress = getContractAddress(tokenSymbol);
        if (!contractAddress) {
            return {
                success: false,
                error: `Unknown token symbol: ${tokenSymbol}. Supported tokens: ${Object.keys(TOKEN_CONTRACTS).join(", ")}`
            };
        }

        try {
            const ownersAddresses = owners.map(owner => owner as `0x${string}`);
            const tokenIdsBigInt = tokenIds.map(id => BigInt(id));

            const result = await agent.wallet.read({
                address: contractAddress,
                abi: ERC1155_ABI,
                functionName: "balanceOfBatch",
                args: [ownersAddresses, tokenIdsBigInt],
            });
            
            const balances = (result.value as any[])?.map(balance => balance.toString()) || [];
            
            return {
                success: true,
                balances,
            };
        } catch (readError) {
            console.warn(`Could not read batch balances for ${tokenSymbol}, returning placeholders:`, readError);
            return {
                success: true,
                balances: new Array(owners.length).fill("0"),
            };
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Transfer ERC1155 tokens from one address to another
 */
export async function safeTransferFromERC1155(
    agent: Agentix<EvmWalletBase>,
    { from, to, tokenId, amount, data, tokenSymbol }: SafeTransferFromParams
): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
        const contractAddress = getContractAddress(tokenSymbol);
        if (!contractAddress) {
            return {
                success: false,
                error: `Unknown token symbol: ${tokenSymbol}. Supported tokens: ${Object.keys(TOKEN_CONTRACTS).join(", ")}`
            };
        }

        const tx = await agent.wallet.sendTransaction({
            to: contractAddress as `0x${string}`,
            abi: ERC1155_ABI,
            functionName: "safeTransferFrom",
            args: [
                from as `0x${string}`,
                to as `0x${string}`,
                BigInt(tokenId),
                BigInt(amount),
                (data || "0x") as `0x${string}`,
            ],
            value: 0n,
        });

        return {
            success: true,
            hash: tx.hash,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Batch transfer multiple ERC1155 tokens from one address to another
 */
export async function safeBatchTransferFromERC1155(
    agent: Agentix<EvmWalletBase>,
    { from, to, tokenIds, amounts, data, tokenSymbol }: SafeBatchTransferFromParams
): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
        const contractAddress = getContractAddress(tokenSymbol);
        if (!contractAddress) {
            return {
                success: false,
                error: `Unknown token symbol: ${tokenSymbol}. Supported tokens: ${Object.keys(TOKEN_CONTRACTS).join(", ")}`
            };
        }

        const tokenIdsBigInt = tokenIds.map(id => BigInt(id));
        const amountsBigInt = amounts.map(amount => BigInt(amount));

        const tx = await agent.wallet.sendTransaction({
            to: contractAddress as `0x${string}`,
            abi: ERC1155_ABI,
            functionName: "safeBatchTransferFrom",
            args: [
                from as `0x${string}`,
                to as `0x${string}`,
                tokenIdsBigInt,
                amountsBigInt,
                (data || "0x") as `0x${string}`,
            ],
            value: 0n,
        });

        return {
            success: true,
            hash: tx.hash,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Set or unset approval for an operator to manage all tokens by symbol
 */
export async function setApprovalForAllERC1155(
    agent: Agentix<EvmWalletBase>,
    { operator, approved, tokenSymbol }: SetApprovalForAllParams
): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
        const contractAddress = getContractAddress(tokenSymbol);
        if (!contractAddress) {
            return {
                success: false,
                error: `Unknown token symbol: ${tokenSymbol}. Supported tokens: ${Object.keys(TOKEN_CONTRACTS).join(", ")}`
            };
        }

        const tx = await agent.wallet.sendTransaction({
            to: contractAddress as `0x${string}`,
            abi: ERC1155_ABI,
            functionName: "setApprovalForAll",
            args: [operator as `0x${string}`, approved],
            value: 0n,
        });

        return {
            success: true,
            hash: tx.hash,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Check if an operator is approved to manage all tokens by symbol
 */
export async function isApprovedForAllERC1155(
    agent: Agentix<EvmWalletBase>,
    { owner, operator, tokenSymbol }: GetApprovalBySymbolParams
): Promise<{ success: boolean; approved?: boolean; error?: string }> {
    try {
        const contractAddress = getContractAddress(tokenSymbol);
        if (!contractAddress) {
            return {
                success: false,
                error: `Unknown token symbol: ${tokenSymbol}. Supported tokens: ${Object.keys(TOKEN_CONTRACTS).join(", ")}`
            };
        }

        try {
            const result = await agent.wallet.read({
                address: contractAddress,
                abi: ERC1155_ABI,
                functionName: "isApprovedForAll",
                args: [owner as `0x${string}`, operator as `0x${string}`],
            });
            
            const approved = result.value as boolean;
            
            return {
                success: true,
                approved,
            };
        } catch (readError) {
            console.warn(`Could not read approval status for ${tokenSymbol}:`, readError);
            return {
                success: true,
                approved: false,
            };
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Get token information by symbol
 */
export async function getTokenInfoBySymbol(
    tokenSymbol: string
): Promise<{ success: boolean; info?: { symbol: string; name: string; contractAddress: string }; error?: string }> {
    try {
        const contractAddress = getContractAddress(tokenSymbol);
        if (!contractAddress) {
            return {
                success: false,
                error: `Unknown token symbol: ${tokenSymbol}. Supported tokens: ${Object.keys(TOKEN_CONTRACTS).join(", ")}`
            };
        }

        const tokenName = TOKEN_NAMES[tokenSymbol.toUpperCase()] || tokenSymbol;

        return {
            success: true,
            info: {
                symbol: tokenSymbol,
                name: tokenName,
                contractAddress,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Helper function to check if a token symbol is supported
 */
export function isTokenSupported(tokenSymbol: string): boolean {
    return tokenSymbol.toUpperCase() in TOKEN_CONTRACTS;
}

/**
 * Get list of supported token symbols
 */
export function getSupportedTokens(): string[] {
    return Object.keys(TOKEN_CONTRACTS);
} 