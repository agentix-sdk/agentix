import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

import { ensoRouteAction } from "./actions/ensoActions";
import { route } from "./tools/enso";

class EnsoPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            ensoRoute: route,
        };

        const actions = [
            ensoRouteAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("enso", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default EnsoPlugin;
