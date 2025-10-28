import React, { useMemo, useState, useEffect } from 'react';
import { BASE_PRODUCTS, PRODUCT_NAMES } from '../../config/products';
import { getAllProducts, isProductHidden } from '../../services/productService';
import { trackProductView, trackButtonClick } from '../../config/analytics';
import { Container, SectionTitle, Badge, Button } from '../ui';
import ProductSpecsModal from '../products/ProductSpecsModal';

/**
 * Products Page Component
 * Displays product catalog with filtering and inquiry options
 */
function Products({ t, lang, onOpenForm }) {
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [specProductKey, setSpecProductKey] = useState(null);
  const [specProductName, setSpecProductName] = useState('');
  const [customProducts, setCustomProducts] = useState([]);

  // Charger les produits personnalisés
  useEffect(() => {
    setCustomProducts(getAllProducts());
  }, []);

  const products = useMemo(() => {
    // Produits de base (non masqués)
    const base = BASE_PRODUCTS
      .filter((p) => !isProductHidden(p.key))
      .map((p) => ({
        ...p,
        name: PRODUCT_NAMES[lang][p.key],
        cat: lang === "fr" ? p.catFR : p.catEN,
      }));
    
    // Produits personnalisés (non masqués)
    const custom = customProducts
      .filter((p) => !isProductHidden(p.key))
      .map((p) => ({
        ...p,
        id: p.id || Date.now(),
        name: p[`name${lang === "fr" ? "FR" : "EN"}`] || p.key,
        cat: lang === "fr" ? p.catFR : p.catEN,
      }));
    
    return [...base, ...custom];
  }, [lang, customProducts]);

  const getOriginColor = (origin) => {
    const colorMap = {
      "Senegal": "green",
      "Africa": "blue", 
      "Canada": "amber",
      "Asia": "purple"
    };
    return colorMap[origin] || "green";
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
                    onClick={() => {
                      setSpecProductKey(product.key);
                      setSpecProductName(product.name);
                      setSpecModalOpen(true);
                      trackButtonClick(`view_specs_${product.key}`);
                    }}
                  >
                    {lang === 'fr' ? 'Voir spécifications' : 'View specifications'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Product Specs Modal */}
      <ProductSpecsModal
        isOpen={specModalOpen}
        onClose={() => setSpecModalOpen(false)}
        productKey={specProductKey}
        productName={specProductName}
        lang={lang}
      />
    </div>
  );
}

export default Products;
