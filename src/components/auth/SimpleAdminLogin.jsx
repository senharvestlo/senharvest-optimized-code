import React, { useState } from 'react';

export default function SimpleAdminLogin({ onLogin }) {
  const [email, setEmail] = useState('manager@senharvest.com');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [open, setOpen] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    
    // Vérification simple pour le moment
    if (email === 'manager@senharvest.com' && pass === 'admin123') {
      // Simuler une connexion réussie
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', email);
      setOpen(false);
      alert('Connecté en tant qu\'admin');
      if (onLogin) onLogin();
    } else {
      setErr('Email ou mot de passe incorrect');
    }
  };

  return (
    <>
      <img
        src="/SenHarvest logo NB.png"
        alt="SenHarvest"
        className="h-8 cursor-pointer"
        onClick={() => setOpen(true)}
      />
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h3 className="font-semibold mb-4">Admin Login</h3>
            <div className="mb-2 text-xs text-gray-600">
              Email: manager@senharvest.com<br/>
              Mot de passe: admin123
            </div>
            <input 
              className="border rounded w-full p-2 mb-2" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email" 
            />
            <input 
              className="border rounded w-full p-2 mb-2" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              placeholder="Password" 
              type="password" 
            />
            {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                className="px-3 py-2" 
                onClick={() => setOpen(false)}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-3 py-2 bg-emerald-600 text-white rounded"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
