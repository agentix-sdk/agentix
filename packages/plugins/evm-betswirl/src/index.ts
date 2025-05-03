import { EvmChain, PluginBase, WalletBase } from "agentix";

class EvmBetswirlPlugin extends PluginBase<WalletBase> {
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

        super("betswirl", methods, actions, supportedChains);
    }

    supportsWallet(wallet: WalletBase): boolean {
        return wallet instanceof WalletBase;
    }
}

export default EvmBetswirlPlugin;
