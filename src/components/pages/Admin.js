import React, { useState, useEffect, useCallback } from 'react';
// Removed Firebase imports - using localStorage only
import Button from '../ui/Button';
import AdminTermsPDF from '../AdminTermsPDF.jsx';
import AdminProforma from './AdminProforma.jsx';
import AdminProductSpecs from '../admin/AdminProductSpecs';
// Admin simplifié sans Firebase
import useLang from '../../hooks/useLang';
import { generateTradePDF, generateTradePDFBlob } from '../../services/pdfService';
// Storage simplifié sans Firebase
// Removed saveTradeDocMeta import

const Admin = ({ onAccess }) => {
  const { lang } = useLang();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Admin toujours accessible
  const [activeTab, setActiveTab] = useState('terms');
  const [pdfType, setPdfType] = useState('proforma'); // 'proforma' | 'quotation'
  const [showBankInfo, setShowBankInfo] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [fx, setFx] = useState({ rate: '', feePct: '', transferFeeFlat: '', dstCurrency: 'XOF' });
  const [useFxConversion, setUseFxConversion] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    company: {
      name: 'SenHarvest',
      address: 'Dakar, Sénégal',
      phone: '+221 776340064',
      email: 'manager@senharvest.com'
    },
    client: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    proforma: {
      number: '',
      date: new Date().toISOString().split('T')[0],
      validity: '',
      paymentTerms: '',
      deliveryTerms: '',
      paymentMethod: '',
      departurePort: '',
      validityPeriod: '',
      notes: ''
    },
    products: [
      { id: 1, description: '', quantity: '', unit: 'MT', unitPrice: '', total: '' }
    ]
  });

  const loadData = useCallback(async () => {
    try {
      console.log('Loading proforma data from localStorage...');
      loadDataFromLocalStorage();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Admin toujours accessible sans Firebase

  useEffect(() => {
    if (onAccess) {
      onAccess();
      if (isAuthenticated) {
        loadData();
      }
    }
  }, [onAccess, loadData, isAuthenticated]);

  const loadDataFromLocalStorage = () => {
    // Load Proforma data
    const savedProforma = localStorage.getItem('proformaData');
    if (savedProforma) {
      try {
        const parsedData = JSON.parse(savedProforma);
        // Vérifier que les données ont la structure attendue
        if (parsedData && parsedData.company && parsedData.client && parsedData.proforma) {
          setInvoiceData(parsedData);
        } else {
          console.log('LocalStorage data structure invalid, using default');
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  };

  const saveData = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('proformaData', JSON.stringify(invoiceData));
      
      alert(lang === 'fr' ? 'Données sauvegardées avec succès !' : 'Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert(lang === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error saving data');
    }
  };

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      description: '',
      quantity: '',
      unit: 'MT',
      unitPrice: '',
      total: ''
    };
    setInvoiceData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const removeProduct = (id) => {
    setInvoiceData(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== id)
    }));
  };

  const updateProduct = (id, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === id ? { ...product, [field]: value } : product
      )
    }));
  };

  const calculateTotal = () => {
    return invoiceData.products.reduce((sum, product) => {
      const quantity = parseFloat(product.quantity) || 0;
      const unitPrice = parseFloat(product.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);
  };

  // legacy generateProforma removed (replaced by handleGeneratePDF)

  // New: Generate modern PDF via html2pdf and upload to Firebase Storage
  const handleGeneratePDF = async () => {
    try {
      const products = (invoiceData.products || []).map(p => ({
        description: p.description,
        quality: p.quality || '',
        quantity: p.quantity,
        unit: p.unit,
        unitPrice: p.unitPrice,
        hsCode: p.hsCode || '',
        packing: p.packing || ''
      }));

      const data = {
        type: pdfType === 'quotation' ? 'quotation' : 'proforma',
        number: invoiceData.proforma?.number || '',
        date: invoiceData.proforma?.date || new Date().toISOString().split('T')[0],
        company: {
          name: invoiceData.company?.name || 'SenHarvest',
          address: invoiceData.company?.address || '',
          phone: invoiceData.company?.phone || '',
          email: invoiceData.company?.email || '',
          bank: invoiceData.company?.bank || {},
        },
        client: invoiceData.client || {},
        terms: {
          incoterm: invoiceData.proforma?.deliveryTerms || 'FOB',
          pol: invoiceData.proforma?.departurePort || '-',
          pod: invoiceData.proforma?.destinationPort || '-',
          paymentMethod: invoiceData.proforma?.paymentMethod || '-',
          paymentTerms: invoiceData.proforma?.paymentTerms || '-',
          deliveryTime: invoiceData.proforma?.validityPeriod || '-',
          notes: invoiceData.proforma?.notes || ''
        },
        currency,
        products,
        flags: {
          showBankInfo,
          useFxConversion
        },
        fx: useFxConversion ? {
          rate: Number(fx.rate || 0),
          feePct: Number(fx.feePct || 0),
          transferFeeFlat: Number(fx.transferFeeFlat || 0),
          dstCurrency: fx.dstCurrency || 'XOF'
        } : undefined
      };

      // Trigger browser download - Utiliser la nouvelle méthode sans about:blank
      await generateTradePDF(data);

      // Optionnel: upload + métadonnées (simplifié sans Firebase)
      const { filename } = await generateTradePDFBlob(data);
      console.log('PDF generated:', filename);
      // Upload désactivé sans Firebase

      // Metadata saved to localStorage (simplifié sans Firebase)
      const metadata = {
        filename,
        type: data.type,
        number: data.number,
        date: data.date,
        companyName: data.company?.name || '',
        clientName: data.client?.name || '',
        currency: data.currency,
        total: calculateTotal()
      };
      localStorage.setItem('lastPdfMetadata', JSON.stringify(metadata));

      alert(lang === 'fr' 
        ? `PDF généré et sauvegardé: ${filename}` 
        : `PDF generated and saved: ${filename}`);
    } catch (err) {
      console.error('PDF generation/upload error:', err);
      alert(lang === 'fr' ? 'Erreur lors de la génération du PDF' : 'Error generating PDF');
    }
  };

  // Admin simplifié - toujours accessible

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
            <p className="text-gray-600">Please contact the administrator for access.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {lang === 'fr' ? 'Administration' : 'Administration'}
            </h1>
            <Button 
              onClick={() => setIsAuthenticated(false)} 
              variant="secondary"
              className="text-sm"
            >
              {lang === 'fr' ? 'Déconnexion' : 'Logout'}
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {/* Proforma tab removed */}
              <button
                onClick={() => setActiveTab('terms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'terms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {lang === 'fr' ? 'Éditeur PDF (HTML)' : 'PDF Editor (HTML)'}
              </button>
              {/* Proforma HTML editor tab removed */}
              <button
                onClick={() => setActiveTab('product-specs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'product-specs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {lang === 'fr' ? 'Spécifications produits' : 'Product specs'}
              </button>
              <button
                onClick={() => setActiveTab('ncnda')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ncnda'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {lang === 'fr' ? 'NCNDA' : 'NCNDA'}
              </button>
            </nav>
          </div>

          {/* Proforma Tab */}
          {activeTab === 'proforma' && (
            <div className="p-6">
              {/* PDF Options */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">{lang === 'fr' ? 'Options PDF' : 'PDF Options'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fr' ? 'Type de document' : 'Document Type'}</label>
                    <select
                      value={pdfType}
                      onChange={(e) => setPdfType(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="proforma">Proforma</option>
                      <option value="quotation">Quotation / Devis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="CAD">CAD</option>
                      <option value="XOF">XOF</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input id="bankInfo" type="checkbox" checked={showBankInfo} onChange={(e)=>setShowBankInfo(e.target.checked)} />
                    <label htmlFor="bankInfo" className="text-sm text-gray-700">{lang === 'fr' ? 'Afficher infos bancaires (proforma)' : 'Show bank details (proforma)'}
                    </label>
                  </div>
                </div>

                {/* FX Conversion */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input id="useFx" type="checkbox" checked={useFxConversion} onChange={(e)=>setUseFxConversion(e.target.checked)} />
                    <label htmlFor="useFx" className="text-sm text-gray-700">{lang === 'fr' ? 'Conversion de devise (optionnel)' : 'Currency conversion (optional)'}
                    </label>
                  </div>
                  {useFxConversion && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                        <input type="number" step="0.0001" value={fx.rate} onChange={(e)=>setFx(prev=>({...prev, rate:e.target.value}))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fee %</label>
                        <input type="number" step="0.0001" value={fx.feePct} onChange={(e)=>setFx(prev=>({...prev, feePct:e.target.value}))}
                          placeholder="0.02 = 2%"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intl Fee (flat)</label>
                        <input type="number" step="0.01" value={fx.transferFeeFlat} onChange={(e)=>setFx(prev=>({...prev, transferFeeFlat:e.target.value}))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dest Currency</label>
                        <input type="text" value={fx.dstCurrency} onChange={(e)=>setFx(prev=>({...prev, dstCurrency:e.target.value}))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Company Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {lang === 'fr' ? 'Informations de l\'entreprise' : 'Company Information'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {lang === 'fr' ? 'Nom de l\'entreprise' : 'Company Name'}
                      </label>
                      <input
                        type="text"
                        value={invoiceData.company?.name || ''}
                        onChange={(e) => setInvoiceData(prev => ({
                          ...prev,
                          company: { ...prev.company, name: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {lang === 'fr' ? 'Adresse' : 'Address'}
                      </label>
                      <textarea
                        value={invoiceData.company?.address || ''}
                        onChange={(e) => setInvoiceData(prev => ({
                          ...prev,
                          company: { ...prev.company, address: e.target.value }
                        }))}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {lang === 'fr' ? 'Téléphone' : 'Phone'}
                        </label>
                        <input
                          type="text"
                          value={invoiceData.company?.phone || ''}
                          onChange={(e) => setInvoiceData(prev => ({
                            ...prev,
                            company: { ...prev.company, phone: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {lang === 'fr' ? 'Email' : 'Email'}
                        </label>
                        <input
                          type="email"
                          value={invoiceData.company?.email || ''}
                          onChange={(e) => setInvoiceData(prev => ({
                            ...prev,
                            company: { ...prev.company, email: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {lang === 'fr' ? 'Informations du client' : 'Client Information'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {lang === 'fr' ? 'Nom du client' : 'Client Name'}
                      </label>
                      <input
                        type="text"
                        value={invoiceData.client?.name || ''}
                        onChange={(e) => setInvoiceData(prev => ({
                          ...prev,
                          client: { ...prev.client, name: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {lang === 'fr' ? 'Adresse' : 'Address'}
                      </label>
                      <textarea
                        value={invoiceData.client?.address || ''}
                        onChange={(e) => setInvoiceData(prev => ({
                          ...prev,
                          client: { ...prev.client, address: e.target.value }
                        }))}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {lang === 'fr' ? 'Téléphone' : 'Phone'}
                        </label>
                        <input
                          type="text"
                          value={invoiceData.client?.phone || ''}
                          onChange={(e) => setInvoiceData(prev => ({
                            ...prev,
                            client: { ...prev.client, phone: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {lang === 'fr' ? 'Email' : 'Email'}
                        </label>
                        <input
                          type="email"
                          value={invoiceData.client?.email || ''}
                          onChange={(e) => setInvoiceData(prev => ({
                            ...prev,
                            client: { ...prev.client, email: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proforma Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {lang === 'fr' ? 'Détails de la proforma' : 'Proforma Details'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang === 'fr' ? 'Numéro de proforma' : 'Proforma Number'}
                    </label>
                    <input
                      type="text"
                        value={invoiceData.proforma?.number || ''}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        proforma: { ...prev.proforma, number: e.target.value }
                      }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang === 'fr' ? 'Date' : 'Date'}
                    </label>
                    <input
                      type="date"
                        value={invoiceData.proforma?.date || ''}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        proforma: { ...prev.proforma, date: e.target.value }
                      }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang === 'fr' ? 'Validité' : 'Validity'}
                    </label>
                    <input
                      type="text"
                        value={invoiceData.proforma?.validity || ''}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        proforma: { ...prev.proforma, validity: e.target.value }
                      }))}
                      placeholder={lang === 'fr' ? 'Ex: 30 jours' : 'Ex: 30 days'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang === 'fr' ? 'Conditions de paiement' : 'Payment Terms'}
                    </label>
                    <input
                      type="text"
                        value={invoiceData.proforma?.paymentTerms || ''}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        proforma: { ...prev.proforma, paymentTerms: e.target.value }
                      }))}
                      placeholder={lang === 'fr' ? 'Ex: 30% à la commande' : 'Ex: 30% on order'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang === 'fr' ? 'Conditions de livraison' : 'Delivery Terms'}
                    </label>
                    <input
                      type="text"
                      value={invoiceData.proforma?.deliveryTerms || ''}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        proforma: { ...prev.proforma, deliveryTerms: e.target.value }
                      }))}
                      placeholder={lang === 'fr' ? 'Ex: FOB Dakar' : 'Ex: FOB Dakar'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang === 'fr' ? 'Mode de paiement' : 'Payment Method'}
                    </label>
                    <select
                      value={invoiceData.proforma?.paymentMethod || ''}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        proforma: { ...prev.proforma, paymentMethod: e.target.value }
                      }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">{lang === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                      <option value="TT">{lang === 'fr' ? 'Virement bancaire (TT)' : 'Bank Transfer (TT)'}</option>
                      <option value="LC">{lang === 'fr' ? 'Lettre de crédit (LC)' : 'Letter of Credit (LC)'}</option>
                      <option value="CAD">{lang === 'fr' ? 'Paiement à la livraison (CAD)' : 'Cash on Delivery (CAD)'}</option>
                      <option value="Advance">{lang === 'fr' ? 'Paiement anticipé' : 'Advance Payment'}</option>
                      <option value="Other">{lang === 'fr' ? 'Autre' : 'Other'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang === 'fr' ? 'Port de départ' : 'Departure Port'}
                    </label>
                    <input
                      type="text"
                      value={invoiceData.proforma?.departurePort || ''}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        proforma: { ...prev.proforma, departurePort: e.target.value }
                      }))}
                      placeholder={lang === 'fr' ? 'Ex: Port de Dakar' : 'Ex: Dakar Port'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang === 'fr' ? 'Période de validité' : 'Validity Period'}
                    </label>
                    <input
                      type="text"
                      value={invoiceData.proforma?.validityPeriod || ''}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        proforma: { ...prev.proforma, validityPeriod: e.target.value }
                      }))}
                      placeholder={lang === 'fr' ? 'Ex: 30 jours' : 'Ex: 30 days'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {lang === 'fr' ? 'Notes' : 'Notes'}
                  </label>
                  <textarea
                        value={invoiceData.proforma?.notes || ''}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      proforma: { ...prev.proforma, notes: e.target.value }
                    }))}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Products */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {lang === 'fr' ? 'Produits' : 'Products'}
                  </h3>
                  <Button onClick={addProduct} variant="primary">
                    {lang === 'fr' ? 'Ajouter un produit' : 'Add Product'}
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {lang === 'fr' ? 'Description' : 'Description'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {lang === 'fr' ? 'Quantité' : 'Quantity'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {lang === 'fr' ? 'Unité' : 'Unit'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {lang === 'fr' ? 'Prix unitaire' : 'Unit Price'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {lang === 'fr' ? 'Total' : 'Total'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {lang === 'fr' ? 'Actions' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(invoiceData.products || []).map((product, index) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={product.description}
                              onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder={lang === 'fr' ? 'Description du produit' : 'Product description'}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => {
                                const quantity = e.target.value;
                                const unitPrice = parseFloat(product.unitPrice) || 0;
                                const total = (parseFloat(quantity) || 0) * unitPrice;
                                updateProduct(product.id, 'quantity', quantity);
                                updateProduct(product.id, 'total', total.toFixed(2));
                              }}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={product.unit}
                              onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="MT">MT</option>
                              <option value="KG">KG</option>
                              <option value="LBS">LBS</option>
                              <option value="TONS">TONS</option>
                              <option value="PCS">PCS</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              step="0.01"
                              value={product.unitPrice}
                              onChange={(e) => {
                                const unitPrice = e.target.value;
                                const quantity = parseFloat(product.quantity) || 0;
                                const total = quantity * (parseFloat(unitPrice) || 0);
                                updateProduct(product.id, 'unitPrice', unitPrice);
                                updateProduct(product.id, 'total', total.toFixed(2));
                              }}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              ${product.total || '0.00'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {lang === 'fr' ? 'Supprimer' : 'Remove'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <div className="text-lg font-semibold">
                    {lang === 'fr' ? 'Total: ' : 'Total: '}${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-4">
                <Button onClick={saveData} variant="primary">
                  {lang === 'fr' ? 'Sauvegarder' : 'Save'}
                </Button>
                <Button onClick={handleGeneratePDF} variant="secondary">
                  {lang === 'fr' ? 'Générer PDF' : 'Generate PDF'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="p-6">
              <AdminTermsPDF />
            </div>
          )}
          {activeTab === 'admin-proforma' && (
            <div className="p-6">
              <AdminProforma />
            </div>
          )}
          {activeTab === 'product-specs' && (
            <div className="p-6">
              <AdminProductSpecs lang={lang} />
            </div>
          )}
          {activeTab === 'ncnda' && (
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">NCNDA Management</h3>
                <p className="text-gray-600">NCNDA functionality is being updated.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
