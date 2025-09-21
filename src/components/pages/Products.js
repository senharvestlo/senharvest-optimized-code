import React, { useMemo, useState, useEffect } from 'react';
import { BASE_PRODUCTS, PRODUCT_NAMES } from '../../config/products';
import { trackProductView, trackButtonClick } from '../../config/analytics';
import { Container, SectionTitle, Badge, Button, Input, Textarea, Select } from '../ui';

/**
 * Products Page Component
 * Displays product catalog with filtering and inquiry options
 */
function Products({ t, lang, onOpenForm }) {
  const [showReferenceForm, setShowReferenceForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [referenceData, setReferenceData] = useState({
    supplier: '',
    buyer: '',
    specifications: '',
    quantity: '',
    quality: '',
    delivery: '',
    notes: ''
  });
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  const products = useMemo(() =>
    BASE_PRODUCTS.map((p) => ({
      ...p,
      name: PRODUCT_NAMES[lang][p.key],
      cat: lang === "fr" ? p.catFR : p.catEN,
    })),
    [lang]
  );

  useEffect(() => {
    // Load suppliers and buyers from localStorage
    const savedSuppliers = localStorage.getItem('sourcing_suppliers');
    const savedBuyers = localStorage.getItem('sourcing_buyers');
    
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
    if (savedBuyers) setBuyers(JSON.parse(savedBuyers));
  }, []);

  const getOriginColor = (origin) => {
    const colorMap = {
      "Senegal": "green",
      "Africa": "blue", 
      "Canada": "amber",
      "Asia": "purple"
    };
    return colorMap[origin] || "green";
  };

  const handleReferenceClick = (product) => {
    setSelectedProduct(product);
    setShowReferenceForm(true);
    setReferenceData({
      supplier: '',
      buyer: '',
      specifications: '',
      quantity: '',
      quality: '',
      delivery: '',
      notes: ''
    });
  };

  const handleReferenceSubmit = (e) => {
    e.preventDefault();
    
    // Save reference data to localStorage
    const referenceKey = `product_reference_${selectedProduct.key}`;
    const existingReferences = JSON.parse(localStorage.getItem(referenceKey) || '[]');
    
    const newReference = {
      id: Date.now(),
      product: selectedProduct,
      ...referenceData,
      createdAt: new Date().toISOString()
    };
    
    existingReferences.push(newReference);
    localStorage.setItem(referenceKey, JSON.stringify(existingReferences));
    
    // Reset form
    setShowReferenceForm(false);
    setSelectedProduct(null);
    setReferenceData({
      supplier: '',
      buyer: '',
      specifications: '',
      quantity: '',
      quality: '',
      delivery: '',
      notes: ''
    });
    
    alert(lang === 'fr' ? 'Référence ajoutée avec succès !' : 'Reference added successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReferenceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="relative py-20 px-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/LOGO SenHarvest.png')"
        }}
      ></div>
      
      <Container className="relative z-10">
        <SectionTitle title={t.productsTitle} subtitle={t.productsDesc} />
        <p className="text-center text-xs text-gray-500 mb-6">{t.indicative}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                  <Badge color={getOriginColor(product.origin)}>
                    {product.origin}
                  </Badge>
                </div>
                
                <p className="text-gray-500 text-xs mb-1">{product.cat}</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-green-700 font-semibold">{product.price}</p>
                  <p className="text-gray-500">MOQ: {product.moq}</p>
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      trackProductView(product.name);
                      trackButtonClick(`product_request_${product.key}`);
                      onOpenForm(product.name);
                    }}
                  >
                    {lang === "fr" ? "Demander" : "Request"}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleReferenceClick(product)}
                  >
                    {lang === "fr" ? "Ajouter Référence" : "Add Reference"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Reference Form Modal */}
      {showReferenceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {lang === 'fr' ? 'Ajouter une Référence' : 'Add Reference'} - {selectedProduct?.name}
                </h3>
                <button
                  onClick={() => setShowReferenceForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleReferenceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === 'fr' ? 'Fournisseur/Producteur' : 'Supplier/Producer'}
                    </label>
                    <Select
                      name="supplier"
                      value={referenceData.supplier}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{lang === 'fr' ? 'Sélectionner un fournisseur' : 'Select supplier'}</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.name}>
                          {supplier.name} - {supplier.company} ({supplier.country})
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === 'fr' ? 'Acheteur' : 'Buyer'}
                    </label>
                    <Select
                      name="buyer"
                      value={referenceData.buyer}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{lang === 'fr' ? 'Sélectionner un acheteur' : 'Select buyer'}</option>
                      {buyers.map((buyer) => (
                        <option key={buyer.id} value={buyer.name}>
                          {buyer.name} - {buyer.company} ({buyer.country})
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="quantity"
                    label={lang === 'fr' ? 'Quantité' : 'Quantity'}
                    value={referenceData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="quality"
                    label={lang === 'fr' ? 'Qualité' : 'Quality'}
                    value={referenceData.quality}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === 'fr' ? 'Spécifications demandées par l\'acheteur' : 'Specifications requested by buyer'}
                  </label>
                  <Textarea
                    name="specifications"
                    value={referenceData.specifications}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder={lang === 'fr' ? 'Décrivez les spécifications détaillées...' : 'Describe detailed specifications...'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === 'fr' ? 'Conditions de livraison' : 'Delivery Terms'}
                  </label>
                  <Input
                    name="delivery"
                    value={referenceData.delivery}
                    onChange={handleInputChange}
                    placeholder={lang === 'fr' ? 'FOB, CIF, etc.' : 'FOB, CIF, etc.'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === 'fr' ? 'Notes additionnelles' : 'Additional Notes'}
                  </label>
                  <Textarea
                    name="notes"
                    value={referenceData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder={lang === 'fr' ? 'Informations complémentaires...' : 'Additional information...'}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    {lang === 'fr' ? 'Ajouter Référence' : 'Add Reference'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setShowReferenceForm(false)}
                    className="flex-1"
                  >
                    {lang === 'fr' ? 'Annuler' : 'Cancel'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
