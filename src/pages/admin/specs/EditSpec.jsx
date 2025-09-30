import React, { useEffect, useState } from 'react';
import { BASE_PRODUCTS } from '../../../config/products';
import { defaultSpec, getSpec, saveSpec } from '../../../services/productSpecs';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditSpec() {
  const { id } = useParams(); // 'new' ou productKey
  const isNew = id === 'new';
  const nav = useNavigate();

  const [data, setData] = useState(defaultSpec(''));
  const [busy, setBusy] = useState(false);
  const [productKey, setProductKey] = useState(isNew ? '' : id);

  useEffect(() => {
    (async () => {
      if (!isNew) {
        const row = await getSpec(id);
        setData(row || defaultSpec(id));
        setProductKey(id);
      } else {
        setData(defaultSpec(''));
      }
    })();
  }, [id, isNew]);

  const onAddItem = (secIdx) => {
    setData(d => {
      const sections = [...(d.sections||[])];
      const it = sections[secIdx]?.items || [];
      sections[secIdx] = { ...sections[secIdx], items: [...it, ''] };
      return { ...d, sections };
    });
  };

  const onDelItem = (secIdx, itemIdx) => {
    setData(d => {
      const sections = [...(d.sections||[])];
      const it = sections[secIdx]?.items || [];
      it.splice(itemIdx, 1);
      sections[secIdx] = { ...sections[secIdx], items: [...it] };
      return { ...d, sections };
    });
  };

  const onChangeItem = (secIdx, itemIdx, val) => {
    setData(d => {
      const sections = [...(d.sections||[])];
      const it = sections[secIdx]?.items || [];
      it[itemIdx] = val;
      sections[secIdx] = { ...sections[secIdx], items: [...it] };
      return { ...d, sections };
    });
  };

  const onSave = async () => {
    if (!productKey) { alert('Choisis un produit.'); return; }
    setBusy(true);
    try {
      const payload = { ...data, productKey };
      await saveSpec(productKey, payload);
      alert('Spécification enregistrée.');
      nav('/admin/specs');
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="font-semibold text-lg mb-3">Éditeur de Spécification</h2>

      <div className="bg-white border rounded p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Produit (key)
            <select
              disabled={!isNew}
              value={productKey}
              onChange={e=>{ setProductKey(e.target.value); setData(defaultSpec(e.target.value)); }}
              className="border rounded w-full px-2 py-1"
            >
              <option value="">— Choisir —</option>
              {BASE_PRODUCTS.map(p => (
                <option key={p.key} value={p.key}>
                  {p.key} — {p.catFR}/{p.catEN}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">Langue
            <select
              value={data.lang}
              onChange={e=>setData(d=>({ ...d, lang: e.target.value }))}
              className="border rounded w-full px-2 py-1"
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </label>

          <label className="col-span-2 text-sm">Résumé / Intro
            <textarea
              value={data.summary}
              onChange={e=>setData(d=>({ ...d, summary: e.target.value }))}
              className="w-full border rounded px-2 py-2 min-h-[90px]"
              placeholder="Résumé court / Selling points"
            />
          </label>
        </div>

        <hr />

        <h3 className="font-semibold">Sections</h3>
        <div className="space-y-6">
          {(data.sections||[]).map((sec, sIdx) => (
            <div key={sIdx} className="bg-gray-50 rounded p-3 border">
              <input
                className="w-full border rounded px-2 py-1 mb-2"
                value={sec.title || ''}
                onChange={e=>{
                  const title = e.target.value;
                  setData(d => {
                    const sections = [...(d.sections||[])];
                    sections[sIdx] = { ...sections[sIdx], title };
                    return { ...d, sections };
                  });
                }}
                placeholder="Titre de section (ex: Qualité / Quality)"
              />

              <div className="space-y-2">
                {(sec.items||[]).map((it, iIdx) => (
                  <div key={iIdx} className="flex gap-2">
                    <input
                      className="flex-1 border rounded px-2 py-1"
                      value={it}
                      onChange={e=>onChangeItem(sIdx, iIdx, e.target.value)}
                      placeholder="Ex: Moisture ≤ 8%"
                    />
                    <button type="button" className="text-red-600 underline" onClick={()=>onDelItem(sIdx, iIdx)}>
                      Supprimer
                    </button>
                  </div>
                ))}
                <button type="button" className="mt-1 px-3 py-1 border rounded" onClick={()=>onAddItem(sIdx)}>
                  + Ajouter point
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <h3 className="font-semibold">Champs</h3>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-2 py-1" placeholder="HS Code"
                 value={data.fields?.hsCode||''}
                 onChange={e=>setData(d=>({ ...d, fields: { ...d.fields, hsCode: e.target.value } }))} />
          <input className="border rounded px-2 py-1" placeholder="Origine / Origin"
                 value={data.fields?.origin||''}
                 onChange={e=>setData(d=>({ ...d, fields: { ...d.fields, origin: e.target.value } }))} />
          <input className="border rounded px-2 py-1" placeholder="MOQ"
                 value={data.fields?.moq||''}
                 onChange={e=>setData(d=>({ ...d, fields: { ...d.fields, moq: e.target.value } }))} />
          <input className="border rounded px-2 py-1" placeholder="Incoterms"
                 value={data.fields?.incoterms||''}
                 onChange={e=>setData(d=>({ ...d, fields: { ...d.fields, incoterms: e.target.value } }))} />
        </div>

        <div className="flex gap-2 mt-4">
          <button disabled={busy} onClick={onSave} className="px-4 py-2 bg-green-600 text-white rounded">
            {isNew ? 'Créer' : 'Enregistrer'}
          </button>
          <button onClick={()=>nav('/admin/specs')} className="px-4 py-2 border rounded">Retour</button>
        </div>
      </div>
    </div>
  );
}
