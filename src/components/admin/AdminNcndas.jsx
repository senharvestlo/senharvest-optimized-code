import React, { useEffect, useState } from 'react';
import { listNcndas, deleteNcnda, getNcnda } from '../../services/ncndaService';
import NcndaEditor from './NcndaEditor';

export default function AdminNcndas(){
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await listNcndas();
    setRows(r);
    setLoading(false);
  }
  useEffect(()=>{ load(); },[]);

  const onNew = () => setEditing({ id: null });

  const onEdit = async (id) => {
    const d = await getNcnda(id);
    setEditing(d || { id });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer ce NCNDA ?')) return;
    await deleteNcnda(id);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {!editing && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">NCNDA — Gestion</h1>
            <button className="border rounded px-3 py-2" onClick={onNew}>+ Nouveau</button>
          </div>
          <div className="border rounded bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-2">Réf</th>
                  <th className="border p-2">Vendeur</th>
                  <th className="border p-2">Acheteur</th>
                  <th className="border p-2">Langue</th>
                  <th className="border p-2">Durée</th>
                  <th className="border p-2">Maj</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={7} className="p-4 text-center">Chargement…</td></tr>}
                {!loading && rows.map(r => (
                  <tr key={r.id}>
                    <td className="border p-2">{r.number}</td>
                    <td className="border p-2">{r?.seller?.corporation || '-'}</td>
                    <td className="border p-2">{r?.buyer?.corporation || '-'}</td>
                    <td className="border p-2">{r?.language?.toUpperCase?.() || '-'}</td>
                    <td className="border p-2">{r?.termYears ?? '-'}</td>
                    <td className="border p-2">{r?.updatedAt?.toDate ? r.updatedAt.toDate().toLocaleString() : '-'}</td>
                    <td className="border p-2 space-x-3">
                      <button className="underline" onClick={()=>onEdit(r.id)}>Éditer</button>
                      <button className="underline text-red-600" onClick={()=>onDelete(r.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
                {!loading && !rows.length && <tr><td colSpan={7} className="p-4 text-center">Aucun NCNDA</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
        <div className="bg-white border rounded">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <div className="font-semibold">{editing?.id ? 'Modifier NCNDA' : 'Nouveau NCNDA'}</div>
            <button className="text-gray-600" onClick={()=>setEditing(null)}>Fermer ✕</button>
          </div>
          <NcndaEditor initial={editing} onSaved={()=>setEditing(null)} />
        </div>
      )}
    </div>
  );
}
