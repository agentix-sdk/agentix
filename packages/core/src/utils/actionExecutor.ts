import type { Agentix } from "../agent";
import type { Action } from "../types";
import { WalletBase } from "../agent/wallet-base";
/**
 * Execute an action with the given input
 */
export async function executeAction<W extends WalletBase>(
  action: Action<W>,
  agent: Agentix<W>,
  input: Record<string, any>,
): Promise<Record<string, any>> {
  try {
    // Validate input using Zod schema
    const validatedInput = action.schema.parse(input);

    // Execute the action with validated input
    const result = await action.handler(agent, validatedInput);

    return {
      status: "success",
      ...result,
    };
  } catch (error: any) {
    // Handle Zod validation errors specially
    if (error.errors) {
      return {
        status: "error",
        message: "Validation error",
        details: error.errors,
        code: "VALIDATION_ERROR",
      };
    }

    return {
      status: "error",
      message: error.message,
      code: error.code || "EXECUTION_ERROR",
    };
  }
}

/**
 * Get examples for an action
 */
export function getActionExamples<W extends WalletBase>(action: Action<W>): string {
  return action.examples
    .flat()
    .map((example) => {
      return `Input: ${JSON.stringify(example.input, null, 2)}
Output: ${JSON.stringify(example.output, null, 2)}
Explanation: ${example.explanation}
---`;
    })
    .join("\n");
}
