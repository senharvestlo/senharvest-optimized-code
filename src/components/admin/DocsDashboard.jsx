import React, { useEffect, useState } from "react";
import { listTradeDocs, deleteTradeDoc } from "@/services/firebaseService";

export default function DocsDashboard({ onOpenNewQuotation, onOpenEdit }) {
  const [rows, setRows] = useState([]);

  async function load() {
    const { items } = await listTradeDocs('quotation');
    setRows(items);
  }
  useEffect(()=>{ load(); },[]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Documents</h1>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-2" onClick={onOpenNewQuotation}>+ New QUOTATION</button>
        </div>
      </div>

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">Number</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Updated</th>
              <th className="border p-2">PDF</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(d=> (
              <tr key={d.id}>
                <td className="border p-2">{d.type}</td>
                <td className="border p-2">{d.number}</td>
                <td className="border p-2">{d.date}</td>
                <td className="border p-2">{d.updatedAt?.toDate ? d.updatedAt.toDate().toLocaleString() : '-'}</td>
                <td className="border p-2">{d.pdfUrl ? <a className="underline text-blue-700" href={d.pdfUrl} target="_blank" rel="noreferrer">Open</a> : '—'}</td>
                <td className="border p-2">
                  <button className="underline mr-3" onClick={()=>onOpenEdit(d.id, 'quotation')}>Edit</button>
                  <button className="underline text-red-600" onClick={async()=>{
                    if (!window.confirm('Supprimer ce document ?')) return;
                    await deleteTradeDoc(d.id);
                    setRows(prev=>prev.filter(x=>x.id!==d.id));
                  }}>Delete</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td className="border p-2 text-center" colSpan={6}>Aucun document</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}


