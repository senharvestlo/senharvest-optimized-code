import React, { useRef, useState } from 'react';
import { downloadElementAsPDF } from '../../services/pdf';

export default function QuotationLite() {
  const ref = useRef(null);
  const [lang, setLang] = useState('fr');
  const [currency, setCurrency] = useState('USD');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [seller, setSeller] = useState({ name:'SenHarvest Group', address:'Dakar, Sénégal', phone:'+221 77...', email:'manager@senharvest.com' });
  const [buyer,  setBuyer]  = useState({ name:'', address:'', phone:'', email:'' });
  const [lines,  setLines]  = useState([{ product:'', quality:'', qty:'', unit:'MT', pack:'', unitPrice:'' }]);
  const [terms, setTerms]   = useState(['Offre valable 15 jours','Livraison 30-45 jours','Paiement TT/LC']);

  const addLine = () => setLines(a=>[...a, { product:'', quality:'', qty:'', unit:'MT', pack:'', unitPrice:'' }]);
  const delLine = (i) => setLines(a=>a.filter((_,x)=>x!==i));
  const setLine = (i,k,v)=> setLines(a=>{ const c=[...a]; c[i]={...c[i],[k]:v}; return c; });

  const total = lines.reduce((s,l)=> s + (Number(l.qty||0)*Number(l.unitPrice||0)), 0);

  const t = lang==='fr'
    ? { title:'QUOTATION / DEVIS', download:'Télécharger le Devis' }
    : { title:'QUOTATION', download:'Download Quotation' };

  return (
    <div className="space-y-6">
      {/* Formulaire */}
      <div className="bg-white border rounded p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <label className="text-sm">Lang
            <select className="mt-1 w-full border rounded px-2 py-1" value={lang} onChange={e=>setLang(e.target.value)}>
              <option value="fr">FR</option><option value="en">EN</option>
            </select>
          </label>
          <label className="text-sm">Devise
            <input className="mt-1 w-full border rounded px-2 py-1" value={currency} onChange={e=>setCurrency(e.target.value)} />
          </label>
          <label className="text-sm">Réf
            <input className="mt-1 w-full border rounded px-2 py-1" value={number} onChange={e=>setNumber(e.target.value)} />
          </label>
          <label className="text-sm">Date
            <input type="date" className="mt-1 w-full border rounded px-2 py-1" value={date} onChange={e=>setDate(e.target.value)} />
          </label>
        </div>

        {/* Vendeur / Acheteur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <fieldset className="border rounded p-3">
            <legend className="px-2 text-sm font-semibold">{lang==='fr'?'Vendeur':'Seller'}</legend>
            {['name','address','phone','email'].map(k=>(
              <input key={k} placeholder={k} className="w-full border rounded px-2 py-1 mb-2"
                     value={seller[k]} onChange={e=>setSeller(s=>({...s,[k]:e.target.value}))}/>
            ))}
          </fieldset>
          <fieldset className="border rounded p-3">
            <legend className="px-2 text-sm font-semibold">{lang==='fr'?'Acheteur':'Buyer'}</legend>
            {['name','address','phone','email'].map(k=>(
              <input key={k} placeholder={k} className="w-full border rounded px-2 py-1 mb-2"
                     value={buyer[k]} onChange={e=>setBuyer(s=>({...s,[k]:e.target.value}))}/>
            ))}
          </fieldset>
        </div>

        {/* Lignes */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">{lang==='fr'?'Lignes de produits':'Line items'}</h4>
          <div className="space-y-2">
            {lines.map((l,i)=>(
              <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-gray-50 p-2 rounded border">
                <input placeholder="Produit" value={l.product} onChange={e=>setLine(i,'product',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="Qualité" value={l.quality} onChange={e=>setLine(i,'quality',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="Qté" type="number" value={l.qty} onChange={e=>setLine(i,'qty',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="Unité" value={l.unit} onChange={e=>setLine(i,'unit',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="PU" type="number" value={l.unitPrice} onChange={e=>setLine(i,'unitPrice',e.target.value)} className="border rounded px-2 py-1" />
                <div className="flex items-center">
                  <button type="button" onClick={()=>delLine(i)} className="text-xs text-red-600 underline">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addLine} className="border rounded px-3 py-2 mt-2">+ Ajouter ligne</button>
        </div>

        {/* Termes */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Termes & Conditions</h4>
          <textarea
            className="w-full border rounded px-2 py-2 min-h-[100px]"
            value={terms.join('\n')}
            onChange={(e)=>setTerms(e.target.value.split('\n').filter(Boolean))}
            placeholder="Un terme par ligne…"
          />
        </div>
      </div>

      {/* Preview imprimable */}
      <div className="bg-white border rounded p-6 shadow" ref={ref}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{t.title}</h1>
            <p className="text-sm text-gray-600">{lang==='fr'?'Réf':'Ref'}: <strong>{number||'—'}</strong></p>
            <p className="text-sm text-gray-600">{lang==='fr'?'Date':'Date'}: {date}</p>
            <p className="text-sm text-gray-600">{lang==='fr'?'Devise':'Currency'}: {currency}</p>
          </div>
          <img src="/logo192.png" alt="SenHarvest" className="h-12" />
        </div>

        <table className="w-full text-sm mt-6 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-1 text-left">Produit</th>
              <th className="border px-2 py-1">Qualité</th>
              <th className="border px-2 py-1">Qté</th>
              <th className="border px-2 py-1">Unité</th>
              <th className="border px-2 py-1">PU ({currency})</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l,i)=>(
              <tr key={i}>
                <td className="border px-2 py-1">{l.product}</td>
                <td className="border px-2 py-1">{l.quality}</td>
                <td className="border px-2 py-1 text-right">{l.qty||0}</td>
                <td className="border px-2 py-1">{l.unit}</td>
                <td className="border px-2 py-1 text-right">{Number(l.unitPrice||0).toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">{(Number(l.qty||0)*Number(l.unitPrice||0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border px-2 py-1 text-right font-semibold" colSpan={5}>TOTAL ({currency})</td>
              <td className="border px-2 py-1 text-right font-semibold">
                {total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-6 text-sm">
          <h3 className="font-semibold mb-2">{lang==='fr'?'Termes & Conditions':'Terms & Conditions'}</h3>
          <ul className="list-disc ml-5 space-y-1">
            {terms.map((t,i)=><li key={i}>{t}</li>)}
          </ul>
        </div>

        {/* NOTE: pas de signatures multiples ni infos bancaires */}
      </div>

      <div className="text-center">
        <button
          onClick={()=>downloadElementAsPDF(ref.current, `Quotation-${number||date}.pdf`, { margin: 0.6 })}
          className="no-print bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2"
        >
          {t.download}
        </button>
      </div>
    </div>
  );
}
