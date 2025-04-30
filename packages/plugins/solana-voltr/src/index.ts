import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import depositVoltrStrategyAction from "./actions/depositStrategy";
import getVoltrPositionValuesAction from "./actions/getPositionValues";
import withdrawVoltrStrategyAction from "./actions/withdrawStrategy";

import {
    voltrDepositStrategy,
    voltrGetPositionValues,
    voltrWithdrawStrategy,
  } from "./tools";

class VoltrPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            voltrDepositStrategy,
            voltrGetPositionValues,
            voltrWithdrawStrategy,
        };

        const actions = [
            depositVoltrStrategyAction,
            getVoltrPositionValuesAction,
            withdrawVoltrStrategyAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("voltr", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default VoltrPlugin;
