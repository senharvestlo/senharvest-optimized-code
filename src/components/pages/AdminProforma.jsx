import React from 'react';
import ProformaHtmlEditor from '../pdf/ProformaHtmlEditor';
import useLang from '../../hooks/useLang';
import { DIC } from '../../config/translations';

export default function AdminProforma() {
  const { lang } = useLang();
  const t = DIC[lang];

  const handleSave = (payload) => {
    // TODO: push to Firestore later
    // eslint-disable-next-line no-console
    console.log('SAVE', payload);
    alert('Proforma sauvegardée (voir console).');
  };

  return <ProformaHtmlEditor onBack={()=>{}} />;
}


