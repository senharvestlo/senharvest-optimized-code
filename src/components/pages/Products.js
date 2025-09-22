import React, { useMemo, useState, useEffect } from 'react';
import { BASE_PRODUCTS, PRODUCT_NAMES } from '../../config/products';
import { trackProductView, trackButtonClick } from '../../config/analytics';
import { Container, SectionTitle, Badge, Button, Input, Textarea, Select } from '../ui';
import { getSpecs } from '../../services/productSpecsService';

/**
 * Products Page Component
 * Displays product catalog with filtering and inquiry options
 */
function Products({ t, lang, onOpenForm }) {
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [specProduct, setSpecProduct] = useState(null);
  const [specList, setSpecList] = useState([]);

  const products = useMemo(() =>
    BASE_PRODUCTS.map((p) => ({
      ...p,
      name: PRODUCT_NAMES[lang][p.key],
      cat: lang === "fr" ? p.catFR : p.catEN,
    })),
    [lang]
  );

  useEffect(() => {}, []);

  const getOriginColor = (origin) => {
    const colorMap = {
      "Senegal": "green",
      "Africa": "blue", 
      "Canada": "amber",
      "Asia": "purple"
    };
    return colorMap[origin] || "green";
  };

  const openSpecs = (product) => {
    const specs = getSpecs(product.key);
    setSpecList(specs);
    setSpecProduct(product);
    setSpecModalOpen(true);
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
                    onClick={() => openSpecs(product)}
                  >
                    {lang === 'fr' ? 'Voir spécifications' : 'View specifications'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Specs Modal */}
      {specModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {lang === 'fr' ? 'Spécifications' : 'Specifications'} — {specProduct?.name}
                </h3>
                <button
                  onClick={() => setSpecModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {specList.length === 0 ? (
                <p className="text-sm text-gray-500">
                  {lang === 'fr' ? 'Spécifications à venir.' : 'Specifications coming soon.'}
                </p>
              ) : (
                <ul className="divide-y">
                  {specList.map((s, i) => (
                    <li key={i} className="py-2 text-sm">
                      <span className="font-medium">{s.label} :</span>{" "}
                      <span className="text-gray-700">{s.value}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 text-right">
                <button
                  onClick={() => setSpecModalOpen(false)}
                  className="inline-flex items-center rounded-md border px-4 py-2"
                >
                  {lang === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
