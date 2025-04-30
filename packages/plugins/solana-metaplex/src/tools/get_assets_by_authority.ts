import {
  GetAssetsByAuthorityRpcInput,
  dasApi,
} from "@metaplex-foundation/digital-asset-standard-api";
import { Agentix } from "agentix";
import { initUmi } from "../utils";
import { SolanaWalletBase } from "agentix";
/**
 * Fetch assets by authority using the Metaplex DAS API
 * @param agent Agentix instance
 * @param params Parameters for fetching assets by authority
 * @returns List of assets associated with the given authority
 */
export async function get_assets_by_authority(
  agent: Agentix<SolanaWalletBase>,
  params: GetAssetsByAuthorityRpcInput,
) {
  const umi = initUmi(agent).use(dasApi());
  return await umi.rpc.getAssetsByAuthority(params);
}
