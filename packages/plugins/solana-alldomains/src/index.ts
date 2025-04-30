import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import getAllDomainsTLDsAction from "./actions/getAllDomainsTLDs";
import getOwnedAllDomainsAction from "./actions/getOwnedAllDomains";
import getOwnedDomainsForTLDAction from "./actions/getOwnedDomainsForTLD";
import resolveDomainAction from "./actions/resolveDomain";
import {
    getAllDomainsTLDs,
    getOwnedAllDomains,
    getOwnedDomainsForTLD,
    resolveAllDomains,
  } from "./tools";

class AllDomainsPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            getAllDomainsTLDs,
            getOwnedAllDomains,
            getOwnedDomainsForTLD,
            resolveAllDomains,
        };

        const actions = [
            getAllDomainsTLDsAction,
            getOwnedAllDomainsAction,
            getOwnedDomainsForTLDAction,
            resolveDomainAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("alldomains", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default AllDomainsPlugin;
