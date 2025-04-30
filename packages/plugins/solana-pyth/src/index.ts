import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import pythFetchPriceAction from "./actions/pythFetchPrice";
import { fetchPythPrice, fetchPythPriceFeedID } from "./tools";

class PythPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            fetchPythPrice,
            fetchPythPriceFeedID,
        };

        const actions = [
            pythFetchPriceAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("pyth", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default PythPlugin;
