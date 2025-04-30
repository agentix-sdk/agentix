import { WalletBase } from '@/agent/wallet-base';
import { Agentix } from '../agent';
import { Action } from './action';
import { Chain } from './chain';

/**
 * Interface for plugins that can be added to Agentix
 */
export interface Plugin<W extends WalletBase> {
  /** Unique identifier for the plugin */
  name: string;
  
  /** Methods that this plugin provides */
  methods: Record<string, Function>;
  
  /** Actions that this plugin provides */
  actions: Action<W>[];
  
  /** Initialize the plugin with the Agentix instance */
  initialize: (agent: Agentix<W>) => void;
  
  /** Check if this plugin supports a specific chain */
  supportsChain: (chain: Chain) => boolean;
  
  /** Check if this plugin works with the provided wallet */
  supportsWallet: (wallet: W) => boolean;
} 