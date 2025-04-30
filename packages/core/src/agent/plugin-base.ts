import { Action, Plugin } from '../types';
import { Chain } from '../types/chain';
import { Agentix } from '.';
import { WalletBase } from './wallet-base';

/**
 * Abstract base class for plugins
 * 
 * This class provides a foundation for building plugins that work with Agentix
 * and support multiple chains (EVM, Solana, etc.)
 */
export abstract class PluginBase<W extends WalletBase> implements Plugin<W> {
  /**
   * Create a new plugin
   * 
   * @param name - Unique identifier for the plugin
   * @param methods - Methods provided by the plugin
   * @param actions - Actions provided by the plugin
   * @param supportedChainTypes - Chain types this plugin supports
   */
  constructor(
    public readonly name: string,
    public readonly methods: Record<string, Function> = {},
    public readonly actions: Action<W>[] = [],
    protected readonly supportedChains: Chain[] = []
  ) {}
  
  /**
   * Check if this plugin supports a specific chain
   * 
   * @param chain - The chain to check
   * @returns True if the chain is supported, false otherwise
   */
  supportsChain(chain: Chain): boolean {
    return !!this.supportedChains.find(c => c.type === chain.type);
  }
  
  /**
   * Check if this plugin supports a specific wallet
   * 
   * @param wallet - The wallet to check
   * @returns True if the wallet is supported, false otherwise
   */
  supportsWallet(wallet: W): boolean {
    return wallet instanceof WalletBase;
  }
  
  /**
   * Initialize the plugin with an Agentix instance
   * This method should be overridden by plugins that need custom initialization
   * 
   * @param agent - The Agentix instance
   */
  initialize(agent: Agentix<W>): void {
    // Default implementation does nothing
  }
} 