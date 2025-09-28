import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function GrantAdminButton() {
  const [email, setEmail] = useState('manager@senharvest.com');
  const [msg, setMsg] = useState('');

  const onGrant = async () => {
    setMsg('');
    try {
      const fn = httpsCallable(getFunctions(), 'setAdminClaim');
      const { data } = await fn({ email, makeAdmin: true });
      setMsg(`OK: ${data.email} admin=${data.admin}`);
      alert('Admin claim set. Déconnecte / reconnecte pour actualiser.');
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div className="p-3 border rounded bg-white">
      <div className="text-sm font-semibold mb-2">Donner le rôle Admin</div>
      <input className="border rounded px-2 py-1 mr-2" value={email} onChange={e=>setEmail(e.target.value)} />
      <button onClick={onGrant} className="px-3 py-1 bg-indigo-600 text-white rounded">Grant</button>
      {msg && <div className="text-xs mt-2">{msg}</div>}
    </div>
  );
}
