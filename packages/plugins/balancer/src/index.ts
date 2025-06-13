import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import { addLiquidityAction, balancerSwapAction, removeLiquidityAction } from "./actions";
import { addLiquidity, removeLiquidity, swapOnBalancer } from "./tools";

class BalancerPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            balancerSwap: swapOnBalancer,
            balancerAddLiquidity: addLiquidity,
            balancerRemoveLiquidity: removeLiquidity
        };

        const actions = [
            balancerSwapAction,
            addLiquidityAction,
            removeLiquidityAction
        ];

        const supportedChains: EvmChain[] = [
            { type: 'evm', id: 1 }, // ethereum
            { type: 'evm', id: 42161 }, // arbitrum
            { type: 'evm', id: 43114 }, // avalanche
            { type: 'evm', id: 8453 }, // base
            { type: 'evm', id: 81457 }, // blast
            { type: 'evm', id: 56 }, // bsc
            { type: 'evm', id: 59144 }, // linea
            { type: 'evm', id: 5000 }, // mantle
            { type: 'evm', id: 34443 }, // mode
            { type: 'evm', id: 10 }, // optimism
            { type: 'evm', id: 137 }, // polygon
            { type: 'evm', id: 534352 }, // scroll
            { type: 'evm', id: 480 }, // worldcoin
        ];

        super("balancer", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default BalancerPlugin;
