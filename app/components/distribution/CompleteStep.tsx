'use client';

interface CompleteStepProps {
    onDownloadReport: () => void;
}

export default function CompleteStep({ onDownloadReport }: CompleteStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">Distribution Complete!</h2>
                <p className="mt-2 text-gray-600">
                    Your tokens have been successfully distributed to all recipients.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Next Steps</h3>
                <ul className="space-y-4">
                    <li className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-600">
                            Download the distribution report for your records
                        </p>
                    </li>
                    <li className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-600">
                            Verify the transactions on the blockchain explorer
                        </p>
                    </li>
                    <li className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-600">
                            Create a new distribution if needed
                        </p>
                    </li>
                </ul>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onDownloadReport}
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Download Report
                </button>
            </div>
        </div>
    );
} 