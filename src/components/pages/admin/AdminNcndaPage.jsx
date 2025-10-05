import React, { useEffect, useState } from "react";
import { listNCNDA, deleteNCNDA } from "../../../services/ncnda";
import { useNavigate } from "react-router-dom";

export default function AdminNcndaPage(){
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const ncndaList = await listNCNDA();
      setItems(ncndaList);
    } catch (error) {
      console.error("Error loading NCNDA:", error);
      setItems([]);
    }
    setLoading(false);
  }
  useEffect(()=>{ load(); },[]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce document NCNDA ?')) return;
    try {
      await deleteNCNDA(id);
      load();
    } catch (error) {
      console.error("Error deleting NCNDA:", error);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Bouton retour */}
      <div className="mb-4">
        <button onClick={() => nav('/admin')} className="px-3 py-2 border rounded hover:bg-gray-50">
          ← Retour au Dashboard
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Documents NCNDA</h1>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-2 bg-green-600 text-white hover:bg-green-700" onClick={()=>nav("/admin/ncnda/new")}>
            + Nouveau NCNDA
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
                <th className="border p-2">Référence</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Acheteur</th>
                <th className="border p-2">Langue</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="border p-2">{doc.ref || 'NCNDA-' + doc.id.slice(-6)}</td>
                  <td className="border p-2">
                    {doc.updatedAt ? new Date(doc.updatedAt.seconds ? doc.updatedAt.seconds * 1000 : doc.updatedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="border p-2">{doc.buyer?.company || doc.buyer?.nameTitle || '-'}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      doc.lang === 'fr' ? 'bg-blue-100 text-blue-800' :
                      doc.lang === 'en' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                    }`}>
                      {doc.lang === 'fr' ? 'Français' : doc.lang === 'en' ? 'English' : doc.lang || 'FR'}
                    </span>
                  </td>
                  <td className="border p-2">
                    <div className="flex gap-2 justify-center">
                      <button 
                        className="px-2 py-1 text-blue-600 hover:underline"
                        onClick={() => nav(`/admin/ncnda/${doc.id}`)}
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
