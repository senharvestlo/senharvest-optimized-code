import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    console.warn("🔒 Redirection : utilisateur non connecté");
    return <Navigate to="/" replace />;
  }

  return children;
}
