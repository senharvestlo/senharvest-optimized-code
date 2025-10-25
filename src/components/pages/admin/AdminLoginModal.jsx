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
    <div className="max-w-md mx-auto bg-white border rounded p-4">
      <h2 className="text-lg font-semibold mb-3">Connexion Admin</h2>

      {err && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3">{err}</div>}

      <button
        onClick={loginGoogle}
        className="w-full bg-blue-600 text-white rounded px-3 py-2 mb-3"
      >
        Continuer avec Google
      </button>

      <div className="text-gray-500 text-center my-2">— ou —</div>

      <div className="space-y-2">
        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />
        <input
          value={pass}
          onChange={e=>setPass(e.target.value)}
          type="password"
          placeholder="Mot de passe"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-2">
          <button onClick={loginEmail} className="flex-1 border rounded px-3 py-2">
            Se connecter
          </button>
          <button onClick={registerEmail} className="flex-1 border rounded px-3 py-2">
            Créer (dev)
          </button>
        </div>
      </div>
    </div>
  );
}