import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProformaHTML from '../../components/docs/ProformaHTML';
import NCNDAEditor from './ncnda/NCNDAEditor';
import PSAEditor from './psa/PSAEditor';
import AdminProductSpecs from '../../components/admin/AdminProductSpecs';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const [tab, setTab] = useState('proforma');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white border rounded p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Accès refusé</h2>
          <p>Veuillez cliquer 3× sur le logo du footer pour vous connecter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h1 className="text-2xl font-bold">Administration</h1>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
            >
              Déconnexion
            </button>
          </div>

          {/* Onglets */}
          <div className="border-b">
            <nav className="-mb-px flex gap-6 px-6 overflow-x-auto">
              {[
                { k:'proforma',   label:'Proforma / Devis' },
                { k:'ncnda',      label:'NCNDA' },
                { k:'psa',        label:'PSA (Partage Bénéfices)' },
                { k:'specs',      label:'Spécifications produits' },
              ].map(x=>(
                <button
                  key={x.k}
                  onClick={()=>setTab(x.k)}
                  className={`py-3 border-b-2 ${tab===x.k?'border-blue-600 text-blue-600':'border-transparent text-gray-600 hover:text-gray-800'}`}
                >
                  {x.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {tab==='proforma'  && <ProformaHTML />}
            {tab==='ncnda'     && <NCNDAEditor />}
            {tab==='psa'       && <PSAEditor />}
            {tab==='specs'     && <AdminProductSpecs />}
          </div>
        </div>
      </div>
    </div>
  );
}
