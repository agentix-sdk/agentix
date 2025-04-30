import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import approveMultisigProposalAction from "./actions/approveMultisigProposal";
import createMultisigAction from "./actions/createMultisig";
import createMultisigProposalAction from "./actions/createMultisigProposal";
import depositToMultisigTreasuryAction from "./actions/depositToMultisigTreasury";
import executeMultisigProposalAction from "./actions/executeMultisigProposal";
import rejectMultisigProposalAction from "./actions/rejectMultisigProposal";
import transferFromMultisigTreasuryAction from "./actions/transferFromMultisigTreasury";
import {
    create_squads_multisig,
    multisig_approve_proposal,
    multisig_create_proposal,
    multisig_deposit_to_treasury,
    multisig_execute_proposal,
    multisig_reject_proposal,
    multisig_transfer_from_treasury,
  } from "./tools";

class SquadsPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            create_squads_multisig,
            multisig_approve_proposal,
            multisig_create_proposal,
            multisig_deposit_to_treasury,
            multisig_execute_proposal,
            multisig_reject_proposal,
            multisig_transfer_from_treasury,
        };

        const actions = [
            approveMultisigProposalAction,
            createMultisigAction,
            createMultisigProposalAction,
            depositToMultisigTreasuryAction,
            executeMultisigProposalAction,
            rejectMultisigProposalAction,
            transferFromMultisigTreasuryAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("squads", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default SquadsPlugin;
