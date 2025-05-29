'use client';

import { DistributionFormData, Recipient } from '../../types/distribution';
import CSVImport from '../CSVImport';
import ManualRecipientForm from '../ManualRecipientForm';

interface RecipientsStepProps {
    formData: DistributionFormData;
    onChange: (data: Partial<DistributionFormData>) => void;
}

export default function RecipientsStep({ formData, onChange }: RecipientsStepProps) {
    const handleAddRecipients = (newRecipients: Recipient[]) => {
        onChange({
            recipients: [...formData.recipients, ...newRecipients]
        });
    };

    const handleRemoveRecipient = (index: number) => {
        onChange({
            recipients: formData.recipients.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Add Recipients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Import CSV</h3>
                    <CSVImport onImport={handleAddRecipients} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Add Manually</h3>
                    <ManualRecipientForm onAdd={(recipient) => handleAddRecipients([recipient])} />
                </div>
            </div>
            {formData.recipients.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Recipients List ({formData.recipients.length})</h3>
                    <div className="max-h-60 overflow-y-auto">
                        <div className="bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-gray-500 uppercase tracking-wider">
                                <div className="col-span-6">Address</div>
                                <div className="col-span-4">Amount</div>
                                <div className="col-span-2">Actions</div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {formData.recipients.map((recipient, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                                        <div className="col-span-6 font-mono text-sm">{recipient.address}</div>
                                        <div className="col-span-4 text-sm">{recipient.amount}</div>
                                        <div className="col-span-2">
                                            <button
                                                onClick={() => handleRemoveRecipient(index)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 