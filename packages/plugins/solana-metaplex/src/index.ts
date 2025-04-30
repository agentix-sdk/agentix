import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import deployCollectionAction from "./actions/deployCollection";
import deployTokenAction from "./actions/deployToken";
import deployToken2022Action from "./actions/deployToken2022";
import getAssetAction from "./actions/getAsset";
import getAssetsByAuthorityAction from "./actions/getAssetsByAuthority";
import getAssetsByCreatorAction from "./actions/getAssetsByCreator";
import mintNFTAction from "./actions/mintNFT";
import searchAssetsAction from "./actions/searchAssets";
import {
    deploy_collection,
    deploy_token,
    deploy_token2022,
    get_asset,
    get_assets_by_authority,
    get_assets_by_creator,
    mintCollectionNFT,
  } from "./tools";
  import { search_assets } from "./tools/search_assets";

class MetaplexPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            deploy_collection,
            deploy_token,
            deploy_token2022,
            get_asset,
            get_assets_by_authority,
            get_assets_by_creator,
            mintCollectionNFT,
            search_assets,
        };

        const actions = [
            deployCollectionAction,
            deployTokenAction,
            deployToken2022Action,
            getAssetAction,
            getAssetsByAuthorityAction,
            getAssetsByCreatorAction,
            mintNFTAction,
            searchAssetsAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("metaplex", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default MetaplexPlugin;
