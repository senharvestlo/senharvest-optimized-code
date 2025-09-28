import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'admin est connecté
    const checkAdminStatus = () => {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      const adminEmail = localStorage.getItem('adminEmail');
      
      if (adminLoggedIn === 'true' && adminEmail) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
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
  };

  const logout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    setIsAdmin(false);
  };

  return { isAdmin, loading, login, logout };
}
