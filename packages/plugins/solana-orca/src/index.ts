import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import createOrcaSingleSidedWhirlpoolAction from "./actions/createOrcaSingleSidedWhirlpool";
import closeOrcaPositionAction from "./actions/closeOrcaPosition";
import createOrcaCLMMAction from "./actions/createOrcaCLMM";
import fetchOrcaPositionsAction from "./actions/fetchOrcaPositions";
import openOrcaCenteredPositionWithLiquidityAction from "./actions/openOrcaCenteredPositionWithLiquidity";
import openOrcaSingleSidedPositionAction from "./actions/openOrcaSingleSidedPosition";
import {
    orcaClosePosition,
    orcaCreateCLMM,
    orcaCreateSingleSidedLiquidityPool,
    orcaFetchPositions,
    orcaOpenCenteredPositionWithLiquidity,
    orcaOpenSingleSidedPosition,
} from "./tools";

class OrcaPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            orcaClosePosition,
            orcaCreateCLMM,
            orcaCreateSingleSidedLiquidityPool,
            orcaFetchPositions,
            orcaOpenCenteredPositionWithLiquidity,
            orcaOpenSingleSidedPosition,
        };

        const actions = [
            closeOrcaPositionAction,
            createOrcaCLMMAction,
            createOrcaSingleSidedWhirlpoolAction,
            fetchOrcaPositionsAction,
            openOrcaCenteredPositionWithLiquidityAction,
            openOrcaSingleSidedPositionAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("orca", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default OrcaPlugin;
