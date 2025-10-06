import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifier si l'admin est connecté
    const checkAdminStatus = () => {
      // Vérification localStorage
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      const adminEmail = localStorage.getItem('adminEmail');
      
      if (adminLoggedIn === 'true' && adminEmail) {
        setIsAdmin(true);
        setUser({ email: adminEmail, uid: 'local-admin' });
      } else {
        setIsAdmin(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAdminStatus();

    // Écouter les changements de localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'adminLoggedIn' || e.key === 'adminEmail') {
        checkAdminStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (email) => {
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminEmail', email);
    setIsAdmin(true);
    setUser({ email, uid: 'local-admin' });
  };

  const logout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    setIsAdmin(false);
    setUser(null);
  };

  return { isAdmin, loading, user, login, logout };
}
