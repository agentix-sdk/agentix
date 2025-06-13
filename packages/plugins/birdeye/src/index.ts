import { EvmChain, SolanaChain, PluginBase, EvmWalletBase, SolanaWalletBase } from "agentix";
import {
    birdeyeGetTokenPriceAction,
    birdeyeGetTokenHistoryPriceAction,
    birdeyeGetOhlcvAction,
    birdeyeGetOhlcvPairAction,
    birdeyeGetTokenSecurityAction,
    birdeyeGetTrendingTokensAction,
    birdeyeSearchTokenAction,
} from "./actions/birdeyeActions";
import {
    getTokenPrice,
    getTokenHistoryPrice,
    getOhlcv,
    getOhlcvPair,
    getTokenSecurity,
    getTrendingTokens,
    searchToken,
} from "./tools/birdeye";

class BirdeyePlugin extends PluginBase<EvmWalletBase | SolanaWalletBase> {
    constructor() {
        const methods = {
            getTokenPrice,
            getTokenHistoryPrice,
            getOhlcv,
            getOhlcvPair,
            getTokenSecurity,
            getTrendingTokens,
            searchToken,
        };

        const actions = [
            birdeyeGetTokenPriceAction,
            birdeyeGetTokenHistoryPriceAction,
            birdeyeGetOhlcvAction,
            birdeyeGetOhlcvPairAction,
            birdeyeGetTokenSecurityAction,
            birdeyeGetTrendingTokensAction,
            birdeyeSearchTokenAction,
        ] as any;

        const supportedChains = [
            {
                type: "evm",
            } as EvmChain,
            {
                type: "solana",
            } as SolanaChain
        ];

        super("birdeye", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase | SolanaWalletBase): boolean {
        return wallet instanceof EvmWalletBase || wallet instanceof SolanaWalletBase;
    }
}

export default BirdeyePlugin;
