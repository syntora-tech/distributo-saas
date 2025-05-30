import { Connection, clusterApiUrl } from '@solana/web3.js';

export enum Network {
    SOLANA_MAINNET = 'solana_mainnet',
    SOLANA_DEVNET = 'solana_devnet'
}

export const NETWORK_CONFIGS = {
    [Network.SOLANA_MAINNET]: {
        name: 'Solana Mainnet',
        endpoint: clusterApiUrl('mainnet-beta'),
        explorer: 'https://explorer.solana.com'
    },
    [Network.SOLANA_DEVNET]: {
        name: 'Solana Devnet',
        endpoint: clusterApiUrl('devnet'),
        explorer: 'https://explorer.solana.com/?cluster=devnet'
    }
};

export function getConnection(network: Network): Connection {
    return new Connection(NETWORK_CONFIGS[network].endpoint);
}

export function isValidNetwork(network: string): network is Network {
    return Object.values(Network).includes(network as Network);
} 