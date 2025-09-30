import React, { useRef, useState, useEffect } from 'react';
import { printStyles, saveElementAsPDF } from '../../utils/pdf';
import { saveTradeDoc, getTradeDoc } from '../../services/firebaseService';

const currencySign = (c) => ({ USD:'$', EUR:'€', XOF:'CFA', XAF:'FCFA', CAD:'$' }[c] || c || '');
const fmt = (n) => Number(n||0).toLocaleString(undefined,{ minimumFractionDigits:2, maximumFractionDigits:2 });

export default function QuotationHtmlEditor({ docId=null, onBack }) {
  const ref = useRef(null);
  const [loading, setLoading] = useState(!!docId);

  const [state, setState] = useState({
    type: 'quotation',
    number: 'QT-0001',
    date: new Date().toLocaleDateString('fr-FR'),
    currency: 'USD',
    validityDays: 30,
    company: { name:'SenHarvest Group', address:'Dakar, Sénégal', phone:'+221...', email:'info@senharvest.com', logoUrl:'/Xidma Harvest Logo NB.png' },
    buyer: { name:'', address:'', phone:'', email:'', taxId:'' },
    shipping: { incoterm:'CIF', transport:'Sea', pol:'Dakar, Senegal', pod:'Montréal' },
    items: [{ description:'Raw Cashew Nuts', grade:'Moisture ≤ 8%', quantity:100, unit:'MT', pack:'50kg PP+PE bags', hsCode:'0801.32.00', unitPrice:1200 }],
    notes: ['This is a quotation and has no fiscal value. Prices subject to confirmation.'],
    terms: { paymentMode:'T/T', paymentTerms:'30% advance, 70% before shipment', leadTime:'25-30 days' },
    sellerSign: { companyName:'SenHarvest Group' }
  });

  useEffect(()=>{ (async()=>{
    if (!docId) return setLoading(false);
    const d = await getTradeDoc(docId);
    if (d){
      if (d.data) setState({ ...d.data, type:'quotation' });
      else setState(prev=>({ ...prev, ...(d || {}), type:'quotation' }));
    }
    setLoading(false);
  })(); }, [docId]);

  const cur = state.currency || 'USD';
  const subtotal = state.items.reduce((s, it)=> s + Number(it.quantity||0)*Number(it.unitPrice||0), 0);

  const setField = (path, val) => {
    setState(prev => {
      const next = { ...prev };
      const parts = path.split('.');
      let o = next;
      for (let i=0;i<parts.length-1;i++){ o[parts[i]] = { ...(o[parts[i]]||{}) }; o = o[parts[i]]; }
      o[parts.at(-1)] = val;
      return next;
    });
  };

  const addItem = () => setState(s => ({ ...s, items:[...s.items, { description:'', grade:'', quantity:0, unit:'MT', pack:'', hsCode:'', unitPrice:0 }] }));
  const removeItem = (i) => setState(s => ({ ...s, items: s.items.filter((_,idx)=>idx!==i) }));

  async function onSave() {
    const html = ref.current?.outerHTML || '';
    const payload = {
      type: 'quotation',
      number: state.number,
      date: state.date,
      currency: state.currency,
      html,
      data: state
    };
    const id = await saveTradeDoc(docId, payload);
    if (!docId) window.history.replaceState({}, '', `/firebase-admin/docs/${id}`);
    alert('Devis enregistré');
  }

  async function onDownloadPdf() {
    if (!ref.current) return;
    try {
      await saveElementAsPDF(ref.current, `quotation-${state.number}.pdf`);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  }

  if (loading) return <div className="p-6">Chargement…</div>;

  return (
    <>
      <style>{printStyles}</style>

      <div className="p-4 md:p-6">
        <div className="no-print max-w-5xl mx-auto mb-4 bg-white border rounded-lg p-4 flex flex-wrap gap-2">
          <button className="border rounded px-3 py-1" onClick={onBack}>← Retour</button>
          <button className="border rounded px-3 py-1" onClick={onSave}>💾 Enregistrer</button>
          <button className="border rounded px-3 py-1 bg-blue-600 text-white hover:bg-blue-700" onClick={onDownloadPdf}>📥 Télécharger PDF</button>

          <div className="ml-auto grid grid-cols-2 md:grid-cols-4 gap-2">
            <input className="border rounded px-2 py-1" placeholder="QT Number" value={state.number} onChange={e=>setField('number', e.target.value)} />
            <input className="border rounded px-2 py-1" placeholder="Date" value={state.date} onChange={e=>setField('date', e.target.value)} />
            <input className="border rounded px-2 py-1" placeholder="Currency" value={state.currency} onChange={e=>setField('currency', e.target.value)} />
            <input type="number" className="border rounded px-2 py-1" placeholder="Validity (days)" value={state.validityDays} onChange={e=>setField('validityDays', e.target.value)} />
          </div>
        </div>

        <div ref={ref} className="max-w-5xl mx-auto bg-white border rounded-lg p-6 md:p-8 text-sm" id="quotation">
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800">QUOTATION / DEVIS</h1>
              <p className="text-gray-600 mt-1">Commercial offer (non-tax document)</p>
            </div>
            <div className="text-right shrink-0">
              {state.company.logoUrl ? <img src={state.company.logoUrl} alt="Logo" className="ml-auto mb-2 h-12 object-contain" /> : null}
              <p className="font-semibold">Ref: {state.number}</p>
              <p>Date: {state.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded border p-4 bg-gray-50 avoid-break-inside">
              <h2 className="font-semibold text-gray-800 mb-2">Seller / Exporter</h2>
              <p><strong contentEditable suppressContentEditableWarning onBlur={e=>setField('company.name', e.currentTarget.textContent)}>{state.company.name}</strong></p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>setField('company.address', e.currentTarget.textContent)}>{state.company.address}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>setField('company.phone', e.currentTarget.textContent)}>{state.company.phone}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>setField('company.email', e.currentTarget.textContent)}>{state.company.email}</p>
            </div>
            <div className="rounded border p-4 bg-gray-50 avoid-break-inside">
              <h2 className="font-semibold text-gray-800 mb-2">Buyer / Importer</h2>
              <p><strong contentEditable suppressContentEditableWarning onBlur={e=>setField('buyer.name', e.currentTarget.textContent)}>{state.buyer.name}</strong></p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>setField('buyer.address', e.currentTarget.textContent)}>{state.buyer.address}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>setField('buyer.phone', e.currentTarget.textContent)}>{state.buyer.phone}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>setField('buyer.email', e.currentTarget.textContent)}>{state.buyer.email}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>setField('buyer.taxId', e.currentTarget.textContent)}>{state.buyer.taxId}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded border mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p><strong>Incoterms:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>setField('shipping.incoterm', e.currentTarget.textContent)}>{state.shipping.incoterm}</span></p>
            <p><strong>Mode:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>setField('shipping.transport', e.currentTarget.textContent)}>{state.shipping.transport}</span></p>
            <p><strong>Port of Loading:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>setField('shipping.pol', e.currentTarget.textContent)}>{state.shipping.pol}</span></p>
            <p><strong>Port of Destination:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>setField('shipping.pod', e.currentTarget.textContent)}>{state.shipping.pod}</span></p>
            <p><strong>Validity:</strong> {state.validityDays} days</p>
          </div>

          <h2 className="text-lg font-semibold mb-3">Goods Description</h2>
          <div className="avoid-break-inside">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-2 text-left">Product</th>
                  <th className="border px-2 py-2 text-left">Quality</th>
                  <th className="border px-2 py-2 text-center">Qty</th>
                  <th className="border px-2 py-2 text-center">Unit</th>
                  <th className="border px-2 py-2 text-center">Packing</th>
                  <th className="border px-2 py-2 text-center">HS Code</th>
                  <th className="border px-2 py-2 text-center">Unit Price</th>
                  <th className="border px-2 py-2 text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {state.items.map((it, idx) => {
                  const amount = (Number(it.quantity||0) * Number(it.unitPrice||0));
                  return (
                    <tr key={idx} className="align-top">
                      <td className="border px-2 py-2" contentEditable suppressContentEditableWarning onBlur={e=>setField(`items.${idx}.description`, e.currentTarget.textContent)}>{it.description}</td>
                      <td className="border px-2 py-2" contentEditable suppressContentEditableWarning onBlur={e=>setField(`items.${idx}.grade`, e.currentTarget.textContent)}>{it.grade}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>setField(`items.${idx}.quantity`, Number(e.currentTarget.textContent)||0)}>{it.quantity}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>setField(`items.${idx}.unit`, e.currentTarget.textContent)}>{it.unit}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>setField(`items.${idx}.pack`, e.currentTarget.textContent)}>{it.pack}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>setField(`items.${idx}.hsCode`, e.currentTarget.textContent)}>{it.hsCode}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>setField(`items.${idx}.unitPrice`, Number(e.currentTarget.textContent)||0)}>{currencySign(cur)} {fmt(it.unitPrice)}</td>
                      <td className="border px-2 py-2 text-center">{currencySign(cur)} {fmt(amount)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={8} className="border px-2 py-2 text-right text-xs">
                    <button type="button" onClick={addItem} className="no-print bg-gray-100 border rounded px-2 py-1">+ Add row</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-right my-4 avoid-break-inside">
            <p className="font-semibold">
              Total : <span className="text-base sm:text-lg">{currencySign(cur)} {fmt(subtotal)} {cur}</span>
            </p>
          </div>

          <div className="rounded border p-4 mb-6 avoid-break-inside">
            <h2 className="font-semibold text-gray-800 mb-3">Terms & Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>Payment Mode:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>setField('terms.paymentMode', e.currentTarget.textContent)}>{state.terms.paymentMode}</span></p>
              <p><strong>Payment Terms:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>setField('terms.paymentTerms', e.currentTarget.textContent)}>{state.terms.paymentTerms}</span></p>
              <p><strong>Lead Time:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>setField('terms.leadTime', e.currentTarget.textContent)}>{state.terms.leadTime}</span></p>
              <p><strong>Validity:</strong> {state.validityDays} days</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between avoid-break-inside pb-safe">
            <div>
              <p className="font-semibold">Seller Signature</p>
              <p className="mt-6 border-t w-48"></p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>setField('sellerSign.companyName', e.currentTarget.textContent)}>{state.sellerSign.companyName}</p>
            </div>
            <div className="opacity-60">
              <p className="text-xs">
                This is a quotation with no fiscal value. Prices subject to confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


