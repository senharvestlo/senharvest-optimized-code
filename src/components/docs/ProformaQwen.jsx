import React, { useMemo, useState } from 'react';
import { exportHtmlToPdf, printHtmlElement } from '../../utils/pdfExport';

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
    print: 'Imprimer',
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
    print: 'Print',
    save: 'Save',
    edit: 'Edit data',
  }
};

function money(v, curr='USD') {
  const sym = { USD: '$', EUR: '€', XOF: 'CFA', CAD: 'CAD$' }[curr] || '$';
  const n = Number(v||0);
  return `${sym}${n.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2})} ${curr}`;
}

export default function ProformaQwen({ initialData, onSave, onBack }) {
  const [showEditor, setShowEditor] = useState(false);
  const [data, setData] = useState(initialData || {
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
  });

  const lang = data?.lang || 'fr';
  const t = useMemo(() => T[lang], [lang]);

  const id = 'proforma-qwen';
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
      lines: [...(prev.lines || []), { product:'', quality:'', qty:0, unit:'MT', pack:'', hsCode:'', unitPrice:0 }]
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
          <button onClick={() => exportHtmlToPdf(id, `${data?.number||'proforma'}.pdf`)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">📥 {t.download}</button>
          <button onClick={() => printHtmlElement(id)} className="border py-2 px-4 rounded hover:bg-gray-50">🖨️ {t.print}</button>
        </div>
      </div>

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
            <h4 className="font-semibold mb-2">Coordonnées bancaires</h4>
            <div className="grid grid-cols-2 gap-2">
              <input className="border rounded px-3 py-2" placeholder="Banque" value={data.bank?.bankName || ''} onChange={e => updateField('bank.bankName', e.target.value)} />
              <input className="border rounded px-3 py-2" placeholder="Bénéficiaire" value={data.bank?.beneficiary || ''} onChange={e => updateField('bank.beneficiary', e.target.value)} />
              <input className="border rounded px-3 py-2" placeholder="IBAN" value={data.bank?.iban || ''} onChange={e => updateField('bank.iban', e.target.value)} />
              <input className="border rounded px-3 py-2" placeholder="SWIFT/BIC" value={data.bank?.swift || ''} onChange={e => updateField('bank.swift', e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Produits</h4>
              <button onClick={addLine} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">+ Ajouter ligne</button>
            </div>
            {(data.lines || []).map((line, idx) => (
              <div key={idx} className="grid grid-cols-7 gap-2 mb-2">
                <input className="border rounded px-2 py-1" placeholder="Produit" value={line.product || ''} onChange={e => updateField(`lines.${idx}.product`, e.target.value)} />
                <input className="border rounded px-2 py-1" placeholder="Qualité" value={line.quality || ''} onChange={e => updateField(`lines.${idx}.quality`, e.target.value)} />
                <input className="border rounded px-2 py-1" type="number" placeholder="Qté" value={line.qty || 0} onChange={e => updateField(`lines.${idx}.qty`, e.target.value)} />
                <input className="border rounded px-2 py-1" placeholder="Unité" value={line.unit || 'MT'} onChange={e => updateField(`lines.${idx}.unit`, e.target.value)} />
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
