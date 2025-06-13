import { type Crossmint } from "@crossmint/common-sdk-base";
import { z } from "zod";

export interface CrossmintConfig {
    crossmint: Crossmint;
    callDataSchema?: z.ZodSchema
}

export interface PhysicalAddress {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}

export interface BuyTokenRecipient {
    email: string;
    physicalAddress?: PhysicalAddress;
}

export interface BuyTokenPayment {
    method: "ethereum" | "ethereum-sepolia" | "base" | "base-sepolia" | "polygon" | "polygon-amoy" | "solana";
    currency: "usdc";
    payerAddress: string;
    receiptEmail?: string;
}

export interface LineItem {
    collectionLocator?: string;
    productLocator?: string;
    callData?: any;
}

export interface BuyTokenRequest {
    recipient: BuyTokenRecipient;
    payment: BuyTokenPayment;
    lineItems: LineItem[];
}

export interface BuyTokenResponse {
    order: any; // Order type from @crossmint/client-sdk-base
    txId: string;
}
