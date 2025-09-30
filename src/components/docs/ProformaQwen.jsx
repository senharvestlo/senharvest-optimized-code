import React, { useMemo, useState } from 'react';
import { exportHtmlToPdf, previewPdf } from '../../utils/pdfExport';

const T = {
  fr: {
    title: 'PROFORMA INVOICE',
    subtitle: 'Document commercial (pour B/L et shipping)',
    ref: 'Réf.',
    date: 'Date',
    validity: 'Validité',
    exporter: 'Vendeur / Exportateur',
    importer: 'Acheteur / Importateur',
    productsTitle: 'Description des Marchandises',
    prod: 'Produit',
    quality: 'Qualité / Grade',
    qty: 'Qté',
    unit: 'Unité',
    pack: 'Conditionnement',
    hsCode: 'HS Code',
    unitPrice: 'Prix unitaire',
    amount: 'Montant',
    total: 'Montant Total',
    terms: 'Termes & Conditions',
    notes: 'Notes',
    bankDetails: 'Coordonnées Bancaires',
    bankName: 'Banque',
    beneficiary: 'Bénéficiaire',
    iban: 'IBAN',
    swift: 'SWIFT/BIC',
    sigSeller: 'Signature du Vendeur',
    acceptedBuyer: "Accepté par l'Acheteur",
    download: 'Télécharger PDF',
    preview: 'Aperçu PDF',
    save: 'Enregistrer',
    edit: 'Modifier les données',
  },
  en: {
    title: 'PROFORMA INVOICE',
    subtitle: 'Commercial document (for B/L and shipping)',
    ref: 'Ref.',
    date: 'Date',
    validity: 'Validity',
    exporter: 'Seller / Exporter',
    importer: 'Buyer / Importer',
    productsTitle: 'Goods Description',
    prod: 'Product',
    quality: 'Quality / Grade',
    qty: 'Qty',
    unit: 'Unit',
    pack: 'Packing',
    hsCode: 'HS Code',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    total: 'Grand Total',
    terms: 'Terms & Conditions',
    notes: 'Notes',
    bankDetails: 'Banking Details',
    bankName: 'Bank',
    beneficiary: 'Beneficiary',
    iban: 'IBAN',
    swift: 'SWIFT/BIC',
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

export default function ProformaQwen({ initialData, onSave, onBack, liveData }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Utilise liveData si fourni (pour preview temps réel), sinon initialData
  const data = liveData || initialData || {
    lang: 'fr',
    number: `PF-${new Date().toISOString().slice(0,10)}`,
    date: new Date().toLocaleDateString('fr-FR'),
    validity: '30 jours',
    currency: 'USD',
    seller: { name:'SenHarvest Group', address:'Dakar, Sénégal', phone:'+221 77 634 0064', email:'manager@senharvest.com' },
    buyer:  { name:'', address:'', phone:'', email:'' },
    showBank: true,
    bank: { bankName:'', beneficiary:'SenHarvest Group', iban:'', swift:'' },
    lines: [{ product:'', quality:'', qty:0, unit:'MT', pack:'', hsCode:'', unitPrice:0 }],
    terms: ['Proforma non fiscale', 'Incoterms FOB/CIF selon accord', 'Paiement: 30% T/T à la commande, 70% avant expédition'],
    notes: ['Document commercial pour douane et B/L']
  };

  const lang = data?.lang || 'fr';
  const t = useMemo(() => T[lang], [lang]);

  const id = 'proforma-qwen';
  const curr = data?.currency || 'USD';
  const total = (data?.lines||[]).reduce((s,l)=> s + Number(l.qty||0)*Number(l.unitPrice||0), 0);

  const handleSave = async () => {
    if (onSave) await onSave(data);
  };

  const handlePreview = async () => {
    const result = await previewPdf(id, `${data?.number||'proforma'}.pdf`);
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
        </div>
        <div className="flex gap-2">
          {onSave && <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">💾 {t.save}</button>}
          <button onClick={handlePreview} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded">👁️ {t.preview}</button>
          <button onClick={() => exportHtmlToPdf(id, `${data?.number||'proforma'}.pdf`)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">📥 {t.download}</button>
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
              <button onClick={() => { exportHtmlToPdf(id, `${data?.number||'proforma'}.pdf`); closePreview(); }} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">📥 Télécharger</button>
            </div>
          </div>
        </div>
      )}

      {/* Document */}
      <div id={id} className="bg-white shadow border rounded-lg p-8 text-sm">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-green-700">{t.title}</h1>
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
          <div className="bg-green-50 p-4 rounded border">
            <h2 className="font-semibold text-green-800 mb-2">{t.exporter}</h2>
            <p><strong>Nom :</strong> {data?.seller?.name||'-'}</p>
            <p><strong>Adresse :</strong> {data?.seller?.address||'-'}</p>
            <p><strong>Téléphone :</strong> {data?.seller?.phone||'-'}</p>
            <p><strong>Email :</strong> {data?.seller?.email||'-'}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded border">
            <h2 className="font-semibold text-blue-800 mb-2">{t.importer}</h2>
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
          <table className="w-full border-collapse text-xs mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-2 text-left">{t.prod}</th>
                <th className="border px-2 py-2 text-left">{t.quality}</th>
                <th className="border px-2 py-2 text-center">{t.qty}</th>
                <th className="border px-2 py-2 text-center">{t.unit}</th>
                <th className="border px-2 py-2 text-center">{t.pack}</th>
                <th className="border px-2 py-2 text-center">{t.hsCode}</th>
                <th className="border px-2 py-2 text-center">{t.unitPrice}</th>
                <th className="border px-2 py-2 text-center">{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {(data?.lines||[]).map((l, i) => {
                const amt = Number(l.qty||0) * Number(l.unitPrice||0);
                return (
                  <tr key={i}>
                    <td className="border px-2 py-2">{l.product||''}</td>
                    <td className="border px-2 py-2">{l.quality||''}</td>
                    <td className="border px-2 py-2 text-center">{l.qty||''}</td>
                    <td className="border px-2 py-2 text-center">{l.unit||'MT'}</td>
                    <td className="border px-2 py-2 text-center">{l.pack||''}</td>
                    <td className="border px-2 py-2 text-center">{l.hsCode||''}</td>
                    <td className="border px-2 py-2 text-center">{money(l.unitPrice, curr)}</td>
                    <td className="border px-2 py-2 text-center">{money(amt, curr)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-right mb-6">
            <p className="font-semibold text-lg">{t.total} : <span className="text-xl">{money(total, curr)}</span></p>
          </div>
        </div>

        {/* Coordonnées bancaires */}
        {data?.showBank && (
          <div className="bg-yellow-50 p-4 rounded border mb-6 pdf-avoid-break">
            <h2 className="font-semibold text-yellow-800 mb-3">{t.bankDetails}</h2>
            <div className="grid grid-cols-2 gap-3">
              <p><strong>{t.bankName} :</strong> {data?.bank?.bankName||'-'}</p>
              <p><strong>{t.beneficiary} :</strong> {data?.bank?.beneficiary||'-'}</p>
              <p><strong>{t.iban} :</strong> {data?.bank?.iban||'-'}</p>
              <p><strong>{t.swift} :</strong> {data?.bank?.swift||'-'}</p>
            </div>
          </div>
        )}

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

        {/* Signatures */}
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
