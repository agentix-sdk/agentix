import { signOrSendTX } from "agentix";
import type { Agentix, SolanaWalletBase } from "agentix";
import type { CreateJupiterOrderRequest } from "../types";
import { createOrderApi } from "./common/jupiterLimitApi";
import { deserializeTransaction } from "./common/transactions";

export async function createLimitOrder(
  agent: Agentix<SolanaWalletBase>,
  params: CreateJupiterOrderRequest,
) {
  const wallet = agent.wallet.getAddress();
  params.maker = params.payer = wallet;

  try {
    const data = await createOrderApi(params);
    const transaction = deserializeTransaction(data.tx);
    const signature = await signOrSendTX(agent, transaction);

    return {
      signature,
      order: data.order,
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error creating limit order: ${error}`);
  }
}
