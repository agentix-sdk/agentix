import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import { cancelListing, listNFTForSale } from "./tools/tensor_trade";
import {
    cancelNFTListingAction,
    listNFTForSaleAction,
  } from "./actions/tensorTrade";

class TensorPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            cancelListing,
            listNFTForSale,
        };

        const actions = [
            cancelNFTListingAction,
            listNFTForSaleAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("tensor", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default TensorPlugin;
