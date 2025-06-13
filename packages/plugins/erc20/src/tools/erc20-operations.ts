import { EvmWalletBase, Agentix } from "agentix";
import {
    ERC20_ABI,
    TokenInfo,
    ERC20OperationResult
} from "../types";

export async function getTokenBalance(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
    wallet?: `0x${string}`;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress, wallet } = params;
    
    try {
        const walletAddress = wallet || (await agent.wallet.getAddress()) as `0x${string}`;
        
        const rawBalance = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [walletAddress],
        });

        return {
            success: true,
            value: rawBalance.value?.toString() as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to fetch balance: ${error.message}`
        };
    }
}

export async function transfer(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
    to: `0x${string}`;
    amount: bigint | string;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress, to, amount } = params;
    
    try {
        const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
        
        const result = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [to, amountBigInt],
        });

        return {
            success: true,
            transactionHash: (result.value as any)?.hash as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to transfer: ${error.message}`
        };
    }
}

export async function getTokenTotalSupply(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress } = params;
    
    try {
        const rawTotalSupply = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "totalSupply",
        });

        return {
            success: true,
            value: rawTotalSupply.value?.toString() as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to fetch total supply: ${error.message}`
        };
    }
}

export async function getTokenAllowance(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
    owner: `0x${string}`;
    spender: `0x${string}`;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress, owner, spender } = params;
    
    try {
        const rawAllowance = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "allowance",
            args: [owner, spender],
        });

        return {
            success: true,
            value: rawAllowance.value?.toString() as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to fetch allowance: ${error.message}`
        };
    }
}

export async function approve(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
    spender: `0x${string}`;
    amount: bigint | string;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress, spender, amount } = params;
    
    try {
        const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
        
        const result = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [spender, amountBigInt],
        });

        return {
            success: true,
            transactionHash: (result.value as any)?.hash as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to approve: ${error.message}`
        };
    }
}

export async function revokeApproval(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
    spender: `0x${string}`;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress, spender } = params;
    
    try {
        const result = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [spender, BigInt(0)],
        });

        return {
            success: true,
            transactionHash: (result.value as any)?.hash as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to revoke approval: ${error.message}`
        };
    }
}

export async function transferFrom(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
    from: `0x${string}`;
    to: `0x${string}`;
    amount: bigint | string;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress, from, to, amount } = params;
    
    try {
        const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
        
        const result = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "transferFrom",
            args: [from, to, amountBigInt],
        });

        return {
            success: true,
            transactionHash: (result.value as any)?.hash as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to transfer from: ${error.message}`
        };
    }
}

export async function convertToBaseUnit(params: {
    amount: number | string;
    decimals: number;
}): Promise<ERC20OperationResult> {
    const { amount, decimals } = params;
    
    try {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        const baseUnit = BigInt(Math.floor(numAmount * Math.pow(10, decimals)));
        
        return {
            success: true,
            value: Number(baseUnit) as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to convert to base unit: ${error.message}`
        };
    }
}

export async function convertFromBaseUnit(params: {
    amount: bigint | string | number;
    decimals: number;
}): Promise<ERC20OperationResult> {
    const { amount, decimals } = params;
    
    try {
        const bigIntAmount = typeof amount === 'bigint' ? amount : BigInt(amount);
        const decimalUnit = Number(bigIntAmount) / Math.pow(10, decimals);
        
        return {
            success: true,
            value: decimalUnit as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to convert from base unit: ${error.message}`
        };
    }
}

export async function getTokenInfo(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
}): Promise<{ success: boolean; tokenInfo?: TokenInfo; error?: string }> {
    const { agent, tokenAddress } = params;
    
    try {
        const [name, symbol, decimals, totalSupply] = await Promise.all([
            agent.wallet.read({
                address: tokenAddress,
                abi: ERC20_ABI,
                functionName: "name",
            }),
            agent.wallet.read({
                address: tokenAddress,
                abi: ERC20_ABI,
                functionName: "symbol",
            }),
            agent.wallet.read({
                address: tokenAddress,
                abi: ERC20_ABI,
                functionName: "decimals",
            }),
            agent.wallet.read({
                address: tokenAddress,
                abi: ERC20_ABI,
                functionName: "totalSupply",
            })
        ]);

        return {
            success: true,
            tokenInfo: {
                name: name.value as any,
                symbol: symbol.value as any,
                decimals: Number(decimals.value),
                totalSupply: totalSupply.value?.toString() as any
            }
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to fetch token info: ${error.message}`
        };
    }
}

export async function getTokenDecimals(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress } = params;
    
    try {
        const decimals = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "decimals",
        });

        return {
            success: true,
            value: Number(decimals.value) as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to fetch decimals: ${error.message}`
        };
    }
}

export async function getTokenSymbol(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress } = params;
    
    try {
        const symbol = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "symbol",
        });

        return {
            success: true,
            value: symbol.value as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to fetch symbol: ${error.message}`
        };
    }
}

export async function getTokenName(params: {
    agent: Agentix<EvmWalletBase>;
    tokenAddress: `0x${string}`;
}): Promise<ERC20OperationResult> {
    const { agent, tokenAddress } = params;
    
    try {
        const name = await agent.wallet.read({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "name",
        });

        return {
            success: true,
            value: name.value as any
        };
    } catch (error: any) {
        return {
            success: false,
            error: `Failed to fetch name: ${error.message}`
        };
    }
} 