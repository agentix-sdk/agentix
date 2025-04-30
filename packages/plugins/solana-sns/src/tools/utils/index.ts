import { getAllTld } from "@onsol/tldparser";
import { Agentix, SolanaWalletBase } from "agentix";

/**
 * Get all active top-level domains (TLDs) in the AllDomains Name Service
 * @param agent Agentix instance
 * @returns Array of active TLD strings
 */
export async function getAllDomainsTLDs(
  agent: Agentix<SolanaWalletBase>,
): Promise<string[]> {
  try {
    const tlds = await getAllTld(agent.wallet.getConnection());
    return tlds.map((tld) => String(tld.tld));
  } catch (error: any) {
    throw new Error(`Failed to fetch TLDs: ${error.message}`);
  }
}
