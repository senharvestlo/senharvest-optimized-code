/**
 * Company Configuration
 * Customize your company information here
 */

export const COMPANY = {
  name: "SenHarvest Group",
  short: "SH",
  taglineFR:
    "Nous sommes un cabinet d'intermédiation et de courtage en commodités agricoles, spécialisé dans l'export de produits du Sénégal (riz 100 % brisé parfumé, arachide, noix de cajou, sel, engrais…) et l'import de produits canadiens (farine de blé, légumineuses, huile de canola…).",
  taglineEN:
    "We are an agricultural commodities intermediation and brokerage firm, specialized in exporting products from Senegal (100% broken fragrant rice, peanuts, cashew nuts, salt, fertilizers...) and importing Canadian products (wheat flour, legumes, canola oil...).",
  phoneSN: process.env.REACT_APP_PHONE_SN || "+221776340064", // E.164 preferred
  phoneCA: "+18193198464",
  email: process.env.REACT_APP_EMAIL || "manager@senharvest.com",
  // Numéro WhatsApp utilisé par le bouton flottant (Sénégal)
  // Changez ici si vous souhaitez pointer vers un autre numéro
  whatsApp: process.env.REACT_APP_WHATSAPP || "+221776340064",
  addressFR: "USA • Sénégal • Canada",
  addressEN: "USA • Senegal • Canada",
  logoSrc: "/senharvest-logo.png", // Your custom logo
  domain: "xidmaharvest.com",
  // Informations d'entreprise pour les documents officiels
  businessId: "7688415 (USA)",
  ninea: "010864694/1D1",
  rrcm: "SN DKR 2023 A 53039 (Sénégal)",
  website: "www.senharvest.com"
};

// Indicative price label (compliance)
export const INDICATIVE_NOTE = {
  fr: "Prix indicatifs (non contractuels). Demandez un devis ferme FOB/CIF.",
  en: "Indicative prices (non-binding). Request a firm FOB/CIF quote.",
};
