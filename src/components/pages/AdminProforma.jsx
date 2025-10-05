import React from 'react';
import useLang from '../../hooks/useLang';

export default function AdminProforma() {
  const { lang } = useLang();

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proforma Editor</h3>
        <p className="text-gray-600">Proforma editor is being updated.</p>
      </div>
    </div>
  );
}


