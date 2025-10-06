import React, { useState, useEffect } from 'react';
import { getAuthSafe, googleProvider, FIREBASE_READY } from '../../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';

export default function AdminLoginModal({ onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // Si tu utilises Redirect (mobile / COOP strict), récupérer le résultat au mount
  useEffect(() => {
    if (!FIREBASE_READY) return;
    const auth = getAuthSafe();
    getRedirectResult(auth).then(() => {
      if (typeof onClose === 'function') onClose();
      navigate('/admin');
    }).catch(e => console.debug('No redirect result:', e?.message));
  }, [onClose, navigate]);

  const loginEmail = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (!FIREBASE_READY) {
        throw new Error('Firebase non initialisé. Vérifiez la console pour plus de détails.');
      }
      const auth = getAuthSafe();
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
      if (!FIREBASE_READY) {
        throw new Error('Firebase non initialisé. Vérifiez la console pour plus de détails.');
      }
      const auth = getAuthSafe();
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err) {
        console.warn('Popup auth failed, fallback to redirect:', err?.message);
        await signInWithRedirect(auth, googleProvider);
        return; // redirect va gérer la navigation
      }
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
          <button 
            onClick={onClose} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors duration-200"
          >
            &times;
          </button>
        </div>

        {!FIREBASE_READY && (
          <div className="mb-3 text-red-600 text-sm">
            Firebase n'est pas configuré. Ajoutez vos variables REACT_APP_FIREBASE_* dans .env / Netlify.
          </div>
        )}

        {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}
        
        <form onSubmit={loginEmail} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={busy}
          >
            {busy ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          <button
            onClick={loginGoogle}
            className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={busy}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
            {busy ? 'Connexion Google...' : 'Se connecter avec Google'}
          </button>
        </div>
      </div>
    </div>
  );
}