'use client';

import { useState, useEffect } from 'react';
import { Distribution, DistributionFormData } from '../../types/distribution';
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

interface DistributionFlowProps {
    initialData?: Distribution;
}

export default function DistributionFlow({ initialData }: DistributionFlowProps) {
    // Load initial state from localStorage or use defaults
    const loadInitialState = () => {
        if (initialData) {
            const key = `distribution_${initialData.id}`;
            const savedData = localStorage.getItem(key);

            if (savedData) {
                const {
                    currentStep: savedStep,
                    formData: savedFormData,
                    isDistributing: savedIsDistributing,
                    distributionProgress: savedProgressValue,
                    distributionReport: savedReport,
                    isDistributionCreated: savedIsCreated,
                } = JSON.parse(savedData);

                return {
                    currentStep: savedStep,
                    formData: savedFormData,
                    isDistributing: savedIsDistributing,
                    distributionProgress: savedProgressValue,
                    distributionReport: savedReport,
                    isDistributionCreated: savedIsCreated,
                };
            }
        }

        return {
            currentStep: initialData ? 1 : 0,
            formData: initialData ? {
                tokenAddress: initialData.tokenAddress,
                tokenName: initialData.name,
                recipients: initialData.recipients || [],
                depositAddressId: initialData.depositAddressId,
            } : {
                tokenAddress: '',
                tokenName: '',
                recipients: [],
            },
            isDistributing: false,
            distributionProgress: 0,
            distributionReport: null,
            isDistributionCreated: !!initialData,
        };
    };

    const initialState = loadInitialState();
    const [currentStep, setCurrentStep] = useState(initialState.currentStep);
    const [formData, setFormData] = useState<DistributionFormData>(initialState.formData);
    const [isDistributing, setIsDistributing] = useState(initialState.isDistributing);
    const [distributionProgress, setDistributionProgress] = useState(initialState.distributionProgress);
    const [distributionReport, setDistributionReport] = useState<string | null>(initialState.distributionReport);
    const [isDistributionCreated, setIsDistributionCreated] = useState(initialState.isDistributionCreated);

    // Save to localStorage when state changes
    useEffect(() => {
        if (initialData) {
            const key = `distribution_${initialData.id}`;
            localStorage.setItem(key, JSON.stringify({
                currentStep,
                formData,
                isDistributing,
                distributionProgress,
                distributionReport,
                isDistributionCreated,
            }));
        }
    }, [currentStep, formData, isDistributing, distributionProgress, distributionReport, isDistributionCreated, initialData]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => {
                const newStep = prev + 1;
                if (prev === 0) {
                    setIsDistributionCreated(true);
                }
                return newStep;
            });
        }
    };

    const handleBack = () => {
        if (currentStep > 0 && !isDistributionCreated) {
            setCurrentStep(prev => {
                const newStep = prev - 1;
                return newStep;
            });
        }
    };

    const handleFormChange = (data: Partial<DistributionFormData>) => {
        setFormData(prev => ({
            ...prev,
            ...data
        }));
    };

    const handleSubmit = async () => {
        setIsDistributing(true);
        try {
            // TODO: Implement distribution submission
            console.log('Submitting distribution:', formData);
            // Simulate progress
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 500));
                setDistributionProgress(i);
            }
            handleNext();
        } catch (error) {
            console.error('Error submitting distribution:', error);
        } finally {
            setIsDistributing(false);
        }
    };

    const handleDownloadReport = () => {
        // TODO: Implement report download
        console.log('Downloading report');
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
            {initialData && (
                <div className="mb-8 bg-white shadow-sm rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Distribution Name</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{formData.tokenName}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Token Address</h3>
                            <p className="mt-1 font-mono text-sm text-gray-900 break-all">{formData.tokenAddress}</p>
                        </div>
                    </div>
                </div>
            )}

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
                        {(currentStep === 2 || !isDistributionCreated) && (
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