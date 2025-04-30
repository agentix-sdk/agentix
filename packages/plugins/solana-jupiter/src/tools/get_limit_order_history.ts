import type { Agentix, SolanaWalletBase } from "agentix";
import { getOrderHistoryApi } from "./common/jupiterLimitApi";

export async function getLimitOrderHistory(agent: Agentix<SolanaWalletBase>) {
  try {
    const history = await getOrderHistoryApi(agent.wallet.getAddress());
    return { history, success: true };
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching order history: ${error}`);
  }
}
