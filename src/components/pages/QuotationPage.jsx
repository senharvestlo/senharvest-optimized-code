import React from 'react';
import useLang from '../../hooks/useLang';

export default function QuotationPage() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quotation Page</h2>
          <p className="text-gray-600">Quotation functionality is being updated.</p>
        </div>
      </div>
    </div>
  );
}