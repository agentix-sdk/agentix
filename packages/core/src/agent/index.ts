import { Action, Plugin } from '../types';
import { Chain } from '../types/chain';
import { WalletBase } from './wallet-base';

export interface AgentixConfig {
  [key: string]: any;
}

/**
 * Main class for interacting with multiple blockchains.
 * 
 * Supports both EVM and Solana chains with a unified interface.
 */
export class Agentix<W extends WalletBase> {
  private plugins: Map<string, Plugin<W>> = new Map();
  public methods: Record<string, unknown> = {} as Record<string, unknown>;
  public actions: Action<W>[] = [];
  
  /**
   * Create a new Agentix instance
   * 
   * @param wallet - The wallet to use for transactions
   * @param config - Configuration options
   */
  constructor(
    public readonly wallet: W,
    public readonly config: AgentixConfig = {}
  ) {}
  
  /**
   * Get the current chain from the wallet
   */
  public getChain(): Chain {
    return this.wallet.getChain();
  }
  
  /**
   * Adds a plugin and registers its methods and actions
   * 
   * @param plugin - The plugin to add
   * @returns The Agentix instance with the plugin's methods
   */
  use<P extends Plugin<W>>(plugin: P): Agentix<W> {
    // Check if plugin is already registered
    if (this.plugins.has(plugin.name)) {
      return this as Agentix<W>;
    }
    
    // Check if plugin supports the current chain
    const currentChain = this.getChain();
    if (!plugin.supportsChain(currentChain)) {
      console.warn(`Plugin ${plugin.name} does not support chain ${currentChain.type}`);
      return this as Agentix<W>;
    }
    
    // Check if plugin supports the wallet
    if (!plugin.supportsWallet(this.wallet)) {
      console.warn(`Plugin ${plugin.name} does not support the current wallet type`);
      return this as Agentix<W>;
    }
    
    // Initialize the plugin
    plugin.initialize(this);
    
    // Register plugin methods
    for (const [methodName, method] of Object.entries(plugin.methods)) {
      if ((this.methods as Record<string, unknown>)[methodName]) {
        throw new Error(`Method ${methodName} already exists in methods`);
      }
      (this.methods as Record<string, unknown>)[methodName] = method.bind(plugin);
    }
    
    // Register plugin actions
    for (const action of plugin.actions) {
      this.actions.push(action);
    }
    
    // Store the plugin
    this.plugins.set(plugin.name, plugin);
    
    return this as Agentix<W>;
  }
} 