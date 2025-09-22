import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, getIdTokenResult } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);

  const refreshClaims = async (u) => {
    const cu = u || auth?.currentUser;
    if (!cu) { setClaims({}); return; }
    const idt = await getIdTokenResult(cu, true);
    setClaims(idt.claims || {});
  };

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      await refreshClaims(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, pass) => { if (!auth) return; await signInWithEmailAndPassword(auth, email, pass); await refreshClaims(); };
  const logout = async () => { if (!auth) return; await signOut(auth); setClaims({}); };
  const requestAdmin = async () => {
    const f = getFunctions();
    const grantAdmin = httpsCallable(f, 'grantAdmin');
    await grantAdmin();
    await refreshClaims();
  };

  return (
    <Ctx.Provider value={{ user, isAdmin: claims.admin === true, login, logout, requestAdmin, loading }}>
      {children}
    </Ctx.Provider>
  );
}


