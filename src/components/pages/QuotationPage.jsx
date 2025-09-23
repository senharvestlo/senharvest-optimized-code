import React from 'react';
import QuotationHtmlEditor from '@/components/pdf/QuotationHtmlEditor';
import useLang from '../../hooks/useLang';
import { DIC } from '../../config/translations';

export default function QuotationPage() {
  const { lang } = useLang();
  const t = DIC[lang];

  const data = {
    company: { name: 'SenHarvest Group', address: 'Dakar, Sénégal', phone: '+221776340064', email: 'manager@senharvest.com', logoUrl: '/senharvest-logo.png' },
    buyer:   { name: 'Client SA', address: 'Montreal, QC', phone: '+1 819 319 8464', email: 'buyer@client.com', taxId: 'CA-GST-...' },
    meta:    { number: 'QT-2025-001', date: new Date().toLocaleDateString('fr-FR'), validityDays: 30 },
    items:   [{ description:'Raw Cashew Nuts', grade:'Moisture ≤ 8%', quantity:500, unit:'MT', pack:'50kg PP+PE bags', hsCode:'0801.32.00', unitPrice:4200, currency:'USD' }],
    notes:   [lang==='fr' ? 'Offre valable 30 jours.' : 'Offer valid 30 days.'],
    terms:   { incoterm:'CIF', pol:'Dakar', pod:'Montréal', transport:'Sea', paymentMode:'T/T', paymentTerms:'30% advance, 70% before shipment', leadTime:'25-30 days' },
    sellerSignature: { companyName: 'SenHarvest Group' }
  };

  return <QuotationHtmlEditor onBack={()=>{}} />;
}


