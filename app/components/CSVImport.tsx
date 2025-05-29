'use client';

import { useState } from 'react';
import { Recipient } from '../types/distribution';

interface CSVImportProps {
    onImport: (recipients: Recipient[]) => void;
}

export default function CSVImport({ onImport }: CSVImportProps) {
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                const addressIndex = headers.findIndex(h => h === 'address');
                const amountIndex = headers.findIndex(h => h === 'amount');

                if (addressIndex === -1 || amountIndex === -1) {
                    throw new Error('CSV must contain "address" and "amount" columns');
                }

                const recipients: Recipient[] = lines.slice(1)
                    .filter(line => line.trim())
                    .map(line => {
                        const values = line.split(',').map(v => v.trim());
                        return {
                            address: values[addressIndex],
                            amount: parseFloat(values[amountIndex])
                        };
                    })
                    .filter(recipient =>
                        recipient.address &&
                        !isNaN(recipient.amount) &&
                        recipient.amount > 0
                    );

                if (recipients.length === 0) {
                    throw new Error('No valid recipients found in CSV');
                }

                onImport(recipients);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
            }
        };

        reader.onerror = () => {
            setError('Failed to read file');
        };

        reader.readAsText(file);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">CSV file with address and amount columns</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept=".csv"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>
            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
        </div>
    );
} 