import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import {
    elfaApiKeyStatusAction,
    elfaGetSmartMentionsAction,
    elfaGetTopMentionsByTickerAction,
    elfaPingAction,
    elfaSearchMentionsByKeywordsAction,
    elfaSmartTwitterAccountStats,
    elfaTrendingTokensAction,
  } from "./actions";
  import {
    getElfaAiApiKeyStatus,
    getSmartMentions,
    getSmartTwitterAccountStats,
    getTopMentionsByTicker,
    getTrendingTokensUsingElfaAi,
    pingElfaAiApi,
    searchMentionsByKeywords,
  } from "./tools/elfa_ai_api";

class ElfaAiPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            getElfaAiApiKeyStatus,
            getSmartMentions,
            getSmartTwitterAccountStats,
            getTopMentionsByTicker,
            getTrendingTokensUsingElfaAi,
            pingElfaAiApi,
            searchMentionsByKeywords,
        };

        const actions = [
            elfaApiKeyStatusAction,
            elfaGetSmartMentionsAction,
            elfaGetTopMentionsByTickerAction,
            elfaPingAction,
            elfaSearchMentionsByKeywordsAction,
            elfaSmartTwitterAccountStats,
            elfaTrendingTokensAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("elfaai", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default ElfaAiPlugin;
