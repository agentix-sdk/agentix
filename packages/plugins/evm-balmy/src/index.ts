import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

class EvmBalmyPlugin extends PluginBase<EvmWalletBase> {
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

        super("balmy", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default EvmBalmyPlugin;
