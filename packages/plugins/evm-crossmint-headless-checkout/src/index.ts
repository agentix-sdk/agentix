import { EvmChain, PluginBase, EvmWalletBase, SolanaWalletBase } from "agentix";

import { crossmintBuyTokenAction } from "./actions/crossmintHeadlessCheckoutAction";
import { buyToken } from "./tools/crossmint_headless_checkout";

class EvmCrossmintHeadlessCheckoutPlugin extends PluginBase<EvmWalletBase | SolanaWalletBase> {
    constructor() {
        const methods = {
            crossmintBuyToken: buyToken,
        };

        const actions = [
            crossmintBuyTokenAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("crossmint-headless-checkout", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase | SolanaWalletBase): boolean {
        return wallet instanceof EvmWalletBase || wallet instanceof SolanaWalletBase;
    }
}

export default EvmCrossmintHeadlessCheckoutPlugin;
