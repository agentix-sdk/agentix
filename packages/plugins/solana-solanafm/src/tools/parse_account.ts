import {
  ParserType,
  SolanaFMParser,
  checkIfAccountParser,
} from "@solanafm/explorer-kit";
import { type IdlItem, getProgramIdl } from "@solanafm/explorer-kit-idls";
import type { AccountParserResponse } from "../types";

/**
 * Parse a Solana account data
 * @param program_id Solana program ID
 * @param account_data Solana account data
 * @returns Object containing the program name, account data layout, parsed account data
 */

export async function parse_account(
  program_id: string,
  account_data: string,
): Promise<AccountParserResponse> {
  try {
    const idl: IdlItem | null = await getProgramIdl(program_id);

    if (!idl) {
      throw new Error(`Error fetching IDL for program ${program_id}`);
    }

    const accountParser = new SolanaFMParser(idl, program_id).createParser(
      ParserType.ACCOUNT,
    );

    if (!accountParser || !checkIfAccountParser(accountParser)) {
      throw new Error(
        `Error creating account parser for program ${program_id}`,
      );
    }

    const layout = accountParser.accountLayouts;
    let layouts: any[] = [];

    if (layout instanceof Map) {
      layout.forEach((value) => {
        layouts.push({
          name: value.instructionName,
          serializer: {
            account: value.serializer?.description,
            deserialize: value.serializer?.deserialize,
            fixedSize: value.serializer?.fixedSize,
            maxSize: value.serializer?.maxSize,
            serialize: value.serializer?.serialize,
          },
        });
      });
    }

    return {
      name: accountParser.getProgramName(),
      layout: null,
      data: accountParser.parseAccount(account_data),
    } as any;
  } catch (error) {
    throw new Error(`Error failed to parse account: ${error}`);
  }
}
