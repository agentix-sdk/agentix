import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import { oneInchBalanceAction } from "./actions";
import { getAggregatedBalancesAndAllowances } from "./tools";

class OneInchPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            getOneInchBalances: getAggregatedBalancesAndAllowances,
        };

        const actions = [
            oneInchBalanceAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("1inch", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default OneInchPlugin;
