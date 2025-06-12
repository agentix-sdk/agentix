import { Agentix, WalletBase } from "agentix";
import { 
    searchTokens, 
    getTokenBySymbol, 
    getTokenByAddress, 
    getNativeTokenForChain, 
    getTokensByChainType,
    getSupportedChainsForToken,
    isTokenSupportedOnChain
} from "../utils";
import { TokenSearchParams } from "../types";

export async function searchTokensByParams(params: {
    agent: Agentix<WalletBase>;
    searchParams: TokenSearchParams;
}) {
    const { searchParams } = params;
    
    try {
        const tokens = searchTokens(searchParams);
        
        return {
            success: true,
            tokens,
            count: tokens.length
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            tokens: [],
            count: 0
        };
    }
}

export async function getTokenBySymbolAndChain(params: {
    agent: Agentix<WalletBase>;
    symbol: string;
    chainId?: string | number;
}) {
    const { symbol, chainId } = params;
    
    try {
        const token = getTokenBySymbol(symbol, chainId);
        
        if (!token) {
            return {
                success: false,
                error: `Token ${symbol} not found${chainId ? ` on chain ${chainId}` : ''}`,
                token: null
            };
        }
        
        return {
            success: true,
            token,
            error: null
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            token: null
        };
    }
}

export async function getTokenByContractAddress(params: {
    agent: Agentix<WalletBase>;
    contractAddress: string;
    chainId?: string | number;
}) {
    const { contractAddress, chainId } = params;
    
    try {
        const token = getTokenByAddress(contractAddress, chainId);
        
        if (!token) {
            return {
                success: false,
                error: `Token with address ${contractAddress} not found${chainId ? ` on chain ${chainId}` : ''}`,
                token: null
            };
        }
        
        return {
            success: true,
            token,
            error: null
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            token: null
        };
    }
}

export async function getNativeToken(params: {
    agent: Agentix<WalletBase>;
    chainId: string | number;
}) {
    const { chainId } = params;
    
    try {
        const token = getNativeTokenForChain(chainId);
        
        if (!token) {
            return {
                success: false,
                error: `Native token not found for chain ${chainId}`,
                token: null
            };
        }
        
        return {
            success: true,
            token,
            error: null
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            token: null
        };
    }
}

export async function getTokensByChain(params: {
    agent: Agentix<WalletBase>;
    chainType: string;
}) {
    const { chainType } = params;
    
    try {
        const tokens = getTokensByChainType(chainType);
        
        return {
            success: true,
            tokens,
            count: tokens.length
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            tokens: [],
            count: 0
        };
    }
}

export async function getSupportedChains(params: {
    agent: Agentix<WalletBase>;
    tokenSymbol: string;
}) {
    const { tokenSymbol } = params;
    
    try {
        const chainIds = getSupportedChainsForToken(tokenSymbol);
        
        if (chainIds.length === 0) {
            return {
                success: false,
                error: `Token ${tokenSymbol} not found or not supported on any chains`,
                chains: []
            };
        }
        
        return {
            success: true,
            chains: chainIds,
            count: chainIds.length
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            chains: []
        };
    }
}

export async function checkTokenSupport(params: {
    agent: Agentix<WalletBase>;
    tokenSymbol: string;
    chainId: string | number;
}) {
    const { tokenSymbol, chainId } = params;
    
    try {
        const isSupported = isTokenSupportedOnChain(tokenSymbol, chainId);
        
        return {
            success: true,
            supported: isSupported,
            message: isSupported 
                ? `Token ${tokenSymbol} is supported on chain ${chainId}`
                : `Token ${tokenSymbol} is not supported on chain ${chainId}`
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            supported: false
        };
    }
} 