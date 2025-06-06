"use client";

import '@solana/wallet-adapter-react-ui/styles.css';
import './styles/wallet-adapter.css';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { SolanaNetworkProvider, useSolanaNetwork } from "./context/SolanaNetworkContext";

function SolanaWalletProviders({ children }: { children: React.ReactNode }) {
  const { network, endpoint } = useSolanaNetwork();
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaNetworkProvider>
      <SolanaWalletProviders>
        {children}
      </SolanaWalletProviders>
    </SolanaNetworkProvider>
  );
} 