import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import { alloraPricePredictionAction } from "./actions";
import { getPricePrediction } from "./tools";

class EvmAlloraPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            getAlloraPricePrediction: getPricePrediction,
        };

        const actions = [
            alloraPricePredictionAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("allora", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default EvmAlloraPlugin;
