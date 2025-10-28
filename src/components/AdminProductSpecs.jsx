import React, { useEffect, useMemo, useState } from "react";
import { BASE_PRODUCTS, PRODUCT_NAMES } from "../config/products";
import { getSpecs, setSpecs, listAllSpecs } from "../services/productSpecsService";
import {
  getAllProducts,
  addCustomProduct,
  updateCustomProduct,
  deleteCustomProduct,
  imageToBase64,
  isValidImageFile,
  productKeyExists,
} from "../services/productService";

export default function AdminProductSpecs({ lang = "fr" }) {
  const [activeTab, setActiveTab] = useState("specs"); // "specs" ou "products"
  const [customProducts, setCustomProducts] = useState([]);

  // Charger les produits personnalisés
  useEffect(() => {
    setCustomProducts(getAllProducts());
  }, []);

  // Combiner BASE_PRODUCTS et produits personnalisés
  const allProducts = useMemo(
    () => {
      const baseProducts = BASE_PRODUCTS.map((p) => ({
        ...p,
        displayName: PRODUCT_NAMES[lang]?.[p.key] || p.key,
        isCustom: false,
      }));
      const custom = customProducts.map((p) => ({
        ...p,
        displayName: p[`name${lang === "fr" ? "FR" : "EN"}`] || p.key,
        isCustom: true,
      }));
      return [...baseProducts, ...custom];
    },
    [lang, customProducts]
  );

  const [selectedKey, setSelectedKey] = useState(allProducts[0]?.key || "");
  const [specs, setSpecsState] = useState([]);
  const [savedMap, setSavedMap] = useState({});

  useEffect(() => {
    setSavedMap(listAllSpecs());
  }, []);

  useEffect(() => {
    if (!selectedKey) return;
    setSpecsState(getSpecs(selectedKey));
  }, [selectedKey]);

  // Recharger les produits quand ils changent
  useEffect(() => {
    if (activeTab === "products") {
      setCustomProducts(getAllProducts());
    }
  }, [activeTab]);

  const addRow = () => setSpecsState((arr) => [...arr, { label: "", value: "" }]);

  const updateRow = (idx, field, val) =>
    setSpecsState((arr) => {
      const cp = [...arr];
      cp[idx] = { ...cp[idx], [field]: val };
      return cp;
    });

  const removeRow = (idx) => setSpecsState((arr) => arr.filter((_, i) => i !== idx));

  const moveRow = (idx, dir) =>
    setSpecsState((arr) => {
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return arr;
      const cp = [...arr];
      [cp[idx], cp[j]] = [cp[j], cp[idx]];
      return cp;
    });

  const save = () => {
    setSpecs(selectedKey, specs);
    setSavedMap(listAllSpecs());
  };

  // ===== GESTION DES PRODUITS =====
  const [newProduct, setNewProduct] = useState({
    nameFR: "",
    nameEN: "",
    key: "",
    origin: "Senegal",
    catFR: "",
    catEN: "",
    price: "Demande de quotation FOB/CIF",
    moq: "",
    img: "",
    imgFile: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      alert(lang === "fr" ? "Veuillez sélectionner un fichier image valide." : "Please select a valid image file.");
      return;
    }
    try {
      const base64 = await imageToBase64(file);
      setImagePreview(base64);
      if (editingProduct) {
        setEditingProduct({ ...editingProduct, img: base64, imgFile: file });
      } else {
        setNewProduct({ ...newProduct, img: base64, imgFile: file });
      }
    } catch (error) {
      console.error("Erreur lors de la conversion de l'image:", error);
      alert(lang === "fr" ? "Erreur lors du chargement de l'image." : "Error loading image.");
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.nameFR && !newProduct.nameEN) {
      alert(lang === "fr" ? "Veuillez saisir au moins un nom (FR ou EN)." : "Please enter at least one name (FR or EN).");
      return;
    }
    if (!newProduct.img) {
      alert(lang === "fr" ? "Veuillez ajouter une image pour le produit." : "Please add an image for the product.");
      return;
    }
    const key = newProduct.key || newProduct.nameFR.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (productKeyExists(key)) {
      alert(lang === "fr" ? `La clé "${key}" existe déjà. Veuillez en choisir une autre.` : `Key "${key}" already exists. Please choose another.`);
      return;
    }
    const product = addCustomProduct({ ...newProduct, key });
    setCustomProducts(getAllProducts());
    setNewProduct({
      nameFR: "",
      nameEN: "",
      key: "",
      origin: "Senegal",
      catFR: "",
      catEN: "",
      price: "Demande de quotation FOB/CIF",
      moq: "",
      img: "",
      imgFile: null,
    });
    setImagePreview(null);
    alert(lang === "fr" ? "Produit ajouté avec succès!" : "Product added successfully!");
  };

  const handleUpdateProduct = () => {
    if (!editingProduct.nameFR && !editingProduct.nameEN) {
      alert(lang === "fr" ? "Veuillez saisir au moins un nom (FR ou EN)." : "Please enter at least one name (FR or EN).");
      return;
    }
    updateCustomProduct(editingProduct.id, editingProduct);
    setCustomProducts(getAllProducts());
    setEditingProduct(null);
    setImagePreview(null);
    alert(lang === "fr" ? "Produit modifié avec succès!" : "Product updated successfully!");
  };

  const handleDeleteProduct = (productId) => {
    if (!window.confirm(lang === "fr" ? "Êtes-vous sûr de vouloir supprimer ce produit?" : "Are you sure you want to delete this product?")) {
      return;
    }
    deleteCustomProduct(productId);
    setCustomProducts(getAllProducts());
    alert(lang === "fr" ? "Produit supprimé avec succès!" : "Product deleted successfully!");
  };

  const startEditProduct = (product) => {
    setEditingProduct({ ...product });
    setImagePreview(product.img || null);
  };

  const selected = allProducts.find((p) => p.key === selectedKey);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        {lang === "fr" ? "Admin — Gestion des Produits" : "Admin — Product Management"}
      </h1>

      {/* Onglets */}
      <div className="border-b flex gap-4">
        <button
          onClick={() => setActiveTab("products")}
          className={`py-2 px-4 border-b-2 ${activeTab === "products" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"}`}
        >
          {lang === "fr" ? "📦 Produits" : "📦 Products"}
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`py-2 px-4 border-b-2 ${activeTab === "specs" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"}`}
        >
          {lang === "fr" ? "📋 Spécifications" : "📋 Specifications"}
        </button>
      </div>

      {/* Onglet Produits */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Formulaire d'ajout/modification */}
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct
                ? lang === "fr" ? "Modifier le produit" : "Edit product"
                : lang === "fr" ? "Ajouter un nouveau produit" : "Add new product"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom FR</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editingProduct?.nameFR || newProduct.nameFR}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, nameFR: e.target.value })
                      : setNewProduct({ ...newProduct, nameFR: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom EN</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editingProduct?.nameEN || newProduct.nameEN}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, nameEN: e.target.value })
                      : setNewProduct({ ...newProduct, nameEN: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Clé (key) - Optionnel</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editingProduct?.key || newProduct.key}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, key: e.target.value })
                      : setNewProduct({ ...newProduct, key: e.target.value })
                  }
                  placeholder="auto-généré si vide"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Origine</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editingProduct?.origin || newProduct.origin}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, origin: e.target.value })
                      : setNewProduct({ ...newProduct, origin: e.target.value })
                  }
                >
                  <option value="Senegal">Sénégal</option>
                  <option value="Africa">Afrique</option>
                  <option value="Canada">Canada</option>
                  <option value="Asia">Asie</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie FR</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editingProduct?.catFR || newProduct.catFR}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, catFR: e.target.value })
                      : setNewProduct({ ...newProduct, catFR: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie EN</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editingProduct?.catEN || newProduct.catEN}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, catEN: e.target.value })
                      : setNewProduct({ ...newProduct, catEN: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prix</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editingProduct?.price || newProduct.price}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, price: e.target.value })
                      : setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">MOQ (Minimum Order Quantity)</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editingProduct?.moq || newProduct.moq}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, moq: e.target.value })
                      : setNewProduct({ ...newProduct, moq: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Image du produit</label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                onChange={handleImageSelect}
              />
              {(imagePreview || editingProduct?.img || newProduct.img) && (
                <div className="mt-2">
                  <img
                    src={imagePreview || editingProduct?.img || newProduct.img}
                    alt="Preview"
                    className="max-w-xs h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              {editingProduct ? (
                <>
                  <button
                    onClick={handleUpdateProduct}
                    className="rounded-md bg-blue-600 text-white px-4 py-2"
                  >
                    {lang === "fr" ? "Enregistrer les modifications" : "Save changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setImagePreview(null);
                    }}
                    className="rounded-md border px-4 py-2"
                  >
                    {lang === "fr" ? "Annuler" : "Cancel"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddProduct}
                  className="rounded-md bg-green-600 text-white px-4 py-2"
                >
                  {lang === "fr" ? "Ajouter le produit" : "Add product"}
                </button>
              )}
            </div>
          </div>

          {/* Liste des produits personnalisés */}
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4">
              {lang === "fr" ? "Produits personnalisés" : "Custom products"}
            </h2>
            {customProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                {lang === "fr" ? "Aucun produit personnalisé." : "No custom products."}
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    {product.img && (
                      <img src={product.img} alt={product.nameFR} className="w-full h-32 object-cover rounded mb-2" />
                    )}
                    <h3 className="font-semibold">{product[`name${lang === "fr" ? "FR" : "EN"}`] || product.key}</h3>
                    <p className="text-sm text-gray-600">{product.origin}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => startEditProduct(product)}
                        className="text-sm rounded-md border px-3 py-1"
                      >
                        {lang === "fr" ? "Modifier" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-sm rounded-md border border-red-300 text-red-600 px-3 py-1"
                      >
                        {lang === "fr" ? "Supprimer" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onglet Spécifications */}
      {activeTab === "specs" && (
        <>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">{lang === "fr" ? "Produit" : "Product"}</span>
          <select
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            {allProducts.map((p) => (
              <option key={p.key} value={p.key}>
                {p.displayName} {p.isCustom ? "(Personnalisé)" : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="text-sm text-gray-500 self-end">
          {lang === "fr" ? "Dernière mise à jour :" : "Last updated:"} {savedMap[selectedKey]?.updatedAt ? new Date(savedMap[selectedKey].updatedAt).toLocaleString() : "—"}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium">{lang === "fr" ? "Lignes de spécifications" : "Specification lines"}</p>
          <button onClick={addRow} className="rounded-md border px-3 py-1.5">+ {lang === "fr" ? "Ajouter" : "Add"}</button>
        </div>

        {specs.length === 0 ? (
          <p className="text-sm text-gray-500">{lang === "fr" ? "Aucune spécification. Cliquez sur “Ajouter”." : "No specification yet. Click “Add”."}</p>
        ) : (
          <div className="space-y-2">
            {specs.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-2 items-center">
                <input
                  className="rounded-md border border-gray-300 px-3 py-2"
                  placeholder={lang === "fr" ? "Libellé (ex: Qualité)" : "Label (e.g., Quality)"}
                  value={row.label}
                  onChange={(e) => updateRow(idx, "label", e.target.value)}
                />
                <input
                  className="rounded-md border border-gray-300 px-3 py-2"
                  placeholder={lang === "fr" ? "Valeur (ex: moisture ≤ 8%)" : "Value (e.g., moisture ≤ 8%)"}
                  value={row.value}
                  onChange={(e) => updateRow(idx, "value", e.target.value)}
                />
                <div className="flex gap-2">
                  <button className="rounded-md border px-2 py-1" onClick={() => moveRow(idx, -1)}>↑</button>
                  <button className="rounded-md border px-2 py-1" onClick={() => moveRow(idx, +1)}>↓</button>
                  <button className="rounded-md border border-red-300 text-red-600 px-2 py-1" onClick={() => removeRow(idx)}>
                    {lang === "fr" ? "Supprimer" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button onClick={save} className="rounded-md bg-gray-900 text-white px-4 py-2">{lang === "fr" ? "Enregistrer" : "Save"}</button>
          <button onClick={() => setSpecsState(getSpecs(selectedKey))} className="rounded-md border px-4 py-2">{lang === "fr" ? "Annuler les modifications" : "Discard changes"}</button>
        </div>
      </div>

      {selected && (
        <div className="text-xs text-gray-500">
          <p>
            <strong>{lang === "fr" ? "Aperçu :" : "Preview:"}</strong> {selected.displayName} — {selected.origin}
          </p>
        </div>
      )}
      </>
      )}
    </div>
  );
}


