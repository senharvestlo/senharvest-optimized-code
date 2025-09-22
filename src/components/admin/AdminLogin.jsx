import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      if (!auth) {
        setErr("Firebase non configuré (auth). Ajoutez vos variables .env et relancez.");
        return;
      }
      await signInWithEmailAndPassword(auth, email, pass);
      onLogin();
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Admin Login</h2>
      <form onSubmit={login} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {err && <p className="text-red-500">{err}</p>}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
