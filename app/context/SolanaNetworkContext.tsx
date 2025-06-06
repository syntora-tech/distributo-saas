import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import React, { createContext, useContext } from 'react';
import { clusterApiUrl } from '@solana/web3.js';



function getEnvNetwork(): WalletAdapterNetwork {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    switch (network) {
        case 'mainnet':
            return WalletAdapterNetwork.Mainnet;
        case 'devnet':
            return WalletAdapterNetwork.Devnet;
        case 'testnet':
            return WalletAdapterNetwork.Testnet;
        default:
            return WalletAdapterNetwork.Devnet;
    }
}

interface SolanaNetworkContextProps {
    network: WalletAdapterNetwork;
    endpoint: string;
}

const SolanaNetworkContext = createContext<SolanaNetworkContextProps | undefined>(undefined);

export const SolanaNetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const network = getEnvNetwork();
    const endpoint = clusterApiUrl(network);

    return (
        <SolanaNetworkContext.Provider value={{ network, endpoint }}>
            {children}
        </SolanaNetworkContext.Provider>
    );
};

export function useSolanaNetwork() {
    const ctx = useContext(SolanaNetworkContext);
    if (!ctx) throw new Error('useSolanaNetwork must be used within SolanaNetworkProvider');
    return ctx;
} 