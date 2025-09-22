import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  previewHTMLInNewTab,
  generateAndDownloadHTMLPDF,
} from "../services/pdfHtmlService";

function deepMerge(target, src) {
  if (Array.isArray(src)) return [...src];
  if (src && typeof src === "object") {
    const out = { ...(target || {}) };
    for (const k of Object.keys(src)) out[k] = deepMerge(out[k], src[k]);
    return out;
  }
  return src ?? target;
}
function useDebouncedCallback(fn, delay = 400) {
  const t = useRef();
  return (...args) => {
    clearTimeout(t.current);
    t.current = setTimeout(() => fn(...args), delay);
  };
}
const STORAGE_KEY = "senharvest_admin_terms_v1";
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function AdminTermsPDF() {
  const defaults = {
    docType: "proforma",
    enableFX: false,
    enableBankInfo: true,
    currency: "USD",
    dstCurrency: "XOF",
    fxRate: 610,
    fxPct: 1.5,
    fxFlat: 25,
    logoPath: "/senharvest-logo.png",
    company: {
      name: "SenHarvest Group",
      address: "Dakar, Sénégal",
      phone: "+221 77 634 0064",
      email: "contact@senharvest.com",
      taxId: "RC SN-123456 / NINEA 001234567",
    },
    client: {
      name: "ACME Import SARL",
      address: "12 Rue du Port, 75001 Paris, France",
      phone: "+33 1 23 45 67 89",
      email: "buy@acme.com",
      taxId: "FR 12 345 678 901",
    },
    pf: {
      number: "PF-2025-001",
      date: new Date().toISOString().slice(0, 10),
      validity: "30 days",
      deliveryTerms: "FOB",
      departurePort: "Dakar, Senegal",
      destinationPort: "Antwerp, Belgium",
      paymentMethod: "T/T — 30% advance, 70% against documents",
      paymentConditions: "",
      etaDelivery: "3–4 weeks after advance",
      pricing: "As per line items; taxes & duties excluded",
      quantityNote: "Subject to final weight at loading",
      notes:
        "Quality per agreed specs. Shipment 3–4 weeks after advance. Inspection SGS/Veritas if required.",
    },
    products: [
      {
        description: "Raw Cashew Nuts (R.C.N.)",
        hsCode: "080131",
        grade: "Moisture ≤ 8%, Defective ≤ 2.5%",
        packaging: "50 kg PP+PE bags, new, export grade",
        quantity: 100,
        unit: "MT",
        unitPrice: 1200,
        grossWeight: "100,500 kg",
        netWeight: "100,000 kg",
      },
      {
        description: "Sesame Seeds — Hulled 99.95%",
        hsCode: "120740",
        grade: "FFA ≤ 2%, Impurities ≤ 0.05%",
        packaging: "25 kg kraft bags on pallets",
        quantity: 30,
        unit: "MT",
        unitPrice: 1450,
        grossWeight: "30,180 kg",
        netWeight: "30,000 kg",
      },
    ],
    signatures: {
      seller: {
        name: "Abdoulahat LO",
        title: "Directeur Général",
        date: new Date().toISOString().slice(0, 10),
      },
      buyer: {
        name: "John Smith",
        title: "Procurement Manager",
        date: new Date().toISOString().slice(0, 10),
      },
    },
    bank: {
      bankName: "Bank of Trade",
      accountName: "SenHarvest Group",
      iban: "SN08 0000 1234 5678",
      swift: "BTSNSNDA",
      address: "123 Av. Marché, Dakar, SN",
    },
    buyerBank: {
      bankName: "BNP Paribas",
      accountName: "ACME Import SARL",
      iban: "FR76 0000 1111 2222 3333",
      swift: "BNPAFRPP",
      address: "16 Bd des Italiens, Paris, FR",
    },
    manualTermsEnabled: true,
    terms: [
      { label: "Incoterm", value: "FOB" },
      { label: "Port of Loading", value: "Dakar, Senegal" },
      { label: "Port of Destination", value: "Antwerp, Belgium" },
      { label: "Payment Method", value: "T/T" },
      { label: "Payment Conditions", value: "30% advance, 70% against documents" },
      { label: "Offer Validity", value: "30 days" },
      { label: "ETA / Delivery", value: "3–4 weeks after advance" },
      { label: "Pricing", value: "As per line items; taxes & duties excluded" },
      { label: "Quantity", value: "Subject to final weight at loading" },
      { label: "Currency", value: "USD" },
    ],
  };

  const persisted = loadState();
  const initial = deepMerge(defaults, persisted || {});

  const [docType, setDocType] = useState(initial.docType);
  const [enableFX, setEnableFX] = useState(initial.enableFX);
  const [enableBankInfo, setEnableBankInfo] = useState(initial.enableBankInfo);
  const [currency, setCurrency] = useState(initial.currency);
  const [dstCurrency, setDstCurrency] = useState(initial.dstCurrency);
  const [fxRate, setFxRate] = useState(initial.fxRate);
  const [fxPct, setFxPct] = useState(initial.fxPct);
  const [fxFlat, setFxFlat] = useState(initial.fxFlat);
  const [logoPath, setLogoPath] = useState(initial.logoPath);

  const [company, setCompany] = useState(initial.company);
  const [client, setClient] = useState(initial.client);
  const [pf, setPf] = useState(initial.pf);
  const [products, setProducts] = useState(initial.products);
  const [signatures, setSignatures] = useState(initial.signatures);
  const [bank, setBank] = useState(initial.bank);
  const [buyerBank, setBuyerBank] = useState(initial.buyerBank);

  const [manualTermsEnabled, setManualTermsEnabled] = useState(initial.manualTermsEnabled);
  const [terms, setTerms] = useState(initial.terms);

  const debouncedSave = useDebouncedCallback((state) => saveState(state), 500);
  useEffect(() => {
    debouncedSave({
      docType, enableFX, enableBankInfo, currency, dstCurrency, fxRate, fxPct, fxFlat, logoPath,
      company, client, pf, products, signatures, bank, buyerBank, manualTermsEnabled, terms,
    });
  }, [
    docType, enableFX, enableBankInfo, currency, dstCurrency, fxRate, fxPct, fxFlat, logoPath,
    company, client, pf, products, signatures, bank, buyerBank, manualTermsEnabled, terms, debouncedSave,
  ]);

  const addTerm = () => setTerms((t) => [...t, { label: "", value: "" }]);
  const removeTerm = (idx) => setTerms((t) => t.filter((_, i) => i !== idx));
  const moveTerm = (idx, dir) =>
    setTerms((t) => {
      const arr = [...t];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return arr;
    });
  const updateTerm = (idx, key, val) =>
    setTerms((t) => {
      const arr = [...t];
      arr[idx] = { ...arr[idx], [key]: val };
      return arr;
    });

  const autoFillTerms = () => {
    const pack = [];
    pack.push({ label: "Incoterm", value: pf.deliveryTerms || "FOB" });
    pack.push({ label: "Port of Loading", value: pf.departurePort || "Dakar, Senegal" });
    if (docType === "proforma")
      pack.push({ label: "Port of Destination", value: pf.destinationPort || "—" });
    pack.push({ label: "Payment Method", value: pf.paymentMethod || "Bank Transfer" });
    if (pf.paymentConditions)
      pack.push({ label: "Payment Conditions", value: pf.paymentConditions });
    pack.push({ label: "Offer Validity", value: pf.validity || "30 days" });
    if (pf.etaDelivery) pack.push({ label: "ETA / Delivery", value: pf.etaDelivery });
    if (pf.pricing) pack.push({ label: "Pricing", value: pf.pricing });
    if (pf.quantityNote) pack.push({ label: "Quantity", value: pf.quantityNote });
    pack.push({ label: "Currency", value: currency });
    setTerms(pack);
    setManualTermsEnabled(true);
  };

  const data = useMemo(
    () => ({
      company,
      client,
      proforma: {
        ...pf,
        currency,
        number: docType === "proforma" ? pf.number : pf.number.replace(/^PF-/, "QT-"),
        ...(manualTermsEnabled ? { terms } : {}),
      },
      products,
      signatures: {
        seller: signatures.seller,
        buyer: docType === "proforma" ? signatures.buyer : undefined,
      },
      bank,
      buyerBank,
    }),
    [company, client, pf, currency, manualTermsEnabled, terms, products, signatures, bank, buyerBank, docType]
  );

  const options = useMemo(
    () => ({
      currency,
      secondaryCurrency: dstCurrency,
      enableFX,
      enableBankInfo,
      fx: {
        rate: Number(fxRate),
        feePct: Number(fxPct) / 100,
        transferFeeFlat: Number(fxFlat),
      },
      locale: "fr-FR",
      logoPath,
    }),
    [currency, dstCurrency, enableFX, enableBankInfo, fxRate, fxPct, fxFlat, logoPath]
  );

  const bankDisabled = docType === "quotation";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin — Proforma / Devis (PDF HTML)</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Select label="Type de document" value={docType} onChange={setDocType} options={[["proforma","Proforma Invoice"],["quotation","Quotation / Devis"]]} />
        <Select label="Devise source" value={currency} onChange={setCurrency} options={[["USD","USD"],["EUR","EUR"],["CAD","CAD"],["XOF","XOF"],["XAF","XAF"]]} />
        <Input label="Logo (chemin public)" value={logoPath} onChange={setLogoPath} placeholder="/senharvest-logo.png" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Checkbox label="Afficher conversion de devise" checked={enableFX} onChange={setEnableFX} />
          {enableFX && (
            <div className="grid grid-cols-3 gap-3">
              <Select label="Devise cible" value={dstCurrency} onChange={setDstCurrency} options={[["XOF","XOF"],["XAF","XAF"],["EUR","EUR"],["USD","USD"],["CAD","CAD"]]} />
              <Input label="Taux" type="number" step="0.0001" value={fxRate} onChange={setFxRate} />
              <Input label="Frais %" type="number" step="0.01" value={fxPct} onChange={setFxPct} />
              <Input label="Frais fixe (international)" type="number" step="0.01" className="col-span-3" value={fxFlat} onChange={setFxFlat} />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Checkbox label="Infos bancaires (Proforma uniquement)" checked={!bankDisabled && enableBankInfo} onChange={setEnableBankInfo} disabled={bankDisabled} />
          <p className="text-xs text-gray-500">Désactivé automatiquement pour le devis.</p>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <p className="font-medium">Champs proforma (pour génération auto des termes)</p>
        <div className="grid md:grid-cols-3 gap-3">
          <Input label="Incoterm" value={pf.deliveryTerms} onChange={(v)=>setPf({...pf, deliveryTerms:v})} />
          <Input label="Port of Loading" value={pf.departurePort} onChange={(v)=>setPf({...pf, departurePort:v})} />
          <Input label="Port of Destination" value={pf.destinationPort} onChange={(v)=>setPf({...pf, destinationPort:v})} />
          <Input label="Payment Method" value={pf.paymentMethod} onChange={(v)=>setPf({...pf, paymentMethod:v})} />
          <Input label="Payment Conditions" value={pf.paymentConditions} onChange={(v)=>setPf({...pf, paymentConditions:v})} />
          <Input label="Offer Validity" value={pf.validity} onChange={(v)=>setPf({...pf, validity:v})} />
          <Input label="ETA / Delivery" value={pf.etaDelivery} onChange={(v)=>setPf({...pf, etaDelivery:v})} />
          <Input label="Pricing" value={pf.pricing} onChange={(v)=>setPf({...pf, pricing:v})} />
          <Input label="Quantity (note)" value={pf.quantityNote} onChange={(v)=>setPf({...pf, quantityNote:v})} />
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-md border px-3 py-2" onClick={autoFillTerms}>Générer les Terms automatiquement</button>
          <Checkbox label="Utiliser la liste manuelle (éditable ci-dessous)" checked={manualTermsEnabled} onChange={setManualTermsEnabled} />
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium">Terms & Conditions — Liste manuelle</p>
          <div className="flex items-center gap-2">
            <button className="rounded-md border px-3 py-1.5" onClick={addTerm}>+ Ajouter un terme</button>
          </div>
        </div>
        <div className="space-y-2">
          {terms.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun terme. Clique sur “Ajouter un terme”.</p>
          ) : (
            terms.map((t, idx) => (
              <div key={idx} className="grid md:grid-cols-[1fr,2fr,auto] gap-2 items-center">
                <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Label (ex: Incoterm)" value={t.label} onChange={(e)=>updateTerm(idx,'label',e.target.value)} />
                <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Valeur (ex: FOB)" value={t.value} onChange={(e)=>updateTerm(idx,'value',e.target.value)} />
                <div className="flex items-center gap-2">
                  <button className="rounded-md border px-2 py-1" onClick={()=>moveTerm(idx,-1)}>↑</button>
                  <button className="rounded-md border px-2 py-1" onClick={()=>moveTerm(idx,+1)}>↓</button>
                  <button className="rounded-md border px-2 py-1 text-red-600" onClick={()=>removeTerm(idx)}>Supprimer</button>
                </div>
              </div>
            ))
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">Astuce : décoche “Utiliser la liste manuelle” pour repasser en auto.</p>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-medium">Produits</p>
          <button className="rounded-md border px-3 py-1.5" onClick={()=>setProducts(ps=>[...ps,{ description:"", hsCode:"", grade:"", packaging:"", quantity:0, unit:"", unitPrice:0, grossWeight:"", netWeight:"" }])}>+ Ajouter une ligne</button>
        </div>
        <div className="space-y-3">
          {products.map((p,i)=> (
            <div key={i} className="grid md:grid-cols-6 gap-2">
              <input className="md:col-span-2 rounded-md border border-gray-300 px-3 py-2" placeholder="Description" value={p.description} onChange={(e)=>setProducts(arr=>{ const cp=[...arr]; cp[i]={...cp[i], description:e.target.value}; return cp; })} />
              <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="HS Code" value={p.hsCode} onChange={(e)=>setProducts(arr=>{ const cp=[...arr]; cp[i]={...cp[i], hsCode:e.target.value}; return cp; })} />
              <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Qty" type="number" value={p.quantity} onChange={(e)=>setProducts(arr=>{ const cp=[...arr]; cp[i]={...cp[i], quantity:Number(e.target.value)}; return cp; })} />
              <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Unit" value={p.unit} onChange={(e)=>setProducts(arr=>{ const cp=[...arr]; cp[i]={...cp[i], unit:e.target.value}; return cp; })} />
              <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Unit Price" type="number" value={p.unitPrice} onChange={(e)=>setProducts(arr=>{ const cp=[...arr]; cp[i]={...cp[i], unitPrice:Number(e.target.value)}; return cp; })} />
              <div className="md:col-span-6 grid md:grid-cols-5 gap-2">
                <input className="md:col-span-2 rounded-md border border-gray-300 px-3 py-2" placeholder="Grade (optionnel)" value={p.grade||""} onChange={(e)=>setProducts(arr=>{ const cp=[...arr]; cp[i]={...cp[i], grade:e.target.value}; return cp; })} />
                <input className="md:col-span-2 rounded-md border border-gray-300 px-3 py-2" placeholder="Packaging (optionnel)" value={p.packaging||""} onChange={(e)=>setProducts(arr=>{ const cp=[...arr]; cp[i]={...cp[i], packaging:e.target.value}; return cp; })} />
                <button className="rounded-md border border-red-300 text-red-600 px-3 py-2" onClick={()=>setProducts(arr=>arr.filter((_,idx)=>idx!==i))}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 space-y-3">
          <p className="font-medium">Signature — Vendeur</p>
          <Input label="Nom" value={signatures.seller.name} onChange={(v)=>setSignatures(s=>({...s, seller:{...s.seller, name:v}}))} />
          <Input label="Titre" value={signatures.seller.title} onChange={(v)=>setSignatures(s=>({...s, seller:{...s.seller, title:v}}))} />
          <Input label="Date" type="date" value={signatures.seller.date} onChange={(v)=>setSignatures(s=>({...s, seller:{...s.seller, date:v}}))} />
        </div>
        {docType === 'proforma' && (
          <div className="rounded-lg border p-4 space-y-3">
            <p className="font-medium">Signature — Acheteur</p>
            <Input label="Nom" value={signatures.buyer?.name||""} onChange={(v)=>setSignatures(s=>({...s, buyer:{...(s.buyer||{}), name:v}}))} />
            <Input label="Titre" value={signatures.buyer?.title||""} onChange={(v)=>setSignatures(s=>({...s, buyer:{...(s.buyer||{}), title:v}}))} />
            <Input label="Date" type="date" value={signatures.buyer?.date||""} onChange={(v)=>setSignatures(s=>({...s, buyer:{...(s.buyer||{}), date:v}}))} />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            const payload = buildPDFData({ company, client, proforma: pf, products, signatures, bank, buyerBank, currency }, docType, manualTermsEnabled, terms);
            previewHTMLInNewTab(payload, docType, { ...options, enableBankInfo: docType === 'proforma' ? enableBankInfo : false });
          }}
          className="rounded-md border px-4 py-2"
        >
          Prévisualiser
        </button>
        <button
          onClick={() => {
            const payload = buildPDFData({ company, client, proforma: pf, products, signatures, bank, buyerBank, currency }, docType, manualTermsEnabled, terms);
            generateAndDownloadHTMLPDF(payload, docType, undefined, { ...options, enableBankInfo: docType === 'proforma' ? enableBankInfo : false });
          }}
          className="rounded-md bg-gray-900 text-white px-4 py-2"
        >
          Télécharger
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", className = "", placeholder }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium">{label}</span>
      <input type={type} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" value={value} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" value={value} onChange={(e)=>onChange(e.target.value)}>
        {options.map(([val, lab]) => (<option key={val} value={val}>{lab}</option>))}
      </select>
    </label>
  );
}
function Checkbox({ label, checked, onChange, disabled }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" className="rounded border-gray-300" checked={checked} disabled={disabled} onChange={(e)=>onChange(e.target.checked)} />
      <span className={disabled ? "text-gray-400" : ""}>{label}</span>
    </label>
  );
}

function buildPDFData(state, docType, manualTermsEnabled, terms) {
  const { company, client, proforma, products, signatures, bank, buyerBank, currency } = state || {};
  const pf = {
    ...(proforma || {}),
    currency: currency || proforma?.currency || "USD",
    number: docType === 'proforma' ? (proforma?.number || 'PF-001') : (proforma?.number || 'PF-001').replace(/^PF-/, 'QT-'),
    ...(manualTermsEnabled ? { terms: (terms || []).filter(t => t && t.label && String(t.value || '').trim() !== '') } : {}),
  };
  return { company, client, proforma: pf, products, signatures, bank, buyerBank };
}


