import { Transaction } from "@solana/web3.js";
import { Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

export async function rock_paper_scissor(
  agent: Agentix<SolanaWalletBase>,
  amount: number,
  choice: "rock" | "paper" | "scissors",
) {
  try {
    const res = await fetch(
      `https://rps.sendarcade.fun/api/actions/bot?amount=${amount}&choice=${choice}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: agent.wallet.getAddress(),
        }),
      },
    );

    const data = await res.json();
    if (data.transaction) {
      const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
      const txn = Transaction.from(Buffer.from(data.transaction, "base64"));
      txn.recentBlockhash = blockhash;

      if (agent.config.signOnly) {
        return signOrSendTX(agent, txn);
      }

      const sig = (await signOrSendTX(agent, txn)) as string;
      const href = data.links?.next?.href;

      return await outcome(agent, sig, href);
    } else {
      return "failed";
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(`RPS game failed: ${error.message}`);
  }
}

async function outcome(
  agent: Agentix<SolanaWalletBase>,
  sig: string,
  href: string,
): Promise<string> {
  try {
    const res = await fetch(
      "https://rps.sendarcade.fun" + href, // href = /api/actions/outcome?id=...
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: agent.wallet.getAddress(),
          signature: sig,
        }),
      },
    );

    const data: any = await res.json();
    const title = data.title;
    if (title.startsWith("You lost")) {
      return title;
    }
    const next_href = data.links?.actions?.[0]?.href;
    return title + "\n" + (await won(agent, next_href));
  } catch (error: any) {
    console.error(error);
    throw new Error(`RPS outcome failed: ${error.message}`);
  }
}

async function won(agent: Agentix<SolanaWalletBase>, href: string): Promise<string> {
  try {
    const res = await fetch(
      "https://rps.sendarcade.fun" + href, // href = /api/actions/won?id=...
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: agent.wallet.getAddress(),
        }),
      },
    );

    const data: any = await res.json();
    if (data.transaction) {
      const txn = Transaction.from(Buffer.from(data.transaction, "base64"));
      const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
      txn.recentBlockhash = blockhash;
      const signedTxn = await agent.wallet.signTransaction(txn);
      await agent.wallet.getConnection().sendRawTransaction(signedTxn.serialize(), {
        preflightCommitment: "confirmed",
      });
    } else {
      return "Failed to claim prize.";
    }
    const next_href = data.links?.next?.href;
    return await postWin(agent, next_href);
  } catch (error: any) {
    console.error(error);
    throw new Error(`RPS outcome failed: ${error.message}`);
  }
}

async function postWin(agent: Agentix<SolanaWalletBase>, href: string): Promise<string> {
  try {
    const res = await fetch(
      "https://rps.sendarcade.fun" + href, // href = /api/actions/postwin?id=...
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: agent.wallet.getAddress(),
        }),
      },
    );

    const data: any = await res.json();
    const title = data.title;
    return "Prize claimed Successfully" + "\n" + title;
  } catch (error: any) {
    console.error(error);
    throw new Error(`RPS outcome failed: ${error.message}`);
  }
}
