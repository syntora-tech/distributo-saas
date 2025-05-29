'use client';

import { useState, useEffect } from 'react';

interface DistributionProgressProps {
    totalRecipients: number;
    onComplete: () => void;
}

export default function DistributionProgress({ totalRecipients, onComplete }: DistributionProgressProps) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'error'>('pending');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'processing') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStatus('completed');
                        onComplete();
                        return 100;
                    }
                    return prev + 1;
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [status, onComplete]);

    const startDistribution = () => {
        setStatus('processing');
        setError(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Distribution Progress</h3>
                <span className="text-sm text-gray-500">
                    {progress}% Complete
                </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${status === 'error' ? 'bg-red-600' :
                            status === 'completed' ? 'bg-green-600' :
                                'bg-blue-600'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="text-sm text-gray-600">
                <p>Total Recipients: {totalRecipients}</p>
                <p>Processed: {Math.floor((progress / 100) * totalRecipients)}</p>
                <p>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
            </div>

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            {status === 'pending' && (
                <button
                    onClick={startDistribution}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Start Distribution
                </button>
            )}

            {status === 'completed' && (
                <div className="text-green-600 text-sm">
                    Distribution completed successfully!
                </div>
            )}
        </div>
    );
} 