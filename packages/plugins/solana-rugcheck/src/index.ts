import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import rugcheckAction from "./actions/rugcheck";
import { fetchTokenDetailedReport, fetchTokenReportSummary } from "./tools";

class RugcheckPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            fetchTokenDetailedReport,
            fetchTokenReportSummary,
        };

        const actions = [
            rugcheckAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("rugcheck", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default RugcheckPlugin;
