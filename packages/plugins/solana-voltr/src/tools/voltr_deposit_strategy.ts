import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { VoltrClient } from "@voltr/vault-sdk";
import BN from "bn.js";
import { type Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

/**
 * Deposits assets into a Voltr strategy
 * @param agent Agentix instance
 * @param depositAmount Amount to deposit in base units (BN)
 * @param vault Public key of the target vault
 * @param strategy Public key of the target strategy
 * @returns Transaction signature for the deposit
 */
export async function voltrDepositStrategy(
  agent: Agentix<SolanaWalletBase>,
  depositAmount: BN,
  vault: PublicKey,
  strategy: PublicKey,
) {
  const vc = new VoltrClient(agent.wallet.getConnection());
  const vaultAccount = await vc.fetchVaultAccount(vault);
  const vaultAssetMint = vaultAccount.asset.mint;
  const assetTokenProgram = await agent.wallet.getConnection()
    .getAccountInfo(new PublicKey(vaultAssetMint))
    .then((account) => account?.owner);

  if (
    !assetTokenProgram ||
    !(
      assetTokenProgram.equals(TOKEN_PROGRAM_ID) ||
      assetTokenProgram.equals(TOKEN_2022_PROGRAM_ID)
    )
  ) {
    throw new Error("Invalid asset token program");
  }

  const response = await fetch(
    `https://voltr.xyz/api/remaining-accounts/deposit-strategy?vault=${vault.toBase58()}&strategy=${strategy.toBase58()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = (await response.json()).data as {
    instructionDiscriminator: number[] | null;
    additionalArgs: number[] | null;
    remainingAccounts:
      | {
          pubkey: string;
          isSigner: boolean;
          isWritable: boolean;
        }[]
      | null;
  };

  const additionalArgs = data.additionalArgs
    ? Buffer.from(data.additionalArgs)
    : null;
  const instructionDiscriminator = data.instructionDiscriminator
    ? Buffer.from(data.instructionDiscriminator)
    : null;
  const remainingAccounts =
    data.remainingAccounts?.map((account) => ({
      pubkey: new PublicKey(account.pubkey),
      isSigner: account.isSigner,
      isWritable: account.isWritable,
    })) ?? [];

  const depositIx = await vc.createDepositStrategyIx(
    {
      depositAmount,
      additionalArgs,
      instructionDiscriminator,
    },
    {
      manager: new PublicKey(agent.wallet.getAddress()),
      vault,
      vaultAssetMint,
      strategy: strategy,
      assetTokenProgram,
      remainingAccounts,
    },
  );

  return await signOrSendTX(agent, [depositIx]);
}
