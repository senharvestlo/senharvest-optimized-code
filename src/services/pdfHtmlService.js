/* SenHarvest — HTML PDF Service (style Qwen AI)
 * - Rendu HTML "beau" (tailwind) puis conversion via html2pdf.js
 * - Proforma / Quotation
 * - FX optionnel (taux + frais)
 * - Infos bancaires optionnelles (proforma only)
 * - Terms & Conditions éditables (ou auto)
 * - RC/NINEA au footer
 */

import html2pdf from 'html2pdf.js';

/* ===== Helpers ===== */
const safe = (v, fb = '') => (v == null || v === '' ? fb : String(v));
const toNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const currencySign = (c) => ({ USD: '$', CAD: '$', EUR: '€', XOF: 'CFA', XAF: 'FCFA' }[c] || '$');
const money = (n, c = 'USD') =>
  `${currencySign(c)} ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function convertWithFees(amountSrc, fx) {
  const rate = toNum(fx?.rate, 1);
  const feePct = toNum(fx?.feePct, 0);
  const flat = toNum(fx?.transferFeeFlat, 0);
  const converted = amountSrc * rate;
  const fee = converted * feePct;
  const net = converted - fee - flat;
  return { rate, converted, feePctAmt: fee, transferFlat: flat, net };
}

/* Terms — auto si pas de liste manuelle */
function buildTermsList(proforma, srcCcy, type) {
  if (Array.isArray(proforma?.terms) && proforma.terms.length) {
    return proforma.terms
      .filter(t => t && t.label && t.value != null && String(t.value).trim() !== '')
      .map(t => ({ label: String(t.label), value: String(t.value) }));
  }
  const auto = [
    { label: 'Incoterm', value: safe(proforma.deliveryTerms, 'FOB') },
    { label: 'Port of Loading', value: safe(proforma.departurePort, 'Dakar, Senegal') },
    ...(type === 'proforma' ? [{ label: 'Port of Destination', value: safe(proforma.destinationPort, '—') }] : []),
    { label: 'Payment Method', value: safe(proforma.paymentMethod, 'Bank Transfer') },
    ...(proforma.paymentConditions ? [{ label: 'Payment Conditions', value: proforma.paymentConditions }] : []),
    { label: 'Offer Validity', value: safe(proforma.validity, '30 days') },
    ...(proforma.etaDelivery ? [{ label: 'ETA / Delivery', value: proforma.etaDelivery }] : []),
    ...(proforma.pricing ? [{ label: 'Pricing', value: proforma.pricing }] : []),
    ...(proforma.quantityNote ? [{ label: 'Quantity', value: proforma.quantityNote }] : []),
    { label: 'Currency', value: srcCcy },
  ];
  return auto.filter(i => String(i.value).trim() !== '');
}

/* ===== HTML Builder (retourne un HTMLElement prêt pour html2pdf) ===== */
export function buildInvoiceHTMLElement(data, documentType = 'proforma', opts = {}) {
  const type = (documentType || 'proforma').toLowerCase() === 'quotation' ? 'quotation' : 'proforma';

  const {
    company = {},
    client = {},
    proforma = {},
    products = [],
    signatures = {},
    bank = {},
    buyerBank = {},
  } = data || {};

  const srcCcy = proforma.currency || opts.currency || 'USD';
  const dstCcy = opts.secondaryCurrency || null;
  const enableFX = Boolean(opts.enableFX && dstCcy && opts.fx?.rate);
  const enableBank = type === 'proforma' && Boolean(opts.enableBankInfo);
  const logoPath = opts.logoPath || '/senharvest-logo.png';

  // Calcul montants
  let subtotal = 0;
  const rows = (products || []).map(p => {
    const qty = toNum(p.quantity, 0);
    const up = toNum(p.unitPrice, 0);
    const amt = qty * up;
    subtotal += amt;
    return { ...p, qty, up, amt };
  });

  const fxBlock = enableFX ? convertWithFees(subtotal, opts.fx || {}) : null;
  const terms = buildTermsList(proforma, srcCcy, type);

  const title = type === 'proforma' ? 'PROFORMA INVOICE' : 'QUOTATION / DEVIS';
  const refPrefix = type === 'proforma' ? 'PF' : 'QT';
  const ref = safe(proforma.number, `${refPrefix}-${Date.now()}`);
  const date = safe(proforma.date, new Date().toLocaleDateString('fr-FR'));
  const validityLabel = type === 'quotation' ? 'Validité de l’offre' : 'Valid until';

  const taxIdFooter = safe(company.taxId, '');

  const root = document.createElement('div');
  root.innerHTML = `
  <div id="senharvest-invoice" class="bg-white shadow-lg border rounded-lg p-8 text-[13px] leading-relaxed text-gray-800">
    <div class="flex justify-between items-start mb-6 border-b pb-4">
      <div class="min-w-[50%]">
        <h1 class="text-2xl font-bold text-blue-700">${title}</h1>
        <p class="text-gray-600 mt-1">${type === 'proforma' ? 'Document officiel d\'offre commerciale' : 'Offre commerciale (non fiscale)'}</p>
      </div>
      <div class="text-right">
        ${logoPath ? `<img src="${logoPath}" alt="Logo" crossorigin="anonymous" class="ml-auto mb-2 max-h-[56px]" />` : ''}
        <p class="font-semibold">Réf: ${ref}</p>
        <p>Date: ${date}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-blue-50 p-4 rounded border">
        <h2 class="font-semibold text-blue-800 mb-2">Exportateur / Vendeur</h2>
        <p><strong>Nom :</strong> ${safe(company.name, '—')}</p>
        <p><strong>Adresse :</strong> ${safe(company.address, '—')}</p>
        <p><strong>Téléphone :</strong> ${safe(company.phone, '—')}</p>
        <p><strong>Email :</strong> ${safe(company.email, '—')}</p>
        ${enableBank ? `
          <div class="mt-3 space-y-1">
            <p class="font-semibold">Banque (Vendeur)</p>
            <p><strong>Banque :</strong> ${safe(bank.bankName, '—')}</p>
            <p><strong>Compte :</strong> ${safe(bank.accountName, '—')}</p>
            <p><strong>IBAN :</strong> ${safe(bank.iban, '—')}</p>
            <p><strong>SWIFT/BIC :</strong> ${safe(bank.swift, '—')}</p>
            <p><strong>Adresse :</strong> ${safe(bank.address, '—')}</p>
          </div>` : ''
        }
      </div>

      <div class="bg-green-50 p-4 rounded border">
        <h2 class="font-semibold text-green-800 mb-2">Importateur / Acheteur</h2>
        <p><strong>Nom :</strong> ${safe(client.name, '—')}</p>
        <p><strong>Adresse :</strong> ${safe(client.address, '—')}</p>
        <p><strong>Téléphone :</strong> ${safe(client.phone, '—')}</p>
        <p><strong>Email :</strong> ${safe(client.email, '—')}</p>
        <p><strong>Numéro fiscal :</strong> ${safe(client.taxId, '—')}</p>
        ${enableBank && (buyerBank.bankName || buyerBank.accountName || buyerBank.iban || buyerBank.swift || buyerBank.address) ? `
          <div class="mt-3 space-y-1">
            <p class="font-semibold">Banque (Acheteur)</p>
            <p><strong>Banque :</strong> ${safe(buyerBank.bankName, '—')}</p>
            <p><strong>Compte :</strong> ${safe(buyerBank.accountName, '—')}</p>
            <p><strong>IBAN :</strong> ${safe(buyerBank.iban, '—')}</p>
            <p><strong>SWIFT/BIC :</strong> ${safe(buyerBank.swift, '—')}</p>
            <p><strong>Adresse :</strong> ${safe(buyerBank.address, '—')}</p>
          </div>` : ''
        }
      </div>
    </div>

    <div class="bg-gray-50 p-4 rounded border mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p><strong>Numéro ${type === 'proforma' ? 'PI' : 'QT'} :</strong> ${ref}</p>
        <p><strong>Date d’émission :</strong> ${date}</p>
      </div>
      <div>
        <p><strong>${validityLabel} :</strong> ${safe(proforma.validity, '30 days')}</p>
      </div>
    </div>

    <h2 class="text-lg font-semibold mb-3">Description des Marchandises</h2>
    <table class="w-full border-collapse text-sm mb-6">
      <thead>
        <tr class="bg-gray-200">
          <th class="border px-3 py-2 text-left">Produit</th>
          <th class="border px-3 py-2 text-left">Qualité</th>
          <th class="border px-3 py-2 text-center">Qté</th>
          <th class="border px-3 py-2 text-center">Conditionnement</th>
          <th class="border px-3 py-2 text-center">Prix unitaire (${srcCcy})</th>
          <th class="border px-3 py-2 text-center">Montant total (${srcCcy})</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td class="border px-3 py-2 align-top">${safe(r.description,'—')}${r.hsCode ? `<div class="text-xs text-gray-500 mt-1">HS: ${r.hsCode}</div>` : ''}</td>
            <td class="border px-3 py-2 align-top">${safe(r.grade,'—')}</td>
            <td class="border px-3 py-2 text-center align-top">${r.qty} ${safe(r.unit,'')}</td>
            <td class="border px-3 py-2 text-center align-top">${safe(r.packaging,'—')}</td>
            <td class="border px-3 py-2 text-center align-top">${money(r.up, srcCcy)}</td>
            <td class="border px-3 py-2 text-center align-top">${money(r.amt, srcCcy)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="text-right mb-6 space-y-1">
      <p class="font-semibold">Sous-total : <span>${money(subtotal, srcCcy)}</span></p>
      ${enableFX && fxBlock ? `
        <div class="inline-block text-left border rounded p-3 bg-gray-50">
          <p class="text-sm text-gray-600">Taux FX ${srcCcy} → ${dstCcy}: <strong>${fxBlock.rate}</strong></p>
          <p>Montant brut (${dstCcy}) : <strong>${money(fxBlock.converted, dstCcy)}</strong></p>
          ${opts.fx?.feePct ? `<p>− Frais conv. (${(opts.fx.feePct*100).toFixed(2)}%) : <strong>${money(fxBlock.feePctAmt, dstCcy)}</strong></p>` : ''}
          ${opts.fx?.transferFeeFlat ? `<p>− Frais virement intl : <strong>${money(fxBlock.transferFlat, dstCcy)}</strong></p>` : ''}
          <p class="text-lg">NET à recevoir (${dstCcy}) : <strong>${money(fxBlock.net, dstCcy)}</strong></p>
        </div>
      ` : ''}
    </div>

    <div class="bg-indigo-50 p-5 rounded border mb-6">
      <h2 class="font-semibold text-indigo-800 mb-4 text-lg">Terms & Conditions</h2>

      ${safe(proforma.notes, type === 'proforma'
          ? 'This is a proforma invoice. Not a tax invoice. Subject to final contract and inspection.'
          : 'This is a quotation. Prices are subject to confirmation. Validity limited.') ? `
        <div class="mb-3 text-sm">
          <p>${safe(proforma.notes, '')}</p>
        </div>` : ''}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        ${terms.map(t => `
          <p><strong>${t.label} :</strong> ${t.value}</p>
        `).join('')}
      </div>
    </div>

    <div class="border-t pt-4 text-xs text-gray-600">
      <p><strong>Notes :</strong></p>
      <ul class="list-disc ml-5 mt-1 space-y-1">
        <li>Ce document est une offre commerciale et n’a pas de valeur fiscale.</li>
        <li>L'ordre sera traité après confirmation écrite et réception de l’avance.</li>
        <li>Les spécifications peuvent être soumises à modification avec accord préalable.</li>
      </ul>
    </div>

    <div class="mt-8 flex justify-between">
      <div>
        <p class="font-semibold">Signature du Vendeur</p>
        <p class="mt-6 border-t w-48"></p>
        <p>${safe(signatures?.seller?.name, safe(company.name,'—'))}</p>
      </div>
      ${type === 'proforma' ? `
      <div>
        <p class="font-semibold">Accepté par l'Acheteur</p>
        <p class="mt-6 border-t w-48"></p>
        <p>${safe(signatures?.buyer?.name, safe(client.name,'—'))}</p>
      </div>` : ''}
    </div>

    <div class="mt-8 pt-4 border-t text-[11px] text-gray-500 flex justify-between">
      <div>${taxIdFooter ? `RC/Tax ID: ${taxIdFooter}` : ''}</div>
      <div>Generated by SenHarvest — www.senharvest.com</div>
    </div>
  </div>
  `;

  return root.firstElementChild;
}

/* ===== API: Générer + Télécharger ===== */
export async function generateAndDownloadHTMLPDF(data, documentType = 'proforma', filename, opts = {}) {
  const el = buildInvoiceHTMLElement(data, documentType, opts);
  const prefix = (documentType || 'proforma').toLowerCase() === 'quotation' ? 'quotation' : 'proforma';
  const ref = safe(data?.proforma?.number, `${prefix === 'quotation' ? 'QT' : 'PF'}-${Date.now()}`);
  const defName = filename || `${prefix}-${ref}.pdf`;

  const opt = {
    margin:       0.5,
    filename:     defName,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'cm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
  };

  await html2pdf().set(opt).from(el).save();
}

/* ===== API: Prévisualiser (ouvre un nouvel onglet avec l’HTML) ===== */
export function previewHTMLInNewTab(data, documentType = 'proforma', opts = {}) {
  const el = buildInvoiceHTMLElement(data, documentType, opts);
  const win = window.open('', '_blank');
  if (!win) return;
  const title = (documentType || 'proforma').toLowerCase() === 'quotation' ? 'Quotation / Devis' : 'Proforma Invoice';
  win.document.write(`
    <!DOCTYPE html>
    <html lang="fr"><head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>@media print {.no-print{display:none!important}} body{-webkit-print-color-adjust:exact; print-color-adjust:exact}</style>
    </head><body class="bg-gray-100 p-6">
      <div class="max-w-4xl mx-auto">${el.outerHTML}</div>
      <div class="text-center mt-8 no-print">
        <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow">
          🖨️ Imprimer
        </button>
      </div>
    </body></html>
  `);
  win.document.close();
}


