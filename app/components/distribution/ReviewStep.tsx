'use client';

import { DistributionFormData } from '../../types/distribution';

interface ReviewStepProps {
    formData: DistributionFormData;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
    const totalAmount = formData.recipients.reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Review Distribution</h2>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Token Information</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Token Address</p>
                        <p className="font-mono text-sm text-gray-900">{formData.tokenAddress}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Token Name</p>
                        <p className="font-mono text-sm text-gray-900">{formData.tokenName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Funding Amount</p>
                        <p className="font-mono text-sm text-gray-900">{formData.fundingAmount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recipients Summary</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Recipients</p>
                        <p className="text-2xl font-bold text-gray-900">{formData.recipients.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">{totalAmount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recipients List</h3>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none z-10" />
                    <div className="max-h-[300px] overflow-y-auto pr-4 -mr-4">
                        <div className="bg-gray-50 rounded-lg">
                            <div className="sticky top-0 bg-gray-50 z-20 grid grid-cols-12 gap-4 p-4 font-medium text-sm text-gray-500 uppercase tracking-wider">
                                <div className="col-span-6">Address</div>
                                <div className="col-span-6">Amount</div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {formData.recipients.map((recipient, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                                        <div className="col-span-6 font-mono text-sm text-gray-900">{recipient.address}</div>
                                        <div className="col-span-6 text-sm text-gray-900">{recipient.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 