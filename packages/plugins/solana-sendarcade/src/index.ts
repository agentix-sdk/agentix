import { PluginBase, SolanaChain, SolanaWalletBase } from "agentix";
import rockPaperScissorAction from "./actions/rockPaperScissors";
import { rock_paper_scissor } from "./tools";

class SendArcadePlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            rock_paper_scissor,
        };

        const actions = [
            rockPaperScissorAction,
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

export default SendArcadePlugin;
