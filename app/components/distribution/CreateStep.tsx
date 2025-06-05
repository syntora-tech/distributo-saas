'use client';

import { useState } from 'react';
import { DistributionFormData } from '../../types/distribution';
import { createDistributionMessage } from '@/lib/blockchain/signature';
import Input from '../Input';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Network } from '@/lib/blockchain/network';
import bs58 from 'bs58';

interface CreateStepProps {
    formData: DistributionFormData;
    onChange: (data: Partial<DistributionFormData>) => void;
    onNext: () => void;
}

export default function CreateStep({ formData, onChange, onNext }: CreateStepProps) {
    const { publicKey, signMessage } = useWallet();
    const { connection } = useConnection();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!publicKey || !signMessage) {
            setError('Please connect your wallet first');
            return;
        }

        if (!formData.tokenAddress || !formData.tokenName) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const message = createDistributionMessage(formData.tokenAddress, formData.tokenName);
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            const network = connection.rpcEndpoint.includes('devnet') ? Network.SOLANA_DEVNET : Network.SOLANA_MAINNET;

            const response = await fetch('/api/distribution/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.tokenName,
                    tokenAddress: formData.tokenAddress,
                    walletAddress: publicKey.toBase58(),
                    signature: bs58.encode(signature),
                    message,
                    network
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create distribution');
            }

            const distribution = await response.json();
            onChange({ depositAddress: distribution.depositAddress.address });
            // Зберігаємо дані з новим id в localStorage
            localStorage.setItem(`distribution_${distribution.id}`, JSON.stringify({
                currentStep: 1,
                formData: {
                    ...formData,
                    depositAddress: distribution.depositAddress.address
                },
                isDistributing: false,
                distributionProgress: 0,
                distributionReport: null,
                isDistributionCreated: true
            }));
            onNext();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create distribution');
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonDisabled = !formData.tokenAddress || isLoading || !publicKey;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Create Distribution</h2>

                <div className="space-y-4">
                    <Input
                        label="Token Name"
                        value={formData.tokenName}
                        onChange={(e) => onChange({ tokenName: e.target.value })}
                        placeholder="Enter token name"
                    />

                    <Input
                        label="Token Address"
                        value={formData.tokenAddress}
                        onChange={(e) => onChange({ tokenAddress: e.target.value })}
                        placeholder="Enter token address"
                    />
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mt-8">
                    <button
                        onClick={handleCreate}
                        disabled={isButtonDisabled}
                        className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </div>
                        ) : (
                            'Create Distribution'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
} 