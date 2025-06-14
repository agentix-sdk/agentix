import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import {
    erc1155GetBalanceAction,
    erc1155GetBatchBalanceAction,
    erc1155SafeTransferAction,
    erc1155SafeBatchTransferAction,
    erc1155SetApprovalForAllAction,
    erc1155IsApprovedForAllAction,
    erc1155GetTokenInfoAction,
} from "./actions/erc1155Actions";
import {
    getBalanceOfBySymbol,
    getBalanceOfBatchBySymbol,
    safeTransferFromERC1155,
    safeBatchTransferFromERC1155,
    setApprovalForAllERC1155,
    isApprovedForAllERC1155,
    getTokenInfoBySymbol,
    isTokenSupported,
    getSupportedTokens,
} from "./tools/erc1155";

class EvmErc1155Plugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            getBalanceOfBySymbol,
            getBalanceOfBatchBySymbol,
            safeTransferFromERC1155,
            safeBatchTransferFromERC1155,
            setApprovalForAllERC1155,
            isApprovedForAllERC1155,
            getTokenInfoBySymbol,
            isTokenSupported,
            getSupportedTokens,
        };

        const actions = [
            erc1155GetBalanceAction,
            erc1155GetBatchBalanceAction,
            erc1155SafeTransferAction,
            erc1155SafeBatchTransferAction,
            erc1155SetApprovalForAllAction,
            erc1155IsApprovedForAllAction,
            erc1155GetTokenInfoAction,
        ] as any;

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("erc1155", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default EvmErc1155Plugin;
