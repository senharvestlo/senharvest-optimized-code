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
  phoneCA: process.env.REACT_APP_PHONE_CA || "+18193198464",
  email: process.env.REACT_APP_EMAIL || "manager@senharvest.com",
  whatsApp: process.env.REACT_APP_WHATSAPP || "+221776340064",
  addressFR: "USA • Sénégal • Canada",
  addressEN: "USA • Senegal • Canada",
  logoSrc: "/senharvest-logo.png", // Your custom logo
  domain: "xidmaharvest.com",
};

// Indicative price label (compliance)
export const INDICATIVE_NOTE = {
  fr: "Prix indicatifs (non contractuels). Demandez un devis ferme FOB/CIF.",
  en: "Indicative prices (non-binding). Request a firm FOB/CIF quote.",
};
