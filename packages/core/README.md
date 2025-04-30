# Agentix Core

Agentix is a multi-chain SDK that provides a unified interface for interacting with different blockchains using a plugin-based architecture. Currently, it supports both EVM (Ethereum Virtual Machine) chains and Solana, with the ability to extend to other chains in the future.

## Architecture Overview

The Agentix architecture is designed around these key components:

1. **Core SDK**: The base framework that provides common functionality and interfaces
2. **Chain Adapters**: Components that adapt chain-specific wallet implementations to a common interface
3. **Plugins**: Extensions that add specific functionality for different protocols and use cases
4. **Actions**: High-level operations that can be executed by AI agents or applications
5. **AI Agent Integration**: Built-in support for AI agents using LangChain and Vercel AI SDK

## Key Components

### Agentix Class

The `Agentix` class is the main entry point for using the SDK. It:

- Connects to a specific blockchain via a wallet
- Loads and manages plugins
- Provides methods to execute actions
- Integrates with AI systems via the agent architecture

### Wallet Adapters

Wallet adapters abstract away chain-specific wallet implementations, providing a unified interface:

- `EVMWalletAdapter`: For Ethereum and other EVM-compatible chains
- `SolanaWalletAdapter`: For Solana

### Plugins

Plugins extend the SDK with additional functionality:

- Each plugin can support one or multiple chains
- Plugins provide methods and actions
- Plugins can be combined to create rich experiences
- Plugins follow a standard interface defined in `PluginBase`

### Actions

Actions are high-level operations that can be executed:

- Each action has a unique ID, name, and description
- Actions specify which chains they support
- Actions provide an execution function that performs the operation
- The action system integrates with AI agents to provide natural language understanding

### AI Integration

Agentix Core includes:

- LangChain integration for connecting to various large language models
- Vercel AI SDK support for streaming responses and AI-based interactions
- Tools for converting blockchain actions into AI-understandable formats

## Project Structure

```
packages/core/
├── src/
│   ├── agent/            - Agent system and plugin architecture
│   ├── constants/        - Common constants and configuration
│   ├── langchain/        - LangChain integration components
│   ├── types/            - TypeScript type definitions
│   ├── utils/            - Utility functions and helpers
│   ├── vercel-ai/        - Vercel AI SDK integration
│   └── index.ts          - Main entry point and exports
```

## Using Agentix

### Installation

```bash
npm install agentix
# or
yarn add agentix
# or
pnpm add agentix
```

### Getting Started

```typescript
import { Agentix } from 'agentix';
import { EVMWalletAdapter } from '@agentix/wallet-evm';
import { chains } from 'agentix/chains';
import { EVMPlugin } from '@agentix/evm';

// Create a wallet adapter
const wallet = new EVMWalletAdapter(yourEthersWalletOrProvider, chains.ethereum);

// Create Agentix instance
const agentix = new Agentix(wallet);

// Add EVM plugin
const agentixWithEvm = agentix.use(new EVMPlugin());

// Use plugin methods
const balance = await agentixWithEvm.methods.getBalance();

// Execute an action
const result = await agentixWithEvm.executeAction('send-eth', {
  to: 'recipient-address',
  amount: '0.1',
});
```

### Using Multiple Chains

Agentix can be used with different chains:

```typescript
// For EVM chains
const evmWallet = new EVMWalletAdapter(yourEthersWallet, chains.ethereum);
const evmagentix = new Agentix(evmWallet).use(new EVMPlugin());

// For Solana
const solanaWallet = new SolanaWalletAdapter(yourSolanaWallet, chains.solana);
const solanaagentix = new Agentix(solanaWallet).use(new SolanaDefiPlugin());
```

### AI Agent Integration

Agentix provides integration with AI systems:

```typescript
import { Agentix } from 'agentix';
import { SolanaWalletAdapter } from '@agentix/wallet-solana';
import { SolanaJupiterPlugin } from '@agentix/plugin-solana-jupiter';
import { createLangchainAgent } from 'agentix/langchain';

// Create Agentix instance with plugins
const wallet = new SolanaWalletAdapter(yourSolanaWallet);
const agentix = new Agentix(wallet).use(new SolanaJupiterPlugin());

// Create an AI agent with the Agentix instance
const agent = createLangchainAgent(agentix, {
  model: 'gpt-4',
  temperature: 0.7,
});

// Let the AI agent perform operations based on natural language
const response = await agent.execute(
  "Find me the best swap rate for 1 SOL to USDC and execute the trade"
);
```

## Creating Plugins

You can create custom plugins by extending the `PluginBase` class:

```typescript
import { PluginBase } from 'agentix';

export class MyPlugin extends PluginBase {
  constructor() {
    const methods = {
      myMethod: async (agent, param1, param2) => {
        // Implementation
      }
    };
    
    const actions = [
      {
        id: 'my-action',
        name: 'My Action',
        description: 'Does something cool',
        supportedChains: ['evm', 'solana'],
        execute: async (params) => {
          // Implementation
        }
      }
    ];
    
    super('my-plugin', methods, actions, ['evm', 'solana']);
  }
  
  initialize(agent) {
    // Custom initialization
    super.initialize(agent);
  }
}
```

## Architecture Benefits

1. **Unified Interface**: Work with multiple chains using a consistent API
2. **Extensibility**: Add new chains and protocols without changing the core
3. **Composability**: Combine plugins to create rich experiences
4. **Type Safety**: Full TypeScript support with intelligent typing
5. **AI Ready**: Designed to work with AI agents through a clear action system
6. **Modern Architecture**: ESM support and tree-shakable imports

## Dependencies

- [@langchain/core](https://github.com/langchain/langchain): For AI agent integration
- [@solana/web3.js](https://github.com/solana-labs/solana-web3.js): For Solana blockchain interactions
- [ai](https://github.com/vercel/ai): Vercel AI SDK for AI streaming and UI integration
- [zod](https://github.com/colinhacks/zod): Schema validation and type safety

## License

Apache-2.0 