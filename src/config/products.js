/**
 * Products Configuration
 * Customize your product catalog here
 */

export const BASE_PRODUCTS = [
  { 
    id: 1, 
    key: "peanuts", 
    origin: "Senegal", 
    catFR: "Oléagineux", 
    catEN: "Oilseeds", 
    img: "/arachidee.png", 
    price: "Demande de quotation FOB/CIF", 
    moq: "10 t" 
  },
  { 
    id: 2, 
    key: "cashew", 
    origin: "Africa", 
    catFR: "Fruits secs", 
    catEN: "Nuts", 
    img: "/cashew.png", 
    price: "Demande de quotation FOB/CIF", 
    moq: "5 t" 
  },
  { 
    id: 11, 
    key: "cashewWW", 
    origin: "Asia", 
    catFR: "Fruits secs", 
    catEN: "Nuts", 
    img: "/cashew1.jpg", 
    price: "Demande de quotation FOB/CIF", 
    moq: "5 t" 
  },
  { 
    id: 3, 
    key: "sesame", 
    origin: "Africa", 
    catFR: "Graines", 
    catEN: "Seeds", 
    img: "/sesame.png", 
    price: "Demande de quotation FOB/CIF", 
    moq: "8 t" 
  },
  { 
    id: 4, 
    key: "cocoa", 
    origin: "Africa", 
    catFR: "Fèves", 
    catEN: "Beans", 
    img: "/cacoa.png", 
    price: "Demande de quotation FOB/CIF", 
    moq: "15 t" 
  },
  { 
    id: 5, 
    key: "mango", 
    origin: "Senegal", 
    catFR: "Fruits", 
    catEN: "Fruits", 
    img: "/mangue.png", 
    price: "Demande de quotation FOB/CIF", 
    moq: "5 t" 
  },
  { 
    id: 6, 
    key: "pulses", 
    origin: "Canada", 
    catFR: "Légumineuses", 
    catEN: "Pulses", 
    img: "/pois.png", 
    price: "Demande de quotation FOB/CIF", 
    moq: "10 t" 
  },
  { 
    id: 7, 
    key: "flour", 
    origin: "Canada", 
    catFR: "Céréales", 
    catEN: "Grains", 
    img: "/farine.png", 
    price: "Demande de quotation FOB/CIF", 
    moq: "15 t" 
  },
  { 
    id: 9, 
    key: "canola", 
    origin: "Canada", 
    catFR: "Huiles", 
    catEN: "Oils", 
    img: "/huile.png", 
    price: "Demande de quotation FOB/CIF", 
    moq: "20 t" 
  },
  { 
    id: 10, 
    key: "rice", 
    origin: "Asia", 
    catFR: "Céréales", 
    catEN: "Grains", 
    img: "/rice.jpg", 
    price: "Demande de quotation FOB/CIF", 
    moq: "20-25 t" 
  },
];

// Product name translations
export const PRODUCT_NAMES = {
  fr: {
    peanuts: "Arachides",
    cashew: "Noix de cajou brut (d'Afrique)",
    cashewWW: "Noix de cajou WW (all types)",
    sesame: "Sésame",
    cocoa: "Cacao",
    mango: "Mangue Kent",
    pulses: "Légumineuses",
    flour: "Farine de blé",
    canola: "Huile de canola",
    rice: "Riz brisé, Parfumé ou Basmati",
  },
  en: {
    peanuts: "Peanuts",
    cashew: "Raw cashew nuts (Africa)",
    cashewWW: "Cashew nuts WW (all types)",
    sesame: "Sesame",
    cocoa: "Cocoa beans",
    mango: "Kent Mango",
    pulses: "Pulses",
    flour: "Wheat flour",
    canola: "Canola oil",
    rice: "Broken, Fragrant or Basmati Rice",
  },
};
