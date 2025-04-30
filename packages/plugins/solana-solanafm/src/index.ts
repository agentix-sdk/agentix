import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import parseAccountAction from "./actions/parseAccount";
import parseInstructionAction from "./actions/parseInstruction";
import {
    parse_account as parseAccountUsingSolanaFM,
    parse_instruction as parseInstructionUsingSolanaFM,
} from "./tools";

class SolanaFMPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            parseAccountUsingSolanaFM,
            parseInstructionUsingSolanaFM,
        };

        const actions = [
            parseAccountAction,
            parseInstructionAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("solanafm", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default SolanaFMPlugin;
