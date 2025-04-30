import { TldParser } from "@onsol/tldparser";
import { PublicKey } from "@solana/web3.js";
import { Agentix, SolanaWalletBase } from "agentix";

/**
 * Resolve all domains for a given agent and domain
 * @param agent Agentix instance
 * @param domain Domain name to resolve
 * @returns Promise resolving to the domain or undefined if not found
 */
export async function resolveAllDomains(
  agent: Agentix<SolanaWalletBase>,
  domain: string,
): Promise<PublicKey | undefined> {
  try {
    const tld = await new TldParser(agent.wallet.getConnection()).getOwnerFromDomainTld(
      domain,
    );
    return tld;
  } catch (error: any) {
    if (
      error.message.includes(
        "Cannot read properties of undefined (reading 'owner')",
      )
    ) {
      return undefined;
    }
    throw new Error(`Domain resolution failed: ${error.message}`);
  }
}
