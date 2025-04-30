import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";
import {
    sanctumAddLiquidityAction,
    sanctumGetLSTAPYAction,
    sanctumGetLSTPriceAction,
    sanctumGetLSTTVLAction,
    sanctumGetOwnedLSTAction,
    sanctumRemoveLiquidityAction,
    sanctumSwapLSTAction,
} from "./actions";

import {
    sanctumAddLiquidity,
    sanctumGetLSTAPY,
    sanctumGetLSTPrice,
    sanctumGetLSTTVL,
    sanctumGetOwnedLST,
    sanctumRemoveLiquidity,
    sanctumSwapLST,
} from "./tools";

class SanctumPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            sanctumAddLiquidity,
            sanctumGetLSTAPY,
            sanctumGetLSTPrice,
            sanctumGetLSTTVL,
            sanctumGetOwnedLST,
            sanctumRemoveLiquidity,
            sanctumSwapLST,
        };

        const actions = [
            sanctumAddLiquidityAction,
            sanctumGetLSTAPYAction,
            sanctumGetLSTPriceAction,
            sanctumGetLSTTVLAction,
            sanctumGetOwnedLSTAction,
            sanctumRemoveLiquidityAction,
            sanctumSwapLSTAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("sanctum", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default SanctumPlugin;
