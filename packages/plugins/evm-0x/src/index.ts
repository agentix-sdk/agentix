import { EvmChain, PluginBase, WalletBase } from "agentix";

class Evm0xPlugin extends PluginBase<WalletBase> {
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

        super("0x", methods, actions, supportedChains);
    }

    supportsWallet(wallet: WalletBase): boolean {
        return wallet instanceof WalletBase;
    }
}

export default Evm0xPlugin;
