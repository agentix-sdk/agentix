# Agentix

Agentix is an SDK for connecting AI agents to web3 protocols. It provides a streamlined way for AI agents to interact with various blockchain networks and protocols.

## Overview

Agentix enables seamless integration between AI agents and blockchain protocols, with a primary focus on Solana and Ethereum (EVM) ecosystems. The SDK is structured in a modular way, allowing developers to use only the components they need for their specific use case.

## Project Structure

- **Core**: Main SDK functionality (`agentix`)
- **Plugins**: Protocol-specific integrations, predominantly for Solana ecosystems
- **Wallets**: Wallet implementations for Solana and EVM

## Installation

```bash
npm install agentix
# or
yarn add agentix
# or
pnpm add agentix
```

For specific plugins or wallets, install them separately:

```bash
npm install @agentix/plugin-solana-adrena
npm install @agentix/wallet-solana
# etc.
```

## Available Packages

### Core
- `agentix`: Main SDK package

### Wallets
- `@agentix/wallet-solana`: Solana wallet implementation
- `@agentix/wallet-evm`: Ethereum/EVM wallet implementation

### Plugins (Solana Ecosystem)
- `@agentix/plugin-solana-adrena`: Integration with Adrena protocol
- `@agentix/plugin-solana-jupiter`: Jupiter integration
- `@agentix/plugin-solana-raydium`: Raydium integration
- `@agentix/plugin-solana-orca`: Orca integration
- `@agentix/plugin-solana-pyth`: Pyth Network integration
- `@agentix/plugin-solana-metaplex`: Metaplex integration
- `@agentix/plugin-solana-tensor`: Tensor integration
- And many more...

## Development

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Setting Up

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the packages:
   ```bash
   pnpm build
   ```

### Scripts

- `pnpm clean` - Clean all build artifacts
- `pnpm build` - Build all packages
- `pnpm build:core` - Build only the core package
- `pnpm lint` - Run linter
- `pnpm lint:fix` - Run linter and fix issues
- `pnpm format` - Format code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
