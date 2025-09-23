import React from 'react';
import ProformaEditor from '../pdf/ProformaEditor';
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

  return <ProformaEditor t={t} onSave={handleSave} />;
}


