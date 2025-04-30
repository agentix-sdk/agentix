import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import getAllRegisteredAllDomainsAction from "./actions/getAllRegisteredAllDomains";
import getMainAllDomainsDomainAction from "./actions/getMainAllDomainsDomain";
import getPrimaryDomainAction from "./actions/getPrimaryDomain";
import registerDomainAction from "./actions/registerDomain";
import resolveSolDomainAction from "./actions/resolveSolDomain";
import {
    getAllRegisteredAllDomains,
    getMainAllDomainsDomain,
    getPrimaryDomain,
    registerDomain,
    resolveSolDomain,
  } from "./tools";

class SNSPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            getAllRegisteredAllDomains,
            getMainAllDomainsDomain,
            getPrimaryDomain,
            registerDomain,
            resolveSolDomain,
        };

        const actions = [
            getAllRegisteredAllDomainsAction,
            getMainAllDomainsDomainAction,
            getPrimaryDomainAction,
            registerDomainAction,
            resolveSolDomainAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("sns", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default SNSPlugin;
