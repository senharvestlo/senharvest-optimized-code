import React, { useState, useEffect } from 'react';
import ProformaQwen from '../docs/ProformaQwen';
import { saveTradeDoc, getTradeDoc } from '../../services/firebaseService';

export default function ProformaQwenWrapper({ docId, onBack }) {
  const [loading, setLoading] = useState(Boolean(docId));
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!docId) return;
    (async () => {
      setLoading(true);
      try {
        const doc = await getTradeDoc(docId);
        if (doc?.data) {
          setInitialData(doc.data);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [docId]);

  const handleSave = async (data) => {
    try {
      const payload = {
        type: 'proforma',
        number: data.number,
        date: data.date,
        currency: data.currency,
        data: data,
        docNumber: data.number,
        buyerCompany: data.buyer?.name || '',
        status: 'draft',
      };
      await saveTradeDoc(docId || null, payload);
      alert('Proforma enregistrée');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return <ProformaQwen initialData={initialData} onSave={handleSave} onBack={onBack} />;
}
