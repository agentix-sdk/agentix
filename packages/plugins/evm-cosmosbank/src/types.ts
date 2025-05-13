import { z } from "zod";

export const TokenBalanceSchema = z.object({
    address: z.string().describe("The address required to retrieve the balance"),
    symbol: z.string().describe("The token symbol required to retrieve the balance"),
});

export const DenomMetadataSchema = z.object({
    symbol: z.string().describe("The token symbol required to retrieve the metadata"),
});

export const SupplyOfSchema = z.object({
    symbol: z.string().describe("The token symbol required to retrieve the totalsupply"),
});

export const SendTokenSchema = z.object({
    toAddress: z.string().describe("The address to send tokens to"),
    amount: z.object({ 
        symbol: z.string(), 
        amount: z.string() 
    }).describe("A token data having its symbol and the amount of token to be sent"),
});

export type TokenBalanceParams = z.infer<typeof TokenBalanceSchema>;
export type DenomMetadataParams = z.infer<typeof DenomMetadataSchema>;
export type SupplyOfParams = z.infer<typeof SupplyOfSchema>;
export type SendTokenParams = z.infer<typeof SendTokenSchema>;
