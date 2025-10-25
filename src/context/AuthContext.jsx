import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuth } from '../config/firebase';
import { getIdTokenResult } from 'firebase/auth';

const AdminAllowlist = [
  'manager@senharvest.com',
  'inquiry@senharvest.com',
  // ajoute d'autres emails admin ici si besoin
];

const AuthCtx = createContext({
  user: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuth(async (u) => {
      setUser(u || null);
      if (u) {
        try {
          const token = await getIdTokenResult(u, true);
          const byClaim = !!token.claims?.admin;
          const byAllow = AdminAllowlist.includes((u.email || '').toLowerCase());
          setIsAdmin(byClaim || byAllow);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);