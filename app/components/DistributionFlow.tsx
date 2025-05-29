'use client';

import { useState } from 'react';
import { DistributionState, DistributionStep, DistributionFormData, Recipient } from '../types/distribution';
import CSVImport from './CSVImport';
import ManualRecipientForm from './ManualRecipientForm';
import DistributionProgress from './DistributionProgress';

const initialFormData: DistributionFormData = {
    tokenAddress: '',
    tokenName: '',
    recipients: [],
    fundingAmount: 0,
};

const initialState: DistributionState = {
    currentStep: 'create',
    formData: initialFormData,
    isProcessing: false,
    error: null,
};

const steps: DistributionStep[] = ['create', 'recipients', 'funding', 'start', 'monitor'];

export default function DistributionFlow() {
    const [state, setState] = useState<DistributionState>(initialState);

    const handleNext = () => {
        const currentIndex = steps.indexOf(state.currentStep);
        if (currentIndex < steps.length - 1) {
            setState(prev => ({
                ...prev,
                currentStep: steps[currentIndex + 1],
                error: null,
            }));
        }
    };

    const handleBack = () => {
        const currentIndex = steps.indexOf(state.currentStep);
        if (currentIndex > 0) {
            setState(prev => ({
                ...prev,
                currentStep: steps[currentIndex - 1],
                error: null,
            }));
        }
    };

    const renderStep = () => {
        switch (state.currentStep) {
            case 'create':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Create Distribution</h2>
                        <div className="space-y-2">
                            <label className="block">
                                <span className="text-gray-700">Token Address</span>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={state.formData.tokenAddress}
                                    onChange={(e) => setState(prev => ({
                                        ...prev,
                                        formData: { ...prev.formData, tokenAddress: e.target.value }
                                    }))}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Token Name</span>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={state.formData.tokenName}
                                    onChange={(e) => setState(prev => ({
                                        ...prev,
                                        formData: { ...prev.formData, tokenName: e.target.value }
                                    }))}
                                />
                            </label>
                        </div>
                    </div>
                );
            case 'recipients':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Add Recipients</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Import CSV</h3>
                                <CSVImport
                                    onImport={(recipients: Recipient[]) => {
                                        setState(prev => ({
                                            ...prev,
                                            formData: {
                                                ...prev.formData,
                                                recipients: [...prev.formData.recipients, ...recipients]
                                            }
                                        }));
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Add Manually</h3>
                                <ManualRecipientForm
                                    onAdd={(recipient: Recipient) => {
                                        setState(prev => ({
                                            ...prev,
                                            formData: {
                                                ...prev.formData,
                                                recipients: [...prev.formData.recipients, recipient]
                                            }
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                        {state.formData.recipients.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Recipients List ({state.formData.recipients.length})</h3>
                                <div className="max-h-60 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {state.formData.recipients.map((recipient, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{recipient.address}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{recipient.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => {
                                                                setState(prev => ({
                                                                    ...prev,
                                                                    formData: {
                                                                        ...prev.formData,
                                                                        recipients: prev.formData.recipients.filter((_, i) => i !== index)
                                                                    }
                                                                }));
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'funding':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Deposit Funding</h2>
                        <div className="space-y-2">
                            <p>Deposit Address: <span className="font-mono">0x...</span></p>
                            <div className="bg-gray-100 p-4 rounded">
                                <p>Required Amount: {state.formData.fundingAmount}</p>
                                <p>Current Balance: 0</p>
                            </div>
                        </div>
                    </div>
                );
            case 'start':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Start Distribution</h2>
                        <div className="space-y-2">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={() => setState(prev => ({ ...prev, isProcessing: true }))}
                            >
                                Start Distribution
                            </button>
                        </div>
                    </div>
                );
            case 'monitor':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Monitor & Report</h2>
                        <DistributionProgress
                            totalRecipients={state.formData.recipients.length}
                            onComplete={() => {
                                // Handle completion
                                console.log('Distribution completed');
                            }}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex justify-between">
                    {steps.map((step, index) => (
                        <div
                            key={step}
                            className={`flex-1 text-center ${steps.indexOf(state.currentStep) >= index
                                ? 'text-blue-600'
                                : 'text-gray-400'
                                }`}
                        >
                            <div className="w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center">
                                {index + 1}
                            </div>
                            <div className="text-sm mt-2 capitalize">{step}</div>
                        </div>
                    ))}
                </div>
            </div>

            {state.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {state.error}
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
                {renderStep()}
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    onClick={handleBack}
                    disabled={state.currentStep === 'create'}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={state.currentStep === 'monitor'}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
} 