import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import cancelAllOrdersAction from "./actions/cancelAllOrders";
import limitOrderAction from "./actions/limitOrder";
import manifestCreateMarketAction from "./actions/manifestCreateMarket";
import withdrawAllAction from "./actions/withdrawAll";
import {
  cancelAllOrders,
  limitOrder,
  manifestCreateMarket,
  withdrawAll,
} from "./tools";

class ManifestPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            cancelAllOrders,
            limitOrder,
            manifestCreateMarket,
            withdrawAll,
        };

        const actions = [
            cancelAllOrdersAction,
            limitOrderAction,
            manifestCreateMarketAction,
            withdrawAllAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("manifest", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default ManifestPlugin;
