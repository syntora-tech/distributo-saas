'use client';

import { useState } from 'react';
import { Recipient } from '../types/distribution';
import Input from './Input';

interface ManualRecipientFormProps {
    onAdd: (recipient: Recipient) => void;
}

export default function ManualRecipientForm({ onAdd }: ManualRecipientFormProps) {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address && amount) {
            onAdd({
                address,
                amount: parseFloat(amount)
            });
            setAddress('');
            setAmount('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                required
            />
            <Input
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
            />
            <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Add Recipient
            </button>
        </form>
    );
} 