'use client';

interface DistributionStepProps {
    progress: number;
}

export default function DistributionStep({ progress }: DistributionStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Distribution in Progress</h2>
                <p className="text-gray-600 mt-2">
                    Please wait while we process your distribution. This may take a few minutes.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Processing</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                Please do not close this window. You will be redirected to the results page when the distribution is complete.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 