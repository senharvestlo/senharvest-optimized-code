// src/pages/admin/psa/PSAEditor.jsx
import React, { useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

const fmtDate = (iso) =>
  new Date(iso || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

export default function PSAEditor() {
  const [form, setForm] = useState({
    ref: '',
    dateIssued: new Date().toISOString(),
    // marge nette (plage %)
    marginMin: 20,
    marginMax: 25,
    // durée
    years: 3,
    indefinite: false,
    // déclencheur paiement
    payTrigger: 'buyer_final', // 'buyer_final' | 'seller_paid'
    // qui paie les coûts
    costsBy: 'partner', // 'partner' | 'senh'
    // périmètre
    scope: 'Peanuts, cashew, sesame, rice, legumes, garlic, wheat, canola, fruits, etc.',
    // parties
    partner: { nameTitle:'', company:'', address:'', phone:'', email:'' },
    senh: {
      nameTitle: 'Mr. Abdou [Full Name] / Business Development Partner',
      company: 'SenHarvest Group (including its affiliates: SenHarvest LLC – USA, Xidma & Harvest SARL – Sénégal, SenHarvest Canada Inc. – in process)',
      address: 'Dakar, Senegal / Montreal, Canada',
      phone: '+1 819 319 8464',
      email: 'manager@senharvest.com'
    }
  });

  const docRef = useRef(null);
  const dateStr = useMemo(()=>fmtDate(form.dateIssued), [form.dateIssued]);

  const onChange = (path, val) => {
    setForm((f) => {
      const c = { ...f };
      const segs = path.split('.');
      let cur = c;
      for (let i=0;i<segs.length-1;i++) cur = cur[segs[i]];
      cur[segs.at(-1)] = val;
      return c;
    });
  };

  const triggerTextEN = useMemo(()=>{
    return form.payTrigger === 'buyer_final'
      ? 'within ten (10) business days after receipt of the final payment from the Buyer'
      : 'within ten (10) business days when the Seller is paid';
  }, [form.payTrigger]);

  const triggerTextFR = useMemo(()=>{
    return form.payTrigger === 'buyer_final'
      ? 'dans les dix (10) jours ouvrables suivant la réception du paiement final de l\'Acheteur'
      : 'dans les dix (10) jours ouvrables lorsque le Vendeur est payé';
  }, [form.payTrigger]);

  const costsEN = useMemo(()=>{
    return form.costsBy === 'partner'
      ? 'All costs related to travel, inspection, sampling and logistics shall be borne exclusively by the Partner. The Business Development Partner shall not be responsible for any such expenses.'
      : 'All costs related to travel, inspection, sampling and logistics shall be borne by SenHarvest (Business Development Partner).';
  }, [form.costsBy]);

  const costsFR = useMemo(()=>{
    return form.costsBy === 'partner'
      ? 'Tous les frais liés aux déplacements, inspections, échantillons et logistique seront exclusivement à la charge du Partenaire. Le Partenaire Développement Commercial n\'assumera aucune de ces dépenses.'
      : 'Tous les frais liés aux déplacements, inspections, échantillons et logistique seront à la charge de SenHarvest (Partenaire Développement Commercial).';
  }, [form.costsBy]);

  const durationEN = useMemo(()=>{
    return form.indefinite
      ? 'This Agreement shall be valid for an indefinite term, renewable automatically unless terminated by mutual written consent.'
      : `This Agreement shall be valid for ${form.years} year(s), automatically renewable unless terminated by mutual written consent.`;
  }, [form.indefinite, form.years]);

  const durationFR = useMemo(()=>{
    return form.indefinite
      ? 'Le présent Accord est valable pour une durée indéterminée, renouvelable automatiquement sauf résiliation d’un commun accord par écrit.'
      : `Le présent Accord est valable pour une durée de ${form.years} an(s), renouvelable automatiquement sauf résiliation d’un commun accord par écrit.`;
  }, [form.indefinite, form.years]);

  const onDownload = async () => {
    await new Promise((r)=>setTimeout(r,0));
    const node = docRef.current;
    const filename = `PSA-${form.ref || new Date().toISOString().slice(0,10)}.pdf`;
    const opt = {
      margin: 0.5,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all','css','legacy'] },
    };
    await html2pdf().set(opt).from(node).save();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Commandes */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="text-sm">
          Reference
          <input
            value={form.ref}
            onChange={(e)=>onChange('ref', e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="PSA-2025-001"
          />
        </label>
        <label className="text-sm">
          Date
          <input
            type="date"
            value={(form.dateIssued||'').slice(0,10)}
            onChange={(e)=>onChange('dateIssued', new Date(e.target.value).toISOString())}
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <label className="text-sm">
          Min Margin (%)
          <input
            type="number" step="0.1" min={0} max={100}
            value={form.marginMin}
            onChange={(e)=>onChange('marginMin', Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </label>
        <label className="text-sm">
          Max Margin (%)
          <input
            type="number" step="0.1" min={0} max={100}
            value={form.marginMax}
            onChange={(e)=>onChange('marginMax', Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <label className="text-sm">
          Duration (years)
          <input
            type="number" min={1} max={15} disabled={form.indefinite}
            value={form.years}
            onChange={(e)=>onChange('years', Number(e.target.value))}
            className="w-full border rounded px-2 py-1 disabled:bg-gray-100"
          />
        </label>
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.indefinite}
            onChange={(e)=>onChange('indefinite', e.target.checked)}
          />
          Indefinite
        </label>

        <label className="text-sm">
          Payment trigger
          <select
            value={form.payTrigger}
            onChange={(e)=>onChange('payTrigger', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="buyer_final">After final payment from Buyer</option>
            <option value="seller_paid">When Seller is paid</option>
          </select>
        </label>

        <label className="text-sm">
          Costs & expenses borne by
          <select
            value={form.costsBy}
            onChange={(e)=>onChange('costsBy', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="partner">Partner</option>
            <option value="senh">SenHarvest</option>
          </select>
        </label>
      </div>

      {/* Parties */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <PartyBlock title="Partner (FR/EN)" data={form.partner} onChange={(k,v)=>onChange(`partner.${k}`, v)} />
        <PartyBlock title="SenHarvest Group (FR/EN)" data={form.senh} onChange={(k,v)=>onChange(`senh.${k}`, v)} />
      </div>

      {/* Aperçu Document */}
      <div
        id="psa-document"
        ref={docRef}
        className="max-w-5xl mx-auto bg-white shadow border rounded p-8 print:p-0 print:shadow-none"
      >
        {/* Header ICC */}
        <div className="flex items-start justify-between gap-4 border-b pb-4">
          <img
            src="/icc%20logo.png"
            alt="ICC"
            className="h-12"
            onError={(e)=>{ e.currentTarget.style.display='none'; }}
          />
          <div className="text-right">
            <h1 className="text-2xl font-bold text-blue-800">
              PROFIT-SHARING AGREEMENT / CONTRAT DE PARTAGE DES BÉNÉFICES
            </h1>
            <p className="text-gray-600 text-sm">According to ICC Rules (Paris, France) / Conformément aux Règles de la CCI (Paris, France)</p>
            <p className="text-xs text-gray-500 mt-1">
              {form.ref ? `Ref: ${form.ref}` : ''} {form.ref && ' · '} {dateStr}
            </p>
          </div>
        </div>

        {/* Parties */}
        <Section title="PARTIES / PARTIES">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PartyCard
              title="Partner / Partenaire"
              data={form.partner}
              labels={{ fullName:'Full Name/Title / Nom & Titre', corp:'Company / Société', addr:'Address / Adresse', tel:'Tel / Téléphone', email:'Email' }}
            />
            <PartyCard
              title="SenHarvest Group"
              data={form.senh}
              labels={{ fullName:'Full Name/Title / Nom & Titre', corp:'Company / Société', addr:'Address / Adresse', tel:'Tel / Téléphone', email:'Email' }}
            />
          </div>
        </Section>

        {/* A1 */}
        <Section title="ARTICLE 1 – OBJECT / OBJET">
          <p className="text-justify">
            <strong>EN:</strong> The Parties agree to collaborate in sourcing, negotiation, and facilitation of international commodity trading transactions (including but not limited to {form.scope}).
          </p>
          <p className="text-justify mt-1">
            <strong>FR:</strong> Les Parties conviennent de collaborer pour le sourcing, la négociation et la facilitation de transactions commerciales internationales de matières premières (y compris mais sans s'y limiter : {form.scope}).
          </p>
        </Section>

        {/* A2 */}
        <Section title="ARTICLE 2 – ROLE OF THE BUSINESS DEVELOPMENT PARTNER / RÔLE DU PARTENAIRE DÉVELOPPEMENT COMMERCIAL">
          <p className="text-justify"><strong>EN:</strong> Identify and introduce potential buyers and sellers; conduct negotiations on behalf of the Partner; facilitate communication, due diligence, and follow-up; ensure inspection, sampling, and quality verification (when required); assist in closing transactions.</p>
          <p className="text-justify mt-1"><strong>FR:</strong> Identifier et présenter des acheteurs et vendeurs potentiels ; mener les négociations au nom du Partenaire ; faciliter la communication, la due diligence et le suivi ; veiller aux inspections, échantillonnages et vérifications de qualité (si nécessaire) ; assister dans la conclusion des transactions.</p>
        </Section>

        {/* A3 */}
        <Section title="ARTICLE 3 – COSTS & EXPENSES / COÛTS & DÉPENSES">
          <p className="text-justify"><strong>EN:</strong> {costsEN}</p>
          <p className="text-justify mt-1"><strong>FR:</strong> {costsFR}</p>
        </Section>

        {/* A4 */}
        <Section title="ARTICLE 4 – PROFIT SHARING / PARTAGE DES BÉNÉFICES">
          <p className="text-justify">
            <strong>EN:</strong> The Parties agree that the Business Development Partner shall receive <strong>{form.marginMin}–{form.marginMax}%</strong> of the net profit margin generated from each transaction facilitated. "Net Profit Margin" shall mean the positive difference between the sale price and the purchase price, after deduction of direct costs (transport, insurance, duties, handling, etc.). Payment of the Business Development Partner's share shall be made {triggerTextEN}.
          </p>
          <p className="text-justify mt-1">
            <strong>FR:</strong> Les Parties conviennent que le Partenaire Développement Commercial percevra <strong>{form.marginMin}–{form.marginMax} %</strong> de la marge bénéficiaire nette générée par chaque transaction facilitée. La « Marge Bénéficiaire Nette » s'entend de la différence positive entre le prix de vente et le prix d'achat, après déduction des coûts directs (transport, assurance, droits, manutention, etc.). Le règlement de la part du Partenaire Développement Commercial sera effectué {triggerTextFR}.
          </p>
        </Section>

        {/* A5 */}
        <Section title="ARTICLE 5 – TRANSPARENCY & ACCOUNTING / TRANSPARENCE & COMPTABILITÉ">
          <p className="text-justify"><strong>EN:</strong> The Partner shall provide all invoices, contracts, and financial documentation necessary to calculate the net profit margin. The Business Development Partner shall have the right to audit the transaction records related to deals in which it participated.</p>
          <p className="text-justify mt-1"><strong>FR:</strong> Le Partenaire devra fournir toutes les factures, contrats et documents financiers nécessaires au calcul de la marge bénéficiaire nette. Le Partenaire Développement Commercial aura le droit d'auditer les dossiers relatifs aux transactions auxquelles il a participé.</p>
        </Section>

        {/* A6 */}
        <Section title="ARTICLE 6 – CONFIDENTIALITY & NON-CIRCUMVENTION / CONFIDENTIALITÉ & NON-CONTORNNEMENT">
          <p className="text-justify"><strong>EN:</strong> Both Parties agree to strict confidentiality regarding all business contacts, pricing, specifications, and trade conditions. Neither Party shall circumvent or bypass the other in any transaction covered by this Agreement.</p>
          <p className="text-justify mt-1"><strong>FR:</strong> Les deux Parties conviennent d'une stricte confidentialité concernant tous les contacts commerciaux, prix, spécifications et conditions commerciales. Aucune des Parties ne devra contourner ou écarter l'autre dans une transaction couverte par le présent Accord.</p>
        </Section>

        {/* A7 */}
        <Section title="ARTICLE 7 – DURATION / DURÉE">
          <p className="text-justify"><strong>EN:</strong> {durationEN}</p>
          <p className="text-justify mt-1"><strong>FR:</strong> {durationFR}</p>
        </Section>

        {/* A8 */}
        <Section title="ARTICLE 8 – GOVERNING LAW & ARBITRATION / LOI APPLICABLE & ARBITRAGE">
          <p className="text-justify"><strong>EN:</strong> This Agreement shall be governed by the Rules of Arbitration of the International Chamber of Commerce (ICC). Any dispute shall be finally settled under ICC arbitration in Paris, France.</p>
          <p className="text-justify mt-1"><strong>FR:</strong> Le présent Accord est régi par les Règles d'Arbitrage de la Chambre de Commerce Internationale (CCI). Tout litige sera tranché en dernier ressort selon l'arbitrage CCI à Paris, France.</p>
        </Section>

        {/* Signatures */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">SIGNATURES / SIGNATURES</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center avoid-page-break">
            <SignBox title="For the Partner / Pour le Partenaire" name={form.partner.nameTitle} />
            <SignBox title="For SenHarvest Group / Pour SenHarvest Group" name={form.senh.nameTitle} />
          </div>
        </div>

        {/* Footer refs */}
        <div className="text-xs text-gray-600 mt-8 pt-4 border-t">
          <p>ICC: https://www.iccwbo.org | Incoterms: https://iccwbo.org/incoterms</p>
          <p className="mt-1">This document may be executed electronically. In case of conflict, English prevails. / Ce document peut être signé électroniquement. En cas de conflit, l'anglais prévaut.</p>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={onDownload} className="px-3 py-2 border rounded">Download PDF</button>
      </div>
    </div>
  );
}

function PartyBlock({ title, data, onChange }) {
  return (
    <div className="border rounded p-3 space-y-2">
      <h4 className="font-semibold mb-1">{title}</h4>
      <LabeledInput label="Full Name & Title / Nom & Titre" value={data.nameTitle} onChange={(v)=>onChange('nameTitle', v)} />
      <LabeledInput label="Company / Société" value={data.company} onChange={(v)=>onChange('company', v)} />
      <LabeledInput label="Address / Adresse" value={data.address} onChange={(v)=>onChange('address', v)} />
      <LabeledInput label="Phone / Téléphone" value={data.phone} onChange={(v)=>onChange('phone', v)} />
      <LabeledInput label="Email" value={data.email} onChange={(v)=>onChange('email', v)} />
    </div>
  );
}
function LabeledInput({ label, value, onChange }) {
  return (
    <label className="text-sm block">
      {label}
      <input className="w-full border rounded px-2 py-1" value={value||''} onChange={(e)=>onChange(e.target.value)} />
    </label>
  );
}
function PartyCard({ title, data, labels }) {
  return (
    <div className="p-4 rounded border bg-gray-50">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p><strong>{labels.fullName}:</strong> {data.nameTitle || '—'}</p>
      <p><strong>{labels.corp}:</strong> {data.company || '—'}</p>
      <p><strong>{labels.addr}:</strong> {data.address || '—'}</p>
      <p><strong>{labels.tel}:</strong> {data.phone || '—'}</p>
      <p><strong>{labels.email}:</strong> {data.email || '—'}</p>
    </div>
  );
}
function Section({ title, children }) {
  return (
    <div className="mt-5">
      <h3 className="font-semibold mb-1">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
function SignBox({ title, name }) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <div className="border-t mt-8 mb-1 w-56 mx-auto"></div>
      <p>{name || '—'}</p>
      <p className="text-xs text-gray-500">Date: ________</p>
    </div>
  );
}
