'use client';

import { useState, KeyboardEvent } from 'react';
import { DistributionFormData, Recipient } from '../../types/distribution';
import Input from '../Input';
import Table from '../Table';
import CSVImport from '../CSVImport';

interface RecipientsStepProps {
    formData: DistributionFormData;
    onChange: (data: Partial<DistributionFormData>) => void;
}

export default function RecipientsStep({ formData, onChange }: RecipientsStepProps) {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editAddress, setEditAddress] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const handleAddRecipient = () => {
        if (!address || !amount) return;

        const newRecipients = [...formData.recipients, { address, amount: Number(amount) }];
        onChange({ recipients: newRecipients });
        setAddress('');
        setAmount('');
    };

    const handleAddRecipients = (newRecipients: Recipient[]) => {
        onChange({
            recipients: [...formData.recipients, ...newRecipients]
        });
    };

    const handleRemoveRecipient = (index: number) => {
        const newRecipients = formData.recipients.filter((_, i) => i !== index);
        onChange({ recipients: newRecipients });
    };

    const handleStartEdit = (index: number) => {
        const recipient = formData.recipients[index];
        setEditingIndex(index);
        setEditAddress(recipient.address);
        setEditAmount(recipient.amount.toString());
        setHasChanges(false);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditAddress('');
        setEditAmount('');
        setHasChanges(false);
    };

    const handleSaveEdit = () => {
        if (editingIndex === null) return;

        const newRecipients = [...formData.recipients];
        newRecipients[editingIndex] = {
            address: editAddress,
            amount: Number(editAmount)
        };

        onChange({ recipients: newRecipients });
        setEditingIndex(null);
        setEditAddress('');
        setEditAmount('');
        setHasChanges(false);
    };

    const handleUndoEdit = () => {
        if (editingIndex === null) return;

        const recipient = formData.recipients[editingIndex];
        setEditAddress(recipient.address);
        setEditAmount(recipient.amount.toString());
        setHasChanges(false);
    };

    const handleEditChange = (newAddress: string, newAmount: string) => {
        setEditAddress(newAddress);
        setEditAmount(newAmount);

        const recipient = formData.recipients[editingIndex!];
        setHasChanges(
            newAddress !== recipient.address ||
            Number(newAmount) !== recipient.amount
        );
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            if (hasChanges) {
                handleUndoEdit();
            } else {
                handleCancelEdit();
            }
        } else if (e.key === 'Enter' && hasChanges) {
            handleSaveEdit();
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Add Recipients</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Import CSV</h3>
                    <CSVImport onImport={handleAddRecipients} />
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Manually</h3>
                    <div className="space-y-4">
                        <Input
                            label="Address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="0x..."
                        />
                        <Input
                            label="Amount"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.0"
                            type="number"
                        />
                        <button
                            onClick={handleAddRecipient}
                            className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Recipient
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-xl">
                <div className="flex justify-between items-center px-8 py-5 border-b-2 border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Recipients List</h3>
                    {formData.recipients.length > 0 && (
                        <button
                            onClick={() => onChange({ recipients: [] })}
                            className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear All
                        </button>
                    )}
                </div>
                <div>
                    <Table
                        headers={['', 'Address', 'Amount']}
                        data={formData.recipients}
                        columnWidths={[1, 8, 3]}
                        renderRow={(recipient, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                                <div className="col-span-1 flex items-center gap-2">
                                    <button
                                        onClick={() => handleRemoveRecipient(index)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    {editingIndex !== index && (
                                        <button
                                            onClick={() => handleStartEdit(index)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    )}
                                    {hasChanges && (<button
                                        onClick={handleSaveEdit}
                                        className="text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>)
                                    }
                                    {!hasChanges && editingIndex === index && (
                                        <button
                                            onClick={handleCancelEdit}
                                            className="text-gray-600 hover:text-gray-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="col-span-8">
                                    {editingIndex === index ? (
                                        <Input
                                            label=""
                                            value={editAddress}
                                            onChange={e => handleEditChange(e.target.value, editAmount)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="0x..."
                                            className="w-full"
                                        />
                                    ) : (
                                        <div className="font-mono text-sm text-gray-900">{recipient.address}</div>
                                    )}
                                </div>
                                <div className="col-span-3 flex items-center gap-2">
                                    {editingIndex === index ? (
                                        <>
                                            <Input
                                                label=""
                                                value={editAmount}
                                                onChange={e => handleEditChange(editAddress, e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="0.0"
                                                type="number"
                                                className="w-full"
                                            />
                                            {hasChanges && (
                                                <>
                                                    <button
                                                        onClick={handleUndoEdit}
                                                        className="text-gray-600 hover:text-gray-700 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-900">{recipient.amount}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
} 