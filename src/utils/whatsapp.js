import { COMPANY } from '../config/company';

/**
 * WhatsApp Utility Functions
 * Handles WhatsApp link generation and encoding
 */

/**
 * Encodes text for WhatsApp URL
 * @param {string} text - Text to encode
 * @returns {string} - Encoded WhatsApp URL
 */
export function encodeWA(text) {
  return `https://wa.me/${COMPANY.whatsApp.replace(/[^+\d]/g, "")}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates WhatsApp message for product inquiry
 * @param {string} lang - Language code ('fr' or 'en')
 * @param {string} productName - Name of the product (optional)
 * @returns {string} - WhatsApp URL with pre-filled message
 */
export function generateProductInquiry(lang, productName = '') {
  const baseMessage = lang === 'fr'
    ? `${COMPANY.name}: Bonjour, je souhaite des informations sur vos produits.`
    : `${COMPANY.name}: Hello, I'd like information about your products.`;
  
  const message = productName 
    ? `${baseMessage} ${lang === 'fr' ? 'Spécifiquement pour:' : 'Specifically for:'} ${productName}`
    : baseMessage;
    
  return encodeWA(message);
}

/**
 * Generates WhatsApp message for general inquiry
 * @param {string} lang - Language code ('fr' or 'en')
 * @returns {string} - WhatsApp URL with pre-filled message
 */
export function generateGeneralInquiry(lang) {
  const message = lang === 'fr'
    ? `${COMPANY.name}: Bonjour, je souhaite des informations sur vos services.`
    : `${COMPANY.name}: Hello, I'd like information about your services.`;
    
  return encodeWA(message);
}
