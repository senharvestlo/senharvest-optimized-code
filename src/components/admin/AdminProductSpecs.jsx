import React, { useRef, useState } from 'react';
import { downloadElementAsPDF } from '../../services/pdf';

export default function AdminProductSpecs() {
  const ref = useRef(null);
  const [lang, setLang] = useState('fr');
  const [title, setTitle] = useState('Arachides — Spécifications');
  const [items, setItems] = useState([
    { label: 'Humidité', value: '≤ 8%' },
    { label: 'Impuretés', value: '≤ 1%' },
  ]);

  const add = () => setItems(a=>[...a, { label:'', value:'' }]);
  const del = (i)=> setItems(a=>a.filter((_,x)=>x!==i));
  const set = (i,k,v)=> setItems(a=>{ const c=[...a]; c[i]={...c[i],[k]:v}; return c; });

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="text-sm">Lang
            <select className="mt-1 w-full border rounded px-2 py-1" value={lang} onChange={e=>setLang(e.target.value)}>
              <option value="fr">FR</option><option value="en">EN</option>
            </select>
          </label>
          <label className="text-sm">{lang==='fr'?'Titre':'Title'}
            <input className="mt-1 w-full border rounded px-2 py-1" value={title} onChange={e=>setTitle(e.target.value)} />
          </label>
        </div>

        <div className="mt-4 space-y-2">
          {items.map((it,i)=>(
            <div key={i} className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded border">
              <input placeholder="Critère" className="border rounded px-2 py-1" value={it.label} onChange={e=>set(i,'label',e.target.value)}/>
              <input placeholder="Valeur"  className="border rounded px-2 py-1" value={it.value} onChange={e=>set(i,'value',e.target.value)}/>
              <div className="col-span-2">
                <button className="text-xs text-red-600 underline" onClick={()=>del(i)}>Supprimer</button>
              </div>
            </div>
          ))}
          <button className="border rounded px-3 py-2" onClick={add}>+ Ajouter</button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white border rounded p-6 shadow" ref={ref}>
        <div className="flex items-center gap-3">
          <img src="/logo192.png" alt="SenHarvest" className="h-10" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <table className="w-full text-sm mt-4 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-1 text-left">{lang==='fr'?'Critère':'Criteria'}</th>
              <th className="border px-2 py-1 text-left">{lang==='fr'?'Valeur':'Value'}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it,i)=>(
              <tr key={i}>
                <td className="border px-2 py-1">{it.label}</td>
                <td className="border px-2 py-1">{it.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <button
          onClick={()=>downloadElementAsPDF(ref.current, `Specs-${title.replace(/\s+/g,'_')}.pdf`, { margin: 0.6 })}
          className="no-print bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2"
        >
          {lang==='fr'?'Télécharger PDF':'Download PDF'}
        </button>
      </div>
    </div>
  );
}
