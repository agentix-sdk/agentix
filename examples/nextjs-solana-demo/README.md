# Agentix Solana Demo with Vercel AI

This is a Next.js project that demonstrates how to use the Agentix SDK with the Vercel AI SDK to create an AI assistant capable of performing Solana blockchain operations.

## Features

- Interactive chat interface powered by Vercel AI SDK
- Integration with Agentix for Solana blockchain operations
- Adrena plugin for perpetual trading features
- Demo wallet generation for testing
- Support for custom wallets via private key input

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd examples/nextjs-solana-demo
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file in the root directory with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o  # or any other compatible model
```

4. Build the required packages:

```bash
# From the root directory
pnpm build:core
pnpm build:plugin-solana-adrena
```

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using the Demo

1. **Wallet Configuration**:
   - You can use the demo wallet (generated automatically) or provide your own private key
   - Customize the RPC URL if needed (defaults to the Solana mainnet)

2. **Example Prompts**:
   - Click on any of the example prompts to quickly start a conversation
   - Or type your own prompt related to Solana and Adrena trading

3. **Chat Interface**:
   - Interact with the AI assistant to learn about Solana and Adrena trading
   - The AI can provide information about opening long/short positions, closing positions, etc.

## Implementation Details

- Uses Vercel AI SDK for streaming chat completions
- Integrates Agentix for Solana blockchain operations
- Implements the Adrena plugin for perpetual trading
- Uses Next.js App Router for API routes and frontend

## Note on Private Keys

This demo allows inputting private keys for testing purposes. In a production environment:

1. **Never store private keys** in client-side code
2. **Always use a secure wallet connection** (e.g., Phantom, Solflare)
3. **Implement proper authentication** and secure key management

## Learn More

- [Agentix Documentation](https://github.com/yourusername/agentix)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Documentation](https://docs.solana.com)
