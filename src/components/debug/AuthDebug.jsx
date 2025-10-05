import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthDebug() {
  const { user, isAdmin, loading, claims } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">🔐 Auth Debug</h3>
      <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
      <div><strong>User:</strong> {user ? user.email : 'Not logged in'}</div>
      <div><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</div>
      <div><strong>Claims:</strong> {JSON.stringify(claims)}</div>
      <div><strong>UID:</strong> {user?.uid || 'N/A'}</div>
    </div>
  );
}
