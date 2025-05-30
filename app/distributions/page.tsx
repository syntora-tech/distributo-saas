'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import DistributionCard from '../components/distribution/DistributionCard';
import { Distribution } from '../types/distribution';

export default function DistributionsPage() {
    const { publicKey } = useWallet();
    const [distributions, setDistributions] = useState<Distribution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDistributions = async () => {
            if (!publicKey) {
                setDistributions([]);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/distribution/list?walletAddress=${publicKey.toBase58()}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch distributions');
                }

                const data = await response.json();
                setDistributions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch distributions');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDistributions();
    }, [publicKey]);

    if (!publicKey) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
                        <p className="text-gray-500">Please connect your wallet to view your distributions</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                        <p className="text-red-500">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {distributions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Distributions Yet</h1>
                        <p className="text-gray-500 mb-6">Create your first distribution to get started</p>
                        <button
                            onClick={() => window.location.href = '/distribution'}
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Distribution
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Your Distributions</h1>
                            <button
                                onClick={() => window.location.href = '/distribution'}
                                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create New Distribution
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {distributions.map((distribution) => (
                                <DistributionCard key={distribution.id} distribution={distribution} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 