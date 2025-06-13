import { Action } from "agentix";
import * as tools from "../tools/cosmosbank";
import {
    TokenBalanceSchema,
    DenomMetadataSchema,
    SupplyOfSchema,
    SendTokenSchema
} from "../types";

export const getTokenBalanceAction: Action<any> = {
    name: "COSMOSBANK_TOKEN_BALANCE",
    similes: [
        "get token balance",
        "check coin balance",
        "view token holdings",
        "check wallet balance",
        "get asset balance"
    ],
    description: "Gets the balance of a specific token for an address on a Cosmos chain",
    examples: [
        [
            {
                input: {
                    address: "cosmos1abcdefg...",
                    symbol: "ATOM"
                },
                output: {
                    status: "success",
                    data: "123.456"
                },
                explanation: "Get the ATOM token balance for the specified address"
            }
        ]
    ],
    schema: TokenBalanceSchema,
    handler: async (agent, input) => {
        try {
            const data = await tools.getTokenBalance({
                agent,
                address: input.address,
                symbol: input.symbol
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getDenomMetadataAction: Action<any> = {
    name: "COSMOSBANK_DENOM_METADATA",
    similes: [
        "get token metadata",
        "retrieve coin information",
        "check token details",
        "get token info",
        "view token specifications"
    ],
    description: "Gets metadata for a token with the specified symbol on a Cosmos chain",
    examples: [
        [
            {
                input: {
                    symbol: "ATOM"
                },
                output: {
                    status: "success",
                    data: "ATOM-Cosmos Hub-The native staking token of the Cosmos Hub-ATOM"
                },
                explanation: "Get metadata for the ATOM token"
            }
        ]
    ],
    schema: DenomMetadataSchema,
    handler: async (agent, input) => {
        try {
            const data = await tools.getDenomMetadata({
                agent,
                symbol: input.symbol
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const getSupplyOfAction: Action<any> = {
    name: "COSMOSBANK_SUPPLY_OF",
    similes: [
        "get token supply",
        "check total supply",
        "view circulating supply",
        "get token circulation",
        "check coin supply"
    ],
    description: "Gets the total supply of a token with the specified symbol on a Cosmos chain",
    examples: [
        [
            {
                input: {
                    symbol: "ATOM"
                },
                output: {
                    status: "success",
                    data: "$300000000_uatom"
                },
                explanation: "Get the total supply of ATOM tokens"
            }
        ]
    ],
    schema: SupplyOfSchema,
    handler: async (agent, input) => {
        try {
            const data = await tools.getSupplyOf({
                agent,
                symbol: input.symbol
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
};

export const sendTokenAction: Action<any> = {
    name: "COSMOSBANK_SEND_TOKEN",
    similes: [
        "send tokens",
        "transfer coins",
        "send cryptocurrency",
        "make token payment",
        "transfer assets"
    ],
    description: "Sends an amount of a token to a specified address on a Cosmos chain",
    examples: [
        [
            {
                input: {
                    toAddress: "cosmos1abcdefg...",
                    amount: {
                        symbol: "ATOM",
                        amount: "1.5"
                    }
                },
                output: {
                    status: "success",
                    data: "0x1234abcd..." // transaction hash
                },
                explanation: "Send 1.5 ATOM to the specified address"
            }
        ]
    ],
    schema: SendTokenSchema,
    handler: async (agent, input) => {
        try {
            const data = await tools.sendToken({
                agent,
                toAddress: input.toAddress,
                amount: input.amount
            });
            return {
                status: "success",
                data
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
}; 