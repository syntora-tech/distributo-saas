'use client';

import { useState } from 'react';
import { DistributionFormData } from '../../types/distribution';
import CreateStep from './CreateStep';
import RecipientsStep from './RecipientsStep';
import ReviewStep from './ReviewStep';

const steps = [
    { id: 'create', name: 'Create Distribution' },
    { id: 'recipients', name: 'Add Recipients' },
    { id: 'review', name: 'Review' },
];

export default function DistributionFlow() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<DistributionFormData>({
        tokenAddress: '',
        tokenName: '',
        fundingAmount: 0,
        recipients: [],
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        // TODO: Implement distribution submission
        console.log('Submitting distribution:', formData);
    };

    const handleFormChange = (data: Partial<DistributionFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CreateStep formData={formData} onChange={handleFormChange} />;
            case 1:
                return <RecipientsStep formData={formData} onChange={handleFormChange} />;
            case 2:
                return <ReviewStep formData={formData} />;
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

                <div className="mt-12 flex justify-between">
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
                    {currentStep === steps.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Submit Distribution
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 