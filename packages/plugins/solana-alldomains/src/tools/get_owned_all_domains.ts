import { TldParser } from "@onsol/tldparser";
import { PublicKey } from "@solana/web3.js";
import { Agentix, SolanaWalletBase } from "agentix";

/**
 * Get all domains owned domains for a specific TLD for the agent's wallet
 * @param agent Agentix instance
 * @param owner - PublicKey of the owner
 * @returns Promise resolving to an array of owned domains or an empty array if none are found
 */
export async function getOwnedAllDomains(
  agent: Agentix<SolanaWalletBase>,
  owner: PublicKey,
): Promise<string[]> {
  try {
    const domains = await new TldParser(
      agent.wallet.getConnection(),
    ).getParsedAllUserDomains(owner);
    return domains.map((domain) => domain.domain);
  } catch (error: any) {
    throw new Error(`Failed to fetch owned domains: ${error.message}`);
  }
}
