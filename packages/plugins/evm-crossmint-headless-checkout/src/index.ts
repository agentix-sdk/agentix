import { EvmChain, PluginBase, WalletBase } from "agentix";

class EvmCrossmintHeadlessCheckoutPlugin extends PluginBase<WalletBase> {
    constructor() {
        const methods = {
        };

        const actions = [
        ] as any;

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("crossmint-headless-checkout", methods, actions, supportedChains);
    }

    supportsWallet(wallet: WalletBase): boolean {
        return wallet instanceof WalletBase;
    }
}

export default EvmCrossmintHeadlessCheckoutPlugin;
