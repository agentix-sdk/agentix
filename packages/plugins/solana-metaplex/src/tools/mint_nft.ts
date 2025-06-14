import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { fetchCollection } from "@metaplex-foundation/mpl-core";
import { generateSigner } from "@metaplex-foundation/umi";
import {
  fromWeb3JsPublicKey,
  toWeb3JsInstruction,
  toWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Agentix, signOrSendTX } from "agentix";
import { initUmi } from "../utils";
import { SolanaWalletBase } from "agentix";
/**
 * Mint a new NFT as part of an existing collection
 * @param agent Agentix instance
 * @param collectionMint Address of the collection's master NFT
 * @param metadata NFT metadata object
 * @param recipient Optional recipient address (defaults to wallet address)
 * @returns Object containing NFT mint address and token account
 */
export async function mintCollectionNFT(
  agent: Agentix<SolanaWalletBase>,
  collectionMint: PublicKey,
  metadata: {
    name: string;
    uri: string;
    sellerFeeBasisPoints?: number;
    creators?: Array<{
      address: string;
      share: number;
    }>;
  },
  recipient?: PublicKey,
) {
  try {
    // Create UMI instance from agent
    const umi = initUmi(agent).use(mplCore());
    // umi.use(keypairIdentity(fromWeb3JsKeypair(agent.wallet)));

    // Convert collection mint to UMI format
    const umiCollectionMint = fromWeb3JsPublicKey(collectionMint);

    // Fetch the existing collection
    const collection = await fetchCollection(umi, umiCollectionMint);

    // Generate a new signer for the NFT
    const assetSigner = generateSigner(umi);

    const ixs = create(umi, {
      asset: assetSigner,
      collection: collection,
      name: metadata.name,
      uri: metadata.uri,
      owner: fromWeb3JsPublicKey(recipient ?? new PublicKey(agent.wallet.getAddress())),
    })
      .getInstructions()
      .map((i) => toWeb3JsInstruction(i));
    const tx = new Transaction().add(...ixs);
    const { blockhash } = await agent.wallet.getConnection().getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = new PublicKey(agent.wallet.getAddress());

    const sigOrTx = await signOrSendTX(agent, tx);

    if (typeof sigOrTx !== "string") {
      return {
        mint: toWeb3JsPublicKey(assetSigner.publicKey),
        // Note: Token account is now handled automatically by the create instruction
        metadata: toWeb3JsPublicKey(assetSigner.publicKey),
        signedTransaction: sigOrTx,
      };
    }

    await signOrSendTX(agent, tx);

    return {
      mint: toWeb3JsPublicKey(assetSigner.publicKey),
      // Note: Token account is now handled automatically by the create instruction
      metadata: toWeb3JsPublicKey(assetSigner.publicKey),
      signature: sigOrTx,
    };
  } catch (error: any) {
    throw new Error(`Collection NFT minting failed: ${error.message}`);
  }
}
