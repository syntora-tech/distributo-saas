'use client';

import { Recipient } from '../types/distribution';

interface CSVImportProps {
    onImport: (recipients: Recipient[]) => void;
}

export default function CSVImport({ onImport }: CSVImportProps) {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const recipients: Recipient[] = [];

            // Skip header row
            for (let i = 1; i < lines.length; i++) {
                const [address, amount] = lines[i].split(',').map(item => item.trim());
                if (address && amount) {
                    recipients.push({
                        address,
                        amount: parseFloat(amount)
                    });
                }
            }

            onImport(recipients);
        };
        reader.readAsText(file);
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
            />
            <label
                htmlFor="csv-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
                Choose CSV File
            </label>
            <p className="mt-2 text-sm text-gray-500">
                Upload a CSV file with address and amount columns
            </p>
        </div>
    );
} 