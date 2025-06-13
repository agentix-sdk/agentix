import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import { balmyExecuteSwapAction, balmyGetQuoteAction } from "./actions";
import { executeSwap, getQuote } from "./tools";

class BalmyPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            getBalmyQuote: getQuote,
            executeBalmySwap: executeSwap
        };

        const actions = [
            balmyGetQuoteAction,
            balmyExecuteSwapAction
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("balmy", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default BalmyPlugin;
