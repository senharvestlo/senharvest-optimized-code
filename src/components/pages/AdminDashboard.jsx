import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🔍 Vérifie la session active
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/"); // redirection si non connecté
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 🚪 Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ Déconnecté avec succès");
      navigate("/");
    } catch (err) {
      console.error("Erreur de déconnexion :", err.message);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <p>Chargement des informations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[90%] max-w-2xl text-center">
        <h1 className="text-2xl font-semibold mb-3 text-green-700">
          Tableau de bord Admin
        </h1>
        <p className="text-gray-600 mb-5">
          Bienvenue <strong>{user.displayName || user.email}</strong> 👋
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
          >
            Se déconnecter
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition"
          >
            Retour à l'accueil
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          Session active : {user.email}
        </div>
      </div>
    </div>
  );
}
