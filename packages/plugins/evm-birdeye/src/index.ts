import { EvmChain, PluginBase, EvmWalletBase, SolanaWalletBase } from "agentix";

class EvmBirdeyePlugin extends PluginBase<EvmWalletBase | SolanaWalletBase> {
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

        super("birdeye", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase | SolanaWalletBase): boolean {
        return wallet instanceof EvmWalletBase || wallet instanceof SolanaWalletBase;
    }
}

export default EvmBirdeyePlugin;
