import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import {
    closePerpTradeLongAction,
    closePerpTradeShortAction,
    openPerpTradeLongAction,
    openPerpTradeShortAction,
} from "./actions/adrenaPerpTrading";
import {
    closePerpTradeLong,
    closePerpTradeShort,
    openPerpTradeLong,
    openPerpTradeShort,
} from "./tools/adrena_perp_trading";

class AdrenaPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            openPerpTradeLong,
            openPerpTradeShort,
            closePerpTradeLong,
            closePerpTradeShort,
        };

        const actions = [
            openPerpTradeLongAction,
            openPerpTradeShortAction,
            closePerpTradeLongAction,
            closePerpTradeShortAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("adrena", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default AdrenaPlugin;
