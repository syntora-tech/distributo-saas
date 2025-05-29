'use client';

interface CompleteStepProps {
    onDownloadReport: () => void;
}

export default function CompleteStep({ onDownloadReport }: CompleteStepProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Distribution Complete</h2>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Distribution Successful
                        </h3>
                        <p className="text-gray-500">
                            All tokens have been distributed successfully. You can download the distribution report below.
                        </p>
                    </div>
                    <button
                        onClick={onDownloadReport}
                        className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );
} 