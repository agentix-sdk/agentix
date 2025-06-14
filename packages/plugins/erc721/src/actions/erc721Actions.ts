import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import {
    getBalanceOfBySymbol,
    transferERC721,
    getTotalSupplyBySymbol,
    approveERC721,
    transferFromERC721,
    getOwnerOfBySymbol,
} from "../tools/erc721";

export const erc721GetBalanceAction: Action<EvmWalletBase> = {
    name: "ERC721_GET_BALANCE",
    similes: [
        "get NFT balance",
        "check NFT balance",
        "get ERC721 balance",
        "how many NFTs does wallet have",
        "NFT balance of address",
    ],
    description: "Get the NFT balance for a wallet address for a specific ERC721 token. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    wallet: "0x1234567890123456789012345678901234567890",
                    tokenSymbol: "BAYC"
                },
                output: {
                    success: true,
                    balance: "3"
                },
                explanation: "Get BAYC NFT balance for the specified wallet address"
            }
        ]
    ],
    schema: z.object({
        wallet: z.string().describe("The wallet address to check balance for"),
        tokenSymbol: z.string().describe("The NFT token symbol (e.g., BAYC, PUNK)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getBalanceOfBySymbol(agent, input as { wallet: string; tokenSymbol: string });
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc721TransferAction: Action<EvmWalletBase> = {
    name: "ERC721_TRANSFER",
    similes: [
        "transfer NFT",
        "send NFT",
        "transfer ERC721 token",
        "send ERC721",
        "transfer specific NFT token ID",
    ],
    description: "Transfer a specific NFT token ID to another address. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    to: "0x1234567890123456789012345678901234567890",
                    tokenId: "1234",
                    tokenSymbol: "BAYC"
                },
                output: {
                    success: true,
                    hash: "0xabcdef..."
                },
                explanation: "Transfer BAYC token ID 1234 to the specified address"
            }
        ]
    ],
    schema: z.object({
        to: z.string().describe("The recipient address"),
        tokenId: z.string().describe("The NFT token ID to transfer"),
        tokenSymbol: z.string().describe("The NFT token symbol (e.g., BAYC, PUNK)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await transferERC721(agent, input as { to: string; tokenId: string; tokenSymbol: string });
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc721GetTotalSupplyAction: Action<EvmWalletBase> = {
    name: "ERC721_GET_TOTAL_SUPPLY",
    similes: [
        "get NFT total supply",
        "get total supply",
        "how many NFTs exist",
        "total NFT count",
        "ERC721 total supply",
    ],
    description: "Get the total supply of an ERC721 token collection. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    tokenSymbol: "BAYC"
                },
                output: {
                    success: true,
                    totalSupply: "10000"
                },
                explanation: "Get the total supply of BAYC NFTs"
            }
        ]
    ],
    schema: z.object({
        tokenSymbol: z.string().describe("The NFT token symbol (e.g., BAYC, PUNK)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getTotalSupplyBySymbol(agent, input as { tokenSymbol: string });
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc721ApproveAction: Action<EvmWalletBase> = {
    name: "ERC721_APPROVE",
    similes: [
        "approve NFT",
        "approve ERC721",
        "give permission for NFT",
        "approve specific token ID",
        "set NFT approval",
    ],
    description: "Approve another address to transfer a specific NFT token ID. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    spender: "0x1234567890123456789012345678901234567890",
                    tokenId: "1234",
                    tokenSymbol: "BAYC"
                },
                output: {
                    success: true,
                    hash: "0xabcdef..."
                },
                explanation: "Approve the spender to transfer BAYC token ID 1234"
            }
        ]
    ],
    schema: z.object({
        spender: z.string().describe("The address to approve for spending"),
        tokenId: z.string().describe("The NFT token ID to approve"),
        tokenSymbol: z.string().describe("The NFT token symbol (e.g., BAYC, PUNK)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await approveERC721(agent, input as { spender: string; tokenId: string; tokenSymbol: string });
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc721TransferFromAction: Action<EvmWalletBase> = {
    name: "ERC721_TRANSFER_FROM",
    similes: [
        "transfer NFT from",
        "transfer from address",
        "move NFT between addresses",
        "ERC721 transfer from",
        "transfer token ID from address",
    ],
    description: "Transfer a specific NFT token ID from one address to another (requires approval). The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    from: "0x1111111111111111111111111111111111111111",
                    to: "0x2222222222222222222222222222222222222222",
                    tokenId: "1234",
                    tokenSymbol: "BAYC"
                },
                output: {
                    success: true,
                    hash: "0xabcdef..."
                },
                explanation: "Transfer BAYC token ID 1234 from one address to another"
            }
        ]
    ],
    schema: z.object({
        from: z.string().describe("The address to transfer from"),
        to: z.string().describe("The address to transfer to"),
        tokenId: z.string().describe("The NFT token ID to transfer"),
        tokenSymbol: z.string().describe("The NFT token symbol (e.g., BAYC, PUNK)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await transferFromERC721(agent, input as { from: string; to: string; tokenId: string; tokenSymbol: string });
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

export const erc721GetOwnerAction: Action<EvmWalletBase> = {
    name: "ERC721_GET_OWNER",
    similes: [
        "get NFT owner",
        "who owns this NFT",
        "get token owner",
        "owner of token ID",
        "ERC721 owner of",
    ],
    description: "Get the owner address of a specific NFT token ID. The AI should first resolve the token symbol using the token plugin to get the contract address.",
    examples: [
        [
            {
                input: {
                    tokenId: "1234",
                    tokenSymbol: "BAYC"
                },
                output: {
                    success: true,
                    owner: "0x1234567890123456789012345678901234567890"
                },
                explanation: "Get the owner of BAYC token ID 1234"
            }
        ]
    ],
    schema: z.object({
        tokenId: z.string().describe("The NFT token ID to check ownership for"),
        tokenSymbol: z.string().describe("The NFT token symbol (e.g., BAYC, PUNK)"),
    }),
    handler: async (agent, input) => {
        try {
            const result = await getOwnerOfBySymbol(agent, input as { tokenId: string; tokenSymbol: string });
            return result;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
}; 