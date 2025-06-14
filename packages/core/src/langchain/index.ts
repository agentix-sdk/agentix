import { tool } from "@langchain/core/tools";
import { Agentix } from "../agent";
import { Action } from "../types";
import { transformToZodObject } from "../utils/zod";
import { WalletBase } from "../agent/wallet-base";

export function createLangchainTools<W extends WalletBase>(
  agentix: Agentix<W>,
  actions: Action<W>[],
) {
  if (actions.length > 128) {
    console.warn(
      `Too many actions provided. Only a maximum of 128 actions allowed. You provided ${actions.length}, the last ${actions.length - 128} will be ignored.`,
    );
  }

  const tools = actions.slice(0, 127).map((action) => {
    const toolInstance = tool(
      async (inputs) =>
        JSON.stringify(await action.handler(agentix, inputs)),
      {
        name: action.name,
        description: `
      ${action.description}

      Similes: ${action.similes.map(
        (simile) => `
        ${simile}
      `,
      )}

      Examples: ${action.examples.map(
        (example) => `
        Input: ${JSON.stringify(example[0].input)}
        Output: ${JSON.stringify(example[0].output)}
        Explanation: ${example[0].explanation}
      `,
      )}`,
        // convert action.schema from ZodType to ZodObject
        schema: transformToZodObject(action.schema),
      },
    );

    return toolInstance;
  });

  return tools;
}
