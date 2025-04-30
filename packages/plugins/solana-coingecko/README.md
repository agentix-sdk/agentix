# @agentix/plugin-solana-coingecko

A Solana CoinGecko plugin for the Agentix SDK, providing tools to access CoinGecko's cryptocurrency data for Solana tokens and pools.

## Features

- Get token information by address
- Fetch token price data
- Get latest pools
- Get trending pools
- Get trending tokens
- Get top gainers

## Installation

```bash
npm install @agentix/plugin-solana-coingecko
# or
yarn add @agentix/plugin-solana-coingecko
# or
pnpm add @agentix/plugin-solana-coingecko
```

## Requirements

- A CoinGecko Pro API key

## Setup

```typescript
import { Agentix } from "agentix";
import CoingeckoPlugin from "@agentix/plugin-solana-coingecko";
import { solanaAdaptor } from "@agentix/wallet-solana";

// Initialize Agentix with your wallet
const agent = new Agentix({
  solanaAdaptor({
    connection: connection,
    publicKey: publicKey,
    sendTransaction: sendTransaction,
    signAllTransactions: signAllTransactions,
    signMessage: signMessage,
    signTransaction: signTransaction,
  }),
  config: {
    COINGECKO_PRO_API_KEY: "your-coingecko-pro-api-key"
  }
});

// Register the CoinGecko plugin
agent.use(new CoingeckoPlugin());
```

## AI Agent Support

This plugin provides AI agent-compatible actions that can be used with Agentix's AI capabilities:

- `getCoingeckoTokenInfo`
- `getCoingeckoTokenPriceData`
- `getCoingeckoLatestPools`
- `getCoingeckoTrendingPools`
- `getCoingeckoTrendingTokens`
- `getCoingeckoTopGainers`

## License

Apache-2.0 