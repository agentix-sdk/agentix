import { AnchorProvider } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { TensorSwapSDK } from "@tensor-oss/tensorswap-sdk";
import { BN } from "bn.js";
import { Agentix, signOrSendTX, SolanaWalletBase } from "agentix";

export async function listNFTForSale(
  agent: Agentix<SolanaWalletBase>,
  nftMint: PublicKey,
  price: number,
) {
  try {
    if (!PublicKey.isOnCurve(nftMint)) {
      throw new Error("Invalid NFT mint address");
    }

    const mintInfo = await agent.wallet.getConnection().getAccountInfo(nftMint);
    if (!mintInfo) {
      throw new Error(`NFT mint ${nftMint.toString()} does not exist`);
    }

    const ata = await getAssociatedTokenAddress(
      nftMint,
      new PublicKey(agent.wallet.getAddress()),
    );

    try {
      const tokenAccount = await getAccount(agent.wallet.getConnection(), ata);

      if (!tokenAccount || tokenAccount.amount <= 0) {
        throw new Error(`You don't own this NFT (${nftMint.toString()})`);
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(
        `No token account found for mint ${nftMint.toString()}. Make sure you own this NFT.`,
      );
    }

    const provider = new AnchorProvider(
      agent.wallet.getConnection(),
      {
        publicKey: new PublicKey(agent.wallet.getAddress()),
        signAllTransactions: agent.wallet.signAllTransactions,
        signTransaction: agent.wallet.signTransaction,
      },
      AnchorProvider.defaultOptions(),
    );

    const tensorSwapSdk = new TensorSwapSDK({ provider });
    const priceInLamports = new BN(price * 1e9);
    const nftSource = await getAssociatedTokenAddress(
      nftMint,
      new PublicKey(agent.wallet.getAddress()),
    );

    const { tx } = await tensorSwapSdk.list({
      nftMint,
      nftSource,
      owner: new PublicKey(agent.wallet.getAddress()),
      price: priceInLamports,
      tokenProgram: TOKEN_PROGRAM_ID,
      payer: new PublicKey(agent.wallet.getAddress()),
    });

    const transaction = new Transaction();
    transaction.add(...tx.ixs);

    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    return await signOrSendTX(agent, transaction, tx.extraSigners);
  } catch (error: any) {
    console.error("Full error details:", error);
    throw error;
  }
}

export async function cancelListing(agent: Agentix<SolanaWalletBase>, nftMint: PublicKey) {
  const provider = new AnchorProvider(
    agent.wallet.getConnection(),
    {
      publicKey: new PublicKey(agent.wallet.getAddress()),
      signAllTransactions: agent.wallet.signAllTransactions,
      signTransaction: agent.wallet.signTransaction,
    },
    AnchorProvider.defaultOptions(),
  );

  const tensorSwapSdk = new TensorSwapSDK({ provider });
  const nftDest = await getAssociatedTokenAddress(
    nftMint,
    new PublicKey(agent.wallet.getAddress()),
    false,
    TOKEN_PROGRAM_ID,
  );

  const { tx } = await tensorSwapSdk.delist({
    nftMint,
    nftDest,
    owner: new PublicKey(agent.wallet.getAddress()),
    tokenProgram: TOKEN_PROGRAM_ID,
    payer: new PublicKey(agent.wallet.getAddress()),
    authData: null,
  });

  const transaction = new Transaction();
  transaction.add(...tx.ixs);
  const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  return await signOrSendTX(agent, transaction, tx.extraSigners);
}
