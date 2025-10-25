import React, { useRef, useState } from 'react';
import { downloadElementAsPDF } from '../../services/pdf';

const today = () => new Date().toISOString().slice(0,10);

export default function NCNDALite() {
  const ref = useRef(null);
  const [lang, setLang] = useState('fr');
  const [years, setYears] = useState(3);
  const [date, setDate] = useState(today());
  const [broker, setBroker] = useState({
    nameTitle: 'Mr. Abdou Lahat Lo / Business Development Partner',
    company: 'SenHarvest Group',
    address: 'Dakar, Sénégal / Montréal, Canada',
    phone: '+1 819 319 8464',
    email: 'manager@senharvest.com',
  });
  const [seller, setSeller] = useState({ nameTitle:'', company:'', address:'', phone:'', email:'' });
  const [buyer,  setBuyer]  = useState({ nameTitle:'', company:'', address:'', phone:'', email:'' });
  const [scope,  setScope]  = useState(lang==='fr' ? 'Arachides, cajou, sésame, riz…' : 'Peanuts, cashew, sesame, rice…');

  const t = lang === 'fr' ? {
    title: 'NON-CIRCUMVENTION, NON-DISCLOSURE AND WORKING AGREEMENT',
    subtitle: 'Conforme aux standards CCI (ICC)',
    edtTitle: 'TRANSMISSIONS ÉLECTRONIQUES (EDT)',
    edtText: `Les transmissions électroniques sont valides. Le présent accord incorpore la loi US 106-229, la Loi Modèle UNCITRAL, et l'accord UN/CEFACT. Une copie papier peut être demandée sans retarder l'exécution.`,
    valid: (y)=>`Accord valable ${y} an(s) à compter de la signature.`,
    download: 'Télécharger le NCNDA en PDF'
  } : {
    title: 'NON-CIRCUMVENTION, NON-DISCLOSURE AND WORKING AGREEMENT',
    subtitle: 'Under ICC (International Chamber of Commerce) standards',
    edtTitle: 'ELECTRONIC DOCUMENT TRANSMISSIONS (EDT)',
    edtText: `EDT are deemed valid. This agreement incorporates U.S. Public Law 106-229, UNCITRAL Model Law, and UN/CEFACT E-Commerce Agreement. Hard copy may be requested without delaying performance.`,
    valid: (y)=>`This agreement is valid for ${y} year(s) from the date of signature.`,
    download: 'Download NCNDA PDF'
  };

  const onDownload = () => {
    downloadElementAsPDF(ref.current, `NCNDA-${date}.pdf`, { margin: 0.6 });
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white border rounded p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="text-sm">Lang / Lang
            <select className="mt-1 w-full border rounded px-2 py-1" value={lang} onChange={e=>setLang(e.target.value)}>
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </label>
          <label className="text-sm">{lang==='fr'?'Durée (années)':'Duration (years)'}
            <input type="number" min="1" className="mt-1 w-full border rounded px-2 py-1" value={years} onChange={e=>setYears(+e.target.value||1)} />
          </label>
          <label className="text-sm">{lang==='fr'?'Date d\'émission':'Date issued'}
            <input type="date" className="mt-1 w-full border rounded px-2 py-1" value={date} onChange={e=>setDate(e.target.value)} />
          </label>
          <label className="text-sm">Scope
            <input className="mt-1 w-full border rounded px-2 py-1" value={scope} onChange={e=>setScope(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <fieldset className="border rounded p-3">
            <legend className="px-2 text-sm font-semibold">{lang==='fr'?'Partie 1 — Intermédiaire':'Party 1 — Broker'}</legend>
            <input placeholder="Nom/Titre" className="w-full border rounded px-2 py-1 mb-2" value={broker.nameTitle} onChange={e=>setBroker(s=>({...s, nameTitle:e.target.value}))}/>
            <input placeholder="Société"   className="w-full border rounded px-2 py-1 mb-2" value={broker.company}   onChange={e=>setBroker(s=>({...s, company:e.target.value}))}/>
            <input placeholder="Adresse"    className="w-full border rounded px-2 py-1 mb-2" value={broker.address}   onChange={e=>setBroker(s=>({...s, address:e.target.value}))}/>
            <input placeholder="Téléphone"  className="w-full border rounded px-2 py-1 mb-2" value={broker.phone}     onChange={e=>setBroker(s=>({...s, phone:e.target.value}))}/>
            <input placeholder="Email"      className="w-full border rounded px-2 py-1"      value={broker.email}     onChange={e=>setBroker(s=>({...s, email:e.target.value}))}/>
          </fieldset>

          <fieldset className="border rounded p-3">
            <legend className="px-2 text-sm font-semibold">{lang==='fr'?'Partie 2 — Vendeur':'Party 2 — Seller'}</legend>
            {['nameTitle','company','address','phone','email'].map(k=>(
              <input key={k} placeholder={k} className="w-full border rounded px-2 py-1 mb-2"
                     value={seller[k]} onChange={e=>setSeller(s=>({...s, [k]: e.target.value}))}/>
            ))}
          </fieldset>

          <fieldset className="border rounded p-3">
            <legend className="px-2 text-sm font-semibold">{lang==='fr'?'Partie 3 — Acheteur':'Party 3 — Buyer'}</legend>
            {['nameTitle','company','address','phone','email'].map(k=>(
              <input key={k} placeholder={k} className="w-full border rounded px-2 py-1 mb-2"
                     value={buyer[k]} onChange={e=>setBuyer(s=>({...s, [k]: e.target.value}))}/>
            ))}
          </fieldset>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white border rounded p-6 shadow" ref={ref}>
        <div className="flex items-center gap-3">
          <img src="/icc logo.png" alt="ICC" className="h-12" />
          <div>
            <h1 className="text-xl font-bold text-blue-800">{t.title}</h1>
            <p className="text-gray-600 text-sm">{t.subtitle}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-justify">
          {lang==='fr'
            ? `Vu le souhait des Parties de définir des paramètres de confidentialité, non-contournement et coopération, en date du ${date}, les Parties conviennent de ce qui suit.`
            : `Whereas the Parties wish to define confidentiality, non-circumvention and cooperation parameters as of ${date}, the Parties agree as follows.`}
        </p>

        <ol className="list-decimal ml-6 space-y-2 mt-4 text-sm">
          <li>{lang==='fr'?'Non-sollicitation et non-contournement des sources communiquées.':'No solicitation or circumvention of sources provided by the other Party.'}</li>
          <li>{lang==='fr'?'Confidentialité intégrale des informations commerciales.':'Full confidentiality of business information.'}</li>
          <li>{lang==='fr'?'Interdiction de divulgation des contacts à des tiers.':'No disclosure of contacts to third parties.'}</li>
          <li>{lang==='fr'?'Compensation intégrale en cas de contournement.':'Full compensation in case of circumvention.'}</li>
          <li>{lang==='fr'?'Répartition des commissions selon accord.':'Commissions to be shared as mutually agreed.'}</li>
          <li>{lang==='fr'?'Arbitrage CCI à Paris (France).':'ICC arbitration in Paris (France).'} </li>
          <li>{t.valid(years)}</li>
          <li>{lang==='fr'?'Le présent NCNDA couvre notamment : ':'This NCNDA notably covers: '}<strong>{scope}</strong></li>
        </ol>

        <div className="bg-gray-50 p-4 rounded border mt-6">
          <h3 className="font-semibold text-gray-800 mb-2">{t.edtTitle}</h3>
          <p className="text-sm text-justify">{t.edtText}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-10">
          {[{t:lang==='fr'?'Signature Intermédiaire':'Broker Signature',n:broker.nameTitle},
            {t:lang==='fr'?'Signature Vendeur':'Seller Signature',n:seller.nameTitle||'[Seller]'},
            {t:lang==='fr'?'Signature Acheteur':'Buyer Signature',n:buyer.nameTitle||'[Buyer]'}]
            .map((b,i)=>(
            <div key={i}>
              <p className="font-semibold">{b.t}</p>
              <div className="border-t mt-8 mx-auto w-4/5"></div>
              <p className="mt-2">{b.n}</p>
              <p className="text-xs text-gray-500">{lang==='fr'?'Date':'Date'}: ________</p>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-600 mt-10 pt-6 border-t">
          <p><strong>ICC</strong>: iccwbo.org — {lang==='fr'?'En cas de conflit, l\'anglais prévaut.':'In case of conflict, English prevails.'}</p>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onDownload} className="no-print bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2">
          {t.download}
        </button>
      </div>
    </div>
  );
}
