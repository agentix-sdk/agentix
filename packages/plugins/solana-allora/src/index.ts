import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import {
    getAllTopics,
    getInferenceByTopicId,
    getPriceInference,
  } from "./tools";
  import getAllTopicsAction from "./actions/getAllTopics";
import getInferenceByTopicIdAction from "./actions/getInferenceByTopicId";
import getPriceInferenceAction from "./actions/getPriceInference";

class AlloraPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            getAllTopics,
            getInferenceByTopicId,
            getPriceInference,
        };

        const actions = [
            getAllTopicsAction,
            getInferenceByTopicIdAction,
            getPriceInferenceAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("allora", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default AlloraPlugin;
