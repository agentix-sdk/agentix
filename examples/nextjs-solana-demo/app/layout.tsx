// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { WalletConnectionProvider } from '../components/WalletConnectionProvider';

export const metadata: Metadata = {
  title: 'Solana Wallet App',
  description: 'Using Phantom & Solflare with App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletConnectionProvider>
          {children}
        </WalletConnectionProvider>
      </body>
    </html>
  );
}