'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        className={`
              w-full px-4 py-4 rounded-lg border-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${error
                                ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300'
                                : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-300'
                            }
              ${className}
            `}
                        {...props}
                    />
                    {error && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                {(error || helperText) && (
                    <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input; 