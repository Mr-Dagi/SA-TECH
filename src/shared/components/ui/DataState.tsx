import React from 'react';

interface DataStateProps {
  isLoading: boolean;
  error: string | null;
}

export const DataState: React.FC<DataStateProps> = ({ isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-primary bg-primary p-6">
        <div className="text-center">
          <div className="loader mb-3 h-8 w-8 rounded-full border-4 border-t-transparent border-primary animate-spin" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600 bg-red-50 p-6 rounded-3xl">
        <div className="text-center">
          <p className="font-semibold mb-2">Something went wrong.</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return null;
};
