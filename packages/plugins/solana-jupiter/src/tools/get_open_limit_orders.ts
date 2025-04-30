import type { Agentix, SolanaWalletBase } from "agentix";
import { getOpenOrdersApi } from "./common/jupiterLimitApi";

export async function getOpenLimitOrders(agent: Agentix<SolanaWalletBase>) {
  try {
    const orders = await getOpenOrdersApi(agent.wallet.getAddress());
    return { orders, success: true };
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching open orders: ${error}`);
  }
}
