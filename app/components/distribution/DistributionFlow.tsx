'use client';

import { useState } from 'react';
import { DistributionFormData } from '../../types/distribution';
import CreateStep from './CreateStep';
import RecipientsStep from './RecipientsStep';
import ReviewStep from './ReviewStep';
import DistributionStep from './DistributionStep';
import CompleteStep from './CompleteStep';

const steps = [
    { id: 'create', name: 'Create Distribution' },
    { id: 'recipients', name: 'Add Recipients' },
    { id: 'review', name: 'Review' },
    { id: 'distribution', name: 'Distribution' },
    { id: 'complete', name: 'Complete' },
];

export default function DistributionFlow() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<DistributionFormData>({
        tokenAddress: '',
        tokenName: '',
        recipients: [],
    });
    const [isDistributing, setIsDistributing] = useState(false);
    const [distributionProgress, setDistributionProgress] = useState(0);
    const [distributionReport, setDistributionReport] = useState<string | null>(null);
    const [isDistributionCreated, setIsDistributionCreated] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            if (currentStep === 0) {
                setIsDistributionCreated(true);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0 && !isDistributionCreated) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsDistributing(true);
        setCurrentStep(3); // Move to distribution step

        // Simulate distribution process
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setDistributionProgress(i);
        }

        // Generate report
        const report = generateDistributionReport(formData);
        setDistributionReport(report);
        setIsDistributing(false);
        setCurrentStep(4); // Move to complete step
    };

    const generateDistributionReport = (data: DistributionFormData) => {
        const timestamp = new Date().toISOString();
        const totalAmount = data.recipients.reduce((sum, r) => sum + r.amount, 0);

        return `Distribution Report
Date: ${timestamp}
Token: ${data.tokenName} (${data.tokenAddress})
Total Recipients: ${data.recipients.length}
Total Amount: ${totalAmount}

Recipients:
${data.recipients.map(r => `${r.address}: ${r.amount}`).join('\n')}`;
    };

    const handleDownloadReport = () => {
        if (!distributionReport) return;

        const blob = new Blob([distributionReport], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `distribution-report-${new Date().toISOString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleFormChange = (data: Partial<DistributionFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CreateStep formData={formData} onChange={handleFormChange} onNext={handleNext} />;
            case 1:
                return <RecipientsStep formData={formData} onChange={handleFormChange} />;
            case 2:
                return <ReviewStep formData={formData} />;
            case 3:
                return <DistributionStep progress={distributionProgress} />;
            case 4:
                return <CompleteStep onDownloadReport={handleDownloadReport} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <nav aria-label="Progress" className="mb-12">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                    {steps.map((step, index) => (
                        <li key={step.id} className="md:flex-1">
                            <div
                                className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${index <= currentStep
                                    ? 'border-blue-600'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <span className="text-sm font-medium text-blue-600">
                                    Step {index + 1}
                                </span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>

            <div className="bg-white shadow-sm rounded-xl p-8">
                {renderStep()}

                {currentStep < 3 && (
                    <div className="mt-12 flex justify-between">
                        {!isDistributionCreated && (
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className={`px-6 py-3 text-sm font-medium rounded-lg ${currentStep === 0
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Back
                            </button>
                        )}
                        {currentStep === 2 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isDistributing}
                                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Distribution
                            </button>
                        ) : currentStep !== 0 && (
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Next
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 