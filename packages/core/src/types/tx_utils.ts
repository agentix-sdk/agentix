export interface PriorityFeeResponse {
    jsonrpc: string;
    id: string;
    method: string;
    params: Array<{
      transaction: string;
      options: { priorityLevel: string };
    }>;
}
  