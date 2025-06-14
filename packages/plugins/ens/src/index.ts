import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

import { ensGetAddressAction } from "./actions/ensActions";
import { getAddressFromEns } from "./tools/ens";

class EnsPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            ensGetAddressFromEns: getAddressFromEns,
        };

        const actions = [
            ensGetAddressAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("ens", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default EnsPlugin;
