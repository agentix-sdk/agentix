import { EvmChain, PluginBase, EvmWalletBase } from "agentix";

import { 
    debridgeBridgeAction, 
    debridgeGetQuoteAction, 
    debridgeGetTokenInfoAction, 
    debridgeGetSupportedChainsAction, 
    debridgeCheckStatusAction 
} from "./actions/debridgeActions";

import { 
    getBridgeQuote, 
    createBridgeOrder, 
    executeBridgeTransaction, 
    getTokenInfo, 
    getSupportedChains, 
    checkTransactionStatus 
} from "./tools/debridge_bridge";

class DebridgePlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            debridgeGetBridgeQuote: getBridgeQuote,
            debridgeCreateBridgeOrder: createBridgeOrder,
            debridgeExecuteBridgeTransaction: executeBridgeTransaction,
            debridgeGetTokenInfo: getTokenInfo,
            debridgeGetSupportedChains: getSupportedChains,
            debridgeCheckTransactionStatus: checkTransactionStatus,
        };

        const actions = [
            debridgeBridgeAction,
            debridgeGetQuoteAction,
            debridgeGetTokenInfoAction,
            debridgeGetSupportedChainsAction,
            debridgeCheckStatusAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("debridge", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default DebridgePlugin;
