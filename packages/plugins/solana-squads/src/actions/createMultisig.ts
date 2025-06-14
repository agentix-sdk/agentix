import { PublicKey } from "@solana/web3.js";
import { Action, SolanaWalletBase } from "agentix";
import { z } from "zod";
import { create_squads_multisig } from "../tools";

const createMultisigAction: Action<SolanaWalletBase> = {
  name: "CREATE_MULTISIG_ACTION",
  similes: [
    "create multisig",
    "create squads multisig",
    "create 2-by-2 multisig",
    "create 2-of-2 multisig",
    "create 2-of-2 multisig account",
    "create 2-of-2 multisig account on Solana",
  ],
  description: `Create a 2-of-2 multisig account on Solana using Squads with the user and the agent, where both approvals will be required to run the transactions.

  Note: For one AI agent, only one 2-by-2 multisig can be created as it is pair-wise.`,
  examples: [
    [
      {
        input: {
          creator: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
        },
        output: {
          status: "success",
          message: "2-by-2 multisig account created successfully",
          signature: "4xKpN2...",
        },
        explanation: "Create a 2-of-2 multisig account on Solana",
      },
    ],
  ],
  schema: z.object({
    creator: z.string(),
  }),
  handler: async (agent, input: Record<string, any>) => {
    const multisig = await create_squads_multisig(
      agent,
      new PublicKey(input.creator as string),
    );

    return {
      status: "success",
      message: "2-by-2 multisig account created successfully",
      transaction: multisig,
    };
  },
};

export default createMultisigAction;
