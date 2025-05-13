import { Agentix } from "agentix";
import {
    QueryBalanceRequest,
    QueryBalanceResponse,
    QueryDenomMetadataRequest,
    QueryDenomMetadataResponse,
    QuerySupplyOfRequest,
    QuerySupplyOfResponse,
} from "cosmjs-types/cosmos/bank/v1beta1/query";
import { 
    TokenBalanceParams, 
    DenomMetadataParams,
    SupplyOfParams,
    SendTokenParams
} from "../types";
import { convertFromBaseUnit, convertToBaseUnit, getChainInfo } from "../utils";

type Asset = {
    base: string;
    symbol: string;
    display: string;
    denom_units: Array<{
        denom: string;
        exponent: number;
    }>;
};

/**
 * Gets the balance of a token denom in base units. Convert to decimal units before returning.
 */
export async function getTokenBalance({
    agent,
    address,
    symbol
}: {
    agent: Agentix<any>;
} & TokenBalanceParams) {
    try {
        const cosmosWallet = agent.wallet;
        const chainInfo = await getChainInfo(cosmosWallet);
        const tokenInfo = chainInfo.asset?.assets.find((a: Asset) => a.symbol === symbol);

        if (!tokenInfo) {
            throw new Error("The requested token is unavailable on the network");
        }

        const data = QueryBalanceRequest.encode({ address, denom: tokenInfo.base }).finish();
        const message = { typeUrl: "/cosmos.bank.v1beta1.Query/Balance", value: data };

        const rawBalance = await cosmosWallet.read({ message });
        const decode = QueryBalanceResponse.decode(rawBalance.value.value);

        if (!decode?.balance) {
            throw new Error("The requested balance is unavailable");
        }

        const tokenAsset = chainInfo.asset?.assets.find((a: Asset) => a.base === decode.balance?.denom);
        const exponent = tokenAsset?.denom_units.find((d: { denom: string; exponent: number }) => d.denom === tokenAsset?.display)?.exponent ?? 0;
        const balance = convertFromBaseUnit(Number(decode.balance.amount), exponent);
        
        return balance.toString();
    } catch (error) {
        throw new Error(`Failed to fetch balance: ${error}`);
    }
}

/**
 * Get the metadata of a token with the specified symbol.
 */
export async function getDenomMetadata({
    agent,
    symbol
}: {
    agent: Agentix<any>;
} & DenomMetadataParams) {
    try {
        const cosmosWallet = agent.wallet;
        const chainInfo = await getChainInfo(cosmosWallet);
        const tokenInfo = chainInfo.asset?.assets.find((a: Asset) => a.symbol === symbol);

        if (!tokenInfo) {
            throw new Error("The requested token is unavailable on the network");
        }

        const data = QueryDenomMetadataRequest.encode({ denom: tokenInfo.base }).finish();
        const message = { typeUrl: "/cosmos.bank.v1beta1.Query/DenomMetadata", value: data };

        const metadata = await cosmosWallet.read({ message });
        const decode = QueryDenomMetadataResponse.decode(metadata.value.value);

        if (!decode.metadata) {
            throw new Error("The requested metadata is unavailable");
        }

        return `${decode.metadata.display}-${decode.metadata.name}-${decode.metadata.description}-${decode.metadata.symbol}`;
    } catch (error) {
        throw new Error(`Failed to fetch denom metadata: ${error}`);
    }
}

/**
 * Get the total supply of a token with the specified symbol.
 */
export async function getSupplyOf({
    agent,
    symbol
}: {
    agent: Agentix<any>;
} & SupplyOfParams) {
    try {
        const cosmosWallet = agent.wallet;
        const chainInfo = await getChainInfo(cosmosWallet);
        const tokenInfo = chainInfo.asset?.assets.find((a: Asset) => a.symbol === symbol);

        if (!tokenInfo) {
            throw new Error("The requested token is unavailable on the network");
        }

        const data = QuerySupplyOfRequest.encode({ denom: tokenInfo.base }).finish();
        const message = { typeUrl: "/cosmos.bank.v1beta1.Query/SupplyOf", value: data };

        const supplyOf = await cosmosWallet.read({ message });
        const decode = QuerySupplyOfResponse.decode(supplyOf.value.value);

        if (!decode.amount) {
            throw new Error("The requested token data is unavailable");
        }

        const tokenAsset = chainInfo.asset?.assets.find((a: Asset) => a.base === decode.amount?.denom);
        const exponent = tokenAsset?.denom_units.find((d: { denom: string; exponent: number }) => d.denom === tokenAsset?.display)?.exponent ?? 0;
        const totalSupply = convertFromBaseUnit(Number(decode.amount.amount), exponent);
        
        return `$${totalSupply.toString()}_${decode.amount.denom}`;
    } catch (error) {
        throw new Error(`Failed to fetch total supply: ${error}`);
    }
}

/**
 * Sends an amount of a Token of a specified symbol to a receivers address.
 */
export async function sendToken({
    agent,
    toAddress,
    amount
}: {
    agent: Agentix<any>;
} & SendTokenParams) {
    try {
        const cosmosWallet = agent.wallet;
        const chainInfo = await getChainInfo(cosmosWallet);
        const tokenInfo = chainInfo.asset?.assets.find((a: Asset) => a.symbol === amount.symbol);

        if (!tokenInfo) {
            throw new Error("The requested token is unavailable on the network");
        }

        const tokenAsset = chainInfo.asset?.assets.find((a: Asset) => a.base === tokenInfo.base);
        const exponent = tokenAsset?.denom_units.find((d: { denom: string; exponent: number }) => d.denom === tokenAsset?.display)?.exponent ?? 0;
        const baseAmount = convertToBaseUnit(Number(amount.amount), exponent);

        const hash = await cosmosWallet.sendTransaction({
            message: {
                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                value: {
                    fromAddress: cosmosWallet.getAddress(),
                    toAddress: toAddress,
                    amount: [{ denom: tokenInfo.base, amount: baseAmount.toString() }],
                },
            },
        });

        if (!hash.value.transactionHash) {
            throw new Error("Transaction was incomplete");
        }

        return hash.value.transactionHash;
    } catch (error) {
        throw new Error(`Failed to send token: ${error}`);
    }
} 