import { PluginBase, EvmWalletBase, EvmChain } from "agentix";
import {
    erc721GetBalanceAction,
    erc721TransferAction,
    erc721GetTotalSupplyAction,
    erc721ApproveAction,
    erc721TransferFromAction,
    erc721GetOwnerAction,
} from "./actions/erc721Actions";
import { 
    getBalanceOfBySymbol,
    transferERC721,
    getTotalSupplyBySymbol,
    approveERC721,
    transferFromERC721,
    getOwnerOfBySymbol,
} from "./tools/erc721";

export class ERC721Plugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            getBalanceOfBySymbol,
            transferERC721,
            getTotalSupplyBySymbol,
            approveERC721,
            transferFromERC721,
            getOwnerOfBySymbol,
        };

        const actions = [
            erc721GetBalanceAction,
            erc721TransferAction,
            erc721GetTotalSupplyAction,
            erc721ApproveAction,
            erc721TransferFromAction,
            erc721GetOwnerAction,
        ];

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("erc721", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default ERC721Plugin;
