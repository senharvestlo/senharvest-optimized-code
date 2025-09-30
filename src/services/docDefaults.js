// src/services/docDefaults.js

export function defaultQuotation() {
  return {
    lang: 'fr',
    number: `QT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: new Date().toISOString().slice(0,10),
    validity: '30 jours',
    currency: 'USD',
    seller: { name:'SenHarvest Group', address:'Dakar, Sénégal', phone:'+221 77 634 0064', email:'manager@senharvest.com' },
    buyer:  { name:'', address:'', phone:'', email:'' },
    lines: [],
    terms: [
      'Offre sujette à confirmation.',
      "Validité 30 jours à compter de la date d'émission.",
    ],
    notes: [
      'Document non fiscal.',
    ],
  };
}

export function defaultProforma() {
  const d = defaultQuotation();
  d.number = `PF-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  d.terms = [
    'Proforma non fiscale.',
    'Incoterms / Ports / Délai à confirmer au bon de commande.',
  ];
  d.showBank = false;
  d.bank = { bankName:'', beneficiary:'SenHarvest Group', iban:'', swift:'' };
  return d;
}
