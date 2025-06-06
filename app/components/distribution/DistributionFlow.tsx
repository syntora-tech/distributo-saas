'use client';

import { useState, useEffect } from 'react';
import { Distribution, DistributionFormData } from '../../types/distribution';
import { TransactionSpeed } from '@/types/distribution';
import CreateStep from './CreateStep';
import RecipientsStep from './RecipientsStep';
import ReviewStep from './ReviewStep';
import DistributionStep from './DistributionStep';
import CompleteStep from './CompleteStep';
import DepositStep from './DepositStep';
import { CalculationData } from './TransactionSpeedSelector';
import { Network } from '@/lib/blockchain/network';

const steps = [
    { id: 'create', name: 'Create Distribution' },
    { id: 'recipients', name: 'Add Recipients' },
    { id: 'review', name: 'Review' },
    { id: 'deposit', name: 'Deposit Funds' },
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
                    txSettings: savedTxSettings,
                } = JSON.parse(savedData);

                return {
                    currentStep: savedStep,
                    formData: savedFormData,
                    isDistributing: savedIsDistributing,
                    distributionProgress: savedProgressValue,
                    distributionReport: savedReport,
                    isDistributionCreated: savedIsCreated,
                    txSettings: savedTxSettings,
                };
            }
        }

        return {
            currentStep: initialData ? 1 : 0,
            formData: initialData ? {
                tokenAddress: initialData.tokenAddress,
                tokenName: initialData.name,
                transactions: initialData.transactions || [],
                depositAddress: initialData.depositAddress,
            } : {
                tokenAddress: '',
                tokenName: '',
                transactions: [],
            },
            isDistributing: false,
            distributionProgress: 0,
            distributionReport: null,
            isDistributionCreated: !!initialData,
            txSettings: null,
        };
    };

    const initialState = loadInitialState();
    const [currentStep, setCurrentStep] = useState(initialState.currentStep);
    const [formData, setFormData] = useState<DistributionFormData>(initialState.formData);
    const [isDistributing, setIsDistributing] = useState(initialState.isDistributing);
    const [distributionProgress, setDistributionProgress] = useState(initialState.distributionProgress);
    const [distributionReport, setDistributionReport] = useState<string | null>(initialState.distributionReport);
    const [isDistributionCreated, setIsDistributionCreated] = useState(initialState.isDistributionCreated);
    const [txSettings, setTxSettings] = useState<CalculationData | null>(initialState.txSettings);

    // Скрол вгору при зміні кроку
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

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
                txSettings,
            }));
        }
    }, [currentStep, formData, isDistributing, distributionProgress, distributionReport, isDistributionCreated, txSettings, initialData]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev: number) => {
                const newStep = prev + 1;
                if (prev === 0) {
                    setIsDistributionCreated(true);
                }
                return newStep;
            });
        }
    };

    const handleBack = () => {
        if (currentStep > 1 || !isDistributionCreated) {
            setCurrentStep((prev: number) => prev - 1);
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
            const distributionAddress = formData.depositAddress || initialData?.depositAddress;
            const transactionSpeed = txSettings?.speed || TransactionSpeed.MEDIUM;
            const network = (formData as any).network || (initialData as any)?.network || Network.SOLANA_DEVNET;
            const response = await fetch('/api/distribution/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    distributionAddress,
                    formData,
                    transactionSpeed,
                    network,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit distribution');
            }

            // handleNext();
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

    const handleTxSettingsChange = (txSettings: CalculationData) => {
        setTxSettings(txSettings);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CreateStep formData={formData} onChange={handleFormChange} onNext={handleNext} />;
            case 1:
                return <RecipientsStep formData={formData} onChange={handleFormChange} />;
            case 2:
                return <ReviewStep formData={formData} txSettings={txSettings} onTxSettingsChange={handleTxSettingsChange} />;
            case 3:
                return <DepositStep formData={formData} txSettings={txSettings} onNext={handleNext} />;
            case 4:
                return <DistributionStep progress={distributionProgress} />;
            case 5:
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

            {initialData?.status === 'COMPLETED' ? (
                <div className="bg-white shadow-sm rounded-xl p-8">
                    <CompleteStep onDownloadReport={handleDownloadReport} />
                </div>
            ) : (
                <>
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

                        {currentStep < 4 && (
                            <div className="mt-12 flex justify-end space-x-4">
                                {(currentStep > 1 || !isDistributionCreated) && (
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-3 text-sm font-medium bg-white text-gray-700 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                )}
                                {currentStep === 3 ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isDistributing}
                                        className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDistributing ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </div>
                                        ) : (
                                            'Submit Distribution'
                                        )}
                                    </button>
                                ) : null}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
} 