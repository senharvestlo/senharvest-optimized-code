import React from 'react';

const ProformaTemplate = ({ data, lang }) => {
  const {
    documentType,
    invoiceNumber,
    date,
    seller,
    buyer,
    products,
    terms
  } = data;

  const calculateTotal = () => {
    return products.reduce((sum, product) => {
      const quantity = parseFloat(product.quantity) || 0;
      const unitPrice = parseFloat(product.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="proforma-pdf">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <img 
            src="/Xidma Harvest Logo NB.png" 
            alt="SenHarvest Logo" 
            className="h-16 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            {documentType === 'quotation' 
              ? (lang === 'fr' ? 'DEVIS' : 'QUOTATION')
              : (lang === 'fr' ? 'FACTURE PROFORMA' : 'PROFORMA INVOICE')
            }
          </h1>
          <p className="text-gray-600">
            {lang === 'fr' ? 'Numéro' : 'Number'}: {invoiceNumber}
          </p>
          <p className="text-gray-600">
            {lang === 'fr' ? 'Date' : 'Date'}: {formatDate(date)}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {lang === 'fr' ? 'Vendeur' : 'Seller'}
          </h2>
          <div className="text-sm text-gray-600">
            <p className="font-semibold">{seller.name}</p>
            <p>{seller.address}</p>
            <p>{seller.email}</p>
            <p>{seller.phone}</p>
            <p className="mt-2 text-xs">{seller.role}</p>
          </div>
        </div>
      </div>

      {/* Buyer Info */}
      {buyer.name && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {lang === 'fr' ? 'Acheteur' : 'Buyer'}
          </h2>
          <div className="text-sm text-gray-600">
            <p className="font-semibold">{buyer.name}</p>
            {buyer.address && <p>{buyer.address}</p>}
            {buyer.email && <p>{buyer.email}</p>}
            {buyer.phone && <p>{buyer.phone}</p>}
            {buyer.role && <p className="mt-2 text-xs">{buyer.role}</p>}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {lang === 'fr' ? 'Produits' : 'Products'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  {lang === 'fr' ? 'Description' : 'Description'}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  {lang === 'fr' ? 'Quantité' : 'Quantity'}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  {lang === 'fr' ? 'Unité' : 'Unit'}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold">
                  {lang === 'fr' ? 'Prix Unitaire' : 'Unit Price'}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold">
                  {lang === 'fr' ? 'Total' : 'Total'}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const quantity = parseFloat(product.quantity) || 0;
                const unitPrice = parseFloat(product.unitPrice) || 0;
                const total = quantity * unitPrice;
                
                return (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.description || '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {product.quantity || '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {product.unit || '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {product.unitPrice ? formatCurrency(unitPrice) : '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan="4" className="border border-gray-300 px-4 py-2 text-right font-bold">
                  {lang === 'fr' ? 'TOTAL' : 'TOTAL'}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-bold text-lg">
                  {formatCurrency(calculateTotal())}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Terms and Conditions - Each term on its own line */}
      {terms && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {lang === 'fr' ? 'Termes et Conditions' : 'Terms and Conditions'}
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm space-y-1">
              {terms.incoterm && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Incoterm:' : 'Incoterm:'}</span>
                  <span className="whitespace-nowrap">{terms.incoterm}</span>
                </div>
              )}
              {terms.payment && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Mode de paiement:' : 'Payment method:'}</span>
                  <span className="whitespace-nowrap">{terms.payment}</span>
                </div>
              )}
              {terms.paymentTerms && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Conditions de Paiement:' : 'Payment Terms:'}</span>
                  <span className="whitespace-nowrap">{terms.paymentTerms}</span>
                </div>
              )}
              {terms.departurePort && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Port de Départ:' : 'Departure Port:'}</span>
                  <span className="whitespace-nowrap">{terms.departurePort}</span>
                </div>
              )}
              {terms.arrivalPort && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Port d\'Arrivée:' : 'Arrival Port:'}</span>
                  <span className="whitespace-nowrap">{terms.arrivalPort}</span>
                </div>
              )}
              {terms.validity && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Période de validité:' : 'Validity period:'}</span>
                  <span className="whitespace-nowrap">{terms.validity}</span>
                </div>
              )}
              {terms.delivery && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Livraison:' : 'Delivery:'}</span>
                  <span className="whitespace-nowrap">{terms.delivery}</span>
                </div>
              )}
              {terms.quality && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Qualité:' : 'Quality:'}</span>
                  <span className="whitespace-nowrap">{terms.quality}</span>
                </div>
              )}
              {terms.inspection && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Inspection:' : 'Inspection:'}</span>
                  <span className="whitespace-nowrap">{terms.inspection}</span>
                </div>
              )}
              {terms.additionalTerms && (
                <div className="flex">
                  <span className="font-semibold w-48">{lang === 'fr' ? 'Termes Additionnels:' : 'Additional Terms:'}</span>
                  <span className="whitespace-nowrap">{terms.additionalTerms}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">SenHarvest Group</p>
          <p>{lang === 'fr' ? 'Cabinet d\'intermédiation et de courtage en commodités agricoles' : 'Agricultural commodities intermediation and brokerage firm'}</p>
          <p className="mt-2">
            {lang === 'fr' ? 'USA • Sénégal • Canada' : 'USA • Senegal • Canada'}
          </p>
          <div className="mt-4 text-xs text-gray-500">
            <p>Business ID Number: 7688415 (USA)</p>
            <p>NINEA: 010864694/1D1 - RRCM: SN DKR 2023 A 53039 (Sénégal)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProformaTemplate;
