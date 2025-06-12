import { Agentix, WalletBase } from "agentix";
import { 
    getChainById, 
    getChainByName, 
    getChainsByType, 
    getAllSupportedChains 
} from "../chains";
import { ChainSearchParams } from "../types";

export async function getChainInfo(params: {
    agent: Agentix<WalletBase>;
    chainId: string | number;
}) {
    const { chainId } = params;
    
    try {
        const chain = getChainById(chainId);
        
        if (!chain) {
            return {
                success: false,
                error: `Chain with ID ${chainId} not found`,
                chain: null
            };
        }
        
        return {
            success: true,
            chain,
            error: null
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            chain: null
        };
    }
}

export async function getChainByNameLookup(params: {
    agent: Agentix<WalletBase>;
    name: string;
}) {
    const { name } = params;
    
    try {
        const chain = getChainByName(name);
        
        if (!chain) {
            return {
                success: false,
                error: `Chain with name "${name}" not found`,
                chain: null
            };
        }
        
        return {
            success: true,
            chain,
            error: null
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            chain: null
        };
    }
}

export async function getChainsByTypeLookup(params: {
    agent: Agentix<WalletBase>;
    type: string;
}) {
    const { type } = params;
    
    try {
        const chains = getChainsByType(type);
        
        if (chains.length === 0) {
            return {
                success: false,
                error: `No chains found for type "${type}"`,
                chains: []
            };
        }
        
        return {
            success: true,
            chains,
            count: chains.length
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            chains: []
        };
    }
}

export async function getAllChains(params: {
    agent: Agentix<WalletBase>;
}) {
    try {
        const chains = getAllSupportedChains();
        
        return {
            success: true,
            chains,
            count: chains.length
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            chains: []
        };
    }
}

export async function getEvmChains(params: {
    agent: Agentix<WalletBase>;
}) {
    try {
        const chains = getChainsByType("evm");
        
        return {
            success: true,
            chains,
            count: chains.length
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            chains: []
        };
    }
}

export async function getSupportedChainTypes(params: {
    agent: Agentix<WalletBase>;
}) {
    try {
        const chains = getAllSupportedChains();
        const types = [...new Set(chains.map(chain => chain.type))];
        
        return {
            success: true,
            types,
            count: types.length
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            types: []
        };
    }
}

export async function searchChains(params: {
    agent: Agentix<WalletBase>;
    searchParams: ChainSearchParams;
}) {
    const { searchParams } = params;
    
    try {
        let chains = getAllSupportedChains();
        
        // Filter by parameters
        if (searchParams.id) {
            const chain = getChainById(searchParams.id);
            chains = chain ? [chain] : [];
        } else if (searchParams.name) {
            const chain = getChainByName(searchParams.name);
            chains = chain ? [chain] : [];
        } else if (searchParams.type) {
            chains = getChainsByType(searchParams.type);
        }
        
        return {
            success: true,
            chains,
            count: chains.length
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            chains: []
        };
    }
}

export async function getChainNativeCurrency(params: {
    agent: Agentix<WalletBase>;
    chainId: string | number;
}) {
    const { chainId } = params;
    
    try {
        const chain = getChainById(chainId);
        
        if (!chain) {
            return {
                success: false,
                error: `Chain with ID ${chainId} not found`,
                currency: null
            };
        }
        
        return {
            success: true,
            currency: chain.nativeCurrency,
            error: null
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            currency: null
        };
    }
} 