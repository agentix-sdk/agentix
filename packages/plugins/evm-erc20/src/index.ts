import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

// Import actions
import {
    getTokenBalanceAction,
    transferTokenAction,
    getTokenTotalSupplyAction,
    getTokenAllowanceAction,
    approveTokenAction,
    revokeApprovalAction,
    transferFromAction,
    convertToBaseUnitAction,
    convertFromBaseUnitAction,
    getTokenInfoAction
} from "./actions/erc20Actions";

// Import tools
import {
    getTokenBalance,
    transfer,
    getTokenTotalSupply,
    getTokenAllowance,
    approve,
    revokeApproval,
    transferFrom,
    convertToBaseUnit,
    convertFromBaseUnit,
    getTokenInfo,
    getTokenDecimals,
    getTokenSymbol,
    getTokenName
} from "./tools/erc20-operations";

class EvmErc20Plugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            // Core ERC20 operations
            getTokenBalance,
            transfer,
            getTokenTotalSupply,
            getTokenAllowance,
            approve,
            revokeApproval,
            transferFrom,
            
            // Utility operations
            convertToBaseUnit,
            convertFromBaseUnit,
            getTokenInfo,
            
            // Token metadata
            getTokenDecimals,
            getTokenSymbol,
            getTokenName
        };

        const actions = [
            // Core ERC20 actions
            getTokenBalanceAction,
            transferTokenAction,
            getTokenTotalSupplyAction,
            getTokenAllowanceAction,
            approveTokenAction,
            revokeApprovalAction,
            transferFromAction,
            
            // Utility actions
            convertToBaseUnitAction,
            convertFromBaseUnitAction,
            getTokenInfoAction
        ];

        const supportedChains = [
            // Mainnet chains
            { type: "evm", id: 1 } as EvmChain,      // Ethereum
            { type: "evm", id: 10 } as EvmChain,     // Optimism
            { type: "evm", id: 137 } as EvmChain,    // Polygon
            { type: "evm", id: 8453 } as EvmChain,   // Base
            { type: "evm", id: 42161 } as EvmChain,  // Arbitrum One
            { type: "evm", id: 43114 } as EvmChain,  // Avalanche
            { type: "evm", id: 250 } as EvmChain,    // Fantom
            { type: "evm", id: 25 } as EvmChain,     // Cronos
            { type: "evm", id: 56 } as EvmChain,     // BNB Smart Chain
            { type: "evm", id: 100 } as EvmChain,    // Gnosis Chain
            { type: "evm", id: 1285 } as EvmChain,   // Moonriver
            { type: "evm", id: 1284 } as EvmChain,   // Moonbeam
            { type: "evm", id: 34443 } as EvmChain,  // Mode Network
            { type: "evm", id: 7777777 } as EvmChain, // Zora
            { type: "evm", id: 324 } as EvmChain,    // zkSync Era
            { type: "evm", id: 59144 } as EvmChain,  // Linea
            { type: "evm", id: 534352 } as EvmChain, // Scroll
            { type: "evm", id: 5000 } as EvmChain,   // Mantle
            
            // Testnet chains
            { type: "evm", id: 11155111 } as EvmChain, // Sepolia
            { type: "evm", id: 84532 } as EvmChain,    // Base Sepolia
            { type: "evm", id: 421614 } as EvmChain,   // Arbitrum Sepolia
            { type: "evm", id: 11155420 } as EvmChain, // Optimism Sepolia
            { type: "evm", id: 80001 } as EvmChain,    // Polygon Mumbai (deprecated but still used)
            { type: "evm", id: 80002 } as EvmChain,    // Polygon Amoy
        ];

        super("erc20", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default EvmErc20Plugin;

// Export types for external use
export type {
    GetTokenBalanceParameters,
    TransferParameters,
    GetTokenTotalSupplyParameters,
    GetTokenAllowanceParameters,
    ApproveParameters,
    RevokeApprovalParameters,
    TransferFromParameters,
    ConvertToBaseUnitParameters,
    ConvertFromBaseUnitParameters,
    GetTokenInfoParameters,
    TokenInfo,
    ERC20OperationResult
} from "./types";

// Export ABI
export { ERC20_ABI } from "./types";

// Export tools for external use
export {
    getTokenBalance,
    transfer,
    getTokenTotalSupply,
    getTokenAllowance,
    approve,
    revokeApproval,
    transferFrom,
    convertToBaseUnit,
    convertFromBaseUnit,
    getTokenInfo,
    getTokenDecimals,
    getTokenSymbol,
    getTokenName
} from "./tools/erc20-operations";
