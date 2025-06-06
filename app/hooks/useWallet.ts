import { Network } from '@/lib/blockchain/network';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export function useWalletBalance() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!publicKey) {
            setBalance(null);
            return;
        }

        const fetchBalance = async () => {
            try {
                setLoading(true);
                setError(null);
                const balance = await connection.getBalance(publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch balance');
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
        const id = connection.onAccountChange(publicKey, (accountInfo) => {
            setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
        });

        return () => {
            connection.removeAccountChangeListener(id);
        };
    }, [connection, publicKey]);

    return { balance, loading, error };
}

export function useWalletSign() {
    const { publicKey, signMessage } = useWallet();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sign = async (message: string) => {
        if (!publicKey || !signMessage) {
            setError('Wallet not connected');
            return null;
        }

        try {
            setLoading(true);
            setError(null);
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);
            return signature;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign message');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { sign, loading, error };
}

export function useNetwork() {
    const { connection } = useConnection();
    const [network, setNetwork] = useState<Network | null>(null);

    useEffect(() => {
        const network = connection.rpcEndpoint.includes('devnet') ? Network.SOLANA_DEVNET : Network.SOLANA_MAINNET;
        console.log('network', network);
        console.log('connection', connection);
        setNetwork(network);
    }, [connection]);

    return { network };
} 