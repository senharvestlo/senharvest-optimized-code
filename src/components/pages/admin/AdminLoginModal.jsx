import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLoginModal({ onClose, onSuccess }) {
  const { login, loading } = useAuth();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const ok = await login(u, p);
    if (ok) {
      onSuccess?.();
    } else {
      setErr('Identifiants invalides.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Connexion Admin</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nom d'utilisateur</label>
            <input
              value={u}
              onChange={(e)=>setU(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Nom d'utilisateur"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Mot de passe</label>
            <input
              type="password"
              value={p}
              onChange={(e)=>setP(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Mot de passe"
            />
          </div>
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
          >
            {loading ? '…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
