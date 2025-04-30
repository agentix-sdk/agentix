import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";


import checkDebridgeTransactionStatusAction from "./actions/checkTransactionStatus";
import createDebridgeBridgeOrderAction from "./actions/createBridgeOrder";
import executeDebridgeBridgeOrderAction from "./actions/executeBridgeOrder";
import getDebridgeSupportedChainsAction from "./actions/getSupportedChains";
import getDebridgeTokensInfoAction from "./actions/getTokensInfo";
import {
  checkDebridgeTransactionStatus,
  createDebridgeBridgeOrder,
  executeDebridgeBridgeOrder,
  getBridgeQuote,
  getDebridgeSupportedChains,
  getDebridgeTokensInfo,
} from "./tools";

class DebridgePlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            checkDebridgeTransactionStatus,
            createDebridgeBridgeOrder,
            executeDebridgeBridgeOrder,
            getBridgeQuote,
            getDebridgeSupportedChains,
            getDebridgeTokensInfo,
        };

        const actions = [
            checkDebridgeTransactionStatusAction,
            createDebridgeBridgeOrderAction,
            executeDebridgeBridgeOrderAction,
            getDebridgeSupportedChainsAction,
            getDebridgeTokensInfoAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("debridge", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default DebridgePlugin;
