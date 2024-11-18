import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-red-900 bg-opacity-20 p-6 rounded-lg max-w-md w-full">
        <div className="flex items-center text-red-400 mb-4">
          <AlertCircle className="w-8 h-8 mr-2" />
          <h2 className="text-xl font-bold">Something went wrong</h2>
        </div>
        <p className="text-red-200 mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}