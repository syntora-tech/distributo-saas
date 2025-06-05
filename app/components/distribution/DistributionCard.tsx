'use client';

import { Distribution } from '../../types/distribution';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface DistributionCardProps {
    distribution: Distribution;
}

export default function DistributionCard({ distribution }: DistributionCardProps) {
    const router = useRouter();
    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        ACTIVE: 'bg-green-100 text-green-800',
        COMPLETED: 'bg-blue-100 text-blue-800',
        FAILED: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
        PENDING: 'Pending',
        ACTIVE: 'Active',
        COMPLETED: 'Completed',
        FAILED: 'Failed'
    };

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/distribution/${distribution.id}`)}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {distribution.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Created {formatDistanceToNow(new Date(distribution.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[distribution.status]}`}>
                        {statusLabels[distribution.status]}
                    </span>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Token Address</p>
                        <p className="text-sm font-mono text-gray-900 truncate">
                            {distribution.tokenAddress}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Deposit Address</p>
                        <p className="text-sm font-mono text-gray-900 truncate">
                            {distribution.depositAddress.address}
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-500">
                                Last updated {formatDistanceToNow(new Date(distribution.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <button
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/distribution/${distribution.id}`);
                            }}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 