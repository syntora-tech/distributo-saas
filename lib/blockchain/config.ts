export const NETWORK_TOKENS = {
    SOL: {
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
    },
    // Add other networks here when needed
} as const;

export type NetworkToken = keyof typeof NETWORK_TOKENS; 