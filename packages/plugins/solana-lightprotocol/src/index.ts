import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import compressedAirdropAction from "./actions/compressedAirdrop";
import { sendCompressedAirdrop } from "./tools";

class LightProtocolPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            sendCompressedAirdrop,
        };

        const actions = [
            compressedAirdropAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("lightprotocol", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default LightProtocolPlugin;
