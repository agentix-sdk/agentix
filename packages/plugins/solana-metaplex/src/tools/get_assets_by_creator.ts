import {
  GetAssetsByCreatorRpcInput,
  dasApi,
} from "@metaplex-foundation/digital-asset-standard-api";
import { Agentix } from "agentix";
import { initUmi } from "../utils";
import { SolanaWalletBase } from "agentix";
/**
 * Fetch assets by creator using the Metaplex DAS API
 * @param agent Agentix instance
 * @param params Parameters for fetching assets by creator
 * @returns List of assets created by the specified creator
 */
export async function get_assets_by_creator(
  agent: Agentix<SolanaWalletBase>,
  params: GetAssetsByCreatorRpcInput,
) {
  const umi = initUmi(agent).use(dasApi());
  return await umi.rpc.getAssetsByCreator(params);
}
