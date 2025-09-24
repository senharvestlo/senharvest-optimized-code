import React, { useEffect, useState } from "react";
import { listTradeDocs, deleteTradeDoc } from "@/services/firebaseService";
import { useNavigate } from "react-router-dom";

export default function AdminDocs(){
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { items } = await listTradeDocs();
    setItems(items);
    setLoading(false);
  }
  useEffect(()=>{ load(); },[]);

  const rows = items.filter(i => filter==='all' ? true : i.type===filter);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Documents (Proforma & Devis)</h1>
        <div className="flex gap-2">
          <select className="border rounded px-2 py-1" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="proforma">Proforma</option>
            <option value="quotation">Devis</option>
          </select>
          <button className="border rounded px-3 py-2" onClick={()=>nav("/admin/docs/new")}>+ Nouveau</button>
        </div>
      </div>

      <div className="border rounded overflow-x-auto bg-white">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">No</th>
              <th className="border p-2">Client</th>
              <th className="border p-2">Maj</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="border p-3 text-center" colSpan={5}>Chargement…</td></tr>}
            {!loading && rows.map(d=> (
              <tr key={d.id}>
                <td className="border p-2 capitalize">{d.type}</td>
                <td className="border p-2">{d.number}</td>
                <td className="border p-2">{d.buyer?.name || d.client?.name || "-"}</td>
                <td className="border p-2">{d.updatedAt?.toDate ? d.updatedAt.toDate().toLocaleString() : "-"}</td>
                <td className="border p-2 space-x-3">
                  <button className="underline" onClick={()=>nav(`/admin/docs/edit/${d.id}`)}>Éditer</button>
                  <button className="underline text-red-600" onClick={async()=>{
                    if (!window.confirm("Supprimer ce document ?")) return;
                    await deleteTradeDoc(d.id);
                    setItems(prev=>prev.filter(x=>x.id!==d.id));
                  }}>Supprimer</button>
                  {d.pdfUrl && <a className="underline" href={d.pdfUrl} target="_blank" rel="noreferrer">PDF</a>}
                </td>
              </tr>
            ))}
            {!loading && !rows.length && <tr><td className="border p-2 text-center" colSpan={5}>Aucun document</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}


