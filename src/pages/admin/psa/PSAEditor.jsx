// src/pages/admin/psa/PSAEditor.jsx
import React, { useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

const TEXTS = {
  fr: {
    title: 'CONTRAT DE PARTAGE DES BÉNÉFICES (Profit-Sharing Agreement)',
    subtitle: 'Conforme aux Règles de la CCI (Paris, France)',
    ui: {
      lang: 'Langue', ref: 'Référence', dateIssued: 'Date d\'émission',
      partnerBlock: 'Bloc Partenaire',
      senhBlock: 'Bloc SenHarvest',
      nameTitle: 'Nom & Titre', company: 'Société', address: 'Adresse', phone: 'Téléphone', email: 'Email',
      scopeTitle: 'Produits / Périmètre',
      marginMin: 'Marge Min (%)', marginMax: 'Marge Max (%)',
      duration: 'Durée (années)', indefinite: 'Indéterminée',
      payTrigger: 'Déclencheur du paiement',
      payBuyerFinal: 'Après paiement final de l\'acheteur',
      payWhenSellerPaid: 'Lorsque le vendeur est payé',
      download: 'Télécharger en PDF'
    },
    parties: {
      pPartner: 'Partenaire',
      pSenh: 'SenHarvest Group (LLC – USA, SARL – Sénégal, Canada Inc. – en cours)',
    },
    articles: {
      a1: 'ARTICLE 1 – OBJET',
      a1b: 'Les Parties conviennent de collaborer pour le sourcing, la négociation et la facilitation de transactions internationales de commodités agricoles.',
      a2: 'ARTICLE 2 – RÔLE DU PARTENAIRE DÉVELOPPEMENT COMMERCIAL',
      a2b: [
        'Identifier et présenter des acheteurs/vendeurs potentiels ;',
        'Négocier au nom du Partenaire ;',
        'Faciliter communication, due diligence et suivi ;',
        'Superviser inspections/échantillons/qualité ;',
        'Assister à la conclusion des transactions.'
      ],
      a3: 'ARTICLE 3 – COÛTS & DÉPENSES',
      a3b: 'Tous les frais (déplacements, inspections, échantillons, logistique) sont à la charge exclusive du Partenaire.',
      a4: 'ARTICLE 4 – PARTAGE DES BÉNÉFICES',
      a5: 'ARTICLE 5 – TRANSPARENCE & COMPTABILITÉ',
      a5b: 'Le Partenaire fournit toutes les pièces nécessaires au calcul de la marge nette. Droit d\'audit accordé au Partenaire Développement Commercial.',
      a6: 'ARTICLE 6 – CONFIDENTIALITÉ & NON-CONTOURNEMENT',
      a6b: 'Confidentialité stricte sur contacts, prix, spécifications, conditions commerciales. Interdiction de contournement.',
      a7: 'ARTICLE 7 – DURÉE',
      a8: 'ARTICLE 8 – LOI APPLICABLE & ARBITRAGE (CCI)',
      a8b: 'Tout litige est tranché en dernier ressort selon l\'arbitrage CCI à Paris, France.'
    },
    sign: { partner: 'Pour le Partenaire', senh: 'Pour SenHarvest Group', date: 'Date' },
    footer1: 'ICC : https://www.iccwbo.org | Incoterms : https://iccwbo.org/incoterms',
    footer2: 'Ce document peut être signé électroniquement. En cas de conflit, l\'anglais prévaut.'
  },
  en: {
    title: 'PROFIT-SHARING AGREEMENT',
    subtitle: 'According to ICC Rules (Paris, France)',
    ui: {
      lang: 'Language', ref: 'Reference', dateIssued: 'Date issued',
      partnerBlock: 'Partner Block',
      senhBlock: 'SenHarvest Block',
      nameTitle: 'Full Name & Title', company: 'Company', address: 'Address', phone: 'Phone', email: 'Email',
      scopeTitle: 'Products / Scope',
      marginMin: 'Min Margin (%)', marginMax: 'Max Margin (%)',
      duration: 'Duration (years)', indefinite: 'Indefinite',
      payTrigger: 'Payment trigger',
      payBuyerFinal: 'After Buyer\'s final payment',
      payWhenSellerPaid: 'When Seller is paid',
      download: 'Download PDF'
    },
    parties: {
      pPartner: 'Partner',
      pSenh: 'SenHarvest Group (LLC – USA, SARL – Senegal, Canada Inc. – in process)',
    },
    articles: {
      a1: 'ARTICLE 1 – OBJECT',
      a1b: 'The Parties agree to collaborate in sourcing, negotiation and facilitation of international commodity trading transactions.',
      a2: 'ARTICLE 2 – ROLE OF THE BUSINESS DEVELOPMENT PARTNER',
      a2b: [
        'Identify and introduce buyers/sellers;',
        'Negotiate on behalf of the Partner;',
        'Facilitate communication, due diligence and follow-up;',
        'Oversee inspections/samples/quality;',
        'Assist in closing transactions.'
      ],
      a3: 'ARTICLE 3 – COSTS & EXPENSES',
      a3b: 'All costs (travel, inspections, samples, logistics) are borne exclusively by the Partner.',
      a4: 'ARTICLE 4 – PROFIT SHARING',
      a5: 'ARTICLE 5 – TRANSPARENCY & ACCOUNTING',
      a5b: 'The Partner provides all necessary contracts/invoices/financials to compute net margin. Audit right granted to the Business Development Partner.',
      a6: 'ARTICLE 6 – CONFIDENTIALITY & NON-CIRCUMVENTION',
      a6b: 'Strict confidentiality on contacts, pricing, specifications and trade terms. No circumvention.',
      a7: 'ARTICLE 7 – DURATION',
      a8: 'ARTICLE 8 – GOVERNING LAW & ARBITRATION (ICC)',
      a8b: 'Any dispute shall be settled under ICC arbitration in Paris, France.'
    },
    sign: { partner: 'For the Partner', senh: 'For SenHarvest Group', date: 'Date' },
    footer1: 'ICC: https://www.iccwbo.org | Incoterms : https://iccwbo.org/incoterms',
    footer2: 'This document may be executed electronically. English prevails in case of conflict.'
  }
};

const fmtDate = (d) => new Date(d||Date.now()).toLocaleDateString();
const waitTick = () => new Promise(r=>setTimeout(r,0));

export default function PSAEditor() {
  const [lang, setLang] = useState('fr');
  const T = useMemo(()=>TEXTS[lang], [lang]);
  const [form, setForm] = useState({
    ref: '',
    dateIssued: new Date().toISOString(),
    marginMin: 20,
    marginMax: 25,
    years: 3,
    indefinite: false,
    payTrigger: 'buyer_final',
    scope: 'Arachides, cajou, sésame, riz, …',
    partner: { nameTitle:'', company:'', address:'', phone:'', email:'' },
    senh: {
      nameTitle:'Mr. Abdou Lahat Lo / Business Development Partner',
      company:'SenHarvest Group',
      address:'Dakar, Sénégal / Montréal, Canada',
      phone:'+1 819 319 8464',
      email:'manager@senharvest.com'
    }
  });
  const docRef = useRef(null);

  const triggerText = lang==='fr'
    ? (form.payTrigger==='buyer_final' ? 'après paiement final de l\'acheteur' : 'lorsque le vendeur est payé')
    : (form.payTrigger==='buyer_final' ? 'after Buyer\'s final payment' : 'when Seller is paid');

  const onChange=(path,val)=>{
    setForm(f=>{
      const c={...f}; const segs=path.split('.'); let cur=c;
      for(let i=0;i<segs.length-1;i++) cur=cur[segs[i]];
      cur[segs.at(-1)]=val; return c;
    });
  };

  const onDownload=async()=>{
    await waitTick();
    const node=docRef.current;
    const filename=`PSA-${form.ref||new Date().toISOString().slice(0,10)}.pdf`;
    const opt={ margin:0.5, filename, image:{type:'jpeg',quality:0.98},
      html2canvas:{scale:2,useCORS:true},
      jsPDF:{unit:'cm',format:'a4',orientation:'portrait'},
      pagebreak:{mode:['avoid-all','css','legacy']} };
    await html2pdf().set(opt).from(node).save();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* commandes */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="text-sm">{T.ui.lang}
          <select value={lang} onChange={e=>setLang(e.target.value)} className="w-full border rounded px-2 py-1">
            <option value="fr">FR</option><option value="en">EN</option>
          </select>
        </label>
        <label className="text-sm">{T.ui.ref}
          <input value={form.ref} onChange={e=>onChange('ref',e.target.value)} className="w-full border rounded px-2 py-1"/>
        </label>
        <label className="text-sm">{T.ui.dateIssued}
          <input type="date" value={(form.dateIssued||'').slice(0,10)}
            onChange={e=>onChange('dateIssued',new Date(e.target.value).toISOString())}
            className="w-full border rounded px-2 py-1"/>
        </label>
        <button onClick={onDownload} className="px-3 py-2 bg-blue-600 text-white rounded">{T.ui.download}</button>
      </div>

      {/* paramètres */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="text-sm">{T.ui.marginMin}
          <input type="number" value={form.marginMin} onChange={e=>onChange('marginMin',+e.target.value)} className="w-full border rounded px-2 py-1"/>
        </label>
        <label className="text-sm">{T.ui.marginMax}
          <input type="number" value={form.marginMax} onChange={e=>onChange('marginMax',+e.target.value)} className="w-full border rounded px-2 py-1"/>
        </label>
        <label className="text-sm">{T.ui.duration}
          <input type="number" value={form.years} disabled={form.indefinite} onChange={e=>onChange('years',+e.target.value)} className="w-full border rounded px-2 py-1"/>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.indefinite} onChange={e=>onChange('indefinite',e.target.checked)}/> {T.ui.indefinite}
        </label>
        <label className="text-sm md:col-span-2">{T.ui.payTrigger}
          <select value={form.payTrigger} onChange={e=>onChange('payTrigger',e.target.value)} className="w-full border rounded px-2 py-1">
            <option value="buyer_final">{T.ui.payBuyerFinal}</option>
            <option value="seller_paid">{T.ui.payWhenSellerPaid}</option>
          </select>
        </label>
        <label className="text-sm md:col-span-2">{T.ui.scopeTitle}
          <input value={form.scope} onChange={e=>onChange('scope',e.target.value)} className="w-full border rounded px-2 py-1"/>
        </label>
      </div>

      {/* blocs parties */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <PartyBlock title={T.ui.partnerBlock} data={form.partner} onChange={(k,v)=>onChange(`partner.${k}`,v)} T={T.ui}/>
        <PartyBlock title={T.ui.senhBlock} data={form.senh} onChange={(k,v)=>onChange(`senh.${k}`,v)} T={T.ui}/>
      </div>

      {/* preview doc */}
      <div ref={docRef} className="max-w-5xl mx-auto bg-white shadow border rounded p-8">
        <header className="flex items-start justify-between border-b pb-3">
          <div className="flex gap-3">
            <img src="/icc%20logo.png" alt="ICC" className="h-12"/>
            <img src="/senharvest-logo.png" alt="SenHarvest" className="h-12"/>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-blue-800">{T.title}</h1>
            <p className="text-sm text-gray-600">{T.subtitle}</p>
            <p className="text-xs text-gray-500">{form.ref} · {fmtDate(form.dateIssued)}</p>
          </div>
        </header>

        <Article title={T.articles.a1}><p>{T.articles.a1b}</p></Article>
        <Article title={T.articles.a2}><ul className="list-disc ml-5">{T.articles.a2b.map((x,i)=><li key={i}>{x}</li>)}</ul></Article>
        <Article title={T.articles.a3}><p>{T.articles.a3b}</p></Article>
        <Article title={T.articles.a4}>
          <p>{lang==='fr'
            ? `Le Partenaire Développement Commercial perçoit entre ${form.marginMin}% et ${form.marginMax}% de la marge nette.`
            : `The Business Development Partner receives between ${form.marginMin}% and ${form.marginMax}% of net margin.`}</p>
          <p>{triggerText}</p>
        </Article>
        <Article title={T.articles.a5}><p>{T.articles.a5b}</p></Article>
        <Article title={T.articles.a6}><p>{T.articles.a6b}</p></Article>
        <Article title={T.articles.a7}>
          <p>{form.indefinite
            ? (lang==='fr'?'Durée : indéterminée.':'Indefinite term.')
            : (lang==='fr'?`Durée : ${form.years} an(s).`:`Term: ${form.years} year(s).`)}</p>
        </Article>
        <Article title={T.articles.a8}><p>{T.articles.a8b}</p></Article>

        {/* signatures */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <SignBox title={T.sign.partner} name={form.partner.nameTitle} dateLabel={T.sign.date}/>
          <SignBox title={T.sign.senh} name={form.senh.nameTitle} dateLabel={T.sign.date}/>
        </div>

        <footer className="mt-8 pt-3 border-t text-xs text-gray-600">
          <p>{T.footer1}</p><p>{T.footer2}</p>
        </footer>
      </div>
    </div>
  );
}

function PartyBlock({ title,data,onChange,T }) {
  return (
    <div className="border rounded p-3 space-y-2">
      <h4 className="font-semibold mb-1">{title}</h4>
      {['nameTitle','company','address','phone','email'].map(k=>(
        <label key={k} className="text-sm block">{T[k]}
          <input value={data[k]||''} onChange={e=>onChange(k,e.target.value)}
            className="w-full border rounded px-2 py-1"/>
        </label>
      ))}
    </div>
  );
}

function Article({title,children}) {
  return <div className="mt-5"><h3 className="font-semibold mb-1">{title}</h3>{children}</div>;
}

function SignBox({title,name,dateLabel}) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <div className="border-t mt-8 mb-1 w-48 mx-auto"></div>
      <p>{name||'—'}</p>
      <p className="text-xs text-gray-500">{dateLabel}: ________</p>
    </div>
  );
}
