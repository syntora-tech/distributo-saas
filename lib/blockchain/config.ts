import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { TransactionSpeed } from '../../types/distribution';

export const SERVICE_FEE_ADDRESS = '8XjXH2oEJPLLXcR6QSZADF5xyNH6gQQkQ1kgSHDTrcLy';

export const SPEED_TO_LAMPORTS: Record<TransactionSpeed, number> = {
    [TransactionSpeed.SLOW]: 50_000,
    [TransactionSpeed.MEDIUM]: 200_000,
    [TransactionSpeed.FAST]: 500_000,
};

export const SERVICE_FEE_SOL = 0.00001; // service fee per transaction in SOL

export const NETWORK_TOKENS = {
    [WalletAdapterNetwork.Mainnet]: {
        symbol: 'SOL',
        decimals: 9,
    },
    [WalletAdapterNetwork.Devnet]: {
        symbol: 'SOL',
        decimals: 9,
    },
    [WalletAdapterNetwork.Testnet]: {
        symbol: 'SOL',
        decimals: 9,
    },
} as const;

export type NetworkToken = keyof typeof NETWORK_TOKENS; 