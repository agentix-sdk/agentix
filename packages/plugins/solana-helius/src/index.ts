import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import createWebhookAction from "./actions/createWebhook";
import deleteWebhookAction from "./actions/deleteWebhook";
import getAssetsByOwnerAction from "./actions/getAssetsbyOwner";
import getWebhookAction from "./actions/getWebhook";
import parseSolanaTransactionAction from "./actions/parseTransaction";
import sendTransactionWithPriorityFeeAction from "./actions/sendTransactionWithPriority";
import {
    create_HeliusWebhook,
    deleteHeliusWebhook,
    getAssetsByOwner,
    getHeliusWebhook,
    parseTransaction,
    sendTransactionWithPriorityFee,
  } from "./tools";

class HeliusPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            create_HeliusWebhook,
            deleteHeliusWebhook,
            getAssetsByOwner,
            getHeliusWebhook,
            parseTransaction,
            sendTransactionWithPriorityFee,
        };

        const actions = [
            createWebhookAction,
            deleteWebhookAction,
            getAssetsByOwnerAction,
            getWebhookAction,
            parseSolanaTransactionAction,
            sendTransactionWithPriorityFeeAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("helius", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default HeliusPlugin;
