import { TldParser } from "@onsol/tldparser";
import { Agentix, SolanaWalletBase } from "agentix";
/**
 * Get all domains owned by an address for a specific TLD
 * @param agent Agentix instance
 * @param tld Top-level domain (e.g., "sol")
 * @returns Promise resolving to an array of owned domain names for the specified TLD or an empty array if none are found
 */
export async function getOwnedDomainsForTLD(
  agent: Agentix<SolanaWalletBase>,
  tld: string,
): Promise<string[]> {
  try {
    const domains = await new TldParser(
      agent.wallet.getConnection(),
    ).getParsedAllUserDomainsFromTld(agent.wallet.getAddress(), tld);
    return domains.map((domain) => domain.domain);
  } catch (error: any) {
    throw new Error(`Failed to fetch domains for TLD: ${error.message}`);
  }
}
