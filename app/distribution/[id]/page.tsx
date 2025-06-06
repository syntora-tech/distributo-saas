'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Distribution } from '../../types/distribution';
import DistributionFlow from '../../components/distribution/DistributionFlow';
import { formatDistanceToNow } from 'date-fns';

export default function DistributionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [distribution, setDistribution] = useState<Distribution | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDistribution = async () => {
            try {
                console.log('params.id', params.id);
                const response = await fetch(`/api/distribution/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch distribution');
                }
                const data = await response.json();
                setDistribution(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDistribution();
    }, [params.id]);

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

    if (!distribution) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Distribution Not Found</h1>
                        <button
                            onClick={() => router.push('/distributions')}
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Distributions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // If distribution is not completed, show the setup flow
    if (distribution.status === 'PENDING') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Continue Setup</h1>
                        <p className="text-gray-600 mt-2">
                            Complete the setup for distribution "{distribution.name}"
                        </p>
                    </div>
                    <DistributionFlow initialData={distribution} />
                </div>
            </div>
        );
    }

    // Show distribution details for completed distributions
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{distribution.name}</h1>
                            <p className="text-gray-600 mt-2">
                                Created {formatDistanceToNow(new Date(distribution.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${distribution.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            distribution.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {distribution.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribution Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Token Address</p>
                                    <p className="text-sm font-mono text-gray-900">{distribution.tokenAddress}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Deposit Address</p>
                                    <p className="text-sm font-mono text-gray-900">{distribution.depositAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        // TODO: Implement report download
                                        console.log('Download report');
                                    }}
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Download Report
                                </button>
                                <button
                                    onClick={() => router.push('/distributions')}
                                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Back to Distributions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 