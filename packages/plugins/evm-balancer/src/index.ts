import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import { arbitrum, avalanche, base, gnosis, mode, optimism, polygon, polygonZkEvm, fraxtal } from "viem/chains";
import { addLiquidityAction, balancerSwapAction, removeLiquidityAction } from "./actions";
import { addLiquidity, removeLiquidity, swapOnBalancer } from "./tools";

// Define supported chains
const SUPPORTED_CHAINS = [mode, base, polygon, gnosis, arbitrum, avalanche, optimism, polygonZkEvm, fraxtal];

class EvmBalancerPlugin extends PluginBase<EvmWalletBase> {
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

        const supportedChains = SUPPORTED_CHAINS.map(chain => ({
            type: "evm" as const,
            id: chain.id
        }));

        super("balancer", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default EvmBalancerPlugin;
