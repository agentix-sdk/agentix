import { EvmChain, PluginBase, WalletBase } from "agentix";

class Evm1InchPlugin extends PluginBase<WalletBase> {
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

        super("1inch", methods, actions, supportedChains);
    }

    supportsWallet(wallet: WalletBase): boolean {
        return wallet instanceof WalletBase;
    }
}

export default Evm1InchPlugin;
