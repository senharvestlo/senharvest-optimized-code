import React, { createContext, useContext, useEffect, useState } from 'react';
import { isAdminLocal, loginLocal, logoutLocal } from '../config/simpleAuth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(isAdminLocal());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // rien de spécial — local sessionStorage
  }, []);

  const login = async (u, p) => {
    setLoading(true);
    try {
      const ok = loginLocal(u, p);
      setIsAdmin(ok);
      return ok;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutLocal();
    setIsAdmin(false);
  };

  return (
    <AuthCtx.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
