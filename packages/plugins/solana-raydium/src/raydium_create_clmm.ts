import {
  CLMM_PROGRAM_ID,
  Raydium,
  TxVersion,
} from "@raydium-io/raydium-sdk-v2";
import { MintLayout } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import Decimal from "decimal.js";
import { type Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

export async function raydiumCreateClmm(
  agent: Agentix<SolanaWalletBase>,
  mint1: PublicKey,
  mint2: PublicKey,
  configId: PublicKey,
  initialPrice: Decimal,
  startTime: BN,
) {
  const raydium = await Raydium.load({
    connection: agent.wallet.getConnection(),
  });

  const [mintInfo1, mintInfo2] = await agent.wallet.getConnection().getMultipleAccountsInfo(
    [mint1, mint2],
  );
  if (mintInfo1 === null || mintInfo2 === null) {
    throw Error("fetch mint info error");
  }

  const mintDecodeInfo1 = MintLayout.decode(mintInfo1.data);
  const mintDecodeInfo2 = MintLayout.decode(mintInfo2.data);

  const mintFormatInfo1 = {
    chainId: 101,
    address: mint1.toString(),
    programId: mintInfo1.owner.toString(),
    logoURI: "",
    symbol: "",
    name: "",
    decimals: mintDecodeInfo1.decimals,
    tags: [],
    extensions: {},
  };
  const mintFormatInfo2 = {
    chainId: 101,
    address: mint2.toString(),
    programId: mintInfo2.owner.toString(),
    logoURI: "",
    symbol: "",
    name: "",
    decimals: mintDecodeInfo2.decimals,
    tags: [],
    extensions: {},
  };

  const { transaction } = await raydium.clmm.createPool({
    programId: CLMM_PROGRAM_ID,
    // programId: DEVNET_PROGRAM_ID.CLMM,
    mint1: mintFormatInfo1,
    mint2: mintFormatInfo2,
    // @ts-expect-error sdk bug
    ammConfig: { id: configId },
    initialPrice,
    startTime,
    txVersion: TxVersion.V0,
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 46591500,
    // },
  });
  const blockhash = (await agent.wallet.getConnection().getLatestBlockhash()).blockhash;
  transaction.message.recentBlockhash = blockhash;

  return signOrSendTX(agent, transaction);
}
