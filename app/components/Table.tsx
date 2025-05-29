'use client';

import { useState } from 'react';

interface TableProps {
    headers: string[];
    data: any[];
    renderRow: (item: any, index: number) => React.ReactNode;
    itemsPerPage?: number;
    columnWidths?: number[];
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function Table({ headers, data, renderRow, itemsPerPage: initialItemsPerPage = 50, columnWidths = [] }: TableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    // Якщо columnWidths не передано, розподіляємо рівномірно
    const widths = columnWidths.length === headers.length
        ? columnWidths
        : headers.map(() => 12 / headers.length);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = Number(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
        <div className="relative w-full">
            <div className="max-h-[500px] overflow-y-auto w-full">
                <div className="bg-gray-50 rounded-lg w-full">
                    <div className="sticky top-0 bg-gray-50 z-20 grid grid-cols-12 gap-4 p-4 font-medium text-sm text-gray-500 uppercase tracking-wider w-full">
                        {headers.map((header, index) => (
                            <div key={index} className={`col-span-${widths[index]}`}>{header}</div>
                        ))}
                    </div>
                    <div className="divide-y divide-gray-100 w-full">
                        {currentData.map((item, index) => renderRow(item, startIndex + index))}
                    </div>
                </div>
            </div>
            <div className="m-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        {ITEMS_PER_PAGE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-700">entries</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
} 