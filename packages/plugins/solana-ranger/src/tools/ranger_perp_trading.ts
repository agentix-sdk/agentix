import type { Agentix, SolanaWalletBase } from "agentix";
import { signOrSendTX } from "agentix";
import { VersionedTransaction } from "@solana/web3.js";
import base64js from "base64-js";
import { getRangerSorAPIBase } from "../utils";

/**
 * Open perp trade on Ranger (uses SOR API)
 */
export async function openPerpTradeRanger({
  agent,
  symbol,
  side,
  size,
  collateral,
  apiKey,
  ...rest
}: {
  agent: Agentix<SolanaWalletBase>;
  symbol: string;
  side: "Long" | "Short";
  size: number;
  collateral: number;
  apiKey: string;
  [key: string]: any;
}) {
  const body = {
    fee_payer: agent.wallet.getAddress(),
    symbol,
    side,
    size,
    collateral,
    size_denomination: symbol,
    collateral_denomination: "USDC",
    adjustment_type: "Increase", // TODO: Confirm if this should be "Increase" or another type for open
    ...rest,
  };
  const response = await fetch(`${getRangerSorAPIBase(agent)}/v1/increase_position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Open position request failed: ${error.message}`);
  }
  const data = await response.json();
  const messageBase64 = data.message;
  const messageBytes = base64js.toByteArray(messageBase64);
  const transaction = VersionedTransaction.deserialize(messageBytes);
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  transaction.message.recentBlockhash = blockhash;
  return signOrSendTX(agent, transaction);
}

/**
 * Close perp trade on Ranger (uses SOR API)
 */
export async function closePerpTradeRanger({
  agent,
  symbol,
  side,
  apiKey,
  ...rest
}: {
  agent: Agentix<SolanaWalletBase>;
  symbol: string;
  side: "Long" | "Short";
  apiKey: string;
  [key: string]: any;
}) {
  const body = {
    fee_payer: agent.wallet.getAddress(),
    symbol,
    side,
    adjustment_type: "CloseFlash", // TODO: Confirm adjustment_type for close
    ...rest,
  };
  const response = await fetch(`${getRangerSorAPIBase(agent)}/v1/close_position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Close position request failed: ${error.message}`);
  }
  const data = await response.json();
  const messageBase64 = data.message;
  const messageBytes = base64js.toByteArray(messageBase64);
  const transaction = VersionedTransaction.deserialize(messageBytes);
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  transaction.message.recentBlockhash = blockhash;
  return signOrSendTX(agent, transaction);
}

/**
 * Increase perp position on Ranger (uses SOR API)
 */
export async function increasePerpPositionRanger({
  agent,
  symbol,
  side,
  size,
  collateral,
  apiKey,
  ...rest
}: {
  agent: Agentix<SolanaWalletBase>;
  symbol: string;
  side: "Long" | "Short";
  size: number;
  collateral: number;
  apiKey: string;
  [key: string]: any;
}) {
  const body = {
    fee_payer: agent.wallet.getAddress(),
    symbol,
    side,
    size,
    collateral,
    size_denomination: symbol,
    collateral_denomination: "USDC",
    adjustment_type: "Increase",
    ...rest,
  };
  const response = await fetch(`${getRangerSorAPIBase(agent)}/v1/increase_position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Increase position request failed: ${error.message}`);
  }
  const data = await response.json();
  const messageBase64 = data.message;
  const messageBytes = base64js.toByteArray(messageBase64);
  const transaction = VersionedTransaction.deserialize(messageBytes);
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  transaction.message.recentBlockhash = blockhash;
  return signOrSendTX(agent, transaction);
}

/**
 * Decrease perp position on Ranger (uses SOR API)
 */
export async function decreasePerpPositionRanger({
  agent,
  symbol,
  side,
  size,
  apiKey,
  ...rest
}: {
  agent: Agentix<SolanaWalletBase>;
  symbol: string;
  side: "Long" | "Short";
  size: number;
  apiKey: string;
  [key: string]: any;
}) {
  const body = {
    fee_payer: agent.wallet.getAddress(),
    symbol,
    side,
    size,
    adjustment_type: "DecreaseFlash", // TODO: Confirm adjustment_type for decrease
    ...rest,
  };
  const response = await fetch(`${getRangerSorAPIBase(agent)}/v1/decrease_position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Decrease position request failed: ${error.message}`);
  }
  const data = await response.json();
  const messageBase64 = data.message;
  const messageBytes = base64js.toByteArray(messageBase64);
  const transaction = VersionedTransaction.deserialize(messageBytes);
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  transaction.message.recentBlockhash = blockhash;
  return signOrSendTX(agent, transaction);
}

/**
 * Withdraw balance from Ranger (uses SOR API)
 */
export async function withdrawBalanceRanger({
  agent,
  symbol,
  amount,
  apiKey,
  ...rest
}: {
  agent: Agentix<SolanaWalletBase>;
  symbol: string;
  amount: number;
  apiKey: string;
  [key: string]: any;
}) {
  const body = {
    fee_payer: agent.wallet.getAddress(),
    symbol,
    amount,
    adjustment_type: "WithdrawBalanceDrift", // TODO: Confirm adjustment_type for withdraw
    ...rest,
  };
  const response = await fetch(`${getRangerSorAPIBase(agent)}/v1/withdraw_balance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Withdraw balance request failed: ${error.message}`);
  }
  const data = await response.json();
  const messageBase64 = data.message;
  const messageBytes = base64js.toByteArray(messageBase64);
  const transaction = VersionedTransaction.deserialize(messageBytes);
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  transaction.message.recentBlockhash = blockhash;
  return signOrSendTX(agent, transaction);
}

/**
 * Withdraw collateral from Ranger (uses SOR API)
 */
export async function withdrawCollateralRanger({
  agent,
  symbol,
  side,
  collateral,
  apiKey,
  ...rest
}: {
  agent: Agentix<SolanaWalletBase>;
  symbol: string;
  side: "Long" | "Short";
  collateral: number;
  apiKey: string;
  [key: string]: any;
}) {
  const body = {
    fee_payer: agent.wallet.getAddress(),
    symbol,
    side,
    collateral,
    collateral_denomination: "USDC",
    adjustment_type: "WithdrawCollateralFlash", // TODO: Confirm adjustment_type for withdraw collateral
    ...rest,
  };
  const response = await fetch(
    `${getRangerSorAPIBase(agent)}/v1/withdraw_collateral`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Withdraw collateral request failed: ${error.message}`);
  }
  const data = await response.json();
  const messageBase64 = data.message;
  const messageBytes = base64js.toByteArray(messageBase64);
  const transaction = VersionedTransaction.deserialize(messageBytes);
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  transaction.message.recentBlockhash = blockhash;
  return signOrSendTX(agent, transaction);
}
