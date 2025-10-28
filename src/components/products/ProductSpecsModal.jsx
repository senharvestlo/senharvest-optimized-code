import React, { useState, useEffect } from 'react';
import { getSpecs } from '../../services/productSpecsService';

/**
 * Modal pour afficher les spécifications d'un produit
 */
export default function ProductSpecsModal({ isOpen, onClose, productKey, productName, lang = 'fr' }) {
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && productKey) {
      loadSpecs();
    }
  }, [isOpen, productKey]);

  const loadSpecs = () => {
    setLoading(true);
    setError('');
    try {
      // Utiliser le nouveau service localStorage
      const specsArray = getSpecs(productKey);
      
      if (specsArray && specsArray.length > 0) {
        setSpecs(specsArray);
      } else {
        setSpecs([]);
      }
    } catch (err) {
      console.error('Error loading specs:', err);
      setError(lang === 'fr' ? 'Erreur lors du chargement des spécifications' : 'Error loading specifications');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {lang === 'fr' ? 'Spécifications' : 'Specifications'} - {productName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="text-center py-8">
              <div className="text-gray-500">
                {lang === 'fr' ? 'Chargement des spécifications...' : 'Loading specifications...'}
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={loadSpecs}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {lang === 'fr' ? 'Réessayer' : 'Retry'}
              </button>
            </div>
          )}

          {!loading && !error && specs.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                {lang === 'fr' 
                  ? 'Aucune spécification disponible pour ce produit.' 
                  : 'No specifications available for this product.'
                }
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'fr' 
                  ? 'Les spécifications seront bientôt ajoutées par notre équipe.' 
                  : 'Specifications will be added soon by our team.'
                }
              </div>
            </div>
          )}

          {!loading && !error && specs.length > 0 && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {lang === 'fr' ? 'Spécifications techniques' : 'Technical specifications'}
                </h3>
                
                {/* Structure simple [{label, value}] */}
                <div className="space-y-3">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex items-start border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {spec.label}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {spec.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Date de mise à jour si disponible */}
                {specs.updatedAt && (
                  <div className="mt-4 text-xs text-gray-500">
                    {lang === 'fr' ? 'Dernière mise à jour' : 'Last updated'}: {
                      specs.updatedAt ? 
                        new Date(specs.updatedAt).toLocaleDateString('fr-FR') :
                        '—'
                    }
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              {lang === 'fr' ? 'Fermer' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
