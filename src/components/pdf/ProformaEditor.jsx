import React, { useRef, useState } from 'react';
import { saveElementAsPDF, printStyles } from '../../utils/pdf';

export default function ProformaEditor({ t, initial = {}, onSave }) {
  const ref = useRef(null);

  const [state, setState] = useState({
    number: initial.number || 'PF-0001',
    date: initial.date || new Date().toLocaleDateString('fr-FR'),
    validityDays: initial.validityDays || 30,
    company: initial.company || { name: 'SenHarvest Group', address: 'Dakar, Sénégal', phone: '', email: '', logoUrl: '/senharvest-logo.png' },
    buyer: initial.buyer || { name: '', address: '', phone: '', email: '', taxId: '' },
    banking: initial.banking || { bank: '', iban: '', swift: '' },
    shipping: initial.shipping || { incoterm: 'FOB', pol: 'Dakar, Senegal', pod: '', transport: 'Sea' },
    items: initial.items || [
      { description: 'Raw Cashew Nuts', grade: 'Moisture ≤ 8%', quantity: 100, unit: 'MT', pack: '50kg PP+PE bags', hsCode: '0801.32.00', unitPrice: 1200, currency: 'USD' }
    ],
    notes: initial.notes || ['This is a proforma invoice; not a tax invoice. Subject to final contract.'],
    seller: initial.seller || { companyName: 'SenHarvest Group' },
    buyerSign: initial.buyerSign || { companyName: '' },
    bl: initial.bl || { notifyParty: '', consignee: '' },
    terms: initial.terms || { paymentMode: 'T/T', paymentTerms: '30% advance, 70% before shipment', leadTime: '25-30 days' },
  });

  const currencySign = (c) => ({ USD: '$', EUR: '€', XOF: 'CFA', XAF: 'FCFA', CAD: '$' }[c] || c || '');
  const fmt = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cur = state.items[0]?.currency || 'USD';
  const subtotal = state.items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unitPrice || 0), 0);

  const addItem = () => setState(s => ({ ...s, items: [...s.items, { description: '', grade: '', quantity: 0, unit: 'MT', pack: '', hsCode: '', unitPrice: 0, currency: cur }] }));
  const removeItem = (i) => setState(s => ({ ...s, items: s.items.filter((_, idx) => idx !== i) }));

  const onDownload = () => {
    if (!ref.current) return;
    saveElementAsPDF(ref.current, `proforma-${state.number}.pdf`);
  };

  const handleChange = (path, value) => {
    setState(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  return (
    <>
      <style>{printStyles}</style>

      <div className="p-4 md:p-6">
        {/* Controls */}
        <div className="no-print max-w-5xl mx-auto mb-4 bg-white border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="text-sm">
              N° Proforma
              <input className="w-full border rounded px-2 py-1" value={state.number} onChange={e=>handleChange('number', e.target.value)} />
            </label>
            <label className="text-sm">
              Date
              <input className="w-full border rounded px-2 py-1" value={state.date} onChange={e=>handleChange('date', e.target.value)} />
            </label>
            <label className="text-sm">
              Validité (jours)
              <input type="number" className="w-full border rounded px-2 py-1" value={state.validityDays} onChange={e=>handleChange('validityDays', e.target.value)} />
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={addItem} className="bg-gray-100 border rounded px-3 py-1">+ Ligne</button>
            <button onClick={onDownload} className="bg-blue-600 text-white rounded px-3 py-1">📥 Export PDF</button>
            {onSave ? <button onClick={()=>onSave(state)} className="bg-green-600 text-white rounded px-3 py-1">💾 Enregistrer</button> : null}
          </div>
        </div>

        {/* Render */}
        <div ref={ref} className="max-w-5xl mx-auto bg-white border rounded-lg p-6 md:p-8 text-sm">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800">PROFORMA INVOICE</h1>
              <p className="text-gray-600 mt-1">Commercial proforma (for shipping documents & B/L)</p>
            </div>
            <div className="text-right shrink-0">
              {state.company.logoUrl ? <img src={state.company.logoUrl} alt="Logo" className="ml-auto mb-2 h-12 object-contain" /> : null}
              <p className="font-semibold">Ref: {state.number}</p>
              <p>Date: {state.date}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded border p-4 bg-gray-50 avoid-break-inside">
              <h2 className="font-semibold text-gray-800 mb-2">Exporter / Seller</h2>
              <p><strong contentEditable suppressContentEditableWarning onBlur={e=>handleChange('company.name', e.currentTarget.textContent)}>{state.company.name}</strong></p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('company.address', e.currentTarget.textContent)}>{state.company.address}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('company.phone', e.currentTarget.textContent)}>{state.company.phone}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('company.email', e.currentTarget.textContent)}>{state.company.email}</p>
            </div>
            <div className="rounded border p-4 bg-gray-50 avoid-break-inside">
              <h2 className="font-semibold text-gray-800 mb-2">Importer / Buyer</h2>
              <p><strong contentEditable suppressContentEditableWarning onBlur={e=>handleChange('buyer.name', e.currentTarget.textContent)}>{state.buyer.name}</strong></p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('buyer.address', e.currentTarget.textContent)}>{state.buyer.address}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('buyer.phone', e.currentTarget.textContent)}>{state.buyer.phone}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('buyer.email', e.currentTarget.textContent)}>{state.buyer.email}</p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('buyer.taxId', e.currentTarget.textContent)}>{state.buyer.taxId}</p>
            </div>
          </div>

          {/* Shipping/Trade details */}
          <div className="bg-gray-50 p-4 rounded border mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p><strong>Incoterms:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('shipping.incoterm', e.currentTarget.textContent)}>{state.shipping.incoterm}</span></p>
            <p><strong>Mode:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('shipping.transport', e.currentTarget.textContent)}>{state.shipping.transport}</span></p>
            <p><strong>Port of Loading:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('shipping.pol', e.currentTarget.textContent)}>{state.shipping.pol}</span></p>
            <p><strong>Port of Destination:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('shipping.pod', e.currentTarget.textContent)}>{state.shipping.pod}</span></p>
            <p><strong>Validity:</strong> {state.validityDays} days</p>
          </div>

          {/* Items */}
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
                      <td className="border px-2 py-2" contentEditable suppressContentEditableWarning onBlur={e=>{
                        const v = e.currentTarget.textContent; setState(s=>{
                          const items=[...s.items]; items[idx]={...items[idx], description:v}; return {...s, items};
                        });
                      }}>{it.description}</td>
                      <td className="border px-2 py-2" contentEditable suppressContentEditableWarning onBlur={e=>{
                        const v = e.currentTarget.textContent; setState(s=>{
                          const items=[...s.items]; items[idx]={...items[idx], grade:v}; return {...s, items};
                        });
                      }}>{it.grade}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>{
                        const v = Number(e.currentTarget.textContent)||0; setState(s=>{
                          const items=[...s.items]; items[idx]={...items[idx], quantity:v}; return {...s, items};
                        });
                      }}>{it.quantity}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>{
                        const v = e.currentTarget.textContent; setState(s=>{
                          const items=[...s.items]; items[idx]={...items[idx], unit:v}; return {...s, items};
                        });
                      }}>{it.unit}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>{
                        const v = e.currentTarget.textContent; setState(s=>{
                          const items=[...s.items]; items[idx]={...items[idx], pack:v}; return {...s, items};
                        });
                      }}>{it.pack}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>{
                        const v = e.currentTarget.textContent; setState(s=>{
                          const items=[...s.items]; items[idx]={...items[idx], hsCode:v}; return {...s, items};
                        });
                      }}>{it.hsCode}</td>
                      <td className="border px-2 py-2 text-center" contentEditable suppressContentEditableWarning onBlur={e=>{
                        const v = Number(e.currentTarget.textContent)||0; setState(s=>{
                          const items=[...s.items]; items[idx]={...items[idx], unitPrice:v}; return {...s, items};
                        });
                      }}>{currencySign(cur)} {fmt(it.unitPrice)}</td>
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

          {/* Total */}
          <div className="text-right my-4 avoid-break-inside">
            <p className="font-semibold">
              Total : <span className="text-base sm:text-lg">{currencySign(cur)} {fmt(subtotal)} {cur}</span>
            </p>
          </div>

          {/* Terms + Banking + B/L */}
          <div className="rounded border p-4 mb-6 avoid-break-inside">
            <h2 className="font-semibold text-gray-800 mb-3">Terms & Conditions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>Payment Mode:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('terms.paymentMode', e.currentTarget.textContent)}>{state.terms.paymentMode}</span></p>
              <p><strong>Payment Terms:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('terms.paymentTerms', e.currentTarget.textContent)}>{state.terms.paymentTerms}</span></p>
              <p><strong>Lead Time:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('terms.leadTime', e.currentTarget.textContent)}>{state.terms.leadTime}</span></p>
              <p><strong>HS Codes:</strong> {state.items.map(i=>i.hsCode).filter(Boolean).join(', ')}</p>
            </div>

            <div className="border-t mt-3 pt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>Bank:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('banking.bank', e.currentTarget.textContent)}>{state.banking.bank}</span></p>
              <p><strong>IBAN:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('banking.iban', e.currentTarget.textContent)}>{state.banking.iban}</span></p>
              <p><strong>SWIFT/BIC:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('banking.swift', e.currentTarget.textContent)}>{state.banking.swift}</span></p>
            </div>

            <div className="border-t mt-3 pt-3 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><strong>B/L Consignee:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('bl.consignee', e.currentTarget.textContent)}>{state.bl.consignee}</span></p>
              <p><strong>B/L Notify Party:</strong> <span contentEditable suppressContentEditableWarning onBlur={e=>handleChange('bl.notifyParty', e.currentTarget.textContent)}>{state.bl.notifyParty}</span></p>
            </div>

            {state.notes?.length ? (
              <div className="border-t mt-3 pt-3 text-xs text-gray-600">
                <p className="font-semibold">Notes:</p>
                <ul className="list-disc ml-5 space-y-1">
                  {state.notes.map((n, i) => <li key={i} contentEditable suppressContentEditableWarning onBlur={(e)=>{
                    const v = e.currentTarget.textContent; setState(s=>{
                      const notes=[...s.notes]; notes[i]=v; return {...s, notes};
                    });
                  }}>{n}</li>)}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Signatures: seller + buyer (proforma) */}
          <div className="mt-6 flex justify-between avoid-break-inside pb-safe">
            <div>
              <p className="font-semibold">Seller Signature</p>
              <p className="mt-6 border-t w-48"></p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('seller.companyName', e.currentTarget.textContent)}>{state.seller.companyName}</p>
            </div>
            <div>
              <p className="font-semibold">Buyer Acceptance</p>
              <p className="mt-6 border-t w-48"></p>
              <p contentEditable suppressContentEditableWarning onBlur={e=>handleChange('buyerSign.companyName', e.currentTarget.textContent)}>{state.buyerSign.companyName}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


