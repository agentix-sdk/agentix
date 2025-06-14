import { EvmWalletBase } from "agentix";
import { Agentix } from "agentix";
import { BridgeQuoteParams, BridgeOrderParams, TokenInfo, ChainInfo } from "../types";

const DEFAULT_BASE_URL = "https://deswap.debridge.finance/v1.0";

async function makeRequest(url: string, method: "GET" | "POST" = "GET", body?: any) {
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
    }

    return response.json();
}

export async function getBridgeQuote({
    agent,
    srcChainId,
    srcChainTokenIn,
    srcChainTokenInAmount,
    dstChainId,
    dstChainTokenOut,
    slippage
}: {
    agent: Agentix<EvmWalletBase>;
} & BridgeQuoteParams) {
    const userAddress = agent.wallet.getAddress();
    
    const isSameChain = srcChainId === dstChainId;
    
    const url = isSameChain
        ? `${DEFAULT_BASE_URL}/chain/transaction?${new URLSearchParams({
              chainId: srcChainId,
              tokenIn: srcChainTokenIn,
              tokenInAmount: srcChainTokenInAmount,
              tokenOut: dstChainTokenOut,
              tokenOutRecipient: userAddress,
              slippage: slippage || "auto",
              affiliateFeePercent: "0",
          })}`
        : `${DEFAULT_BASE_URL}/dln/order/create-tx?${new URLSearchParams({
              srcChainId,
              srcChainTokenIn,
              srcChainTokenInAmount,
              dstChainId,
              dstChainTokenOut,
              dstChainTokenOutAmount: "auto",
              prependOperatingExpenses: "true",
              additionalTakerRewardBps: "0",
          })}`;

    return await makeRequest(url);
}

export async function createBridgeOrder({
    agent,
    srcChainId,
    srcChainTokenIn,
    srcChainTokenInAmount,
    dstChainId,
    dstChainTokenOut,
    dstChainTokenOutRecipient,
    senderAddress
}: {
    agent: Agentix<EvmWalletBase>;
} & BridgeOrderParams) {
    const params = new URLSearchParams();
    params.append("srcChainId", srcChainId);
    params.append("srcChainTokenIn", srcChainTokenIn);
    params.append("srcChainTokenInAmount", srcChainTokenInAmount);
    params.append("dstChainId", dstChainId);
    params.append("dstChainTokenOut", dstChainTokenOut);
    params.append("dstChainTokenOutRecipient", dstChainTokenOutRecipient);
    params.append("senderAddress", senderAddress);
    params.append("srcChainOrderAuthorityAddress", senderAddress);
    params.append("srcChainRefundAddress", senderAddress);
    params.append("dstChainOrderAuthorityAddress", dstChainTokenOutRecipient);
    params.append("referralCode", "21064");
    params.append("deBridgeApp", "AGENTIX");
    params.append("prependOperatingExpenses", "true");

    const url = `${DEFAULT_BASE_URL}/dln/order/create-tx?${params}`;
    
    return await makeRequest(url);
}

export async function executeBridgeTransaction({
    agent,
    txData
}: {
    agent: Agentix<EvmWalletBase>;
    txData: {
        to: string;
        data: string;
        value?: string;
    };
}) {
    const walletClient = agent.wallet;

    if (!txData.to || !txData.data) {
        throw new Error("Invalid transaction data: missing 'to' or 'data' field");
    }

    if (!txData.data.startsWith("0x")) {
        throw new Error("Invalid transaction data: 'data' field must start with '0x'");
    }

    const tx = await walletClient.sendTransaction({
        to: txData.to as `0x${string}`,
        data: txData.data as `0x${string}`,
        value: txData.value ? BigInt(txData.value) : undefined,
    });

    return tx.hash;
}

export async function getTokenInfo({
    agent,
    chainId,
    tokenAddress,
    search
}: {
    agent: Agentix<EvmWalletBase>;
    chainId: string;
    tokenAddress?: string;
    search?: string;
}): Promise<{ tokens: Record<string, TokenInfo> } | TokenInfo> {
    const url = `${DEFAULT_BASE_URL}/token-list?chainId=${chainId}`;
    const responseData = await makeRequest(url);
    const data = responseData.tokens;

    if (tokenAddress) {
        const tokenInfo = data[tokenAddress];
        if (!tokenInfo) {
            throw new Error(`Token ${tokenAddress} not found on chain ${chainId}`);
        }
        return {
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            address: tokenAddress,
            decimals: tokenInfo.decimals,
        };
    }

    const searchTerm = search?.toLowerCase() || "";
    const tokens = Object.entries(data)
        .filter(
            ([, token]: [string, any]) =>
                token.symbol && (!searchTerm || token.symbol.toLowerCase().includes(searchTerm))
        )
        .reduce((acc, [address, token]: [string, any]) => {
            acc[address] = {
                name: token.name,
                symbol: token.symbol,
                address: address,
                decimals: token.decimals,
            };
            return acc;
        }, {} as Record<string, TokenInfo>);

    return { tokens };
}

export async function getSupportedChains({
    agent
}: {
    agent: Agentix<EvmWalletBase>;
}): Promise<{ chains: ChainInfo[] }> {
    const url = `${DEFAULT_BASE_URL}/supported-chains-info`;
    return await makeRequest(url);
}

export async function checkTransactionStatus({
    agent,
    txHash
}: {
    agent: Agentix<EvmWalletBase>;
    txHash: string;
}) {
    const orderIdsUrl = `${DEFAULT_BASE_URL}/dln/tx/${txHash}/order-ids`;
    const orderIdsData = await makeRequest(orderIdsUrl);

    if (!orderIdsData.orderIds || orderIdsData.orderIds.length === 0) {
        throw new Error("No order IDs found for this transaction");
    }

    const statuses = await Promise.all(
        orderIdsData.orderIds.map(async (orderId: string) => {
            const statusUrl = `${DEFAULT_BASE_URL}/dln/order/${orderId}/status`;
            const statusData = await makeRequest(statusUrl);
            statusData.orderLink = `https://app.debridge.finance/order?orderId=${orderId}`;
            return statusData;
        })
    );

    return statuses;
} 