// src/components/pages/admin/AdminLoginModal.jsx
import React, { useState, useEffect } from 'react';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../../../config/firebase';

export default function AdminLoginModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Gérer le résultat de redirection au montage du composant
  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result) {
        console.log('✅ Redirection Google Auth réussie');
        onClose(); // Fermer le modal si connexion réussie
      }
    }).catch((error) => {
      console.log('ℹ️ Pas de résultat de redirection ou erreur:', error.message);
    });
  }, [onClose]);

  async function loginGoogle() {
    setLoading(true);
    setError('');
    try {
      // Utiliser directement signInWithRedirect pour éviter les problèmes COOP
      await signInWithRedirect(auth, googleProvider);
    } catch (e) {
      console.error('Erreur de connexion Google:', e);
      setError('Erreur de connexion Google. Essayez de rafraîchir la page.');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Connexion Admin</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={loginGoogle}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Redirection...' : 'Se connecter avec Google'}
        </button>
        
        <p className="text-sm text-gray-600 mt-2 text-center">
          Vous allez être redirigé vers Google pour la connexion
        </p>

        <button
          onClick={onClose}
          className="w-full mt-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}