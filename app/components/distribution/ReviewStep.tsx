'use client';

import { DistributionFormData } from '../../types/distribution';
import Table from '../Table';

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
                <Table
                    headers={['Address', 'Amount']}
                    data={formData.recipients}
                    columnWidths={[8, 4]}
                    renderRow={(recipient, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                            <div className="col-span-8 font-mono text-sm text-gray-900">{recipient.address}</div>
                            <div className="col-span-4 text-sm text-gray-900">{recipient.amount}</div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
} 