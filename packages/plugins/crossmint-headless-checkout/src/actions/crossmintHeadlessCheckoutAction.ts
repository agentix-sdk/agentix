import { Action, EvmWalletBase, SolanaWalletBase } from "agentix";
import { z } from "zod";
import { buyToken } from "../tools/crossmint_headless_checkout";

const physicalAddressSchema = z
    .object({
        name: z.string().min(1, "Name is required for physical address"),
        line1: z.string().min(1, "Line 1 is required for physical address"),
        line2: z.string().optional(),
        city: z.string().min(1, "City is required for physical address"),
        state: z.string().optional().describe("State/Province/Region - optional"),
        postalCode: z.string().min(1, "Postal/ZIP code is required for physical address"),
        country: z
            .string()
            .min(2, "Country is required for physical address")
            .max(2, "Country must be a 2-letter ISO code for physical address")
            .toUpperCase(),
    })
    .superRefine((data, ctx) => {
        if (data.country !== "US") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Only 'US' country code is supported at this time",
            });
        }

        if (data.country === "US" && !data.state) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "State is required for US physical address",
            });
        }
    })
    .describe("International mailing address using ISO 3166-1 alpha-2 country codes");

export const crossmintBuyTokenAction: Action<EvmWalletBase | SolanaWalletBase> = {
    name: "CROSSMINT_BUY_TOKEN",
    similes: [
        "buy token using crossmint",
        "purchase NFT via crossmint",
        "buy digital collectible with crossmint",
        "crossmint checkout",
        "buy token with crossmint headless checkout",
        "purchase item with crossmint"
    ],
    description: "Buy a token such as an NFT, SFT or item tokenized by them, listed on any blockchain using Crossmint headless checkout",
    examples: [
        [
            {
                input: {
                    recipient: {
                        email: "buyer@example.com"
                    },
                    payment: {
                        method: "ethereum",
                        currency: "usdc",
                        payerAddress: "0x1234...5678",
                        receiptEmail: "buyer@example.com"
                    },
                    lineItems: [
                        {
                            collectionLocator: "ethereum:0x1234567890123456789012345678901234567890"
                        }
                    ]
                },
                output: {
                    status: "success",
                    message: "Successfully purchased token via Crossmint",
                    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                    orderId: "order_1234567890"
                },
                explanation: "Purchase an NFT from a collection using Ethereum mainnet and USDC payment",
            },
        ],
    ],
    schema: z.object({
        recipient: z
            .object({
                email: z.string().email(),
                physicalAddress: physicalAddressSchema.optional(),
            })
            .describe(
                "Where the tokens will be sent to - either a wallet address or email, if email is provided a Crossmint wallet will be created and associated with the email",
            ),
        payment: z
            .object({
                method: z
                    .enum(["ethereum", "ethereum-sepolia", "base", "base-sepolia", "polygon", "polygon-amoy", "solana"])
                    .describe("The blockchain network to use for the transaction"),
                currency: z.enum(["usdc"]).describe("The currency to use for payment"),
                payerAddress: z.string().describe("The address that will pay for the transaction"),
                receiptEmail: z.string().optional().describe("Optional email to send payment receipt to"),
            })
            .describe(
                "Payment configuration - the desired blockchain, currency and address of the payer - optional receipt email, if an email recipient was not provided",
            ),
        lineItems: z
            .array(
                z.union([
                    z.object({
                        collectionLocator: z
                            .string()
                            .describe(
                                "The collection locator. Ex: 'crossmint:<crossmint_collection_id>', '<chain>:<contract_address>'",
                            ),
                        callData: z.any().optional(),
                    }),
                    z.object({
                        productLocator: z
                            .string()
                            .describe("The product locator. Ex: 'amazon:<amazon_product_id>', 'amazon:<asin>'"),
                        callData: z.any().optional(),
                    }),
                ]),
            )
            .describe("Array of items to purchase"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const result = await buyToken({
                agent,
                recipient: input.recipient,
                payment: input.payment,
                lineItems: input.lineItems,
            });

            return {
                status: "success",
                message: "Token purchase executed successfully via Crossmint",
                transactionHash: result.txId,
                orderId: result.order.orderId,
                order: result.order,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 