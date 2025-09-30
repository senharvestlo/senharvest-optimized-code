import React, { useEffect, useState } from 'react';
import ProformaQwen from '../../components/docs/ProformaQwen';
import { createDoc, getDocById, saveDoc } from '../../services/firestoreDocs';
import { defaultProforma } from '../../services/docDefaults';
import { useParams, useNavigate } from 'react-router-dom';

function TextareaArray({ value, onChange, placeholder }) {
  const [text, setText] = useState((value||[]).join('\n'));
  useEffect(()=>{ setText((value||[]).join('\n')); }, [value]);
  return (
    <textarea
      className="w-full border rounded px-2 py-2 min-h-[120px]"
      value={text}
      onChange={(e)=>{ setText(e.target.value); onChange(e.target.value.split('\n').filter(Boolean)); }}
      placeholder={placeholder}
    />
  );
}

export default function EditProforma() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(defaultProforma());
  const isNew = id === 'new';
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isNew) {
        const row = await getDocById('proforma', id);
        if (row) setData(row);
      }
    })();
  }, [id, isNew]);

  const onAddLine = () => setData(d => ({ ...d, lines: [...(d.lines||[]), { product:'', quality:'', qty:0, unit:'MT', pack:'', hsCode:'', unitPrice:0 }] }));
  const onDelLine = (idx) => setData(d => ({ ...d, lines: d.lines.filter((_,i)=>i!==idx) }));
  const setLine = (idx, key, val) => setData(d => {
    const lines = [...(d.lines||[])];
    lines[idx] = { ...lines[idx], [key]: val };
    return { ...d, lines };
  });
  const setArray = (key, arr) => setData(d => ({ ...d, [key]: arr }));

  const onSave = async () => {
    setBusy(true);
    try {
      if (isNew) {
        const res = await createDoc('proforma', data);
        nav(`/admin/proforma/${res.id}`);
      } else {
        await saveDoc('proforma', id, data);
        alert('Proforma enregistrée.');
      }
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Bouton retour */}
      <div className="mb-4">
        <button onClick={()=>nav('/admin/docs?type=proforma')} className="px-3 py-2 border rounded hover:bg-gray-50">
          ← Retour à la liste
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white border rounded p-4 overflow-y-auto max-h-screen">
          <h2 className="font-semibold text-lg mb-3">Éditeur Proforma</h2>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Langue
            <select value={data.lang} onChange={e=>setData(d=>({...d, lang:e.target.value}))} className="border rounded w-full px-2 py-1 mt-1">
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </label>
          <label className="text-sm">Devise
            <input value={data.currency} onChange={e=>setData(d=>({...d, currency:e.target.value}))} className="border rounded w-full px-2 py-1 mt-1" />
          </label>

          <label className="text-sm">Référence
            <input value={data.number} onChange={e=>setData(d=>({...d, number:e.target.value}))} className="border rounded w-full px-2 py-1 mt-1" />
          </label>
          <label className="text-sm">Date
            <input type="date" value={data.date} onChange={e=>setData(d=>({...d, date:e.target.value}))} className="border rounded w-full px-2 py-1 mt-1" />
          </label>

          <label className="col-span-2 text-sm">Validité
            <input value={data.validity} onChange={e=>setData(d=>({...d, validity:e.target.value}))} className="border rounded w-full px-2 py-1 mt-1" />
          </label>
        </div>

        <hr className="my-4" />

        <h3 className="font-semibold mb-2">Vendeur</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Nom" value={data.seller.name||''} onChange={e=>setData(d=>({...d, seller:{...d.seller, name:e.target.value}}))} className="border rounded px-2 py-1" />
          <input placeholder="Téléphone" value={data.seller.phone||''} onChange={e=>setData(d=>({...d, seller:{...d.seller, phone:e.target.value}}))} className="border rounded px-2 py-1" />
          <input placeholder="Email" value={data.seller.email||''} onChange={e=>setData(d=>({...d, seller:{...d.seller, email:e.target.value}}))} className="border rounded px-2 py-1 col-span-2" />
          <input placeholder="Adresse" value={data.seller.address||''} onChange={e=>setData(d=>({...d, seller:{...d.seller, address:e.target.value}}))} className="border rounded px-2 py-1 col-span-2" />
        </div>

        <h3 className="font-semibold mt-4 mb-2">Acheteur</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Nom" value={data.buyer.name||''} onChange={e=>setData(d=>({...d, buyer:{...d.buyer, name:e.target.value}}))} className="border rounded px-2 py-1" />
          <input placeholder="Téléphone" value={data.buyer.phone||''} onChange={e=>setData(d=>({...d, buyer:{...d.buyer, phone:e.target.value}}))} className="border rounded px-2 py-1" />
          <input placeholder="Email" value={data.buyer.email||''} onChange={e=>setData(d=>({...d, buyer:{...d.buyer, email:e.target.value}}))} className="border rounded px-2 py-1 col-span-2" />
          <input placeholder="Adresse" value={data.buyer.address||''} onChange={e=>setData(d=>({...d, buyer:{...d.buyer, address:e.target.value}}))} className="border rounded px-2 py-1 col-span-2" />
        </div>

        <h3 className="font-semibold mt-4 mb-2">Lignes de produits</h3>
        <div className="space-y-2">
          {(data.lines||[]).map((l, idx) => (
            <div key={idx} className="border rounded p-2 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Produit" value={l.product||''} onChange={e=>setLine(idx,'product',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="Qualité" value={l.quality||''} onChange={e=>setLine(idx,'quality',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="Qté" type="number" value={l.qty||0} onChange={e=>setLine(idx,'qty',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="Unité" value={l.unit||'MT'} onChange={e=>setLine(idx,'unit',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="Pack" value={l.pack||''} onChange={e=>setLine(idx,'pack',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="HS Code" value={l.hsCode||''} onChange={e=>setLine(idx,'hsCode',e.target.value)} className="border rounded px-2 py-1" />
                <input placeholder="Prix unitaire" type="number" value={l.unitPrice||0} onChange={e=>setLine(idx,'unitPrice',e.target.value)} className="border rounded px-2 py-1 col-span-2" />
              </div>
              <button type="button" onClick={()=>onDelLine(idx)} className="text-red-600 text-xs underline mt-1">Supprimer cette ligne</button>
            </div>
          ))}
          <button type="button" onClick={onAddLine} className="px-3 py-2 border rounded w-full">+ Ajouter ligne</button>
        </div>

        <h3 className="font-semibold mt-4 mb-2">Termes & Conditions</h3>
        <TextareaArray value={data.terms||[]} onChange={(arr)=>setArray('terms', arr)} placeholder="Un terme par ligne…" />

        <h3 className="font-semibold mt-4 mb-2">Notes</h3>
        <TextareaArray value={data.notes||[]} onChange={(arr)=>setArray('notes', arr)} placeholder="Une note par ligne…" />

        <h3 className="font-semibold mt-4 mb-2">Banque (optionnel)</h3>
        <div className="flex items-center gap-2 mb-2">
          <input id="showBank" type="checkbox" checked={!!data.showBank} onChange={e=>setData(d=>({...d, showBank:e.target.checked}))}/>
          <label htmlFor="showBank">Afficher les infos bancaires</label>
        </div>
        {data.showBank && (
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Banque" value={data.bank?.bankName||''} onChange={e=>setData(d=>({...d, bank:{...d.bank, bankName:e.target.value}}))} className="border rounded px-2 py-1" />
            <input placeholder="Bénéficiaire" value={data.bank?.beneficiary||''} onChange={e=>setData(d=>({...d, bank:{...d.bank, beneficiary:e.target.value}}))} className="border rounded px-2 py-1" />
            <input placeholder="IBAN/Account" value={data.bank?.iban||''} onChange={e=>setData(d=>({...d, bank:{...d.bank, iban:e.target.value}}))} className="border rounded px-2 py-1 col-span-2" />
            <input placeholder="SWIFT/BIC" value={data.bank?.swift||''} onChange={e=>setData(d=>({...d, bank:{...d.bank, swift:e.target.value}}))} className="border rounded px-2 py-1 col-span-2" />
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button disabled={busy} onClick={onSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {busy ? '⏳' : (isNew?'Créer':'Enregistrer')}
          </button>
          <button onClick={()=>nav('/admin/docs?type=proforma')} className="px-4 py-2 border rounded hover:bg-gray-50">Retour</button>
        </div>
      </div>

        {/* Preview PDF */}
        <div className="bg-white border rounded sticky top-4">
          <ProformaQwen liveData={data} onSave={onSave} onBack={()=>nav('/admin/docs?type=proforma')} />
        </div>
      </div>
    </div>
  );
}
