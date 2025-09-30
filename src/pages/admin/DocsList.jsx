import React, { useEffect, useState } from 'react';
import { listDocs, deleteDocById } from '../../services/firestoreDocs';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Tabs = [
  { key:'quotation', label:'Devis' },
  { key:'proforma',  label:'Proforma' },
];

export default function DocsList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('quotation');
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    const tab = params.get('type');
    if (tab && Tabs.some(t => t.key === tab)) setType(tab);
  }, [params]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rows = await listDocs(type, { search: q });
      setItems(rows);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [type]); // eslint-disable-line

  const onSearch = async (e) => {
    e?.preventDefault();
    await fetchData();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    await deleteDocById(type, id);
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          {Tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setType(t.key); setParams({ type: t.key }); }}
              className={`px-3 py-2 rounded border ${type===t.key ? 'bg-blue-600 text-white border-blue-600':'bg-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <input
              value={q} onChange={e=>setQ(e.target.value)}
              placeholder="Rechercher (réf, client)…"
              className="border rounded px-3 py-2"
            />
            <button className="px-3 py-2 rounded border">Rechercher</button>
          </form>

          {type==='quotation' ? (
            <Link to="/admin/quotation/new" className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700">Nouveau Devis</Link>
          ) : (
            <Link to="/admin/proforma/new" className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700">Nouvelle Proforma</Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Réf</th>
              <th className="border px-3 py-2 text-left">Date</th>
              <th className="border px-3 py-2 text-left">Client</th>
              <th className="border px-3 py-2 text-left">Montant</th>
              <th className="border px-3 py-2 text-left">Maj</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="px-3 py-2" colSpan={6}>Chargement…</td></tr>}
            {!loading && items.length===0 && <tr><td className="px-3 py-2" colSpan={6}>Aucun document</td></tr>}
            {!loading && items.map(it => {
              const total = (it?.lines||[]).reduce((s,l)=> s + Number(l.qty||0)*Number(l.unitPrice||0), 0);
              const updated = it?.updatedAt?.toDate ? it.updatedAt.toDate().toLocaleString() : '';
              return (
                <tr key={it.id}>
                  <td className="border px-3 py-2">{it.number}</td>
                  <td className="border px-3 py-2">{it.date}</td>
                  <td className="border px-3 py-2">{it?.buyer?.name||'-'}</td>
                  <td className="border px-3 py-2">{new Intl.NumberFormat().format(total)} {it?.currency||''}</td>
                  <td className="border px-3 py-2">{updated}</td>
                  <td className="border px-3 py-2">
                    {it.type==='proforma' || type==='proforma' ? (
                      <>
                        <Link className="underline mr-3 text-blue-600" to={`/admin/proforma/${it.id}`}>Éditer</Link>
                        <button className="text-red-600 underline" onClick={()=>onDelete(it.id)}>Supprimer</button>
                      </>
                    ) : (
                      <>
                        <Link className="underline mr-3 text-blue-600" to={`/admin/quotation/${it.id}`}>Éditer</Link>
                        <button className="text-red-600 underline" onClick={()=>onDelete(it.id)}>Supprimer</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
