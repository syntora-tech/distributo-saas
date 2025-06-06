'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSolanaNetwork } from '../context/SolanaNetworkContext';
import { useEffect, useState } from 'react';

export default function WalletButton() {
    const { connected, publicKey } = useWallet();
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
            <WalletMultiButton className="!bg-gradient-to-r from-blue-500 to-blue-600 hover:!from-blue-600 hover:!to-blue-700 !text-white !px-6 !py-2.5 !rounded-lg !transition-all !duration-200 !shadow-sm hover:!shadow-md !font-medium !text-sm" />
        </div>
    );
} 