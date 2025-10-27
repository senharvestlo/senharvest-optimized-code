import React from 'react';

export default function ProformaHTML() {
  return (
    <div className="w-full h-screen border rounded">
      <iframe 
        src="/proforma-standalone.html"
        className="w-full h-full border-0"
        title="Proforma Invoice Editor"
      />
    </div>
  );
}
