import html2pdf from "html2pdf.js";

export async function generateTradePDF(data){
  const el = renderTemplate(data);
  const filename = `${data.type === "quotation" ? "quotation":"proforma"}-${data.number||"000"}.pdf`;
  const opt = {
    margin: [0.7,0.7,0.7,0.7],
    filename,
    image: { type:'jpeg', quality:0.98 },
    html2canvas: { scale:2, useCORS:true },
    jsPDF: { unit:'in', format:'a4', orientation:'portrait' },
    pagebreak: { mode:['avoid-all','css','legacy'] }
  };
  await html2pdf().set(opt).from(el).save();
}

function fmt(n,c='USD'){ return `${c} ${Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function convertWithFees(amount, fx){
  if(!fx) return null;
  const rate = Number(fx.rate||1), feePct = Number(fx.feePct||0), flat = Number(fx.transferFeeFlat||0);
  const converted = amount * rate;
  const feePctAmt = converted * feePct;
  const net = converted - feePctAmt - flat;
  return {converted, feePctAmt, flat, net, rate, dst: fx.dstCurrency||'XOF'};
}

function renderTemplate(d){
  const root = document.createElement("div");
  root.innerHTML = `
  <style>
    *{ box-sizing:border-box }
    .doc{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#111; font-size:12px; }
    h1,h2,h3{ margin:0 }
    .muted{ color:#666 }
    .grid{ display:grid; gap:10px }
    .border{ border:1px solid #e5e7eb }
    .rounded{ border-radius:8px }
    .p8{ padding:12px }
    .mb6{ margin-bottom:16px }
    .mb3{ margin-bottom:8px }
    .fw600{ font-weight:600 }
    .right{ text-align:right }
    .table{ width:100%; border-collapse:collapse; }
    .table th,.table td{ border:1px solid #e5e7eb; padding:6px; vertical-align:top }
    .table thead th{ background:#f3f4f6; font-weight:600 }
    .no-break{ break-inside: avoid; page-break-inside: avoid }
    .row{ display:flex; gap:12px }
    .col{ flex:1 }
    .small{ font-size:11px }
  </style>

  <div class="doc">
    <div class="row mb6">
      <div class="col">
        <img src="/senharvest-logo.png" alt="logo" style="height:44px"/>
        <div class="small muted">${esc(d.company?.address||"")}</div>
        <div class="small muted">Tel: ${esc(d.company?.phone||"")} · ${esc(d.company?.email||"")}</div>
      </div>
      <div class="col right">
        <h1>${d.type==="quotation" ? "QUOTATION / DEVIS" : "PROFORMA INVOICE"}</h1>
        <div class="small">No: ${esc(d.number||"-")} · ${esc(d.date||new Date().toLocaleDateString())}</div>
      </div>
    </div>

    <div class="row mb6">
      <div class="col border rounded p8 no-break">
        <h3 class="mb3">Exporter / Seller</h3>
        <div class="small">${esc(d.company?.name||"")}</div>
        <div class="small">${esc(d.company?.address||"")}</div>
        <div class="small">Tel: ${esc(d.company?.phone||"")} · ${esc(d.company?.email||"")}</div>
      </div>
      <div class="col border rounded p8 no-break">
        <h3 class="mb3">Importer / Buyer</h3>
        <div class="small">${esc(d.client?.name||"")}</div>
        <div class="small">${esc(d.client?.address||"")}</div>
        <div class="small">Tel: ${esc(d.client?.phone||"")} · ${esc(d.client?.email||"")}</div>
        ${d.client?.taxId ? `<div class="small">Tax ID: ${esc(d.client.taxId)}</div>` : ""}
      </div>
    </div>

    <div class="row mb6">
      <div class="col border rounded p8 no-break">
        <div><span class="fw600">Currency:</span> ${esc(d.currency||"USD")}</div>
        <div><span class="fw600">Validity:</span> ${esc(d.terms?.validity||"30 days")}</div>
      </div>
      <div class="col border rounded p8 no-break">
        <div><span class="fw600">Incoterms:</span> ${esc(d.terms?.incoterm||"FOB")}</div>
        <div><span class="fw600">POL:</span> ${esc(d.terms?.pol||"-")} · <span class="fw600">POD:</span> ${esc(d.terms?.pod||"-")}</div>
      </div>
    </div>

    <div class="mb6 no-break">
      <h3 class="mb3">Goods / Marchandises</h3>
      <table class="table">
        <thead>
          <tr>
            <th style="width:34%">Description</th>
            <th>Quality/Grade</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Unit Price (${esc(d.currency||"USD")})</th>
            <th>Total (${esc(d.currency||"USD")})</th>
          </tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
      <div id="totals" class="right fw600" style="margin-top:6px"></div>
    </div>

    <div class="border rounded p8 mb6 no-break" id="terms">
      <h3 class="mb3">Terms & Conditions</h3>
      <div class="small">
        <div>Incoterms: ${esc(d.terms?.incoterm||"-")}</div>
        <div>Port of Loading: ${esc(d.terms?.pol||"-")}</div>
        <div>Port of Destination: ${esc(d.terms?.pod||"-")}</div>
        <div>Payment: ${esc(d.terms?.paymentMethod||"-")} · ${esc(d.terms?.paymentTerms||"-")}</div>
        <div>Delivery: ${esc(d.terms?.deliveryTime||"-")}</div>
        ${d.terms?.hsCode ? `<div>HS Code: ${esc(d.terms.hsCode)}</div>` : ""}
        ${d.terms?.notes ? `<div style="margin-top:6px">${nl2br(esc(d.terms.notes))}</div>` : ""}
      </div>
      ${
        d.type==="proforma" && d.flags?.showBankInfo
        ? `<div class="border rounded p8" style="margin-top:10px">
            <div class="fw600 mb3">Bank Details</div>
            <div class="small">Bank: ${esc(d.company?.bank?.name||"-")}</div>
            <div class="small">SWIFT: ${esc(d.company?.bank?.swift||"-")} · IBAN/ACC: ${esc(d.company?.bank?.iban||"-")}</div>
            <div class="small">Beneficiary: ${esc(d.company?.bank?.beneficiary||"-")}</div>
            ${d.company?.bank?.address ? `<div class="small">${esc(d.company.bank.address)}</div>`:""}
          </div>`
        : ""
      }
    </div>

    <div class="row no-break">
      <div class="col">
        <div class="fw600">Seller / Vendeur</div>
        <div style="margin-top:28px; border-top:1px solid #ddd; width:70%"></div>
        <div class="small">${esc(d.company?.name||"")}</div>
      </div>
      ${
        d.type==="proforma"
        ? `<div class="col right">
             <div class="fw600">Buyer / Acheteur</div>
             <div style="margin-top:28px; border-top:1px solid #ddd; width:70%; float:right"></div>
             <div class="small">${esc(d.client?.name||"")}</div>
           </div>`
        : `<div class="col"></div>`
      }
    </div>

    <div class="small muted" style="margin-top:10px">
      ${d.type==="quotation"
        ? "This is a quotation; prices subject to confirmation."
        : "This is a proforma invoice; not a tax invoice."
      }
      · SenHarvest Group — www.senharvest.com
    </div>
  </div>
  `;

  const tbody = root.querySelector("#rows");
  let subtotal = 0;
  (d.products||[]).forEach(p=>{
    const qty = Number(p.quantity||0), up = Number(p.unitPrice||0);
    const total = qty * up; subtotal += total;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${esc(p.description||"-")}${p.packing?`<div class="small muted">Packing: ${esc(p.packing)}</div>`:""}</td>
      <td>${esc(p.quality||"-")}${p.hsCode?`<div class="small muted">HS: ${esc(p.hsCode)}</div>`:""}</td>
      <td>${qty}</td>
      <td>${esc(p.unit||"")}</td>
      <td class="right">${fmt(up, d.currency)}</td>
      <td class="right">${fmt(total, d.currency)}</td>`;
    tbody.appendChild(tr);
  });

  const totals = root.querySelector("#totals");
  let html = `Subtotal: ${fmt(subtotal, d.currency)}`;
  if (d.flags?.useFxConversion && d.fx?.rate) {
    const detail = convertWithFees(subtotal, d.fx);
    html += `<div class="small muted">
      FX ${esc(d.currency||'USD')}→${esc(detail.dst)} @ ${detail.rate} — Gross ${fmt(detail.converted, detail.dst)}
      ${d.fx.feePct?` · Fee ${(d.fx.feePct*100).toFixed(2)}% = -${fmt(detail.feePctAmt, detail.dst)}`:""}
      ${d.fx.transferFeeFlat?` · Intl fee = -${fmt(detail.flat, detail.dst)}`:""}
      · <b>NET ${fmt(detail.net, detail.dst)}</b>
    </div>`;
  }
  totals.innerHTML = html;

  return root;
}
function esc(s=""){ return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
function nl2br(s){ return s.replace(/\n/g,"<br/>"); }


