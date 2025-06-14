import { Action, EvmWalletBase } from "agentix";
import { z } from "zod";
import { getAddressFromEns } from "../tools/ens";

export const ensGetAddressAction: Action<EvmWalletBase> = {
    name: "ENS_GET_ADDRESS",
    similes: [
        "resolve ens name",
        "get address from ens",
        "lookup ens address",
        "resolve ens domain",
        "get wallet address from ens"
    ],
    description: "Get the address from an ENS (Ethereum Name Service, e.g. goat.eth) name",
    examples: [
        [
            {
                input: {
                    ensName: "goat.eth"
                },
                output: {
                    status: "success",
                    message: "Successfully resolved ENS name",
                    address: "0x1234567890abcdef1234567890abcdef12345678",
                },
                explanation: "Resolve the ENS name 'goat.eth' to its corresponding Ethereum address",
            },
        ],
    ],
    schema: z.object({
        ensName: z.string().describe("The ENS name to resolve (e.g., 'vitalik.eth')"),
        provider: z.string().optional().describe("Optional RPC provider URL"),
        chainId: z.number().optional().describe("Optional chain ID for resolution"),
    }),
    handler: async (agent, input: Record<string, any>) => {
        try {
            const address = await getAddressFromEns({
                agent,
                ensName: input.ensName,
                provider: input.provider,
                chainId: input.chainId,
            });

            if (!address) {
                return {
                    status: "error",
                    message: `ENS name '${input.ensName}' could not be resolved`,
                };
            }

            return {
                status: "success",
                message: `Successfully resolved ENS name '${input.ensName}'`,
                address,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: error.message,
            };
        }
    },
}; 