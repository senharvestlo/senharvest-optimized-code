import React, { useEffect, useMemo, useState } from "react";
import { BASE_PRODUCTS, PRODUCT_NAMES } from "../config/products";
import { getSpecs, setSpecs, listAllSpecs } from "../services/productSpecsService";

export default function AdminProductSpecs({ lang = "fr" }) {
  const products = useMemo(
    () =>
      BASE_PRODUCTS.map((p) => ({
        ...p,
        displayName: PRODUCT_NAMES[lang]?.[p.key] || p.key,
      })),
    [lang]
  );

  const [selectedKey, setSelectedKey] = useState(products[0]?.key || "");
  const [specs, setSpecsState] = useState([]);
  const [savedMap, setSavedMap] = useState({});

  useEffect(() => {
    setSavedMap(listAllSpecs());
  }, []);

  useEffect(() => {
    if (!selectedKey) return;
    setSpecsState(getSpecs(selectedKey));
  }, [selectedKey]);

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

  const selected = products.find((p) => p.key === selectedKey);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        {lang === "fr" ? "Admin — Spécifications produits" : "Admin — Product Specifications"}
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">{lang === "fr" ? "Produit" : "Product"}</span>
          <select
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.key} value={p.key}>
                {p.displayName}
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
    </div>
  );
}


