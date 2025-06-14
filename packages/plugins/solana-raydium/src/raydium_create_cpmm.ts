import {
  CREATE_CPMM_POOL_FEE_ACC,
  CREATE_CPMM_POOL_PROGRAM,
  Raydium,
  TxVersion,
} from "@raydium-io/raydium-sdk-v2";
import { MintLayout } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { type Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

export async function raydiumCreateCpmm(
  agent: Agentix<SolanaWalletBase>,
  mintA: PublicKey,
  mintB: PublicKey,
  configId: PublicKey,
  mintAAmount: BN,
  mintBAmount: BN,
  startTime: BN,
) {
  const raydium = await Raydium.load({
    connection: agent.wallet.getConnection(),
  });

  const [mintInfoA, mintInfoB] = await agent.wallet.getConnection().getMultipleAccountsInfo(
    [mintA, mintB],
  );
  if (mintInfoA === null || mintInfoB === null) {
    throw Error("fetch mint info error");
  }

  const mintDecodeInfoA = MintLayout.decode(mintInfoA.data);
  const mintDecodeInfoB = MintLayout.decode(mintInfoB.data);

  const mintFormatInfoA = {
    chainId: 101,
    address: mintA.toString(),
    programId: mintInfoA.owner.toString(),
    logoURI: "",
    symbol: "",
    name: "",
    decimals: mintDecodeInfoA.decimals,
    tags: [],
    extensions: {},
  };
  const mintFormatInfoB = {
    chainId: 101,
    address: mintB.toString(),
    programId: mintInfoB.owner.toString(),
    logoURI: "",
    symbol: "",
    name: "",
    decimals: mintDecodeInfoB.decimals,
    tags: [],
    extensions: {},
  };

  const { transaction } = await raydium.cpmm.createPool({
    programId: CREATE_CPMM_POOL_PROGRAM,
    poolFeeAccount: CREATE_CPMM_POOL_FEE_ACC,
    mintA: mintFormatInfoA,
    mintB: mintFormatInfoB,
    mintAAmount,
    mintBAmount,
    startTime,
    //@ts-expect-error sdk bug
    feeConfig: { id: configId.toString() },
    associatedOnly: false,
    ownerInfo: {
      useSOLBalance: true,
    },
    txVersion: TxVersion.V0,
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 46591500,
    // },
  });
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  transaction.message.recentBlockhash = blockhash;

  return signOrSendTX(agent, transaction);
}
