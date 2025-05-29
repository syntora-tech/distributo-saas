'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletBalance } from '../hooks/useWallet';
import { useEffect, useState } from 'react';

export default function WalletButton() {
    const { connected, publicKey } = useWallet();
    const { balance, loading, error } = useWalletBalance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const copyAddress = async () => {
        if (!publicKey) return;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(publicKey.toString());
            } else {
                // Fallback for non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = publicKey.toString();
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            {connected && balance !== null && !loading && !error && (
                <div className="text-sm text-gray-600">
                    Balance: {balance.toFixed(4)} SOL
                </div>
            )}
            {loading && (
                <div className="text-sm text-gray-600">
                    Loading...
                </div>
            )}
            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}
            <WalletMultiButton className="!bg-gradient-to-r from-blue-500 to-blue-600 hover:!from-blue-600 hover:!to-blue-700 !text-white !px-6 !py-2.5 !rounded-lg !transition-all !duration-200 !shadow-sm hover:!shadow-md !font-medium !text-sm" />
        </div>
    );
} 