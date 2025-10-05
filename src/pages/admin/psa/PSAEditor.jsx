// src/pages/admin/psa/PSAEditor.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { createPSA, getPSA, updatePSA } from '../../../services/psa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const TEXTS = {
  fr: {
    title: 'CONTRAT DE PARTAGE DES BÉNÉFICES (Profit-Sharing Agreement)',
    subtitle: 'Conforme aux Règles de la CCI (Paris, France)',
    ui: {
      lang: 'Langue', ref: 'Référence', dateIssued: 'Date d\'émission',
      partnerBlock: 'Bloc Partenaire (Votre contrepartie)',
      senhBlock: 'Bloc SenHarvest',
      nameTitle: 'Nom & Titre', company: 'Société', address: 'Adresse', phone: 'Téléphone', email: 'Email',
      scopeTitle: 'Produits / Périmètre', scopePH: 'Arachides, cajou, sésame, riz, …',
      profitShare: 'Partage de bénéfices (Commission%)',
      marginMin: 'Marge Min (%)', marginMax: 'Marge Max (%)',
      duration: 'Durée (années)', indefinite: 'Indéterminée',
      payTrigger: 'Déclencheur du paiement',
      payBuyerFinal: 'Après réception du paiement final de l\'acheteur',
      payWhenSellerPaid: 'Lorsque le vendeur est payé',
      download: 'Télécharger en PDF', save: 'Enregistrer', update: 'Enregistrer',
    },
    parties: {
      title: 'PARTIES / PARTIES',
      pPartner: 'Partenaire',
      pSenh: 'SenHarvest Group (incl. SenHarvest LLC – USA, Xidma & Harvest SARL – Sénégal, SenHarvest Canada Inc. – en cours)',
    },
    articles: {
      a1: 'ARTICLE 1 – OBJET',
      a1b: 'Les Parties conviennent de collaborer pour le sourcing, la négociation et la facilitation de transactions internationales de commodités agricoles.',
      a2: 'ARTICLE 2 – RÔLE DU PARTENAIRE DÉVELOPPEMENT COMMERCIAL',
      a2b: [
        'Identifier et présenter des acheteurs/vendeurs potentiels ;',
        'Négocier au nom du Partenaire ;',
        'Faciliter la communication, due diligence et suivi ;',
        'Superviser, le cas échéant, inspections/échantillons/qualité ;',
        'Assister à la conclusion des transactions.'
      ],
      a3: 'ARTICLE 3 – COÛTS & DÉPENSES',
      a3b: 'Tous les frais (déplacements, inspections, échantillons, logistique) sont à la charge exclusive du Partenaire.',
      a4: 'ARTICLE 4 – PARTAGE DES BÉNÉFICES',
      a4b: (min,max,triggerText)=>[
        `Le Partenaire Développement Commercial perçoit entre ${min}% et ${max}% de la marge bénéficiaire nette générée par chaque transaction facilitée.`,
        'La "Marge bénéficiaire nette" = prix de vente – prix d\'achat – coûts directs (transport, assurance, droits, manutention, etc.).',
        `Le paiement de la part du Partenaire Développement Commercial intervient ${triggerText}.`,
      ],
      a5: 'ARTICLE 5 – TRANSPARENCE & COMPTABILITÉ',
      a5b: 'Le Partenaire fournit toutes pièces (contrats, factures, documents financiers) nécessaires au calcul de la marge nette. Droit d\'audit ouvert au Partenaire Développement Commercial.',
      a6: 'ARTICLE 6 – CONFIDENTIALITÉ & NON-CONTOURNEMENT',
      a6b: 'Confidentialité stricte sur contacts, prix, spécifications, conditions commerciales. Interdiction de contournement.',
      a7: 'ARTICLE 7 – DURÉE',
      a7b: (years, indef)=> indef ? 'Durée : indéterminée (résiliation possible d\'un commun accord par écrit).'
                                  : `Durée : ${years} an(s), renouvellement automatique sauf résiliation convenue par écrit.`,
      a8: 'ARTICLE 8 – LOI APPLICABLE & ARBITRAGE (CCI)',
      a8b: 'Tout litige est tranché en dernier ressort selon l\'arbitrage CCI à Paris, France.',
    },
    sign: {
      title: 'SIGNATURES / SIGNATURES',
      partner: 'Pour le Partenaire',
      senh: 'Pour SenHarvest Group',
      date: 'Date'
    },
    footer1: 'ICC : https://www.iccwbo.org | Incoterms : https://iccwbo.org/incoterms',
    footer2: 'Ce document peut être signé électroniquement. En cas de conflit, l\'anglais prévaut.',
  },
  en: {
    title: 'PROFIT-SHARING AGREEMENT',
    subtitle: 'According to ICC Rules (Paris, France)',
    ui: {
      lang: 'Language', ref: 'Reference', dateIssued: 'Date issued',
      partnerBlock: 'Partner Block (your counterparty)',
      senhBlock: 'SenHarvest Block',
      nameTitle: 'Full Name & Title', company: 'Company', address: 'Address', phone: 'Phone', email: 'Email',
      scopeTitle: 'Products / Scope', scopePH: 'Peanuts, cashew, sesame, rice, …',
      profitShare: 'Profit Sharing (Commission%)',
      marginMin: 'Min Margin (%)', marginMax: 'Max Margin (%)',
      duration: 'Duration (years)', indefinite: 'Indefinite',
      payTrigger: 'Payment trigger',
      payBuyerFinal: 'After receipt of final payment from Buyer',
      payWhenSellerPaid: 'When Seller is paid',
      download: 'Download PDF', save: 'Save', update: 'Save',
    },
    parties: {
      title: 'PARTIES / PARTIES',
      pPartner: 'Partner',
      pSenh: 'SenHarvest Group (incl. SenHarvest LLC – USA, Xidma & Harvest SARL – Senegal, SenHarvest Canada Inc. – in process)',
    },
    articles: {
      a1: 'ARTICLE 1 – OBJECT',
      a1b: 'The Parties agree to collaborate in sourcing, negotiation and facilitation of international commodity trading transactions.',
      a2: 'ARTICLE 2 – ROLE OF THE BUSINESS DEVELOPMENT PARTNER',
      a2b: [
        'Identify and introduce potential buyers/sellers;',
        'Negotiate on behalf of the Partner;',
        'Facilitate communication, due diligence and follow-up;',
        'Oversee, where required, inspections/samples/quality;',
        'Assist in closing transactions.'
      ],
      a3: 'ARTICLE 3 – COSTS & EXPENSES',
      a3b: 'All costs (travel, inspections, samples, logistics) are borne exclusively by the Partner.',
      a4: 'ARTICLE 4 – PROFIT SHARING',
      a4b: (min,max,triggerText)=>[
        `The Business Development Partner shall receive between ${min}% and ${max}% of the net profit margin generated from each facilitated transaction.`,
        '"Net Profit Margin" = sale price – purchase price – direct costs (freight, insurance, duties, handling, etc.).',
        `Payment of the Business Development Partner's share shall be made ${triggerText}.`,
      ],
      a5: 'ARTICLE 5 – TRANSPARENCY & ACCOUNTING',
      a5b: 'The Partner provides all necessary contracts/invoices/financials to compute net margin. Audit right granted to the Business Development Partner.',
      a6: 'ARTICLE 6 – CONFIDENTIALITY & NON-CIRCUMVENTION',
      a6b: 'Strict confidentiality on contacts, pricing, specifications and trade terms. No circumvention.',
      a7: 'ARTICLE 7 – DURATION',
      a7b: (years, indef)=> indef ? 'Term: Indefinite (termination by mutual written consent).'
                                  : `Term: ${years} year(s), auto-renewed unless terminated by mutual written consent.`,
      a8: 'ARTICLE 8 – GOVERNING LAW & ARBITRATION (ICC)',
      a8b: 'Any dispute shall be finally settled under ICC arbitration in Paris, France.',
    },
    sign: {
      title: 'SIGNATURES / SIGNATURES',
      partner: 'For the Partner',
      senh: 'For SenHarvest Group',
      date: 'Date'
    },
    footer1: 'ICC: https://www.iccwbo.org | Incoterms: https://iccwbo.org/incoterms',
    footer2: 'This document may be executed electronically. In case of conflict, English prevails.',
  }
};

const fmtDate = (d) => new Date(d || Date.now()).toLocaleDateString();
const waitTick = () => new Promise(r=>setTimeout(r,0));

export default function PSAEditor() {
  const { id } = useParams();           // "new" ou docId
  const isNew = id === 'new';
  const nav = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Debug: afficher l'ID et le mode
  console.log('PSAEditor - ID:', id, 'isNew:', isNew);

  const [lang, setLang] = useState('fr');
  const T = useMemo(()=>TEXTS[lang], [lang]);

  const [form, setForm] = useState({
    ref: '',
    dateIssued: new Date().toISOString(),
    lang: 'fr',

    // marge bénéficiaire (commission % sur marge nette)
    marginMin: 20,
    marginMax: 25,

    // durée
    years: 3,
    indefinite: false,

    // trigger paiement commission
    payTrigger: 'buyer_final', // 'buyer_final' | 'seller_paid'

    scope: 'Arachides, cajou, sésame, riz, …',

    partner: { nameTitle:'', company:'', address:'', phone:'', email:'' },
    senh: {
      nameTitle: 'Mr. Abdou Lahat Lo / Business Development Partner',
      company: 'SenHarvest Group',
      address: 'Dakar, Sénégal / Montréal, Canada',
      phone: '+1 819 319 8464',
      email: 'manager@senharvest.com'
    }
  });

  const docRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!isNew && id) {
        const row = await getPSA(id);
        if (row) {
          setForm({ ...row });
          if (row.lang) setLang(row.lang);
        }
      }
      // duplication preset
      if (isNew && location.state?.preset) {
        const { id: _drop, createdAt: __c, updatedAt: __u, ...copy } = location.state.preset || {};
        copy.ref = (copy.ref || 'PSA-') + '-COPY';
        copy.dateIssued = new Date().toISOString();
        setForm(prev => ({ ...prev, ...copy, lang: copy.lang || prev.lang }));
        setLang(copy.lang || 'fr');
      }
    })();
  }, [id, isNew, location.state]);

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

  const triggerText = useMemo(()=>{
    return lang === 'fr'
      ? (form.payTrigger === 'buyer_final'
          ? 'après réception du paiement final de l\'acheteur'
          : 'lorsque le vendeur est payé')
      : (form.payTrigger === 'buyer_final'
          ? 'after receipt of final payment from Buyer'
          : 'when Seller is paid');
  }, [form.payTrigger, lang]);

  const onSave = async () => {
    try {
      const payload = { ...form, lang };
      console.log('PSA onSave - payload:', payload, 'id:', id, 'isNew:', isNew);
      
      if (isNew) {
        const newId = await createPSA(payload);
        alert('Contrat enregistré.');
        nav(`/admin/psa/${newId}`);
      } else {
        if (!id || id === 'new') {
          alert('Erreur: ID du document manquant. Redirection vers la création d\'un nouveau document.');
          nav('/admin/psa/new');
          return;
        }
        await updatePSA(id, payload);
        alert('Contrat enregistré.');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde PSA:', error);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    }
  };

  const onDownload = async () => {
    await waitTick(); // évite PDF vide/about:blank
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

  // Vérification d'authentification après tous les hooks
  if (authLoading) return <div className="p-6">Vérification des permissions...</div>;
  if (!user) return <div className="p-6 text-red-600">Veuillez vous connecter en tant qu'admin.</div>;
  if (!isAdmin) return <div className="p-6 text-red-600">Accès refusé. Permissions admin requises.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Bouton retour */}
      <div className="mb-4">
        <button onClick={() => nav('/admin/psa')} className="px-3 py-2 border rounded hover:bg-gray-50">
          ← Retour à la liste PSA
        </button>
      </div>

      {/* --- Commandes --- */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="text-sm">
          {T.ui.lang}
          <select
            value={lang}
            onChange={(e)=>{ setLang(e.target.value); onChange('lang', e.target.value); }}
            className="w-full border rounded px-2 py-1"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </label>

        <label className="text-sm">
          {T.ui.ref}
          <input
            value={form.ref}
            onChange={(e)=>onChange('ref', e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="PSA-2025-001"
          />
        </label>

        <label className="text-sm">
          {T.ui.dateIssued}
          <input
            type="date"
            value={(form.dateIssued||'').slice(0,10)}
            onChange={(e)=>onChange('dateIssued', new Date(e.target.value).toISOString())}
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <div className="flex items-end gap-2">
          <button onClick={onSave} className="px-3 py-2 bg-green-600 text-white rounded">
            {isNew ? T.ui.save : T.ui.update}
          </button>
          <button onClick={() => {
            const previewWindow = window.open('', '_blank');
            if (previewWindow && docRef.current) {
              previewWindow.document.write(docRef.current.outerHTML);
              previewWindow.document.close();
            }
          }} className="px-3 py-2 border rounded bg-blue-50 hover:bg-blue-100">
            👁️ Aperçu
          </button>
          <button onClick={onDownload} className="px-3 py-2 border rounded">
            {T.ui.download}
          </button>
        </div>
      </div>

      {/* --- Paramètres --- */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="text-sm">
          {T.ui.marginMin}
          <input
            type="number" step="0.1" min={0} max={100}
            value={form.marginMin}
            onChange={(e)=>onChange('marginMin', Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </label>
        <label className="text-sm">
          {T.ui.marginMax}
          <input
            type="number" step="0.1" min={0} max={100}
            value={form.marginMax}
            onChange={(e)=>onChange('marginMax', Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <label className="text-sm">
          {T.ui.duration}
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
          {T.ui.indefinite}
        </label>

        <label className="text-sm md:col-span-2">
          {T.ui.payTrigger}
          <select
            value={form.payTrigger}
            onChange={(e)=>onChange('payTrigger', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="buyer_final">{T.ui.payBuyerFinal}</option>
            <option value="seller_paid">{T.ui.payWhenSellerPaid}</option>
          </select>
        </label>

        <label className="text-sm md:col-span-2">
          {T.ui.scopeTitle}
          <input
            value={form.scope}
            onChange={(e)=>onChange('scope', e.target.value)}
            placeholder={T.ui.scopePH}
            className="w-full border rounded px-2 py-1"
          />
        </label>
      </div>

      {/* --- Blocs Parties --- */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <PartyBlock title={T.ui.partnerBlock} data={form.partner} onChange={(k,v)=>onChange(`partner.${k}`, v)} T={T.ui} />
        <PartyBlock title={T.ui.senhBlock} data={form.senh}    onChange={(k,v)=>onChange(`senh.${k}`, v)} T={T.ui} />
      </div>

      {/* ================== APERCU DOCUMENT ================== */}
      <div id="psa-document" ref={docRef}
           className="max-w-5xl mx-auto bg-white shadow border rounded p-8 print:p-0 print:shadow-none">
        {/* Header : logos ICC + SenHarvest */}
        <div className="flex items-start justify-between gap-4 border-b pb-4">
          <div className="flex items-start gap-3">
            <img
              src="/icc%20logo.png" alt="ICC"
              className="h-12" onError={(e)=>{ e.currentTarget.style.display='none'; }}
            />
            <img
              src="/senharvest-logo.png" alt="SenHarvest"
              className="h-12" onError={(e)=>{ e.currentTarget.style.display='none'; }}
            />
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-blue-800">{T.title}</h1>
            <p className="text-gray-600 text-sm">{T.subtitle}</p>
            <p className="text-xs text-gray-500 mt-1">
              {form.ref ? `Ref: ${form.ref}` : ''} {form.ref && ' · '} {fmtDate(form.dateIssued)}
            </p>
          </div>
        </div>

        {/* Parties */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">{T.parties.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PartyCard color="green" title={T.parties.pPartner} data={form.partner} labels={lang==='fr'?FRLBL:ENLBL} />
            <PartyCard color="blue"  title={T.parties.pSenh}    data={form.senh}    labels={lang==='fr'?FRLBL:ENLBL} />
          </div>
        </div>

        {/* Articles */}
        <Section title={T.articles.a1}>
          <p className="text-justify">{T.articles.a1b}</p>
        </Section>

        <Section title={T.articles.a2}>
          <ul className="list-disc ml-5 space-y-1">
            {T.articles.a2b.map((x,i)=><li key={i}>{x}</li>)}
          </ul>
        </Section>

        <Section title={T.articles.a3}>
          <p className="text-justify">{T.articles.a3b}</p>
        </Section>

        <Section title={T.articles.a4}>
          {T.articles.a4b(form.marginMin, form.marginMax, triggerText).map((x,i)=><p key={i} className="text-justify">{x}</p>)}
        </Section>

        <Section title={T.articles.a5}>
          <p className="text-justify">{T.articles.a5b}</p>
        </Section>

        <Section title={T.articles.a6}>
          <p className="text-justify">{T.articles.a6b}</p>
        </Section>

        <Section title={T.articles.a7}>
          <p className="text-justify">{T.articles.a7b(form.years, form.indefinite)}</p>
        </Section>

        <Section title={T.articles.a8}>
          <p className="text-justify">{T.articles.a8b}</p>
        </Section>

        {/* Signatures */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">{(lang==='fr'? 'SIGNATURES / SIGNATURES' : 'SIGNATURES / SIGNATURES')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center avoid-page-break">
            <SignBox title={T.sign.partner} name={form.partner.nameTitle} dateLabel={T.sign.date}/>
            <SignBox title={T.sign.senh}    name={form.senh.nameTitle}    dateLabel={T.sign.date}/>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-600 mt-8 pt-4 border-t">
          <p>{T.footer1}</p>
          <p className="mt-1">{T.footer2}</p>
        </div>
      </div>
    </div>
  );
}

function PartyBlock({ title, data, onChange, T }) {
  return (
    <div className="border rounded p-3 space-y-2">
      <h4 className="font-semibold mb-1">{title}</h4>
      <LabeledInput label={T.nameTitle} value={data.nameTitle} onChange={(v)=>onChange('nameTitle', v)} />
      <LabeledInput label={T.company}   value={data.company}   onChange={(v)=>onChange('company', v)} />
      <LabeledInput label={T.address}   value={data.address}   onChange={(v)=>onChange('address', v)} />
      <LabeledInput label={T.phone}     value={data.phone}     onChange={(v)=>onChange('phone', v)} />
      <LabeledInput label={T.email}     value={data.email}     onChange={(v)=>onChange('email', v)} />
    </div>
  );
}
function LabeledInput({ label, value, onChange }) {
  return (
    <label className="text-sm block">
      {label}
      <input
        className="w-full border rounded px-2 py-1"
        value={value||''}
        onChange={(e)=>onChange(e.target.value)}
      />
    </label>
  );
}

const FRLBL = { fullName:'Nom/Intitulé', corp:'Société', addr:'Adresse', tel:'Téléphone', email:'Email' };
const ENLBL = { fullName:'Full Name/Title', corp:'Company', addr:'Address', tel:'Tel', email:'Email Address' };

function PartyCard({ color='blue', title, data, labels }) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200',
    green:'bg-green-50 border-green-200',
  };
  return (
    <div className={`p-4 rounded border ${colorMap[color]||''}`}>
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

function SignBox({ title, name, dateLabel }) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <div className="border-t mt-8 mb-1 w-56 mx-auto"></div>
      <p>{name || '—'}</p>
      <p className="text-xs text-gray-500">{dateLabel}: ________</p>
    </div>
  );
}
