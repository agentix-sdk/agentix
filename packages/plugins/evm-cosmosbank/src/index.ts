import { EvmChain, PluginBase, WalletBase } from "agentix";

class EvmCosmosbankPlugin extends PluginBase<WalletBase> {
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

        super("cosmosbank", methods, actions, supportedChains);
    }

    supportsWallet(wallet: WalletBase): boolean {
        return wallet instanceof WalletBase;
    }
}

export default EvmCosmosbankPlugin;
