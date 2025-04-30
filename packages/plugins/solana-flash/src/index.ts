import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import flashCloseTradeAction from "./actions/flashCloseTrade";
import flashOpenTradeAction from "./actions/flashOpenTrade";
import { flashCloseTrade, flashOpenTrade } from "./tools";

class FlashPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            flashCloseTrade,
            flashOpenTrade,
        };

        const actions = [
            flashCloseTradeAction,
            flashOpenTradeAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("flash", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default FlashPlugin;
