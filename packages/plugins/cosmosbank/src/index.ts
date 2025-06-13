import { CosmosChain, PluginBase } from "agentix";

// Import tools
import * as cosmosBankTools from "./tools/cosmosbank";

// Import actions
import {
    getTokenBalanceAction,
    getDenomMetadataAction,
    getSupplyOfAction,
    sendTokenAction
} from "./actions/cosmosbank";

/**
 * Cosmos Bank plugin for interacting with the Cosmos Bank module
 */
class CosmosBankPlugin extends PluginBase<any> {
    constructor() {
        // Register methods for tool access
        const methods: Record<string, Function> = {
            getTokenBalance: cosmosBankTools.getTokenBalance,
            getDenomMetadata: cosmosBankTools.getDenomMetadata,
            getSupplyOf: cosmosBankTools.getSupplyOf,
            sendToken: cosmosBankTools.sendToken
        };

        // Register actions
        const actions = [
            getTokenBalanceAction,
            getDenomMetadataAction,
            getSupplyOfAction,
            sendTokenAction
        ];

        // This plugin supports Cosmos chains only
        const supportedChains = [
            {
                type: "cosmos",
            } as CosmosChain
        ];

        super("cosmosbank", methods, actions, supportedChains);
    }

    supportsWallet(wallet: any): boolean {
        // Check if the wallet is a Cosmos wallet
        return wallet.getChainId !== undefined;
    }
}

/**
 * Create a new Cosmos Bank plugin instance
 */
export function cosmosbank() {
    return new CosmosBankPlugin();
}

export default cosmosbank;

