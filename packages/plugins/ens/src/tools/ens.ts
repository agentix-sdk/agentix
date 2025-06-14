import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import { EnsParams } from "../types";
import { http, createPublicClient, type Chain } from "viem";
import { mainnet, sepolia, goerli } from "viem/chains";
import { normalize } from "viem/ens";

export async function getAddressFromEns({
    agent,
    ensName,
    provider,
    chainId
}: {
    agent: Agentix<EvmWalletBase>;
    provider?: string;
    chainId?: number;
} & EnsParams): Promise<string | null> {
    let resolveChainId = agent.wallet.getChain().id;
    
    if (chainId) {
        resolveChainId = chainId;
    }
    
    const supportedChains = [mainnet, sepolia, goerli];
    const chain = supportedChains.find((c: Chain) => c.id === resolveChainId) || mainnet;
    
    const client = createPublicClient({
        chain: chain,
        transport: http(provider),
    });
    
    const address = await client.getEnsAddress({
        name: normalize(ensName),
    });
    
    return address;
} 