import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

import { zeroExTokenSwapAction, zeroExTokenPriceAction } from "./actions/zeroExTokenSwapAction";

import { getPrice, swap } from "./tools/zero_ex_token_swap";

class ZeroExPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            getZeroExTokenPrice: getPrice,
            zeroExTokenSwap: swap,
        };

        const actions = [
            zeroExTokenSwapAction,
            zeroExTokenPriceAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("0x", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default ZeroExPlugin;
