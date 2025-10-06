import React, { useEffect, useMemo, useState } from 'react';
import { listSpecs, deleteSpec } from '../../../services/productSpecs';
import { BASE_PRODUCTS } from '../../../config/products';
import { Link } from 'react-router-dom';

// Fonction pour formater les dates Firestore
const formatDate = (timestamp) => {
  if (!timestamp) return '—';
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleDateString('fr-FR');
  }
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('fr-FR');
  }
  return String(timestamp);
};

export default function SpecsList() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const nameByKey = useMemo(() => {
    const map = {};
    BASE_PRODUCTS.forEach(p => { map[p.key] = p; });
    return map;
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await listSpecs();
      setRows(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []); // eslint-disable-line

  const filtered = rows.filter(r =>
    r.productKey.toLowerCase().includes(q.toLowerCase()) ||
    (nameByKey[r.productKey]?.catFR || '').toLowerCase().includes(q.toLowerCase()) ||
    (nameByKey[r.productKey]?.catEN || '').toLowerCase().includes(q.toLowerCase())
  );

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer les spécifications de ce produit ?')) return;
    await deleteSpec(id);
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Bouton retour */}
      <div className="mb-4">
        <Link to="/admin" className="px-3 py-2 border rounded hover:bg-gray-50 inline-block">
          ← Retour au Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Spécifications Produits</h2>
        <div className="flex items-center gap-2">
          <input
            value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Rechercher par clé ou catégorie…"
            className="border rounded px-3 py-2"
          />
          <Link className="px-3 py-2 bg-green-600 text-white rounded" to="/admin/specs/new">Nouveau</Link>
        </div>
      </div>

      <div className="bg-white border rounded">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Produit (key)</th>
              <th className="border px-3 py-2 text-left">Nom/Catégorie</th>
              <th className="border px-3 py-2 text-left">Langue</th>
              <th className="border px-3 py-2 text-left">Maj</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="px-3 py-2" colSpan={5}>Chargement…</td></tr>}
            {!loading && filtered.length===0 && <tr><td className="px-3 py-2" colSpan={5}>Aucune spécification</td></tr>}
            {!loading && filtered.map(r => {
              const p = nameByKey[r.productKey];
              return (
                <tr key={r.id}>
                  <td className="border px-3 py-2">{r.productKey}</td>
                  <td className="border px-3 py-2">
                    {p ? `${p.catFR} / ${p.catEN}` : '—'}
                  </td>
                  <td className="border px-3 py-2">{r.lang || 'fr'}</td>
                  <td className="border px-3 py-2">{formatDate(r.updatedAt)}</td>
                  <td className="border px-3 py-2">
                    <Link className="underline mr-3" to={`/admin/specs/${r.id}`}>Éditer</Link>
                    <button className="text-red-600 underline" onClick={()=>onDelete(r.id)}>Supprimer</button>
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
