import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import { avnuSwapAction } from "./actions";
import { executeTokenSwap } from "./tools";

class EvmAvnuPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            executeAvnuSwap: executeTokenSwap,
        };

        const actions = [
            avnuSwapAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("avnu", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default EvmAvnuPlugin;
