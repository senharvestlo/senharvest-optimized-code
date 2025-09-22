import React from "react";

export default function SpecsModal({ product, specs, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h3 className="text-lg font-bold mb-4">
          {product.name} - Specifications
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          {specs?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
