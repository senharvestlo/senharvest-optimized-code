import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }){
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Chargement…</div>;
  if (!user) return <div className="p-6">Accès protégé — connectez-vous.</div>;
  return children;
}


