'use client';

interface DistributionStepProps {
    progress: number;
}

export default function DistributionStep({ progress }: DistributionStepProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Distributing Tokens</h2>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Please wait while we distribute tokens to all recipients...
                    </p>
                </div>
            </div>
        </div>
    );
} 