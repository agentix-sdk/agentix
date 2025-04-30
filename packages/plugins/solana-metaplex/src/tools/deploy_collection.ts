import { createCollection, ruleSet } from "@metaplex-foundation/mpl-core";
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import {
  toWeb3JsInstruction,
  toWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Agentix, SolanaWalletBase, signOrSendTX } from "agentix";
import { initUmi } from "../utils";
import type { CollectionOptions } from "../types";

/**
 * Deploy a new NFT collection
 * @param agent Agentix instance
 * @param options Collection options including name, URI, royalties, and creators
 * @returns Object containing collection address and metadata
 */
export async function deploy_collection(
  agent: Agentix<SolanaWalletBase>,
  options: CollectionOptions,
) {
  try {
    // Initialize Umi
    const umi = initUmi(agent);

    // Generate collection signer
    const collectionSigner = generateSigner(umi);

    // Format creators if provided
    const formattedCreators = options.creators?.map((creator) => ({
      address: publicKey(creator.address),
      percentage: creator.percentage,
    })) || [
      {
        address: publicKey(agent.wallet.getAddress()),
        percentage: 100,
      },
    ];

    // Create collection
    const ixs = createCollection(umi, {
      collection: collectionSigner,
      name: options.name,
      uri: options.uri,
      plugins: [
        {
          type: "Royalties",
          basisPoints: options.royaltyBasisPoints || 500, // Default 5%
          creators: formattedCreators,
          ruleSet: ruleSet("None"), // Compatibility rule set
        },
      ],
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
        collectionAddress: toWeb3JsPublicKey(collectionSigner.publicKey),
        signedTransaction: sigOrTx,
      };
    }

    return {
      collectionAddress: toWeb3JsPublicKey(collectionSigner.publicKey),
      signature: sigOrTx,
    };
  } catch (error: any) {
    throw new Error(`Collection deployment failed: ${error.message}`);
  }
}
