import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { auth } from '../../../config/firebase';
import { useNavigate } from 'react-router-dom';
import GrantAdminButton from '../../admin/GrantAdminButton';

export default function AdminDashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  if (loading) return <div className="p-8">Chargement…</div>;
  if (!user) return <div className="p-8">Veuillez vous connecter (triple-clic sur le logo en bas).</div>;
  
  // MODE DEV: Accès temporaire pour configurer les admins
  const DEV_MODE = false; // ✅ Sécurisé - seuls les utilisateurs avec claim admin=true peuvent accéder
  
  if (!DEV_MODE && isAdmin !== true) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-red-600">Accès refusé. Compte non autorisé.</div>
        <div className="text-sm">Connecté en tant que: <b>{auth?.currentUser?.email || 'inconnu'}</b></div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => { try { setStatus('...'); await auth?.currentUser?.getIdToken(true); setStatus('Jeton rafraîchi. Déconnecte/reconnecte si besoin.'); } catch (e) { setStatus(e?.message || 'Erreur refresh'); } }}
            className="px-3 py-1 border rounded"
          >Rafraîchir le jeton</button>
          <button onClick={logout} className="px-3 py-1 border rounded">Se déconnecter</button>
        </div>
        <div className="text-xs text-gray-600">{status}</div>
        <div className="mt-4">
          <GrantAdminButton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 text-sm text-gray-700">
        Connecté: <b>{auth?.currentUser?.email || 'inconnu'}</b>
        {DEV_MODE && <span className="ml-2 text-xs bg-yellow-200 px-2 py-1 rounded">MODE DEV</span>}
      </div>
      <h1 className="text-2xl font-bold mb-4">Admin — Tableau de bord</h1>
      
      {/* Bouton pour donner le rôle admin */}
      {DEV_MODE && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <p className="text-sm font-semibold mb-2">⚠️ Configuration initiale</p>
          <p className="text-xs text-gray-600 mb-3">
            Utilise ce bouton pour te donner le rôle admin, puis remets DEV_MODE à false dans le code.
          </p>
          <GrantAdminButton />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NCNDA Documents */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer bg-white" onClick={() => navigate('/admin/ncnda')}>
          <h3 className="text-lg font-semibold mb-2">📄 Documents NCNDA</h3>
          <p className="text-sm text-gray-600">Créer, éditer et gérer les documents de confidentialité (NCNDA)</p>
        </div>

        {/* Proforma & Devis */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer bg-white" onClick={() => navigate('/admin/docs')}>
          <h3 className="text-lg font-semibold mb-2">📋 Proforma & Devis</h3>
          <p className="text-sm text-gray-600">Créer et éditer des proformas et devis (PDF HTML)</p>
        </div>

        {/* Spécifications Produits */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer bg-white" onClick={() => navigate('/admin/specs')}>
          <h3 className="text-lg font-semibold mb-2">🌾 Spécifications Produits</h3>
          <p className="text-sm text-gray-600">Gérer les spécifications techniques des produits</p>
        </div>

        {/* Demandes Contact */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer bg-white" onClick={() => alert('Section en développement')}>
          <h3 className="text-lg font-semibold mb-2">📧 Demandes Contact</h3>
          <p className="text-sm text-gray-600">Voir et gérer les demandes de contact clients</p>
        </div>
      </div>
      
      {/* Boutons navigation */}
      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate('/')} className="px-4 py-2 border rounded hover:bg-gray-50">
          ← Retour au site web
        </button>
        <button onClick={async () => { await logout(); navigate('/admin/logout'); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}


