'use client';

import DistributionFlow from '../components/DistributionFlow';

export default function DistributionPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Token Distribution</h1>
                    <p className="mt-2 text-gray-600">
                        Create and manage your token distributions
                    </p>
                </div>
                <DistributionFlow />
            </div>
        </div>
    );
} 