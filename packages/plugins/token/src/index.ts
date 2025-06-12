import { EvmChain, PluginBase, WalletBase } from "agentix";


class TokenPlugin extends PluginBase<WalletBase> {
    constructor() {
        const methods = {};

        const actions = [] as any;

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("token", methods, actions, supportedChains);
    }

    supportsWallet(wallet: WalletBase): boolean {
        return true;
    }
}

export default TokenPlugin;
