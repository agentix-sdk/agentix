import {
  OPEN_BOOK_PROGRAM,
  Raydium,
  TxVersion,
} from "@raydium-io/raydium-sdk-v2";
import { MintLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";
import { type Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

export async function openbookCreateMarket(
  agent: Agentix<SolanaWalletBase>,
  baseMint: PublicKey,
  quoteMint: PublicKey,
  lotSize = 1,
  tickSize = 0.01,
) {
  const raydium = await Raydium.load({
    connection: agent.wallet.getConnection(),
  });

  const baseMintInfo = await agent.wallet.getConnection().getAccountInfo(baseMint);
  const quoteMintInfo = await agent.wallet.getConnection().getAccountInfo(quoteMint);

  if (
    baseMintInfo?.owner.toString() !== TOKEN_PROGRAM_ID.toBase58() ||
    quoteMintInfo?.owner.toString() !== TOKEN_PROGRAM_ID.toBase58()
  ) {
    throw new Error(
      "openbook market only support TOKEN_PROGRAM_ID mints, if you want to create pool with token-2022, please create raydium cpmm pool instead",
    );
  }

  const { transactions } = await raydium.marketV2.create({
    baseInfo: {
      mint: baseMint,
      decimals: MintLayout.decode(baseMintInfo.data).decimals,
    },
    quoteInfo: {
      mint: quoteMint,
      decimals: MintLayout.decode(quoteMintInfo.data).decimals,
    },
    lotSize,
    tickSize,
    dexProgramId: OPEN_BOOK_PROGRAM,

    txVersion: TxVersion.V0,
  });

  const txs = await Promise.all(
    transactions.map(async (tx) => {
      tx.message.recentBlockhash = (
        await agent.wallet.getConnection().getLatestBlockhash()
      ).blockhash;
      return await signOrSendTX(agent, tx);
    }),
  );

  return txs;
}
