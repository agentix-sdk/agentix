import { type Agentix, signOrSendTX, SolanaWalletBase } from "agentix";
import type { CancelJupiterOrderRequest } from "../types";
import { cancelOrdersApi } from "./common/jupiterLimitApi";
import { deserializeTransaction } from "./common/transactions";

export async function cancelLimitOrders(
  agent: Agentix<SolanaWalletBase>,
  params: CancelJupiterOrderRequest,
) {
  params.maker = agent.wallet.getAddress();
  try {
    const data = await cancelOrdersApi(params);
    const transactions = data.txs.map((tx: string) =>
      deserializeTransaction(tx),
    );

    const signatures = await signOrSendTX(agent, transactions);

    return {
      signatures,
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error canceling limit orders: ${error}`);
  }
}
