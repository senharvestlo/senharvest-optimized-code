import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../config/firebase";

export default function AdminLoginModal({ onClose }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Surveille l'état Firebase et redirige si connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ Utilisateur connecté :", firebaseUser.email);
        setTimeout(() => {
          onClose();
          navigate("/admin");
        }, 600);
      }
    });
    return () => unsubscribe();
  }, [navigate, onClose]);

  // 🚀 Connexion Google
  const loginGoogle = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Erreur Google Auth:", err.code, err.message);
      setError("Erreur de connexion avec Google : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✉️ Connexion Email / Mot de passe
  const loginEmail = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Erreur Email Auth:", err.code, err.message);
      switch (err.code) {
        case "auth/invalid-email":
          setError("Adresse e-mail invalide.");
          break;
        case "auth/user-not-found":
          setError("Aucun compte trouvé avec cet e-mail.");
          break;
        case "auth/wrong-password":
          setError("Mot de passe incorrect.");
          break;
        default:
          setError("Erreur de connexion : " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative animate-fadeIn">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Connexion Admin
        </h2>

        {/* 🔹 Google Login */}
        <button
          onClick={loginGoogle}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md transition"
        >
          {loading ? "Connexion..." : "Continuer avec Google"}
        </button>

        <div className="text-center my-3 text-gray-500">— ou —</div>

        {/* 🔹 Email / Password Login */}
        <form onSubmit={loginEmail} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-green-200"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:ring-green-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Se connecter
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
