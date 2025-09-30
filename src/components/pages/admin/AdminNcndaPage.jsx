import React, { useEffect, useState } from "react";
import { listTradeDocs, deleteTradeDoc } from "../../../services/firebaseService";
import { useNavigate } from "react-router-dom";

export default function AdminNcndaPage(){
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { items } = await listTradeDocs();
    // Filtrer uniquement les NCNDA
    setItems(items.filter(i => i.type === 'ncnda'));
    setLoading(false);
  }
  useEffect(()=>{ load(); },[]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    await deleteTradeDoc(id);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Documents NCNDA</h1>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-2 bg-blue-600 text-white hover:bg-blue-700" onClick={()=>nav("/admin/ncnda/new")}>
            + Nouveau NCNDA
          </button>
          <button className="border rounded px-3 py-2" onClick={()=>nav("/admin")}>
            ← Retour
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun document NCNDA. Cliquez sur "+ Nouveau NCNDA" pour en créer un.
        </div>
      ) : (
        <div className="border rounded overflow-x-auto bg-white">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Client</th>
                <th className="border p-2">Statut</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="border p-2">{doc.docNumber || '-'}</td>
                  <td className="border p-2">
                    {doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : '-'}
                  </td>
                  <td className="border p-2">{doc.buyerCompany || doc.clientName || '-'}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      doc.status === 'draft' ? 'bg-gray-200' :
                      doc.status === 'sent' ? 'bg-blue-200' :
                      doc.status === 'signed' ? 'bg-green-200' : 'bg-gray-100'
                    }`}>
                      {doc.status || 'draft'}
                    </span>
                  </td>
                  <td className="border p-2">
                    <div className="flex gap-2 justify-center">
                      <button 
                        className="px-2 py-1 text-blue-600 hover:underline"
                        onClick={() => nav(`/admin/ncnda/edit/${doc.id}`)}
                      >
                        Éditer
                      </button>
                      <button 
                        className="px-2 py-1 text-red-600 hover:underline"
                        onClick={() => handleDelete(doc.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
