import { EvmChain, PluginBase, EvmWalletBase, SolanaWalletBase, SolanaChain } from "agentix";

import { crossmintBuyTokenAction } from "./actions/crossmintHeadlessCheckoutAction";
import { buyToken } from "./tools/crossmint_headless_checkout";

class CrossmintHeadlessCheckoutPlugin extends PluginBase<EvmWalletBase | SolanaWalletBase> {
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
            } as EvmChain,
            {
                type: "solana",
            } as SolanaChain
        ];

        super("crossmint-headless-checkout", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase | SolanaWalletBase): boolean {
        return wallet instanceof EvmWalletBase || wallet instanceof SolanaWalletBase;
    }
}

export default CrossmintHeadlessCheckoutPlugin;
