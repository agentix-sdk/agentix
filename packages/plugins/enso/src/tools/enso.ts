import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import { EnsoClient, RouteParams } from "@ensofinance/sdk";
import { Address, Hash, parseUnits } from "viem";
import { ENSO_ETH, ENSO_SUPPORTED_NETWORKS, MIN_ERC20_ABI } from "../constants";
import { EnsoRouteParams } from "../types";

const ENSO_API_KEY = "1e02632d-6feb-4a75-a157-documentation" as const;

export async function route({
    agent,
    tokenIn,
    tokenOut,
    amountIn,
}: {
    agent: Agentix<EvmWalletBase>;
} & EnsoRouteParams): Promise<string> {
    const walletClient = agent.wallet;
    const chainId = walletClient.getChain().id;
    const sender = walletClient.getAddress() as Address;
    
    if (!ENSO_SUPPORTED_NETWORKS.has(chainId)) {
        throw Error(`Chain ${chainId} is not supported`);
    }

    try {
        const ensoClient = new EnsoClient({ apiKey: agent.config.ensoApiKey || ENSO_API_KEY });
        
        const tokenInRes = await ensoClient.getTokenData({
            chainId,
            address: tokenIn as Address,
            includeMetadata: true,
        });
        
        if (tokenInRes.data.length === 0 || typeof tokenInRes.data[0].decimals !== "number") {
            throw Error(`Token ${tokenIn} is not supported`);
        }
        
        const tokenInData = tokenInRes.data[0];
        const amountInWei = parseUnits(amountIn, tokenInData.decimals);

        const params: RouteParams = {
            chainId,
            tokenIn: tokenIn as Address,
            tokenOut: tokenOut as Address,
            amountIn: amountInWei.toString(),
            fromAddress: sender,
            receiver: sender,
            spender: sender,
        };
        
        const routeData = await ensoClient.getRouterData(params);

        if (tokenIn.toLowerCase() !== ENSO_ETH) {
            await walletClient.sendTransaction({
                to: tokenIn as Address,
                abi: MIN_ERC20_ABI,
                functionName: "approve",
                args: [routeData.tx.to as Address, BigInt(amountInWei)],
            });
        }

        const tx = await walletClient.sendTransaction({
            to: routeData.tx.to,
            data: routeData.tx.data as Hash,
            value: BigInt(routeData.tx.value),
        });
        
        return tx.hash;
    } catch (err) {
        throw Error(`Failed to route through Enso: ${err}`);
    }
}