import { EvmChain, PluginBase, EvmWalletBase } from "agentix";
import { openIncreasePosition, closeDecreasePosition, getPosition } from "./tools/bmx";
import { openIncreasePositionAction, closeDecreasePositionAction, getPositionAction } from "./actions/bmx";

/**
 * BMX plugin for trading on Mode network using BMX
 */
class BmxPlugin extends PluginBase<EvmWalletBase> {
  constructor() {
    const methods = {
      openBmxPosition: openIncreasePosition,
      closeBmxPosition: closeDecreasePosition,
      getBmxPosition: getPosition,
    };

    const actions: any[] = [
      openIncreasePositionAction,
      closeDecreasePositionAction,
      getPositionAction
    ];

    const supportedChains = [
      {
        id: 34443,
        name: "Mode",
        type: "evm",
      } as EvmChain
    ];

    super("bmx", methods, actions, supportedChains);
  }

  supportsWallet(wallet: EvmWalletBase): boolean {
    return wallet instanceof EvmWalletBase;
  }
}

export default BmxPlugin;
