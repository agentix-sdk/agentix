export interface TokenInfo {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
}

export interface ChainInfo {
    chainId: string;
    originalChainId: string;
    chainName: string;
}

export interface BridgeQuoteParams {
    srcChainId: string;
    srcChainTokenIn: string;
    srcChainTokenInAmount: string;
    dstChainId: string;
    dstChainTokenOut: string;
    slippage?: string;
}

export interface BridgeOrderParams {
    srcChainId: string;
    srcChainTokenIn: string;
    srcChainTokenInAmount: string;
    dstChainId: string;
    dstChainTokenOut: string;
    dstChainTokenOutRecipient: string;
    senderAddress: string;
}
