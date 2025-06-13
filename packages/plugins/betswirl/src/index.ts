import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import { coinTossAction, diceAction, getBetAction, getBetsAction, rouletteAction } from "./actions";
import { getBetByHash, getBetsList, playCoinToss, playDice, playRoulette } from "./tools";

class BetswirlPlugin extends PluginBase<EvmWalletBase> {
    constructor() {
        const methods = {
            playCoinToss,
            playDice,
            playRoulette,
            getBetByHash,
            getBetsList
        };

        const actions = [
            coinTossAction,
            diceAction,
            rouletteAction,
            getBetAction,
            getBetsAction
        ];

        // BetSwirl is supported on multiple chains
        const supportedChains = [
            {
                type: "evm",
            } as EvmChain
        ];

        super("betswirl", methods, actions, supportedChains);
    }

    supportsWallet(wallet: EvmWalletBase): boolean {
        return wallet instanceof EvmWalletBase;
    }
}

export default BetswirlPlugin;
