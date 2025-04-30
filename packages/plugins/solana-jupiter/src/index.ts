import { SolanaChain, PluginBase, SolanaWalletBase } from "agentix";

import {
    cancelLimitOrders as cancelJupiterLimitOrders,
    createLimitOrder as createJupiterLimitOrder,
    fetchPrice as fetchJupiterPrice,
    getLimitOrderHistory as getJupiterLimitOrderHistory,
    getOpenLimitOrders as getOpenJupiterLimitOrders,
    stakeWithJup as stakeWithJupiter,
    trade as tradeJupiter,
} from "./tools";
import cancelLimitOrdersAction from "./actions/cancelLimitOrders";
import createLimitOrderAction from "./actions/createLimitOrder";
import fetchPriceAction from "./actions/fetchPrice";
import getLimitOrderHistoryAction from "./actions/getLimitOrderHistory";
import getOpenLimitOrdersAction from "./actions/getOpenLimitOrders";
import tokenDataByTickerAction from "./actions/getTokenDataByTicker";
import stakeWithJupAction from "./actions/stakeWithJup";
import tradeAction from "./actions/trade";  

class JupiterPlugin extends PluginBase<SolanaWalletBase> {
    constructor() {
        const methods = {
            cancelJupiterLimitOrders,
            createJupiterLimitOrder,
            fetchJupiterPrice,
            getJupiterLimitOrderHistory,
            getOpenJupiterLimitOrders,
            stakeWithJupiter,
            tradeJupiter,
        };

        const actions = [
            cancelLimitOrdersAction,
            createLimitOrderAction,
            fetchPriceAction,
            getLimitOrderHistoryAction,
            getOpenLimitOrdersAction,
            tokenDataByTickerAction,
            stakeWithJupAction,
            tradeAction,
        ];

        const supportedChains = [
            {
                type: "solana",
            } as SolanaChain
        ];

        super("jupiter", methods, actions, supportedChains);
    }

    supportsWallet(wallet: SolanaWalletBase): boolean {
        return wallet instanceof SolanaWalletBase;
    }
}

export default JupiterPlugin;
