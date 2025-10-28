/**
 * Product Management Service
 * Gestion locale des produits (localStorage)
 */

const LS_PRODUCTS_KEY = "senharvest_custom_products_v1";

/**
 * Lit tous les produits personnalisés depuis localStorage
 */
function _readCustomProducts() {
  try {
    const raw = localStorage.getItem(LS_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Écrit les produits personnalisés dans localStorage
 */
function _writeCustomProducts(products) {
  try {
    localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Erreur lors de la sauvegarde des produits:", e);
  }
}

/**
 * Génère un ID unique pour un nouveau produit
 */
function _generateId() {
  return Date.now();
}

/**
 * Génère une clé unique pour un nouveau produit à partir du nom
 */
function _generateKey(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Récupère tous les produits (BASE + personnalisés)
 */
export function getAllProducts() {
  const customProducts = _readCustomProducts();
  return customProducts;
}

/**
 * Ajoute un nouveau produit personnalisé
 */
export function addCustomProduct(product) {
  const customProducts = _readCustomProducts();
  const newProduct = {
    ...product,
    id: _generateId(),
    key: product.key || _generateKey(product.nameFR || product.nameEN || "product"),
    isCustom: true, // Marqueur pour différencier des produits BASE
  };
  customProducts.push(newProduct);
  _writeCustomProducts(customProducts);
  return newProduct;
}

/**
 * Met à jour un produit personnalisé
 */
export function updateCustomProduct(productId, updates) {
  const customProducts = _readCustomProducts();
  const index = customProducts.findIndex((p) => p.id === productId);
  if (index === -1) return null;
  customProducts[index] = { ...customProducts[index], ...updates };
  _writeCustomProducts(customProducts);
  return customProducts[index];
}

/**
 * Supprime un produit personnalisé
 */
export function deleteCustomProduct(productId) {
  const customProducts = _readCustomProducts();
  const filtered = customProducts.filter((p) => p.id !== productId);
  _writeCustomProducts(filtered);
  return true;
}

/**
 * Convertit un fichier image en base64
 */
export function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Valide qu'un fichier est une image
 */
export function isValidImageFile(file) {
  return file && file.type.startsWith("image/");
}

/**
 * Vérifie si une clé de produit existe déjà
 */
export function productKeyExists(key, excludeId = null) {
  const customProducts = _readCustomProducts();
  return customProducts.some((p) => p.key === key && p.id !== excludeId);
}

// ===== GESTION DES PRODUITS MASQUÉS =====
const LS_HIDDEN_PRODUCTS_KEY = "senharvest_hidden_products_v1";

/**
 * Lit la liste des clés de produits masqués
 */
function _readHiddenProducts() {
  try {
    const raw = localStorage.getItem(LS_HIDDEN_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Écrit la liste des produits masqués
 */
function _writeHiddenProducts(hiddenKeys) {
  try {
    localStorage.setItem(LS_HIDDEN_PRODUCTS_KEY, JSON.stringify(hiddenKeys));
  } catch (e) {
    console.error("Erreur lors de la sauvegarde des produits masqués:", e);
  }
}

/**
 * Masque un produit (par sa clé)
 */
export function hideProduct(productKey) {
  const hidden = _readHiddenProducts();
  if (!hidden.includes(productKey)) {
    hidden.push(productKey);
    _writeHiddenProducts(hidden);
  }
  return true;
}

/**
 * Affiche un produit masqué (par sa clé)
 */
export function showProduct(productKey) {
  const hidden = _readHiddenProducts();
  const filtered = hidden.filter((key) => key !== productKey);
  _writeHiddenProducts(filtered);
  return true;
}

/**
 * Vérifie si un produit est masqué
 */
export function isProductHidden(productKey) {
  const hidden = _readHiddenProducts();
  return hidden.includes(productKey);
}

/**
 * Récupère la liste des produits masqués
 */
export function getHiddenProducts() {
  return _readHiddenProducts();
}

