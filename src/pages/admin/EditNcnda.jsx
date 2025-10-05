import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditNcnda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ncndaData, setNcndaData] = useState({
    title: '',
    content: '',
    company: '',
    client: ''
  });

  const isNew = !id || id === 'new';

  const handleSave = () => {
    console.log('💾 Sauvegarde NCNDA:', ncndaData);
    alert(isNew ? 'NCNDA créé avec succès!' : 'NCNDA mis à jour!');
    navigate('/admin/ncnda');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'Créer un nouveau NCNDA' : 'Modifier NCNDA'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNew ? 'Remplissez les informations ci-dessous' : 'Modifiez les informations ci-dessous'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/ncnda')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          ← Retour
        </button>
      </div>

      {/* Formulaire */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du document
            </label>
            <input
              type="text"
              value={ncndaData.title}
              onChange={(e) => setNcndaData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Accord de confidentialité - Cashew Nuts"
            />
          </div>

          {/* Entreprise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entreprise
            </label>
            <input
              type="text"
              value={ncndaData.company}
              onChange={(e) => setNcndaData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom de l'entreprise"
            />
          </div>
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client / Partenaire
          </label>
          <input
            type="text"
            value={ncndaData.client}
            onChange={(e) => setNcndaData(prev => ({ ...prev, client: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nom du client ou partenaire"
          />
        </div>

        {/* Contenu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenu du NCNDA
          </label>
          <textarea
            value={ncndaData.content}
            onChange={(e) => setNcndaData(prev => ({ ...prev, content: e.target.value }))}
            rows={12}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Saisissez le contenu de l'accord de confidentialité..."
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={() => navigate('/admin/ncnda')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isNew ? 'Créer NCNDA' : 'Mettre à jour'}
          </button>
        </div>
      </div>
    </div>
  );
}

