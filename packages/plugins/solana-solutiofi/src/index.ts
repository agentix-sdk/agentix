import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import burnTokensUsingSolutiofiAction from "./actions/burnTokens";
import closeAccountsUsingSolutiofiAction from "./actions/closeAccounts";
import mergeTokensUsingSolutiofiAction from "./actions/mergeTokens";
import spreadTokenUsingSolutiofiAction from "./actions/spreadToken";
import {
    burnTokens,
    closeAccounts,
    mergeTokens,
    spreadToken,
} from "./tools/solutiofi";

class SolutiofiPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            burnTokens,
            closeAccounts,
            mergeTokens,
            spreadToken,
        };

        const actions = [
            burnTokensUsingSolutiofiAction,
            closeAccountsUsingSolutiofiAction,
            mergeTokensUsingSolutiofiAction,
            spreadTokenUsingSolutiofiAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("solutiofi", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default SolutiofiPlugin;
