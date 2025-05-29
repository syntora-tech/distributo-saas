'use client';

import { useState } from 'react';
import { Recipient } from '../types/distribution';

interface ManualRecipientFormProps {
    onAdd: (recipient: Recipient) => void;
}

export default function ManualRecipientForm({ onAdd }: ManualRecipientFormProps) {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!address) {
            setError('Address is required');
            return;
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Amount must be a positive number');
            return;
        }

        onAdd({ address, amount: amountNum });
        setAddress('');
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Address
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Enter recipient address"
                    />
                </label>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Amount
                    <input
                        type="number"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Enter amount"
                    />
                </label>
            </div>
            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Add Recipient
            </button>
        </form>
    );
} 