// src/pages/admin/ncnda/NCNDAEditor.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { createNCNDA, getNCNDA, updateNCNDA } from '../../../services/ncnda';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// ---------- textes FR/EN (clauses ICC "NCNDA" standards light) ----------
const TEXTS = {
  fr: {
    title: 'ACCORD DE NON-CONTREFAÇON, NON-DIVULGATION ET COLLABORATION (NCNDA)',
    subtitle: "Rédigé conformément aux standards de la Chambre de Commerce Internationale (ICC)",
    edtTitle: 'TRANSFERTS ÉLECTRONIQUES DE DOCUMENTS (EDT)',
    edtBody:
      "Les transmissions électroniques sont réputées valides. Le présent accord incorpore la Loi US 106-229, la Loi Modèle CNUDCI, et l'accord UN/CEFACT sur le e-commerce. Chaque Partie peut demander une copie papier sans retarder l'exécution.",
    partiesTitle: 'PARTIES À CET ACCORD',
    p1: 'Partie 1 : Intermédiaire / Broker',
    p2: 'Partie 2 : Vendeur / Exportateur',
    p3: 'Partie 3 : Acheteur / Importateur',
    fullName: 'Nom/Intitulé',
    corp: 'Société',
    addr: 'Adresse',
    tel: 'Téléphone',
    email: 'Email',
    sigBroker: 'Signature – Intermédiaire',
    sigSeller: 'Signature – Vendeur',
    sigBuyer: 'Signature – Acheteur',
    date: 'Date',
    clausesIntro:
      "Considérant la volonté des Parties de définir leurs obligations respectives et de protéger leurs intérêts commerciaux, elles conviennent de ce qui suit :",
    clauses: [
      "Aucune Partie ni affiliée ne sollicitera ni ne traitera directement avec une source présentée par l'autre Partie sans autorisation écrite expresse.",
      "Les Parties maintiendront une confidentialité complète sur les informations d'affaires et contacts fournis.",
      "Aucune Partie ne contournnera l'autre, directement ou indirectement, notamment pour éviter le paiement de commissions.",
      "Les contacts communiqués par l'une des Parties ne seront pas transmis à des tiers sans accord préalable.",
      "En cas de contournement, la Partie lésée a droit à une compensation intégrale incluant les frais juridiques.",
      "Les commissions et bénéfices seront répartis conformément à la section Commission ci-après ou selon tout avenant signé.",
      "Le présent Accord est valable pour {YEARS} ans à compter de la dernière signature.",
      "Tout litige sera résolu par arbitrage selon les règles de la CCI. Le droit applicable et le siège d'arbitrage seront déterminés d'un commun accord.",
      "Le présent Accord lie les héritiers, successeurs et ayants-droit des Parties.",
      "La signature électronique a pleine valeur légale.",
      "En cas de contradiction, la version anglaise prévaut.",
    ],
    commissionTitle: 'COMMISSION DE L\'INTERMÉDIAIRE',
    commissionBody:
      "L\'Intermédiaire (SenHarvest Group) perçoit une commission de {FEE}% sur la valeur FOB/CIF de chaque transaction réalisée entre le Vendeur et l\'Acheteur pour les Produits couverts pendant la Durée du Contrat. La commission est due et exigible à chaque closing (paiement effectif), et couvre toute répétition de transaction entre les mêmes Parties durant la période de validité du présent Accord.",
    scopeTitle: 'PRODUITS ET CHAMP D\'APPLICATION',
    scopeBody:
      "Produits couverts : {PRODUCTS}. Incoterms et modalités (à titre indicatif) : {INCOTERMS}. Territoires et volumes selon opportunités et disponibilités.",
    footer1: 'ICC : https://www.iccwbo.org | Incoterms : https://iccwbo.org/incoterms',
    footer2: "Ce document peut être signé électroniquement. En cas de conflit, l'anglais prévaut.",
    ui: {
      lang: 'Langue',
      years: 'Durée (années)',
      fee: 'Commission (%)',
      products: 'Produits couverts',
      incoterms: 'Incoterms / modalités',
      meta: 'Référence & Date',
      ref: 'Référence',
      dateIssued: 'Date d\'émission',
      brokerBlock: 'Bloc Intermédiaire (SenHarvest)',
      sellerBlock: 'Bloc Vendeur',
      buyerBlock: 'Bloc Acheteur',
      nameTitle: 'Nom & Titre',
      company: 'Société',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      save: 'Enregistrer',
          update: 'Enregistrer',
      download: 'Télécharger en PDF',
    }
  },
  en: {
    title: 'NON-CIRCUMVENTION, NON-DISCLOSURE & WORKING AGREEMENT (NCNDA)',
    subtitle: "Prepared in accordance with ICC (International Chamber of Commerce) standards",
    edtTitle: 'ELECTRONIC DOCUMENT TRANSMISSIONS (EDT)',
    edtBody:
      "Electronic transmissions shall be deemed valid. This agreement incorporates U.S. Public Law 106-229, UNCITRAL Model Law, and UN/CEFACT E-Commerce Agreement. Any Party may request a hard copy without delaying performance.",
    partiesTitle: 'PARTIES TO THIS AGREEMENT',
    p1: 'Party 1: Intermediary / Broker',
    p2: 'Party 2: Seller / Exporter',
    p3: 'Party 3: Buyer / Importer',
    fullName: 'Full Name/Title',
    corp: 'Corporation',
    addr: 'Address',
    tel: 'Tel',
    email: 'Email Address',
    sigBroker: 'Authorized Signature – Broker',
    sigSeller: 'Authorized Signature – Seller',
    sigBuyer: 'Authorized Signature – Buyer',
    date: 'Date',
    clausesIntro:
      "Whereas the Parties intend to protect their respective business interests, they agree as follows:",
    clauses: [
      "No Party nor any affiliate shall solicit or conduct business directly with sources presented by the other Party without prior written authorization.",
      "The Parties shall maintain strict confidentiality over business information and contacts disclosed.",
      "No Party shall circumvent the other, directly or indirectly, including with the intent to avoid commission payment.",
      "Contacts disclosed by either Party shall not be revealed to third parties without prior consent.",
      "In case of circumvention, the injured Party is entitled to full compensation including legal fees.",
      "Commissions and benefits shall be distributed in accordance with the Commission section below or any duly signed addendum.",
      "This Agreement shall remain valid for {YEARS} years from the last signature date.",
      "Any dispute shall be settled by arbitration under ICC rules. Governing law and seat of arbitration shall be mutually agreed.",
      "This Agreement is binding upon heirs, successors, and assigns.",
      "Electronic signature has full legal force.",
      "In case of conflict, the English version prevails.",
    ],
    commissionTitle: 'BROKER COMMISSION',
    commissionBody:
      "The Intermediary (SenHarvest Group) shall receive a commission of {FEE}% on the FOB/CIF value of each transaction concluded between Seller and Buyer for the Covered Products during the Contract Term. The commission is due at each closing (effective payment) and covers any repeat transactions between the same Parties during the validity period.",
    scopeTitle: 'PRODUCTS & SCOPE',
    scopeBody:
      "Covered products: {PRODUCTS}. Incoterms & modalities (indicative): {INCOTERMS}. Territories and volumes subject to opportunities and availability.",
    footer1: 'ICC: https://www.iccwbo.org | Incoterms: https://iccwbo.org/incoterms',
    footer2: "This document may be executed electronically. In case of conflict, English prevails.",
    ui: {
      lang: 'Language',
      years: 'Duration (years)',
      fee: 'Commission (%)',
      products: 'Covered Products',
      incoterms: 'Incoterms / modalities',
      meta: 'Reference & Date',
      ref: 'Reference',
      dateIssued: 'Date issued',
      brokerBlock: 'Broker Block (SenHarvest)',
      sellerBlock: 'Seller Block',
      buyerBlock: 'Buyer Block',
      nameTitle: 'Name & Title',
      company: 'Company',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      save: 'Save',
          update: 'Save',
      download: 'Download PDF',
    }
  }
};

// ---------- helpers ----------
const fmtDate = (d) => new Date(d || Date.now()).toLocaleDateString();

// Remplace {YEARS}/{FEE}/{PRODUCTS}/{INCOTERMS} dans un texte
const inject = (s, map) =>
  s.replace(/\{(\w+)\}/g, (_, k) => (map[k] != null ? String(map[k]) : ''));

export default function NCNDAEditor() {
  const { id } = useParams(); // 'new' ou docId Firestore
  const isNew = id === 'new';
  const nav = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [lang, setLang] = useState('fr');
  const T = useMemo(() => TEXTS[lang], [lang]);

  // Debug: afficher l'ID et le mode
  console.log('NCNDAEditor - ID:', id, 'isNew:', isNew);

  const [form, setForm] = useState({
    ref: '',
    dateIssued: new Date().toISOString(),
    years: 3,
    feePct: 3,
    products: 'Raw Cashew Nuts, Sesame Seeds…',
    incoterms: 'FOB/CIF',
    broker: {
      nameTitle: 'Mr. Abdou Lahat Lo / Manager',
      company: 'SenHarvest Group',
      address: 'Dakar, Sénégal / Montréal, Canada',
      phone: '+1 819 319 8464',
      email: 'manager@senharvest.com',
    },
    seller: { nameTitle: '', company: '', address: '', phone: '', email: '' },
    buyer:  { nameTitle: '', company: '', address: '', phone: '', email: '' },
    lang: 'fr',
  });

  const docRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!isNew && id) {
        const row = await getNCNDA(id);
        if (row) {
          setForm({ ...row });
          if (row.lang) setLang(row.lang);
        }
      }
    })();
  }, [id, isNew]);

  // Gestion de la duplication (preset)
  useEffect(() => {
    if (isNew && location.state?.preset) {
      const { id: _drop, createdAt: __c, updatedAt: __u, ...copy } = location.state.preset || {};
      // Reset de la ref et dates
      copy.ref = (copy.ref || 'NCNDA-') + '-COPY';
      copy.dateIssued = new Date().toISOString();
      setForm(prev => ({ ...prev, ...copy, lang: copy.lang || prev.lang }));
      setLang(copy.lang || 'fr');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew]);

  const onChange = (path, val) => {
    setForm((f) => {
      const clone = { ...f };
      const segs = path.split('.');
      let cur = clone;
      for (let i = 0; i < segs.length - 1; i++) cur = cur[segs[i]];
      cur[segs.at(-1)] = val;
      return clone;
    });
  };

  const onSave = async () => {
    try {
      const payload = { ...form, lang };
      console.log('onSave - payload:', payload, 'id:', id, 'isNew:', isNew);
      
      if (isNew) {
        const newId = await createNCNDA(payload);
        alert('NCNDA enregistré.');
        nav(`/admin/ncnda/${newId}`);
      } else {
        if (!id || id === 'new') {
          alert('Erreur: ID du document manquant. Redirection vers la création d\'un nouveau document.');
          nav('/admin/ncnda/new');
          return;
        }
        await updateNCNDA(id, payload);
        alert('NCNDA mis à jour.');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    }
  };

  const onDownload = async () => {
    // Evite les PDF vides/about:blank : attendre un cycle de rendu
    await new Promise((r) => setTimeout(r, 0));
    const node = docRef.current;
    const filename = `NCNDA-${form.ref || new Date().toISOString().slice(0,10)}.pdf`;
    const opt = {
      margin: 0.5,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    await html2pdf().set(opt).from(node).save();
  };

  // Clauses dynamiques
  const clauses = T.clauses.map(c =>
    inject(c, {
      YEARS: form.years,
      FEE: form.feePct,
      PRODUCTS: form.products,
      INCOTERMS: form.incoterms,
    })
  );

  // Vérification d'authentification après tous les hooks
  if (authLoading) return <div className="p-6">Vérification des permissions...</div>;
  if (!user) return <div className="p-6 text-red-600">Veuillez vous connecter en tant qu'admin.</div>;
  if (!isAdmin) return <div className="p-6 text-red-600">Accès refusé. Permissions admin requises.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Bouton retour */}
      <div className="mb-4">
        <button onClick={() => nav('/admin/ncnda')} className="px-3 py-2 border rounded hover:bg-gray-50">
          ← Retour à la liste NCNDA
        </button>
      </div>

      {/* --- Barre d'options --- */}
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
          {T.ui.years}
          <input
            type="number" min={1} max={10}
            value={form.years}
            onChange={(e)=>onChange('years', Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <label className="text-sm">
          {T.ui.fee}
          <input
            type="number" step="0.1" min={0} max={20}
            value={form.feePct}
            onChange={(e)=>onChange('feePct', Number(e.target.value))}
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

      {/* --- Meta & champs --- */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm">
          {T.ui.ref}
          <input
            value={form.ref}
            onChange={(e)=>onChange('ref', e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="NCNDA-2025-001"
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

        <label className="text-sm md:col-span-3">
          {T.ui.products}
          <input
            value={form.products}
            onChange={(e)=>onChange('products', e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <label className="text-sm md:col-span-3">
          {T.ui.incoterms}
          <input
            value={form.incoterms}
            onChange={(e)=>onChange('incoterms', e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </label>
      </div>

      {/* --- Blocs parties --- */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Block title={TEXTS[lang].ui.brokerBlock} data={form.broker} onChange={(k,v)=>onChange(`broker.${k}`, v)} T={TEXTS[lang].ui}/>
        <Block title={TEXTS[lang].ui.sellerBlock} data={form.seller} onChange={(k,v)=>onChange(`seller.${k}`, v)} T={TEXTS[lang].ui}/>
        <Block title={TEXTS[lang].ui.buyerBlock}  data={form.buyer}  onChange={(k,v)=>onChange(`buyer.${k}`, v)}  T={TEXTS[lang].ui}/>
      </div>

      {/* ================== APERCU DOCUMENT ================== */}
      <div id="ncnda-document"
           ref={docRef}
           className="max-w-5xl mx-auto bg-white shadow border rounded p-8 print:p-0 print:shadow-none">
        {/* Entête + logo ICC */}
        <div className="flex items-start gap-4 border-b pb-4">
          <img
            src={'/icc%20logo.png'} /* nom exact fourni: 'icc logo.png' (avec espace) */
            alt="ICC - International Chamber of Commerce"
            className="h-14"
            onError={(e)=>{ e.currentTarget.style.display='none'; }}
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">{T.title}</h1>
            <p className="text-gray-600 text-sm">{T.subtitle}</p>
            <p className="text-xs text-gray-500 mt-1">
              {form.ref ? `Ref: ${form.ref}` : ''} {form.ref && ' · '} {fmtDate(form.dateIssued)}
            </p>
          </div>
        </div>

        {/* Clauses */}
        <p className="mt-6 text-justify">{T.clausesIntro}</p>
        <ol className="list-decimal ml-6 space-y-3 mt-4">
          {clauses.map((c,i)=>(
            <li key={i} className="text-justify">{c}</li>
          ))}
        </ol>

        {/* Commission */}
        <div className="bg-indigo-50 p-4 rounded border mt-6">
          <h2 className="font-semibold text-indigo-800 mb-2">{T.commissionTitle}</h2>
          <p className="text-justify">
            {inject(T.commissionBody, { FEE: form.feePct })}
          </p>
        </div>

        {/* Scope */}
        <div className="bg-gray-50 p-4 rounded border mt-4">
          <h2 className="font-semibold mb-2">{T.scopeTitle}</h2>
          <p className="text-justify">
            {inject(T.scopeBody, { PRODUCTS: form.products, INCOTERMS: form.incoterms })}
          </p>
        </div>

        {/* EDT */}
        <div className="bg-gray-50 p-4 rounded border mt-4">
          <h2 className="font-semibold mb-2">{T.edtTitle}</h2>
          <p className="text-justify">{T.edtBody}</p>
        </div>

        {/* Parties */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">{T.partiesTitle}</h2>
          <PartyCard color="blue"  title={T.p1} data={form.broker} labels={T} />
          <PartyCard color="green" title={T.p2} data={form.seller} labels={T} />
          <PartyCard color="purple" title={T.p3} data={form.buyer}  labels={T} />
        </div>

        {/* Signatures */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center avoid-page-break">
          <SignBox title={T.sigBroker} name={form.broker.nameTitle} dateLabel={T.date}/>
          <SignBox title={T.sigSeller} name={form.seller.nameTitle} dateLabel={T.date}/>
          <SignBox title={T.sigBuyer}  name={form.buyer.nameTitle}  dateLabel={T.date}/>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-600 mt-10 pt-4 border-t">
          <p>{T.footer1}</p>
          <p className="mt-1">{T.footer2}</p>
        </div>
      </div>
    </div>
  );
}

// ---------- sous-composants ----------
function Block({ title, data, onChange, T }) {
  return (
    <div className="border rounded p-3 space-y-2">
      <h4 className="font-semibold mb-1">{title}</h4>
      <Input label={T.nameTitle} value={data.nameTitle} onChange={(v)=>onChange('nameTitle', v)} />
      <Input label={T.company}   value={data.company}   onChange={(v)=>onChange('company', v)} />
      <Input label={T.address}   value={data.address}   onChange={(v)=>onChange('address', v)} />
      <Input label={T.phone}     value={data.phone}     onChange={(v)=>onChange('phone', v)} />
      <Input label={T.email}     value={data.email}     onChange={(v)=>onChange('email', v)} />
    </div>
  );
}

function Input({ label, value, onChange }) {
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

function PartyCard({ color='blue', title, data, labels }) {
  const colorMap = {
    blue:    'bg-blue-50 border-blue-200',
    green:   'bg-green-50 border-green-200',
    purple:  'bg-purple-50 border-purple-200',
  };
  return (
    <div className={`p-4 rounded border mb-4 ${colorMap[color]||''}`}>
      <h3 className={`font-semibold mb-2`}>{title}</h3>
      <p><strong>{labels.fullName}:</strong> {data.nameTitle || '—'}</p>
      <p><strong>{labels.corp}:</strong> {data.company || '—'}</p>
      <p><strong>{labels.addr}:</strong> {data.address || '—'}</p>
      <p><strong>{labels.tel}:</strong> {data.phone || '—'}</p>
      <p><strong>{labels.email}:</strong> {data.email || '—'}</p>
    </div>
  );
}

function SignBox({ title, name, dateLabel }) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <div className="border-t mt-8 mb-1 w-48 mx-auto"></div>
      <p>{name || '—'}</p>
      <p className="text-xs text-gray-500">{dateLabel}: ________</p>
    </div>
  );
}
