import { Connection, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';


export const NETWORK_CONFIGS = {
    [WalletAdapterNetwork.Mainnet]: {
        name: 'Solana Mainnet',
        endpoint: clusterApiUrl('mainnet-beta'),
        explorer: 'https://explorer.solana.com'
    },
    [WalletAdapterNetwork.Devnet]: {
        name: 'Solana Devnet',
        endpoint: clusterApiUrl('devnet'),
        explorer: 'https://explorer.solana.com/?cluster=devnet'
    },
    [WalletAdapterNetwork.Testnet]: {
        name: 'Solana Testnet',
        endpoint: clusterApiUrl('testnet'),
        explorer: 'https://explorer.solana.com/?cluster=testnet'
    }
};

export function getConnection(network: WalletAdapterNetwork): Connection {
    return new Connection(NETWORK_CONFIGS[network].endpoint);
}

export function isValidNetwork(network: string): network is WalletAdapterNetwork {
    return Object.values(WalletAdapterNetwork).includes(network as WalletAdapterNetwork);
} 