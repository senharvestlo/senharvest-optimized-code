// Stockage local (peut être migré vers Firestore plus tard)
const LS_KEY = "senharvest_product_specs_v1";

/** Retourne l'objet complet { [productKey]: {specs: [{label, value}], updatedAt} } */
function _readAll() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function _writeAll(map) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch {}
}

/** Récupère les specs pour un produit (array de {label, value}) */
export function getSpecs(productKey) {
  const all = _readAll();
  return all[productKey]?.specs || [];
}

/** Sauvegarde (remplace) les specs d’un produit */
export function setSpecs(productKey, specsArray) {
  const all = _readAll();
  all[productKey] = {
    specs: (specsArray || []).filter(
      (s) => s && String(s.label || "").trim() && String(s.value || "").trim()
    ),
    updatedAt: new Date().toISOString(),
  };
  _writeAll(all);
}

/** Liste toutes les specs enregistrées (pour l’admin) */
export function listAllSpecs() {
  return _readAll();
}


