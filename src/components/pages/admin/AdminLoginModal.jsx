import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../../../config/firebase';
import {
  signInWithPopup, signInWithRedirect, getRedirectResult,
  signInWithEmailAndPassword, createUserWithEmailAndPassword
} from 'firebase/auth';

export default function AdminLoginModal() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  async function loginGoogle() {
    setErr('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      // COOP/popup blocked → fallback
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (e2) {
        setErr(e2.message || 'Google Sign-in failed');
      }
    }
  }

  async function loginEmail() {
    setErr('');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      setErr(e.message || 'Email login failed');
    }
  }

  // Optionnel: création manuelle (à n'exposer qu'en dev)
  async function registerEmail() {
    setErr('');
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      setErr(e.message || 'Registration failed');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Connexion Admin</h2>

        {err && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4">{err}</div>}

        <button
          onClick={loginGoogle}
          className="w-full bg-blue-600 text-white rounded px-4 py-3 mb-4 hover:bg-blue-700 transition-colors"
        >
          Continuer avec Google
        </button>

        <div className="text-gray-500 text-center my-3">— ou —</div>

        <div className="space-y-3">
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={pass}
            onChange={e=>setPass(e.target.value)}
            type="password"
            placeholder="Mot de passe"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button 
              onClick={loginEmail} 
              className="flex-1 bg-gray-600 text-white rounded px-3 py-2 hover:bg-gray-700 transition-colors"
            >
              Se connecter
            </button>
            <button 
              onClick={registerEmail} 
              className="flex-1 border border-gray-300 rounded px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              Créer (dev)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}