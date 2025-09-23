import React, { useRef } from 'react';
import { saveElementAsPDF, printStyles } from '../../utils/pdf';

export default function QuotationPrint({
  t,
  company = {},
  buyer = {},
  meta = {},
  items = [],
  notes = [],
  terms = {},
  sellerSignature = {}
}) {
  const ref = useRef(null);

  const currencySign = (c) => ({ USD: '$', EUR: '€', XOF: 'CFA', XAF: 'FCFA', CAD: '$' }[c] || c || '');
  const fmt = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const subtotal = items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unitPrice || 0), 0);
  const cur = items[0]?.currency || 'USD';

  const onDownload = () => {
    if (!ref.current) return;
    saveElementAsPDF(ref.current, `quotation-${meta.number || '0001'}.pdf`);
  };

  return (
    <>
      <style>{printStyles}</style>

      <div className="bg-gray-100 p-4 md:p-6 text-sm">
        <div ref={ref} id="quotation" className="max-w-4xl mx-auto bg-white shadow border rounded-lg p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800">{t?.quotationTitle || 'QUOTATION / DEVIS'}</h1>
              <p className="text-gray-600 mt-1">{t?.quotationSubtitle || 'Commercial offer (non-tax document)'}</p>
            </div>
            <div className="text-right shrink-0">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt="Logo" className="ml-auto mb-2 h-12 object-contain" />
              ) : null}
              <p className="font-semibold">{t?.ref || 'Ref'}: {meta.number || 'QT-0001'}</p>
              <p>{t?.date || 'Date'}: {meta.date || new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded border p-4 bg-gray-50 avoid-break-inside">
              <h2 className="font-semibold text-gray-800 mb-2">{t?.seller || 'Seller / Exporter'}</h2>
              <p><strong>{company.name || 'Company Name'}</strong></p>
              <p>{company.address}</p>
              <p>{company.phone}</p>
              <p>{company.email}</p>
            </div>
            <div className="rounded border p-4 bg-gray-50 avoid-break-inside">
              <h2 className="font-semibold text-gray-800 mb-2">{t?.buyer || 'Buyer / Importer'}</h2>
              <p><strong>{buyer.name || '-'}</strong></p>
              <p>{buyer.address}</p>
              <p>{buyer.phone}</p>
              <p>{buyer.email}</p>
              {buyer.taxId ? <p>{t?.taxId || 'Tax ID'}: {buyer.taxId}</p> : null}
            </div>
          </div>

          {/* Meta (Validity) */}
          <div className="bg-gray-50 p-4 rounded border mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <p><strong>{t?.validity || 'Offer Validity'}:</strong> {meta.validityDays ? `${meta.validityDays} ${t?.days || 'days'}` : '-'}</p>
            <p><strong>{t?.currency || 'Currency'}:</strong> {cur}</p>
            <p><strong>{t?.transport || 'Transport'}:</strong> {terms.transport || 'Sea'}</p>
          </div>

          {/* Items */}
          <h2 className="text-lg font-semibold mb-3">{t?.goods || 'Goods Description'}</h2>
          <div className="avoid-break-inside">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-2 text-left">{t?.product || 'Product'}</th>
                  <th className="border px-2 py-2 text-left">{t?.grade || 'Quality/Grade'}</th>
                  <th className="border px-2 py-2 text-center">{t?.qty || 'Qty'}</th>
                  <th className="border px-2 py-2 text-center">{t?.unit || 'Unit'}</th>
                  <th className="border px-2 py-2 text-center">{t?.pack || 'Packing'}</th>
                  <th className="border px-2 py-2 text-center">{t?.unitPrice || 'Unit Price'}</th>
                  <th className="border px-2 py-2 text-center">{t?.amount || 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td className="border px-2 py-2 text-center" colSpan={7}>{t?.noItems || 'No items'}</td></tr>
                ) : items.map((it, idx) => {
                  const amount = (Number(it.quantity||0) * Number(it.unitPrice||0));
                  return (
                    <tr key={idx} className="align-top">
                      <td className="border px-2 py-2">{it.description}</td>
                      <td className="border px-2 py-2">{it.grade}</td>
                      <td className="border px-2 py-2 text-center">{it.quantity}</td>
                      <td className="border px-2 py-2 text-center">{it.unit}</td>
                      <td className="border px-2 py-2 text-center">{it.pack}</td>
                      <td className="border px-2 py-2 text-center">{currencySign(cur)} {fmt(it.unitPrice)}</td>
                      <td className="border px-2 py-2 text-center">{currencySign(cur)} {fmt(amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="text-right my-4 avoid-break-inside">
            <p className="font-semibold">
              {t?.total || 'Total'} : <span className="text-base sm:text-lg">{currencySign(cur)} {fmt(subtotal)} {cur}</span>
            </p>
          </div>

          {/* Terms & Conditions (no bank info) */}
          <div className="rounded border p-4 mb-6 avoid-break-inside">
            <h2 className="font-semibold text-gray-800 mb-3">{t?.terms || 'Terms & Conditions'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>{t?.incoterms || 'Incoterms'}:</strong> {terms.incoterm || '-'}</p>
              <p><strong>{t?.pol || 'Port of Loading'}:</strong> {terms.pol || '-'}</p>
              <p><strong>{t?.pod || 'Port of Destination'}:</strong> {terms.pod || '-'}</p>
              <p><strong>{t?.paymentMode || 'Payment Mode'}:</strong> {terms.paymentMode || '-'}</p>
              <p><strong>{t?.paymentTerms || 'Payment Terms'}:</strong> {terms.paymentTerms || '-'}</p>
              <p><strong>{t?.leadTime || 'Lead Time'}:</strong> {terms.leadTime || '-'}</p>
            </div>

            {notes?.length ? (
              <div className="border-t mt-3 pt-3 text-xs text-gray-600">
                <p className="font-semibold">{t?.notes || 'Notes'}:</p>
                <ul className="list-disc ml-5 space-y-1">
                  {notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Signatures: seller only */}
          <div className="mt-6 flex justify-between avoid-break-inside pb-safe">
            <div>
              <p className="font-semibold">{t?.sellerSign || 'Seller Signature'}</p>
              <p className="mt-6 border-t w-48"></p>
              <p>{sellerSignature.companyName || company.name}</p>
            </div>
            <div className="opacity-60">
              <p className="text-xs">
                {t?.quotationDisclaimer || 'This is a quotation and has no fiscal value. Prices subject to confirmation.'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-6 no-print">
          <button
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
          >
            {t?.download || 'Download PDF'}
          </button>
        </div>
      </div>
    </>
  );
}


