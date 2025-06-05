import { Agentix, SolanaWalletBase } from "agentix";

export function getRangerDataAPIBase(agent: Agentix<SolanaWalletBase>): string {
    if (agent.config?.rangerDataAPIBase) {
        return agent.config.rangerDataAPIBase;
    }
    return "https://data-api-staging-437363704888.asia-northeast1.run.app";
}

export function getRangerSorAPIBase(agent: Agentix<SolanaWalletBase>): string {
    if (agent.config?.rangerSorAPIBase) {
        return agent.config.rangerSorAPIBase;
    }
    return "https://staging-sor-api-437363704888.asia-northeast1.run.app";
}