import html2pdf from 'html2pdf.js';
import { downloadPdfBlob, printPdfBlob } from '../utils/pdfIo.js';
import { elementToPdfBlob } from '../utils/html2pdfSafe.js';

/* ================= i18n ================= */
const I18N = {
  fr: {
    PROFORMA: 'PROFORMA INVOICE',
    QUOTATION: 'QUOTATION / DEVIS',
    DOC_DESC_PROFORMA: "Document officiel d'offre commerciale",
    DOC_DESC_QUOTATION: 'Offre commerciale (non fiscale)',

    EXPORTER: 'Exportateur / Vendeur',
    IMPORTER: 'Importateur / Acheteur',
    BANK_SELLER: 'Banque (Vendeur)',
    NAME: 'Nom',
    ADDRESS: 'Adresse',
    PHONE: 'Téléphone',
    EMAIL: 'Email',
    TAX_ID: 'Numéro fiscal',
    BANK: 'Banque',
    ACCOUNT: 'Compte',
    IBAN: 'IBAN',
    SWIFT: 'SWIFT/BIC',

    NUMBER_PI: 'Numéro PI',
    NUMBER_QT: 'Numéro QT',
    ISSUE_DATE: "Date d’émission",
    VALIDITY_OFFER: "Validité de l’offre",
    VALID_UNTIL: 'Valid until',

    GOODS_TITLE: 'Description des Marchandises',
    PRODUCT: 'Produit',
    QUALITY: 'Qualité',
    QTY: 'Qté',
    PACKAGING: 'Conditionnement',
    UNIT_PRICE: 'Prix unitaire',
    LINE_TOTAL: 'Montant total',

    SUBTOTAL: 'Sous-total',
    FX_RATE: 'Taux FX',
    FX_GROSS: 'Montant brut',
    FX_FEE: '− Frais conv.',
    FX_INTL_FEE: '− Frais virement intl',
    FX_NET: 'NET à recevoir',

    TERMS: 'Terms & Conditions',
    DEFAULT_NOTES_PI: 'This is a proforma invoice. Not a tax invoice. Subject to final contract and inspection.',
    DEFAULT_NOTES_QT: 'This is a quotation. Prices are subject to confirmation. Validity limited.',

    NOTES: 'Notes',
    NOTE_1: 'Ce document est une offre commerciale et n’a pas de valeur fiscale.',
    NOTE_2: "L'ordre sera traité après confirmation écrite et réception de l’avance.",
    NOTE_3: 'Les spécifications peuvent être soumises à modification avec accord préalable.',

    SIGN_SELLER: 'Signature du Vendeur',
    SIGN_BUYER: "Accepté par l'Acheteur",

    FOOTER_GEN: 'SenHarvest Group — www.senharvest.com',
    FOOTER_RC: 'RC/Tax ID',

    TERM_INCOTERM: 'Incoterm',
    TERM_POL: 'Port of Loading',
    TERM_POD: 'Port of Destination',
    TERM_PAY_METHOD: 'Payment Method',
    TERM_PAY_COND: 'Payment Conditions',
    TERM_VALIDITY: 'Offer Validity',
    TERM_ETA: 'ETA / Delivery',
    TERM_PRICING: 'Pricing',
    TERM_QUANTITY: 'Quantity',
    TERM_CCY: 'Currency',
  },
  en: {
    PROFORMA: 'PROFORMA INVOICE',
    QUOTATION: 'QUOTATION',
    DOC_DESC_PROFORMA: 'Official commercial offer document',
    DOC_DESC_QUOTATION: 'Commercial offer (non fiscal)',

    EXPORTER: 'Exporter / Seller',
    IMPORTER: 'Importer / Buyer',
    BANK_SELLER: 'Bank (Seller)',
    NAME: 'Name',
    ADDRESS: 'Address',
    PHONE: 'Phone',
    EMAIL: 'Email',
    TAX_ID: 'Tax ID',
    BANK: 'Bank',
    ACCOUNT: 'Account',
    IBAN: 'IBAN',
    SWIFT: 'SWIFT/BIC',

    NUMBER_PI: 'PI Number',
    NUMBER_QT: 'QT Number',
    ISSUE_DATE: 'Issue Date',
    VALIDITY_OFFER: 'Offer Validity',
    VALID_UNTIL: 'Valid until',

    GOODS_TITLE: 'Goods Description',
    PRODUCT: 'Product',
    QUALITY: 'Quality',
    QTY: 'Qty',
    PACKAGING: 'Packaging',
    UNIT_PRICE: 'Unit Price',
    LINE_TOTAL: 'Line Total',

    SUBTOTAL: 'Subtotal',
    FX_RATE: 'FX rate',
    FX_GROSS: 'Gross amount',
    FX_FEE: '− Conversion fee',
    FX_INTL_FEE: '− International transfer fee',
    FX_NET: 'NET to receive',

    TERMS: 'Terms & Conditions',
    DEFAULT_NOTES_PI: 'This is a proforma invoice. Not a tax invoice. Subject to final contract and inspection.',
    DEFAULT_NOTES_QT: 'This is a quotation. Prices are subject to confirmation. Validity limited.',

    NOTES: 'Notes',
    NOTE_1: 'This document is a commercial offer and has no fiscal value.',
    NOTE_2: 'The order will be processed after written confirmation and advance receipt.',
    NOTE_3: 'Specifications may be adjusted upon prior agreement.',

    SIGN_SELLER: 'Seller Signature',
    SIGN_BUYER: 'Accepted by Buyer',

    FOOTER_GEN: 'SenHarvest Group — www.senharvest.com',
    FOOTER_RC: 'RC/Tax ID',

    TERM_INCOTERM: 'Incoterm',
    TERM_POL: 'Port of Loading',
    TERM_POD: 'Port of Destination',
    TERM_PAY_METHOD: 'Payment Method',
    TERM_PAY_COND: 'Payment Conditions',
    TERM_VALIDITY: 'Offer Validity',
    TERM_ETA: 'ETA / Delivery',
    TERM_PRICING: 'Pricing',
    TERM_QUANTITY: 'Quantity',
    TERM_CCY: 'Currency',
  },
};
const t = (lang, key) => (I18N[lang]?.[key] ?? I18N.fr[key] ?? key);

/* ================ Helpers ================ */
const safe = (v, fb = '') => (v == null || v === '' ? fb : String(v));
const toNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const currencySign = (c) => ({ USD: '$', CAD: '$', EUR: '€', XOF: 'CFA', XAF: 'FCFA' }[c] || '$');
const money = (n, c = 'USD', lang = 'fr') =>
  `${currencySign(c)} ${Number(n || 0).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function convertWithFees(amountSrc, fx) {
  const rate = toNum(fx?.rate, 1);
  const feePct = toNum(fx?.feePct, 0);
  const flat = toNum(fx?.transferFeeFlat, 0);
  const converted = amountSrc * rate;
  const fee = converted * feePct;
  const net = converted - fee - flat;
  return { rate, converted, feePctAmt: fee, transferFlat: flat, net };
}

function buildTermsList(proforma, srcCcy, type, lang) {
  if (Array.isArray(proforma?.terms) && proforma.terms.length) {
    return proforma.terms
      .filter(t => t && t.label && t.value != null && String(t.value).trim() !== '')
      .map(t => ({ label: String(t.label), value: String(t.value) }));
  }
  const auto = [
    { label: t(lang, 'TERM_INCOTERM'), value: safe(proforma.deliveryTerms, 'FOB') },
    { label: t(lang, 'TERM_POL'), value: safe(proforma.departurePort, 'Dakar, Senegal') },
    ...(type === 'proforma' ? [{ label: t(lang, 'TERM_POD'), value: safe(proforma.destinationPort, '—') }] : []),
    { label: t(lang, 'TERM_PAY_METHOD'), value: safe(proforma.paymentMethod, 'Bank Transfer') },
    ...(proforma.paymentConditions ? [{ label: t(lang, 'TERM_PAY_COND'), value: proforma.paymentConditions }] : []),
    { label: t(lang, 'TERM_VALIDITY'), value: safe(proforma.validity, '30 days') },
    ...(proforma.etaDelivery ? [{ label: t(lang, 'TERM_ETA'), value: proforma.etaDelivery }] : []),
    ...(proforma.pricing ? [{ label: t(lang, 'TERM_PRICING'), value: proforma.pricing }] : []),
    ...(proforma.quantityNote ? [{ label: t(lang, 'TERM_QUANTITY'), value: proforma.quantityNote }] : []),
    { label: t(lang, 'TERM_CCY'), value: srcCcy },
  ];
  return auto.filter(i => String(i.value).trim() !== '');
}

/* ============ HTML builder (tout page 1, pagination si besoin) ============ */
export function buildInvoiceHTMLElement(data, documentType = 'proforma', opts = {}) {
  const type = (documentType || 'proforma').toLowerCase() === 'quotation' ? 'quotation' : 'proforma';
  const lang = (opts.lang === 'en' ? 'en' : 'fr');

  const {
    company = {}, client = {}, proforma = {}, products = [], signatures = {}, bank = {},
  } = data || {};

  const srcCcy = proforma.currency || opts.currency || 'USD';
  const dstCcy = opts.secondaryCurrency || null;
  const enableFX = Boolean(opts.enableFX && dstCcy && opts.fx?.rate);
  const enableBank = type === 'proforma' && Boolean(opts.enableBankInfo);
  const logoPath = opts.logoPath || '/Xidma Harvest Logo NB.png';

  let subtotal = 0;
  const rows = (products || []).map(p => {
    const qty = toNum(p.quantity, 0);
    const up = toNum(p.unitPrice, 0);
    const amt = qty * up;
    subtotal += amt;
    return { ...p, qty, up, amt };
  });
  const fxBlock = enableFX ? convertWithFees(subtotal, opts.fx || {}) : null;
  const terms = buildTermsList(proforma, srcCcy, type, lang);

  const title = type === 'proforma' ? t(lang, 'PROFORMA') : t(lang, 'QUOTATION');
  const refPrefix = type === 'proforma' ? 'PF' : 'QT';
  const ref = safe(proforma.number, `${refPrefix}-${Date.now()}`);
  const date = safe(proforma.date, new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US'));
  const validityLabel = type === 'quotation' ? t(lang, 'VALIDITY_OFFER') : t(lang, 'VALID_UNTIL');

  const root = document.createElement('div');
  root.innerHTML = `
      <style>
        @media print { 
          .no-print { display: none !important; visibility: hidden !important; }
          @page { 
            margin: 0.5in; 
            size: A4;
            @bottom-right { content: none !important; }
            @bottom-left { content: none !important; }
            @bottom-center { content: none !important; }
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .html2pdf__page-break { page-break-before: always; break-before: page; }
        .avoid-break { break-inside: avoid; page-break-inside: avoid; }
        table { border-collapse: collapse; width: 100%; }
        thead { display: table-header-group; }
        tr { break-inside: avoid; page-break-inside: avoid; }
        td, th { vertical-align: top; }
        .card { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; }
        .muted { color: #6b7280; }
        .heading { font-weight: 600; }
        body { 
          margin: 0 !important; 
          padding: 0 !important; 
          background: white !important;
        }
        .print-hidden { display: none !important; visibility: hidden !important; }
        button { display: none !important; }
        .no-print { display: none !important; visibility: hidden !important; }
        /* Masquer tous les éléments générés par html2pdf */
        .html2pdf__page-break::after,
        .html2pdf__page-break::before { content: none !important; }
        /* Masquer les numéros de page et about:blank */
        [data-page-number],
        [class*="page-number"],
        [class*="pageNumber"] { display: none !important; }
      </style>

  <div id="pdf-root" class="text-[13px] leading-relaxed text-gray-800">
    <section class="pdf-page page-1">
      <div class="flex justify-between items-start mb-5 pb-3 border-b avoid-break" id="header-block">
        <div class="min-w-[50%]">
          <h1 class="text-2xl font-bold text-blue-700">${title}</h1>
          <p class="muted mt-1">${type === 'proforma' ? t(lang,'DOC_DESC_PROFORMA') : t(lang,'DOC_DESC_QUOTATION')}</p>
        </div>
        <div class="text-right">
          ${logoPath ? `<img src="${logoPath}" alt="Logo" crossorigin="anonymous" class="ml-auto mb-2 max-h-[56px]" />` : ''}
          <p class="font-semibold">Ref: ${ref}</p>
          <p>${t(lang,'ISSUE_DATE')}: ${date}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 avoid-break" id="parties">
        <div class="card bg-blue-50">
          <h2 class="heading text-blue-800 mb-2">${t(lang,'EXPORTER')}</h2>
          <p><strong>${t(lang,'NAME')} :</strong> ${safe(company.name, '—')}</p>
          <p><strong>${t(lang,'ADDRESS')} :</strong> ${safe(company.address, '—')}</p>
          <p><strong>${t(lang,'PHONE')} :</strong> ${safe(company.phone, '—')}</p>
          <p><strong>${t(lang,'EMAIL')} :</strong> ${safe(company.email, '—')}</p>
          ${enableBank ? `
            <div class="mt-3 space-y-1">
              <p class="heading">${t(lang,'BANK_SELLER')}</p>
              <p><strong>${t(lang,'BANK')} :</strong> ${safe(bank.bankName, '—')}</p>
              <p><strong>${t(lang,'ACCOUNT')} :</strong> ${safe(bank.accountName, '—')}</p>
              <p><strong>${t(lang,'IBAN')} :</strong> ${safe(bank.iban, '—')}</p>
              <p><strong>${t(lang,'SWIFT')} :</strong> ${safe(bank.swift, '—')}</p>
              <p><strong>${t(lang,'ADDRESS')} :</strong> ${safe(bank.address, '—')}</p>
            </div>` : ''
          }
        </div>
        <div class="card bg-green-50">
          <h2 class="heading text-green-800 mb-2">${t(lang,'IMPORTER')}</h2>
          <p><strong>${t(lang,'NAME')} :</strong> ${safe(client.name, '—')}</p>
          <p><strong>${t(lang,'ADDRESS')} :</strong> ${safe(client.address, '—')}</p>
          <p><strong>${t(lang,'PHONE')} :</strong> ${safe(client.phone, '—')}</p>
          <p><strong>${t(lang,'EMAIL')} :</strong> ${safe(client.email, '—')}</p>
          <p><strong>${t(lang,'TAX_ID')} :</strong> ${safe(client.taxId, '—')}</p>
        </div>
      </div>

      <div class="card bg-gray-50 mb-5 grid grid-cols-1 md:grid-cols-2 gap-2 avoid-break" id="meta">
        <div>
          <p><strong>${type === 'proforma' ? t(lang,'NUMBER_PI') : t(lang,'NUMBER_QT')} :</strong> ${ref}</p>
          <p><strong>${t(lang,'ISSUE_DATE')} :</strong> ${date}</p>
        </div>
        <div>
          <p><strong>${validityLabel} :</strong> ${safe(proforma.validity, '30 days')}</p>
        </div>
      </div>

      <div id="products-block" class="mb-4">
        <h2 class="text-lg heading mb-2">${t(lang,'GOODS_TITLE')}</h2>
        <table class="text-sm" id="products-table">
          <thead class="bg-gray-200">
            <tr>
              <th class="border px-3 py-2 text-left">${t(lang,'PRODUCT')}</th>
              <th class="border px-3 py-2 text-left">${t(lang,'QUALITY')}</th>
              <th class="border px-3 py-2 text-center">${t(lang,'QTY')}</th>
              <th class="border px-3 py-2 text-center">${t(lang,'PACKAGING')}</th>
              <th class="border px-3 py-2 text-center">${t(lang,'UNIT_PRICE')} (${srcCcy})</th>
              <th class="border px-3 py-2 text-center">${t(lang,'LINE_TOTAL')} (${srcCcy})</th>
            </tr>
          </thead>
          <tbody id="products-tbody">
            ${rows.map(r => `
              <tr class="align-top">
                <td class="border px-3 py-2">
                  ${safe(r.description,'—')}
                  ${r.hsCode ? `<div class="text-xs text-gray-500 mt-1">HS: ${r.hsCode}</div>` : ''}
                </td>
                <td class="border px-3 py-2">${safe(r.grade,'—')}</td>
                <td class="border px-3 py-2 text-center">${r.qty} ${safe(r.unit,'')}</td>
                <td class="border px-3 py-2 text-center">${safe(r.packaging,'—')}</td>
                <td class="border px-3 py-2 text-center">${money(r.up, srcCcy, lang)}</td>
                <td class="border px-3 py-2 text-center">${money(r.amt, srcCcy, lang)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div id="totals-block" class="text-right mb-5 avoid-break">
        <p class="font-semibold">${t(lang,'SUBTOTAL')} : <span>${money(subtotal, srcCcy, lang)}</span></p>
        ${enableFX && fxBlock ? `
          <div class="inline-block text-left border rounded p-3 bg-gray-50 mt-2">
            <p class="text-sm muted">${t(lang,'FX_RATE')} ${srcCcy} → ${dstCcy}: <strong>${fxBlock.rate}</strong></p>
            <p>${t(lang,'FX_GROSS')} (${dstCcy}) : <strong>${money(fxBlock.converted, dstCcy, lang)}</strong></p>
            ${opts.fx?.feePct ? `<p>${t(lang,'FX_FEE')} (${(opts.fx.feePct*100).toFixed(2)}%) : <strong>${money(fxBlock.feePctAmt, dstCcy, lang)}</strong></p>` : ''}
            ${opts.fx?.transferFeeFlat ? `<p>${t(lang,'FX_INTL_FEE')} : <strong>${money(fxBlock.transferFlat, dstCcy, lang)}</strong></p>` : ''}
            <p class="text-lg">${t(lang,'FX_NET')} (${dstCcy}) : <strong>${money(fxBlock.net, dstCcy, lang)}</strong></p>
          </div>
        ` : ''}
      </div>

      <div id="terms-block" class="card bg-indigo-50 mb-5 avoid-break">
        <h2 class="heading text-indigo-800 mb-2 text-lg">${t(lang,'TERMS')}</h2>
        ${safe(proforma.notes, type === 'proforma'
            ? t(lang,'DEFAULT_NOTES_PI')
            : t(lang,'DEFAULT_NOTES_QT'))
          ? `<div class="mb-2 text-sm"><p>${safe(proforma.notes, '')}</p></div>`
          : ''
        }
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          ${terms.map(ti => `<p><strong>${ti.label} :</strong> ${ti.value}</p>`).join('')}
        </div>
      </div>

      <div id="signatures-block" class="mt-6 flex justify-between avoid-break">
        <div>
          <p class="font-semibold">${t(lang,'SIGN_SELLER')}</p>
          <p class="mt-6 border-t w-48"></p>
          <p>${safe(signatures?.seller?.name, safe(company.name,'—'))}</p>
        </div>
        ${type === 'proforma' ? `
        <div>
          <p class="font-semibold">${t(lang,'SIGN_BUYER')}</p>
          <p class="mt-6 border-t w-48"></p>
          <p>${safe(signatures?.buyer?.name, safe(client.name,'—'))}</p>
        </div>` : ''}
      </div>

      <div id="footer-block" class="mt-8 pt-3 border-t text-[11px] text-gray-500 flex justify-between avoid-break">
        <div>
          <div>Business ID Number: 7688415 (USA)</div>
          <div>NINEA: 010864694/1D1 - RRCM: SN DKR 2023 A 53039 (Sénégal)</div>
        </div>
        <div class="footer-brand">${t(lang,'FOOTER_GEN')}</div>
      </div>
    </section>

    <section class="pdf-page page-2 html2pdf__page-break" style="display:none">
      <div id="page2-container"></div>
    </section>
  </div>
  `;

  const rootEl = root.querySelector('#pdf-root');
  const page1 = rootEl.querySelector('.page-1');
  const page2 = rootEl.querySelector('.page-2');
  const page2Container = rootEl.querySelector('#page2-container');

  const table = rootEl.querySelector('#products-table');
  const tbody = rootEl.querySelector('#products-tbody');

  const totalsBlock = rootEl.querySelector('#totals-block');
  const termsBlock = rootEl.querySelector('#terms-block');
  const signBlock = rootEl.querySelector('#signatures-block');

  table.style.tableLayout = 'fixed';
  table.querySelectorAll('th, td').forEach((cell, idx) => {
    const widths = ['28%','22%','10%','15%','12.5%','12.5%'];
    cell.style.width = widths[idx % 6];
    cell.style.wordBreak = 'break-word';
  });

  const PAGE_PX = 1122;
  const MARGIN_PX = 56;
  const MAX_P1 = PAGE_PX - MARGIN_PX;
  const MAX_P2 = PAGE_PX - MARGIN_PX;

  const fitsP1 = () => page1.scrollHeight <= MAX_P1;
  const fitsP2 = () => page2.scrollHeight <= MAX_P2;
  const showP2 = () => { page2.style.display = 'block'; };

  if (fitsP1()) return rootEl;

  showP2();

  const table2 = table.cloneNode(true);
  table2.id = 'products-table-continued';
  const tbody2 = table2.querySelector('tbody');
  tbody2.id = 'products-tbody-continued';
  while (tbody2.firstChild) tbody2.removeChild(tbody2.firstChild);
  page2Container.appendChild(table2);

  while (!fitsP1() && tbody.children.length > 0) {
    const lastRow = tbody.lastElementChild;
    tbody2.insertBefore(lastRow, tbody2.firstChild);
  }

  const pushBlockToP2 = (el) => { if (el && !page2Container.contains(el)) page2Container.appendChild(el); };

  if (!fitsP1()) pushBlockToP2(totalsBlock);
  if (!fitsP1()) pushBlockToP2(termsBlock);
  if (!fitsP1()) pushBlockToP2(signBlock);

  const shrink = (scale) => {
    rootEl.style.transformOrigin = 'top left';
    rootEl.style.transform = `scale(${scale})`;
    rootEl.style.width = `${100 / scale}%`;
  };
  if (!fitsP2()) {
    shrink(0.97);
    if (!fitsP2()) {
      shrink(0.94);
      if (!fitsP2()) shrink(0.92);
    }
  }

  return rootEl;
}

// Fonction utilitaire pour nettoyer les éléments indésirables
function cleanElementForPDF(element) {
  // Supprimer tous les boutons
  const buttons = element.querySelectorAll('button');
  buttons.forEach(btn => btn.remove());
  
  // Supprimer les éléments avec les classes no-print
  const noPrintElements = element.querySelectorAll('.no-print, .print-controls, .print-hidden');
  noPrintElements.forEach(el => el.remove());
  
  // Supprimer les scripts
  const scripts = element.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Nettoyer les URLs about:blank - APPROCHE PLUS AGRESSIVE
  const links = element.querySelectorAll('a[href="about:blank"], a[href*="about:"], a[href*="blank"]');
  links.forEach(link => link.remove());
  
  // Supprimer les éléments de numérotation de page
  const pageNumbers = element.querySelectorAll('[data-page-number], [class*="page-number"], [class*="pageNumber"], [id*="page-number"], [id*="pageNumber"]');
  pageNumbers.forEach(el => el.remove());
  
  // Nettoyer le texte "about:blank" dans tout le contenu
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  // eslint-disable-next-line no-cond-assign
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  textNodes.forEach(textNode => {
    if (textNode.textContent && textNode.textContent.includes('about:blank')) {
      textNode.textContent = textNode.textContent.replace(/about:blank/gi, '');
    }
  });
  
  // Nettoyer les attributs href contenant about:blank
  const allElements = element.querySelectorAll('*');
  allElements.forEach(el => {
    if (el.href && el.href.includes('about:blank')) {
      el.removeAttribute('href');
    }
    // Nettoyer aussi les attributs data-href ou autres
    Array.from(el.attributes).forEach(attr => {
      if (attr.value && attr.value.includes('about:blank')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return element;
}

// Fonction spécifique pour nettoyer le footer
function cleanFooterForPDF(element) {
  const footerBlock = element.querySelector('#footer-block');
  if (footerBlock) {
    // Nettoyer spécifiquement le footer
    const footerBrand = footerBlock.querySelector('.footer-brand');
    if (footerBrand) {
      footerBrand.innerHTML = 'SenHarvest Group — www.senharvest.com';
    }
    
    // Supprimer tout texte contenant about:blank dans le footer
    const walker = document.createTreeWalker(
      footerBlock,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    // eslint-disable-next-line no-cond-assign
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
      if (textNode.textContent && textNode.textContent.includes('about:blank')) {
        textNode.textContent = textNode.textContent.replace(/about:blank/gi, '');
      }
    });
  }
}

// Fonction pour nettoyer les éléments de navigation ajoutés par html2pdf
function cleanNavigationElements() {
  // Supprimer les éléments de navigation qui pourraient être ajoutés par html2pdf
  const navigationElements = document.querySelectorAll(
    '[class*="html2pdf"], [class*="page-number"], [class*="navigation"], ' +
    '[data-html2canvas], [data-jspdf], [id*="html2pdf"], [id*="page-number"]'
  );
  navigationElements.forEach(el => el.remove());
  
  // Supprimer les styles de navigation
  const styleSheets = document.querySelectorAll('style, link[rel="stylesheet"]');
  styleSheets.forEach(sheet => {
    if (sheet.textContent && sheet.textContent.includes('about:blank')) {
      sheet.textContent = sheet.textContent.replace(/about:blank/gi, '');
    }
  });
}

export async function generateAndDownloadHTMLPDF(data, documentType = 'proforma', filename, opts = {}) {
  const el = buildInvoiceHTMLElement(data, documentType, opts);
  
  // Nettoyer l'élément avant génération
  cleanElementForPDF(el);
  
  // Nettoyer spécifiquement le footer
  cleanFooterForPDF(el);
  
  // Nettoyer les éléments de navigation
  cleanNavigationElements();
  
  const prefix = (documentType || 'proforma').toLowerCase() === 'quotation' ? 'quotation' : 'proforma';
  const ref = (data?.proforma?.number && String(data.proforma.number)) || `${prefix === 'quotation' ? 'QT' : 'PF'}-${Date.now()}`;
  const defName = filename || `${prefix}-${ref}.pdf`;

  // Créer un conteneur temporaire sans about:blank
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = '210mm'; // A4 width
  tempContainer.style.minHeight = '297mm'; // A4 height
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.padding = '20px';
  tempContainer.style.boxSizing = 'border-box';
  
  // Cloner l'élément et l'ajouter au conteneur temporaire
  const clonedEl = el.cloneNode(true);
  tempContainer.appendChild(clonedEl);
  document.body.appendChild(tempContainer);

  const opt = {
    margin: [10, 12, 10, 12],
    filename: defName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    // Utiliser la nouvelle fonction robuste
    const blob = await elementToPdfBlob(tempContainer, defName, {
      margin: [10, 12, 10, 12],
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#FFFFFF'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    });
    
    downloadPdfBlob(blob, defName);
  } finally {
    // Nettoyer le conteneur temporaire
    if (tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }
  }
}

// Alternative: Génération PDF via impression du navigateur SANS about:blank
export async function generatePDFViaPrint(data, documentType = 'proforma', filename, opts = {}) {
  const el = buildInvoiceHTMLElement(data, documentType, opts);
  
  // Nettoyer l'élément avant génération
  cleanElementForPDF(el);
  cleanFooterForPDF(el);
  
  const lang = (opts.lang === 'fr' ? 'fr' : 'en');
  const defName = filename || `${documentType || 'proforma'}-${data.number || '000'}.pdf`;
  
  const opt = {
    margin: [10, 12, 10, 12],
    filename: defName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };
  
  await html2pdf()
    .set(opt)
    .from(el)
    .toPdf()
    .get('pdf')
    .then((pdf) => {
      // Supprimer le footer auto "about:blank"
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        
        // Effacer le footer ajouté automatiquement avec du texte blanc
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255); // écrit en blanc => invisible
        pdf.text('', 200, pdf.internal.pageSize.height - 10, null, null, 'right');
        pdf.text('', 100, pdf.internal.pageSize.height - 10, null, null, 'center');
        pdf.text('', 20, pdf.internal.pageSize.height - 10, null, null, 'left');
        
        // Maintenant ajouter notre footer personnalisé
        pdf.setTextColor(100, 100, 100); // gris foncé
        
        // Informations d'entreprise en bas à gauche
        pdf.setFontSize(8);
        pdf.text(
          'Business ID Number: 7688415 (USA)',
          20,
          pdf.internal.pageSize.height - 15,
          null, null, 'left'
        );
        
        pdf.text(
          'NINEA: 010864694/1D1 - RRCM: SN DKR 2023 A 53039 (Sénégal)',
          20,
          pdf.internal.pageSize.height - 10,
          null, null, 'left'
        );
        
        // Numéro de page en bas à droite
        pdf.setFontSize(9);
        pdf.text(
          `Page ${i} / ${pageCount}`,
          200,
          pdf.internal.pageSize.height - 10,
          null, null, 'right'
        );
        
        // SenHarvest Group au centre
        pdf.text(
          'SenHarvest Group — www.senharvest.com',
          105,
          pdf.internal.pageSize.height - 10,
          null, null, 'center'
        );
      }
      
      // Build a clean Blob (no window.open)
      const arrayBuffer = pdf.output('arraybuffer');
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      printPdfBlob(blob); // ✅ no about:blank in address bar or footer
    });
}

export function previewHTMLInNewTab(data, documentType = 'proforma', opts = {}) {
  const el = buildInvoiceHTMLElement(data, documentType, opts);
  const win = window.open('', '_blank');
  if (!win) return;
  const lang = (opts.lang === 'en' ? 'en' : 'fr');
  const title = (documentType || 'proforma').toLowerCase() === 'quotation' ? t(lang,'QUOTATION') : t(lang,'PROFORMA');
  
  // Nettoyer l'élément pour la prévisualisation
  cleanElementForPDF(el);
  cleanFooterForPDF(el);
  
  win.document.write(`
    <!DOCTYPE html>
    <html lang="${lang}"><head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact; 
          margin: 0 !important; 
          padding: 0 !important; 
          background: white !important;
        }
        .html2pdf__page-break { page-break-before: always; break-before: page; }
        .avoid-break { break-inside: avoid; page-break-inside: avoid; }
        thead { display: table-header-group; }
        tr { break-inside: avoid; page-break-inside: avoid; }
        @media print {
          .no-print { display: none !important; visibility: hidden !important; }
          button { display: none !important; }
          .print-controls { display: none !important; }
          .print-hidden { display: none !important; visibility: hidden !important; }
          @page { 
            margin: 0.5in; 
            size: A4;
          }
        }
        .print-controls { 
          position: fixed; 
          bottom: 20px; 
          left: 50%; 
          transform: translateX(-50%); 
          z-index: 1000; 
        }
      </style>
    </head><body class="bg-gray-100 p-6">
      <div class="max-w-4xl mx-auto">${el.outerHTML}</div>
      <div class="print-controls no-print">
        <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow print-hidden">
          🖨️ ${lang === 'fr' ? 'Imprimer' : 'Print'}
        </button>
        <button onclick="window.close()" class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded shadow ml-2 print-hidden">
          ✕ ${lang === 'fr' ? 'Fermer' : 'Close'}
        </button>
      </div>
    </body></html>
  `);
  win.document.close();
}

