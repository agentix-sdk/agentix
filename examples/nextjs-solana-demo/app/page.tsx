/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Agentix, createSolanaTools, SolanaWalletBase } from 'agentix';
import { useMemo, useState, FormEvent } from 'react';
import { solanaAdaptor } from '@agentix/wallet-solana';
import CoingeckoPlugin from '@agentix/plugin-solana-coingecko';
import { generateText } from 'ai';
import { createOpenAI } from "@ai-sdk/openai";

export default function Home() {
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction, signAllTransactions, signMessage, signTransaction } = useWallet();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const agentixTools = useMemo(() => {
    if (! connection || !connected || !publicKey || !sendTransaction || !signAllTransactions || !signMessage || !signTransaction) return null;

    const agentix = new Agentix<SolanaWalletBase>(
      solanaAdaptor({
        connection: connection,
        publicKey: publicKey,
        sendTransaction: sendTransaction,
        signAllTransactions: signAllTransactions,
        signMessage: signMessage,
        signTransaction: signTransaction,
      }),
      {
        COINGECKO_DEMO_API_KEY: process.env.NEXT_PUBLIC_COINGECKO_DEMO_API_KEY,
      }
    );

    agentix.use(new CoingeckoPlugin());

    return createSolanaTools(agentix, agentix.actions);
  }, [connection, connected, publicKey, sendTransaction, signAllTransactions, signMessage, signTransaction]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;
    
    setIsLoading(true);
    try {
      const openai = createOpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });
      const model = openai('gpt-4o');
      
      const toolResults: any[] = [];
      
      const aiResult = await generateText({
        model: model,
        tools: agentixTools || {},
        maxSteps: 10,
        prompt: prompt,
        onStepFinish: (event) => {
          console.log(event);
          toolResults.push(event.toolResults);
        },
      });
      
      // Convert the result to string if it's not already
      setResult(typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult));
    } catch (error) {
      console.error('Error generating text:', error);
      setResult('Error: Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Connect to Solana Wallet</h1>
      <WalletMultiButton className="mb-8" />

      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Enter your prompt:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md min-h-24"
              placeholder="Ask something..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !connected}
            className={`w-full py-2 px-4 rounded-md ${
              connected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
            } text-white font-medium`}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
          {!connected && (
            <p className="text-sm text-red-500">Connect your wallet first to use AI features</p>
          )}
        </form>

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Result:</h2>
            <div className="p-4 bg-gray-800 rounded-md whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}