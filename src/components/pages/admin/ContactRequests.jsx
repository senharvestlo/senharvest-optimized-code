// src/components/pages/admin/ContactRequests.jsx
import React, { useEffect, useState, useCallback } from 'react';

export default function ContactRequests() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const loadRequests = useCallback(async () => {
    setBusy(true); setErr('');
    try {
      // Simulation de chargement des demandes de contact
      console.log('Loading contact requests...');
      setItems([]);
    } catch (e) {
      console.error(e); 
      setErr(e.message || 'Load error');
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { 
    // Délai pour laisser Firebase s'initialiser
    const timer = setTimeout(loadRequests, 1000);
    return () => clearTimeout(timer);
  }, [loadRequests]);

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette demande ?')) return;
    try {
      // Simulation de suppression
      console.log('Deleting contact request:', id);
      setItems(items.filter(x => x.id !== id));
    } catch (e) { console.error(e); alert('Suppression impossible'); }
  }

  return (
        <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Demandes de contact</h3>
        <button onClick={loadRequests} className="px-3 py-1 border rounded">Rafraîchir</button>
      </div>
      {busy && <div>Chargement…</div>}
      {err && <div className="text-red-600">{err}</div>}
      <div className="space-y-3">
        {items.map(r => (
          <div key={r.id} className="p-3 border rounded">
            <div className="text-sm text-gray-600">
              <b>{r.name}</b> — {r.email} — {r.phone}
              <div className="text-xs">{new Date(r.createdAt?.seconds ? r.createdAt.seconds*1000 : Date.parse(r.createdAt || Date.now())).toLocaleString()}</div>
      </div>
            <div className="mt-2 whitespace-pre-line text-sm">{r.message}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-2 py-1 text-red-600" onClick={() => handleDelete(r.id)}>Supprimer</button>
              <a className="px-2 py-1 underline" href={`mailto:${r.email}`}>Répondre par mail</a>
            </div>
          </div>
        ))}
        {!busy && items.length === 0 && <div>Aucune demande.</div>}
        </div>
    </div>
  );
}