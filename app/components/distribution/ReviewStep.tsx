'use client';

import { DistributionFormData } from '../../types/distribution';

interface ReviewStepProps {
    formData: DistributionFormData;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
    const totalAmount = formData.recipients.reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Distribution</h2>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Token Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Token Address</p>
                        <p className="font-mono text-sm">{formData.tokenAddress}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Token Name</p>
                        <p className="font-mono text-sm">{formData.tokenName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Funding Amount</p>
                        <p className="font-mono text-sm">{formData.fundingAmount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recipients Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Total Recipients</p>
                        <p className="text-2xl font-bold">{formData.recipients.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold">{totalAmount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recipients List</h3>
                <div className="max-h-60 overflow-y-auto">
                    <div className="bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-gray-500 uppercase tracking-wider">
                            <div className="col-span-6">Address</div>
                            <div className="col-span-6">Amount</div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {formData.recipients.map((recipient, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                                    <div className="col-span-6 font-mono text-sm">{recipient.address}</div>
                                    <div className="col-span-6 text-sm">{recipient.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 