import {
  SearchAssetsRpcInput,
  dasApi,
} from "@metaplex-foundation/digital-asset-standard-api";
import { Agentix } from "agentix";
import { initUmi } from "../utils";
import { SolanaWalletBase } from "agentix";
/**
 * Search for assets using the Metaplex DAS API
 * @param agent Agentix instance
 * @param params Parameters for searching assets
 * @returns List of assets matching the search criteria
 */
export async function search_assets(
  agent: Agentix<SolanaWalletBase>,
  params: SearchAssetsRpcInput,
) {
  const umi = initUmi(agent).use(dasApi());
  return await umi.rpc.searchAssets(params);
}
