import { type Crossmint, CrossmintApiClient, createCrossmint, isEVMBlockchain } from "@crossmint/common-sdk-base";
import type { Order } from "@crossmint/client-sdk-base";
import { Transaction } from "@solana/web3.js";
import base58 from "bs58";
import { parseTransaction } from "viem";
import { EvmWalletBase, SolanaWalletBase } from "agentix";
import { Agentix } from "agentix";
import { BuyTokenRequest, BuyTokenResponse, CrossmintConfig } from "../types";
import packageJson from "../../package.json";

interface BuyTokenParams extends BuyTokenRequest {
    agent: Agentix<EvmWalletBase | SolanaWalletBase>;
}

/**
 * Buy a token such as an NFT, SFT or item tokenized by them, listed on any blockchain
 * @returns Transaction hash and order details
 */
export async function buyToken(params: BuyTokenParams): Promise<BuyTokenResponse> {
    const { agent } = params;
    const walletClient = agent.wallet;
    
    // Get Crossmint configuration from agent config
    const crossmintConfig = agent.config.crossmintConfig as CrossmintConfig;
    if (!crossmintConfig) {
        throw new Error("Crossmint configuration not found in agent config");
    }

    const validatedCrossmint = createCrossmint(crossmintConfig.crossmint, {
        usageOrigin: "server",
    });

    const crossmintApiClient = new CrossmintApiClient(validatedCrossmint, {
        internalConfig: {
            sdkMetadata: {
                name: "@agentix/plugin-evm-crossmint-headless-checkout",
                version: packageJson.version,
            },
        },
    });

    // Create order
    const orderParams = {
        recipient: params.recipient,
        payment: params.payment,
        lineItems: params.lineItems,
    };

    const res = await crossmintApiClient.post("/api/2022-06-09/orders", {
        body: JSON.stringify(orderParams),
        headers: {
            "x-api-key": crossmintConfig.crossmint.apiKey,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        let errorMessage = `Failed to create buy order: ${res.status} ${res.statusText}`;
        try {
            const json = await res.json();
            errorMessage += `\n\n${JSON.stringify(json, null, 2)}`;
        } catch (e) {
            console.error("Failed to parse JSON response:", e);
        }
        throw new Error(errorMessage);
    }

    const { order } = (await res.json()) as {
        order: Order;
        orderClientSecret: string;
    };

    console.log("Created order:", order.orderId);

    const isInsufficientFunds = order.payment.status === "crypto-payer-insufficient-funds";
    if (isInsufficientFunds) {
        throw new Error("Insufficient funds");
    }

    const isRequiresPhysicalAddress = order.quote.status === "requires-physical-address";
    if (isRequiresPhysicalAddress) {
        throw new Error("recipient.physicalAddress is required");
    }

    const serializedTransaction =
        order.payment.preparation != null && "serializedTransaction" in order.payment.preparation
            ? order.payment.preparation.serializedTransaction
            : undefined;
    if (!serializedTransaction) {
        throw new Error(
            `No serialized transaction found for order, this item may not be available for purchase:\n\n ${JSON.stringify(
                order,
                null,
                2,
            )}`,
        );
    }

    const paymentMethod = order.payment.method;

    if (paymentMethod === "solana") {
        if (!(walletClient instanceof SolanaWalletBase)) {
            throw new Error(
                "Solana wallet client required. Use a solana wallet client, or change the payment method to one supported by your wallet client",
            );
        }
        const transaction = Transaction.from(base58.decode(serializedTransaction));
        const hash = await walletClient.sendTransaction(transaction, walletClient.getConnection());
        return { order, txId: hash };
    }

    if (isEVMBlockchain(paymentMethod)) {
        if (!(walletClient instanceof EvmWalletBase)) {
            throw new Error(
                "EVM wallet client required. Use an evm wallet client, or change the payment method to one supported by your wallet client",
            );
        }
        const transaction = parseTransaction(serializedTransaction as `0x${string}`);
        if (transaction.to == null) {
            throw new Error("Transaction to is null");
        }

        console.log("Paying order:", order.orderId);
        const sendRes = await walletClient.sendTransaction({
            to: transaction.to,
            value: transaction.value || 0n,
            data: transaction.data,
        });

        return {
            order,
            txId: sendRes.hash,
        };
    }

    throw new Error(`Unsupported payment method: ${paymentMethod}`);
} 