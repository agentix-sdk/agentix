import { EvmChain, PluginBase, WalletBase } from "agentix";

class EvmEnsPlugin extends PluginBase<WalletBase> {
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

        super("ens", methods, actions, supportedChains);
    }

    supportsWallet(wallet: WalletBase): boolean {
        return wallet instanceof WalletBase;
    }
}

export default EvmEnsPlugin;
