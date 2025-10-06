import React, { useState, useEffect } from 'react';
import { listSpecs } from '../../services/productSpecs';

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

  const loadSpecs = async () => {
    setLoading(true);
    setError('');
    try {
      const specsList = await listSpecs({ productKey });
      
      // Filtrer par langue si nécessaire
      const filteredSpecs = specsList.filter(spec => 
        !spec.lang || spec.lang === lang || spec.lang === 'fr'
      );
      
      // Filtrer les spécifications vides (sans contenu utile)
      const validSpecs = filteredSpecs.filter(spec => {
        // Support pour l'ancienne structure (title, bullets, pdfNotes)
        const hasOldTitle = spec.title && spec.title.trim() !== '';
        const hasOldBullets = spec.bullets && spec.bullets.length > 0 && spec.bullets.some(b => b && b.trim() !== '');
        const hasOldPdfNotes = spec.pdfNotes && spec.pdfNotes.trim() !== '';
        const hasOldDescription = spec.description && spec.description.trim() !== '';
        
        // Support pour la nouvelle structure (sections, fields, summary)
        const hasSections = spec.sections && spec.sections.length > 0 && spec.sections.some(s => s && (s.title || s.content));
        const hasFields = spec.fields && Object.keys(spec.fields).length > 0;
        const hasSummary = spec.summary && spec.summary.trim() !== '';
        
        return hasOldTitle || hasOldBullets || hasOldPdfNotes || hasOldDescription || hasSections || hasFields || hasSummary;
      });
      setSpecs(validSpecs);
    } catch (err) {
      console.error('Error loading specs:', err);
      setError('Erreur lors du chargement des spécifications');
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
              {specs.map((spec, index) => (
                <div key={spec.id || index} className="border rounded-lg p-4">
                  {/* Ancienne structure (title, bullets, pdfNotes) */}
                  {spec.title && spec.title.trim() && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {spec.title}
                    </h3>
                  )}
                  
                  {spec.bullets && spec.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {spec.bullets
                        .filter(bullet => bullet && bullet.trim() !== '')
                        .map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span className="text-gray-700">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {spec.description && spec.description.trim() && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 text-sm">{spec.description}</p>
                    </div>
                  )}

                  {spec.pdfNotes && spec.pdfNotes.trim() && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {lang === 'fr' ? 'Notes complémentaires' : 'Additional notes'}
                      </h4>
                      <p className="text-gray-700 text-sm">{spec.pdfNotes}</p>
                    </div>
                  )}

                  {/* Nouvelle structure (sections, fields, summary) */}
                  {spec.sections && spec.sections.length > 0 && (
                    <div className="space-y-4">
                      {spec.sections
                        .filter(section => section && (section.title || section.content))
                        .map((section, sectionIndex) => (
                        <div key={sectionIndex} className="border-l-4 border-green-500 pl-4">
                          {section.title && (
                            <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
                          )}
                          {section.content && (
                            <p className="text-gray-700 text-sm">{section.content}</p>
                          )}
                          {section.items && section.items.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start">
                                  <span className="text-green-600 mr-2">•</span>
                                  <span className="text-gray-700 text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {spec.fields && Object.keys(spec.fields).length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <h4 className="font-medium text-gray-900 mb-3">
                        {lang === 'fr' ? 'Spécifications techniques' : 'Technical specifications'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(spec.fields).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-medium text-gray-700">{key}:</span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {spec.summary && spec.summary.trim() && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {lang === 'fr' ? 'Résumé' : 'Summary'}
                      </h4>
                      <p className="text-gray-700 text-sm">{spec.summary}</p>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    {lang === 'fr' ? 'Dernière mise à jour' : 'Last updated'}: {
                      spec.updatedAt?.toDate ? 
                        spec.updatedAt.toDate().toLocaleDateString('fr-FR') :
                        new Date(spec.updatedAt).toLocaleDateString('fr-FR')
                    }
                  </div>
                </div>
              ))}
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
