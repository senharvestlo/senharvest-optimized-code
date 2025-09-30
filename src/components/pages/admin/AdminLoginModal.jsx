import React, { useState } from 'react';
import { auth, FIREBASE_READY } from '../../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function AdminLoginModal({ onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const loginEmail = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (!FIREBASE_READY || !auth) throw new Error('Firebase non configuré. Vérifiez vos variables REACT_APP_FB_*');
      await signInWithEmailAndPassword(auth, email.trim(), pwd);
      if (typeof onClose === 'function') onClose();
      navigate('/admin');
    } catch (e2) {
      setErr(e2?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const loginGoogle = async () => {
    setErr(''); setBusy(true);
    try {
      if (!FIREBASE_READY || !auth) throw new Error('Firebase non configuré. Vérifiez vos variables REACT_APP_FB_*');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (typeof onClose === 'function') onClose();
      navigate('/admin');
    } catch (e2) {
      setErr(e2?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Admin Login</h3>
          <button onClick={onClose} className="text-2xl leading-none">×</button>
        </div>

        {!FIREBASE_READY && (
          <div className="mb-3 text-red-600 text-sm">
            Firebase n'est pas configuré. Ajoutez vos variables REACT_APP_FB_* dans .env / Netlify.
          </div>
        )}

        {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}

        <form onSubmit={loginEmail} className="space-y-3">
          <input
            type="email"
            required
            placeholder="admin@email.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={pwd}
            onChange={(e)=>setPwd(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold rounded px-3 py-2"
          >
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="my-3 text-center text-gray-400">ou</div>

        <button
          onClick={loginGoogle}
          disabled={busy}
          className="w-full border rounded px-3 py-2 hover:bg-gray-50"
        >
          Continuer avec Google
        </button>
      </div>
    </div>
  );
}


