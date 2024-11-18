import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div 
      role="alert" 
      className={`flex items-center text-red-400 text-sm ${className}`}
    >
      <AlertCircle className="w-4 h-4 mr-2" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}