import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import lendAssetAction from "./actions/lendAsset";
import luloLendAction from "./actions/luloLend";
import luloWithdrawAction from "./actions/luloWithdraw";
import { lendAsset, luloLend, luloWithdraw } from "./tools";

class LuloPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            lendAsset,
            luloLend,
            luloWithdraw,
        };

        const actions = [
            lendAssetAction,
            luloLendAction,
            luloWithdrawAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("lulo", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default LuloPlugin;
