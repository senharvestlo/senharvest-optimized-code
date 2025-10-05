import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../../config/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, getIdTokenResult } from 'firebase/auth';

export default function AdminLoginButton() {
  const [user, setUser] = useState(null);
  const [isAdmin, setAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setErr('');
      setAdmin(false);
      if (u) {
        const token = await getIdTokenResult(u, true);
        setAdmin(Boolean(token.claims?.admin));
      }
      setChecking(false);
    });
    return () => unsub();
  }, []);

  const login = async () => {
    setErr('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setErr(e.message);
    }
  };


  if (checking) {
    return <div className="text-xs text-gray-600">Vérification...</div>;
  }

  return (
    <div className="text-xs text-gray-300 flex items-center gap-2">
      {!user && (
        <button 
          onClick={login} 
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium"
        >
          🔐 Admin Login (Google)
        </button>
      )}
      {user && (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-white ${isAdmin ? 'bg-green-600' : 'bg-yellow-600'}`}>
            {isAdmin ? '👑 Admin' : '👤 User'}
          </span>
          {!isAdmin && <span className="text-red-400 text-xs">(no admin claim)</span>}
        </div>
      )}
      {err && <span className="text-red-400 text-xs">⚠️ {err}</span>}
    </div>
  );
}
