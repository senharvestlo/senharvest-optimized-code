import React, { useEffect, useState } from 'react';
import { getSpec } from '../../services/productSpecs';

export default function ProductSpecsModal({ productKey, open, onClose, lang='fr' }) {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if (!open || !productKey) return;
    (async ()=>{
      setLoading(true);
      const row = await getSpec(productKey);
      setSpec(row);
      setLoading(false);
    })();
  }, [open, productKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full rounded shadow-xl p-5" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {lang==='fr' ? 'Spécifications du produit' : 'Product specifications'}
            {spec?.productKey ? ` — ${spec.productKey}` : ''}
          </h3>
          <button onClick={onClose} className="text-2xl leading-none">×</button>
        </div>

        {loading && <p>Chargement…</p>}
        {!loading && !spec && (
          <p className="text-gray-600">{lang==='fr' ? 'Aucune spécification disponible pour ce produit.' : 'No specs available for this product.'}</p>
        )}

        {!loading && spec && (
          <div className="space-y-4">
            {spec.summary && <p className="text-sm text-gray-700">{spec.summary}</p>}

            {(spec.sections||[]).map((sec, idx) => (
              <div key={idx} className="border rounded p-3">
                {sec.title && <h4 className="font-semibold mb-2">{sec.title}</h4>}
                <ul className="list-disc ml-5 text-sm">
                  {(sec.items||[]).map((it, i)=> <li key={i}>{it}</li>)}
                </ul>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3 text-sm">
              {spec.fields?.hsCode && <Field label={lang==='fr'?'HS Code':'HS Code'} value={spec.fields.hsCode} />}
              {spec.fields?.origin && <Field label={lang==='fr'?'Origine':'Origin'} value={spec.fields.origin} />}
              {spec.fields?.moq && <Field label="MOQ" value={spec.fields.moq} />}
              {spec.fields?.incoterms && <Field label="Incoterms" value={spec.fields.incoterms} />}
            </div>
          </div>
        )}

        <div className="mt-5 text-right">
          <button onClick={onClose} className="px-4 py-2 border rounded">{lang==='fr'?'Fermer':'Close'}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="bg-gray-50 rounded border p-2">
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
