import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

import {
    buyCurvesToken,
    getBuyPrice,
    sellCurvesToken,
    getSellPrice,
    getCurvesERC20,
    getCurvesBalance,
    withdrawCurves,
    depositCurves,
    mintCurvesERC20
} from "./tools/curves";

import {
    buyCurvesTokenAction,
    getBuyPriceAction,
    sellCurvesTokenAction,
    getSellPriceAction,
    getCurvesERC20Action,
    getCurvesBalanceAction,
    withdrawCurvesAction,
    depositCurvesAction,
    mintCurvesERC20Action
} from "./actions";

class CurvesPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            buyCurvesToken,
            getBuyPrice,
            sellCurvesToken,
            getSellPrice,
            getCurvesERC20,
            getCurvesBalance,
            withdrawCurves,
            depositCurves,
            mintCurvesERC20
        };

        const actions = [
            buyCurvesTokenAction,
            getBuyPriceAction,
            sellCurvesTokenAction,
            getSellPriceAction,
            getCurvesERC20Action,
            getCurvesBalanceAction,
            withdrawCurvesAction,
            depositCurvesAction,
            mintCurvesERC20Action
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("curves", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default CurvesPlugin;
