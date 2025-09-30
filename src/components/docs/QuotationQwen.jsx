import React, { useMemo, useState } from 'react';
import { exportHtmlToPdf, previewPdf } from '../../utils/pdfExport';

// Traductions simples
const T = {
  fr: {
    title: 'DEVIS',
    subtitle: "Document officiel d'offre commerciale",
    ref: 'Réf.',
    date: 'Date',
    validity: 'Validité',
    exporter: 'Vendeur',
    importer: 'Acheteur',
    productsTitle: 'Description des Marchandises',
    prod: 'Produit',
    quality: 'Qualité',
    qty: 'Qté',
    pack: 'Conditionnement',
    unitPrice: 'Prix unitaire',
    amount: 'Montant total',
    total: 'Montant Total',
    terms: 'Termes & Conditions',
    notes: 'Notes',
    sigSeller: 'Signature du Vendeur',
    acceptedBuyer: "Accepté par l'Acheteur",
    download: 'Télécharger PDF',
    preview: 'Aperçu PDF',
    save: 'Enregistrer',
    edit: 'Modifier les données',
  },
  en: {
    title: 'QUOTATION',
    subtitle: 'Official commercial offer',
    ref: 'Ref.',
    date: 'Date',
    validity: 'Validity',
    exporter: 'Seller',
    importer: 'Buyer',
    productsTitle: 'Goods Description',
    prod: 'Product',
    quality: 'Quality',
    qty: 'Qty',
    pack: 'Packing',
    unitPrice: 'Unit Price',
    amount: 'Total Amount',
    total: 'Grand Total',
    terms: 'Terms & Conditions',
    notes: 'Notes',
    sigSeller: 'Seller Signature',
    acceptedBuyer: 'Accepted by Buyer',
    download: 'Download PDF',
    preview: 'PDF Preview',
    save: 'Save',
    edit: 'Edit data',
  }
};

function money(v, curr='USD') {
  const sym = { USD: '$', EUR: '€', XOF: 'CFA', CAD: 'CAD$' }[curr] || '$';
  const n = Number(v||0);
  return `${sym}${n.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2})} ${curr}`;
}

/**
 * Props data = {
 *   lang, // 'fr' | 'en'
 *   number, date, validity,
 *   currency,
 *   seller: { name,address,phone,email },
 *   buyer:  { name,address,phone,email },
 *   lines: [{ product, quality, qty, pack, unitPrice }],
 *   terms: [string], notes: [string]
 * }
 */
export default function QuotationQwen({ initialData, onSave, onBack }) {
  const [showEditor, setShowEditor] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [data, setData] = useState(initialData || {
    lang: 'fr',
    number: `QT-${new Date().toISOString().slice(0,10)}`,
    date: new Date().toLocaleDateString('fr-FR'),
    validity: '30 jours',
    currency: 'USD',
    seller: { name:'SenHarvest Group', address:'Dakar, Sénégal', phone:'+221 77 634 0064', email:'manager@senharvest.com' },
    buyer:  { name:'', address:'', phone:'', email:'' },
    lines: [{ product:'', quality:'', qty:0, pack:'', unitPrice:0 }],
    terms: ['Offre sujette à confirmation', 'Validité 30 jours', 'Expédition sous 25-30 jours après acompte'],
    notes: ['Document non fiscal']
  });

  const lang = data?.lang || 'fr';
  const t = useMemo(() => T[lang], [lang]);

  const id = 'quotation-qwen';
  const curr = data?.currency || 'USD';
  const total = (data?.lines||[]).reduce((s,l)=> s + Number(l.qty||0)*Number(l.unitPrice||0), 0);

  const updateField = (path, value) => {
    setData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addLine = () => {
    setData(prev => ({
      ...prev,
      lines: [...(prev.lines || []), { product:'', quality:'', qty:0, pack:'', unitPrice:0 }]
    }));
  };

  const removeLine = (idx) => {
    setData(prev => ({
      ...prev,
      lines: (prev.lines || []).filter((_, i) => i !== idx)
    }));
  };

  const addTerm = () => {
    setData(prev => ({
      ...prev,
      terms: [...(prev.terms || []), '']
    }));
  };

  const removeTerm = (idx) => {
    setData(prev => ({
      ...prev,
      terms: (prev.terms || []).filter((_, i) => i !== idx)
    }));
  };

  const addNote = () => {
    setData(prev => ({
      ...prev,
      notes: [...(prev.notes || []), '']
    }));
  };

  const removeNote = (idx) => {
    setData(prev => ({
      ...prev,
      notes: (prev.notes || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    if (onSave) await onSave(data);
    setShowEditor(false);
  };

  const handlePreview = async () => {
    const result = await previewPdf(id, `${data?.number||'quotation'}.pdf`);
    if (result) {
      setPreviewUrl(result.url);
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Barre actions */}
      <div className="no-print flex items-center justify-between gap-2 mb-4 bg-white p-3 rounded border">
        <div className="flex gap-2">
          {onBack && <button onClick={onBack} className="border py-2 px-4 rounded hover:bg-gray-50">← Retour</button>}
          <button onClick={() => setShowEditor(!showEditor)} className="border py-2 px-4 rounded hover:bg-gray-50">
            {showEditor ? '👁️ Voir Document' : '✏️ ' + t.edit}
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">💾 {t.save}</button>
          <button onClick={handlePreview} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded">👁️ {t.preview}</button>
          <button onClick={() => exportHtmlToPdf(id, `${data?.number||'quotation'}.pdf`)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">📥 {t.download}</button>
        </div>
      </div>

      {/* Modal aperçu PDF */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={closePreview}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">Aperçu PDF - {data?.number}</h3>
              <button onClick={closePreview} className="text-2xl hover:text-red-600">×</button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe src={previewUrl} className="w-full h-full border-0" title="PDF Preview"></iframe>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={closePreview} className="border py-2 px-4 rounded hover:bg-gray-50">Fermer</button>
              <button onClick={() => { exportHtmlToPdf(id, `${data?.number||'quotation'}.pdf`); closePreview(); }} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">📥 Télécharger</button>
            </div>
          </div>
        </div>
      )}

      {/* Éditeur rapide */}
      {showEditor && (
        <div className="no-print bg-white border rounded-lg p-6 mb-4 space-y-4">
          <h3 className="text-lg font-bold">Édition rapide</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <input className="border rounded px-3 py-2" placeholder="Numéro" value={data.number} onChange={e => updateField('number', e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Date" value={data.date} onChange={e => updateField('date', e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Validité" value={data.validity} onChange={e => updateField('validity', e.target.value)} />
            <select className="border rounded px-3 py-2" value={data.currency} onChange={e => updateField('currency', e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="XOF">XOF (CFA)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Vendeur</h4>
              <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Nom" value={data.seller?.name || ''} onChange={e => updateField('seller.name', e.target.value)} />
              <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Adresse" value={data.seller?.address || ''} onChange={e => updateField('seller.address', e.target.value)} />
              <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Téléphone" value={data.seller?.phone || ''} onChange={e => updateField('seller.phone', e.target.value)} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Email" value={data.seller?.email || ''} onChange={e => updateField('seller.email', e.target.value)} />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Acheteur</h4>
              <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Nom" value={data.buyer?.name || ''} onChange={e => updateField('buyer.name', e.target.value)} />
              <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Adresse" value={data.buyer?.address || ''} onChange={e => updateField('buyer.address', e.target.value)} />
              <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Téléphone" value={data.buyer?.phone || ''} onChange={e => updateField('buyer.phone', e.target.value)} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Email" value={data.buyer?.email || ''} onChange={e => updateField('buyer.email', e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Produits</h4>
              <button onClick={addLine} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">+ Ajouter ligne</button>
            </div>
            {(data.lines || []).map((line, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-2 mb-2">
                <input className="border rounded px-2 py-1" placeholder="Produit" value={line.product || ''} onChange={e => updateField(`lines.${idx}.product`, e.target.value)} />
                <input className="border rounded px-2 py-1" placeholder="Qualité" value={line.quality || ''} onChange={e => updateField(`lines.${idx}.quality`, e.target.value)} />
                <input className="border rounded px-2 py-1" type="number" placeholder="Qté" value={line.qty || 0} onChange={e => updateField(`lines.${idx}.qty`, e.target.value)} />
                <input className="border rounded px-2 py-1" placeholder="Emballage" value={line.pack || ''} onChange={e => updateField(`lines.${idx}.pack`, e.target.value)} />
                <input className="border rounded px-2 py-1" type="number" placeholder="Prix" value={line.unitPrice || 0} onChange={e => updateField(`lines.${idx}.unitPrice`, e.target.value)} />
                <button onClick={() => removeLine(idx)} className="bg-red-600 text-white px-2 rounded text-sm">✕</button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Termes & Conditions</h4>
              <button onClick={addTerm} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">+ Ajouter terme</button>
            </div>
            {(data.terms || []).map((term, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <textarea 
                  className="border rounded px-3 py-2 w-full" 
                  placeholder="Terme ou condition"
                  value={term || ''} 
                  onChange={e => updateField(`terms.${idx}`, e.target.value)}
                  rows={2}
                />
                <button onClick={() => removeTerm(idx)} className="bg-red-600 text-white px-2 rounded text-sm h-10">✕</button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Notes</h4>
              <button onClick={addNote} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">+ Ajouter note</button>
            </div>
            {(data.notes || []).map((note, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input 
                  className="border rounded px-3 py-2 w-full" 
                  placeholder="Note"
                  value={note || ''} 
                  onChange={e => updateField(`notes.${idx}`, e.target.value)}
                />
                <button onClick={() => removeNote(idx)} className="bg-red-600 text-white px-2 rounded text-sm">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document */}
      <div id={id} className="bg-white shadow border rounded-lg p-8 text-sm">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">{t.title}</h1>
            <p className="text-gray-600 mt-1">{t.subtitle}</p>
          </div>
          <div className="text-right">
            <img src="/senharvest-logo.png" alt="Logo" className="mx-auto mb-2 h-12 object-contain" />
            <p className="font-semibold">{t.ref}: {data?.number||'-'}</p>
            <p>{t.date}: {data?.date||'-'}</p>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded border">
            <h2 className="font-semibold text-blue-800 mb-2">{t.exporter}</h2>
            <p><strong>Nom :</strong> {data?.seller?.name||'-'}</p>
            <p><strong>Adresse :</strong> {data?.seller?.address||'-'}</p>
            <p><strong>Téléphone :</strong> {data?.seller?.phone||'-'}</p>
            <p><strong>Email :</strong> {data?.seller?.email||'-'}</p>
          </div>

          <div className="bg-green-50 p-4 rounded border">
            <h2 className="font-semibold text-green-800 mb-2">{t.importer}</h2>
            <p><strong>Nom :</strong> {data?.buyer?.name||'-'}</p>
            <p><strong>Adresse :</strong> {data?.buyer?.address||'-'}</p>
            <p><strong>Téléphone :</strong> {data?.buyer?.phone||'-'}</p>
            <p><strong>Email :</strong> {data?.buyer?.email||'-'}</p>
          </div>
        </div>

        {/* Infos générales */}
        <div className="bg-gray-50 p-4 rounded border mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><p><strong>{t.ref} :</strong> {data?.number||'-'}</p></div>
          <div><p><strong>{t.date} :</strong> {data?.date||'-'}</p></div>
          <div><p><strong>{t.validity} :</strong> {data?.validity||'-'}</p></div>
        </div>

        {/* Tableau marchandises */}
        <h2 className="text-lg font-semibold mb-3">{t.productsTitle}</h2>
        <div className="pdf-avoid-break">
          <table className="w-full border-collapse text-sm mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2 text-left">{t.prod}</th>
                <th className="border px-3 py-2 text-left">{t.quality}</th>
                <th className="border px-3 py-2 text-center">{t.qty}</th>
                <th className="border px-3 py-2 text-center">{t.pack}</th>
                <th className="border px-3 py-2 text-center">{t.unitPrice}</th>
                <th className="border px-3 py-2 text-center">{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {(data?.lines||[]).map((l, i) => {
                const amt = Number(l.qty||0) * Number(l.unitPrice||0);
                return (
                  <tr key={i}>
                    <td className="border px-3 py-2">{l.product||''}</td>
                    <td className="border px-3 py-2">{l.quality||''}</td>
                    <td className="border px-3 py-2 text-center">{l.qty||''}</td>
                    <td className="border px-3 py-2 text-center">{l.pack||''}</td>
                    <td className="border px-3 py-2 text-center">{money(l.unitPrice, curr)}</td>
                    <td className="border px-3 py-2 text-center">{money(amt, curr)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-right mb-6">
            <p className="font-semibold">{t.total} : <span className="text-xl">{money(total, curr)}</span></p>
          </div>
        </div>

        {/* Terms */}
        {Array.isArray(data?.terms) && data?.terms.length > 0 && (
          <div className="bg-indigo-50 p-5 rounded border mb-6 pdf-avoid-break">
            <h2 className="font-semibold text-indigo-800 mb-3 text-lg">{t.terms}</h2>
            <ul className="list-disc ml-5 space-y-1">
              {data.terms.map((cl, idx) => <li key={idx} className="text-justify">{cl}</li>)}
            </ul>
          </div>
        )}

        {/* Notes */}
        {Array.isArray(data?.notes) && data?.notes.length > 0 && (
          <div className="border-t pt-4 text-xs text-gray-600 pdf-avoid-break">
            <p><strong>{t.notes} :</strong></p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              {data.notes.map((n, idx) => <li key={idx}>{n}</li>)}
            </ul>
          </div>
        )}

        {/* Signatures (vendeur uniquement pour DEVIS) */}
        <div className="mt-8 flex justify-between pdf-avoid-break">
          <div>
            <p className="font-semibold">{t.sigSeller}</p>
            <p className="mt-6 border-t w-48"></p>
            <p>{data?.seller?.name||'-'}</p>
          </div>
          <div className="opacity-60">
            <p className="font-semibold">{t.acceptedBuyer}</p>
            <p className="mt-6 border-t w-48"></p>
            <p>{data?.buyer?.name||''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
