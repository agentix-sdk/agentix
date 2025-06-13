import { StarknetChain, PluginBase, StarknetWalletBase } from "agentix";
import { avnuSwapAction } from "./actions";
import { executeTokenSwap } from "./tools";

class StarknetAvnuPlugin extends PluginBase<StarknetWalletBase> {
    constructor() {
        const methods = {
            executeAvnuSwap: executeTokenSwap,
        };

        const actions = [
            avnuSwapAction,
        ];

        const supportedChains = [
            {
                type: "starknet",
            } as StarknetChain
        ];

        super("avnu", methods, actions, supportedChains);
    }

    supportsWallet(wallet: StarknetWalletBase): boolean {
        return wallet instanceof StarknetWalletBase;
    }
}

export default StarknetAvnuPlugin;
