import { 
    EvmChain, 
    SolanaChain, 
    AptosChain, 
    SuiChain, 
    ZilliqaChain,
    CosmosChain,
    StarknetChain,
    RadixChain,
    FuelChain,
    ChromiaChain,
    ZetrixChain,
    PluginBase, 
    WalletBase 
} from "agentix";

// Import actions
import {
    searchTokensAction,
    getTokenAction,
    getTokenByAddressAction,
    getNativeTokenAction,
    getTokensByChainTypeAction,
    getSupportedChainsForTokenAction,
    checkTokenSupportAction
} from "./actions/tokenActions";

import {
    getChainInfoAction,
    getChainByNameAction,
    getChainsByTypeAction,
    getAllSupportedChainsAction,
    getEvmChainsAction,
    getSupportedChainTypesAction,
    getChainNativeCurrencyAction
} from "./actions/chainActions";

// Import tools
import {
    searchTokensByParams,
    getTokenBySymbolAndChain,
    getTokenByContractAddress,
    getNativeToken,
    getTokensByChain,
    getSupportedChains,
    checkTokenSupport
} from "./tools/token-lookup";

import {
    getChainInfo,
    getChainByNameLookup,
    getChainsByTypeLookup,
    getAllChains,
    getEvmChains,
    getSupportedChainTypes,
    getChainNativeCurrency
} from "./tools/chain-lookup";

// Import utilities
import {
    searchTokens,
    getTokenBySymbol,
    getTokenByAddress,
    getNativeTokenForChain,
    getTokensByChainType,
    getSupportedChainsForToken,
    isTokenSupportedOnChain,
    formatTokenAmount,
    parseTokenAmount,
    getChainInfo as getChainInfoUtil
} from "./utils";

class TokenPlugin extends PluginBase<WalletBase> {
    constructor() {
        const methods = {
            // Token methods
            searchTokens: searchTokensByParams,
            getTokenBySymbol: getTokenBySymbolAndChain,
            getTokenByAddress: getTokenByContractAddress,
            getNativeToken: getNativeToken,
            getTokensByChainType: getTokensByChain,
            getSupportedChainsForToken: getSupportedChains,
            checkTokenSupport: checkTokenSupport,
            
            // Chain methods
            getChainInfo: getChainInfo,
            getChainByName: getChainByNameLookup,
            getChainsByType: getChainsByTypeLookup,
            getAllSupportedChains: getAllChains,
            getEvmChains: getEvmChains,
            getSupportedChainTypes: getSupportedChainTypes,
            getChainNativeCurrency: getChainNativeCurrency,

            // Utility methods
            searchTokensUtil: searchTokens,
            getTokenBySymbolUtil: getTokenBySymbol,
            getTokenByAddressUtil: getTokenByAddress,
            getNativeTokenForChainUtil: getNativeTokenForChain,
            getTokensByChainTypeUtil: getTokensByChainType,
            getSupportedChainsForTokenUtil: getSupportedChainsForToken,
            isTokenSupportedOnChainUtil: isTokenSupportedOnChain,
            formatTokenAmount: formatTokenAmount,
            parseTokenAmount: parseTokenAmount,
            getChainInfoUtil: getChainInfoUtil
        };

        const actions = [
            // Token actions
            searchTokensAction,
            getTokenAction,
            getTokenByAddressAction,
            getNativeTokenAction,
            getTokensByChainTypeAction,
            getSupportedChainsForTokenAction,
            checkTokenSupportAction,
            
            // Chain actions
            getChainInfoAction,
            getChainByNameAction,
            getChainsByTypeAction,
            getAllSupportedChainsAction,
            getEvmChainsAction,
            getSupportedChainTypesAction,
            getChainNativeCurrencyAction
        ];

        const supportedChains = [
            // EVM Chains
            { type: "evm", id: 1 } as EvmChain,      // Ethereum
            { type: "evm", id: 10 } as EvmChain,     // Optimism
            { type: "evm", id: 137 } as EvmChain,    // Polygon
            { type: "evm", id: 8453 } as EvmChain,   // Base
            { type: "evm", id: 42161 } as EvmChain,  // Arbitrum
            { type: "evm", id: 34443 } as EvmChain,  // Mode
            { type: "evm", id: 11155111 } as EvmChain, // Sepolia
            { type: "evm", id: 84532 } as EvmChain,  // Base Sepolia
            
            // Non-EVM Chains
            { type: "solana" } as SolanaChain,
            { type: "aptos" } as AptosChain,
            { type: "sui" } as SuiChain,
            { type: "zilliqa", id: 32769, evmId: 32769 } as ZilliqaChain,
            { type: "cosmos" } as CosmosChain,
            { type: "starknet" } as StarknetChain,
            { type: "radix", id: 1 } as RadixChain,
            { type: "fuel" } as FuelChain,
            { type: "chromia" } as ChromiaChain,
            { type: "zetrix" } as ZetrixChain
        ];

        super("token", methods, actions, supportedChains);
    }

    supportsWallet(wallet: WalletBase): boolean {
        return true;
    }
}

export default TokenPlugin;

// Export types
export type {
    Token,
    ChainSpecificToken,
    ChainInfo,
    TokenSearchParams,
    ChainSearchParams
} from "./types";

// Export utilities
export {
    searchTokens,
    getTokenBySymbol,
    getTokenByAddress,
    getNativeTokenForChain,
    getTokensByChainType,
    getSupportedChainsForToken,
    isTokenSupportedOnChain,
    formatTokenAmount,
    parseTokenAmount,
    getTokensForNetwork
} from "./utils";

// Export chain utilities
export {
    getChainById,
    getChainByName,
    getChainsByType,
    getAllSupportedChains,
    CHAIN_INFO,
    EVM_CHAINS,
    NON_EVM_CHAINS
} from "./chains";

// Export default tokens
export {
    DEFAULT_TOKENS,
    NATIVE_TOKENS,
    ERC20_TOKENS,
    ETH,
    SOL,
    APT,
    SUI,
    MATIC,
    ZIL,
    ATOM,
    XRD,
    CHR,
    ZTX,
    PEPE,
    USDC,
    USDT,
    MODE,
    WETH,
    WBTC
} from "./default-tokens";
