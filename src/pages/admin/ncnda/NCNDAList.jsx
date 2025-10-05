// src/pages/admin/ncnda/NCNDAList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { listNCNDA, deleteNCNDA } from '../../../services/ncnda';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function useDebouncedValue(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function NCNDAList() {
  const nav = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const dq = useDebouncedValue(q, 250);
  const [err, setErr] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const fetchAll = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await listNCNDA();
      setRows(data);
    } catch (e) {
      console.error(e);
      setErr(e.message || 'Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const term = dq.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(r => {
      const hay = [
        r.ref, r.lang, r.products, r.incoterms,
        r?.broker?.nameTitle, r?.broker?.company, r?.broker?.email,
        r?.seller?.nameTitle, r?.seller?.company, r?.seller?.email,
        r?.buyer?.nameTitle,  r?.buyer?.company,  r?.buyer?.email,
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(term);
    });
  }, [rows, dq]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const onDelete = async (id) => {
    const ok = window.confirm('Supprimer définitivement ce NCNDA ?');
    if (!ok) return;
    try {
      await deleteNCNDA(id);
      await fetchAll();
    } catch (e) {
      alert(e.message || 'Suppression impossible');
    }
  };

  const onDuplicate = (row) => {
    // Ouvre l'éditeur en mode "new" et pré-remplit via state
    nav('/admin/ncnda/new', { state: { preset: row } });
  };

  // Vérification d'authentification après tous les hooks
  if (authLoading) return <div className="p-6">Vérification des permissions...</div>;
  if (!user) return <div className="p-6 text-red-600">Veuillez vous connecter en tant qu'admin.</div>;
  if (!isAdmin) return <div className="p-6 text-red-600">Accès refusé. Permissions admin requises.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Bouton retour */}
      <div className="mb-4">
        <button onClick={() => nav('/admin')} className="px-3 py-2 border rounded hover:bg-gray-50">
          ← Retour au Dashboard
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-xl font-semibold">NCNDA — Liste</h2>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e)=>{ setQ(e.target.value); setPage(1); }}
            placeholder="Chercher (réf, parties, produits…)"
            className="border rounded px-3 py-2 w-72"
          />
          <Link to="/admin/ncnda/new" className="px-3 py-2 bg-blue-600 text-white rounded">
            + Nouveau NCNDA
          </Link>
        </div>
      </div>

      <div className="bg-white border rounded">
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Chargement…</div>
        ) : err ? (
          <div className="p-6 text-sm text-red-600">{err}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">Aucun résultat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Réf</Th>
                  <Th>Lang</Th>
                  <Th>Émis le</Th>
                  <Th>Broker</Th>
                  <Th>Seller</Th>
                  <Th>Buyer</Th>
                  <Th>Produits</Th>
                  <Th>MAJ</Th>
                  <Th className="text-right pr-3">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {paged.map(r => (
                  <tr key={r.id} className="border-t">
                    <Td><span className="font-medium">{r.ref || '—'}</span></Td>
                    <Td>{(r.lang || '').toUpperCase()}</Td>
                    <Td>{fmtDate(r.dateIssued)}</Td>
                    <Td>{shortParty(r.broker)}</Td>
                    <Td>{shortParty(r.seller)}</Td>
                    <Td>{shortParty(r.buyer)}</Td>
                    <Td className="max-w-[280px] truncate" title={r.products || ''}>{r.products || '—'}</Td>
                    <Td>{fmtDate(r.updatedAt)}</Td>
                    <Td className="text-right pr-3">
                      <div className="flex gap-2 justify-end">
                        <Link to={`/admin/ncnda/${r.id}`} className="px-2 py-1 border rounded">Éditer</Link>
                        <button onClick={()=>onDuplicate(r)} className="px-2 py-1 border rounded">Dupliquer</button>
                        <button onClick={()=>onDelete(r.id)} className="px-2 py-1 border rounded text-red-600">Suppr.</button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {filtered.length} élément(s) — Page {pageSafe}/{totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pageSafe <= 1}
              onClick={()=>setPage(p => Math.max(1, p-1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ←
            </button>
            <button
              disabled={pageSafe >= totalPages}
              onClick={()=>setPage(p => Math.min(totalPages, p+1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className='' }) {
  return (
    <th className={`text-left px-3 py-2 font-semibold text-gray-700 ${className}`}>{children}</th>
  );
}
function Td({ children, className='' }) {
  return (
    <td className={`px-3 py-2 align-top ${className}`}>{children}</td>
  );
}
function fmtDate(d) {
  if (!d) return '—';
  try {
    const dt = typeof d === 'string' ? new Date(d) : (d.toDate ? d.toDate() : new Date(d));
    return dt.toLocaleDateString();
  } catch { return '—'; }
}
function shortParty(p) {
  if (!p) return '—';
  return p.company || p.nameTitle || p.email || '—';
}
