/**
 * Email Service Utility Functions
 * Handles email sending using EmailJS
 */

// EmailJS imports removed as they are not used
import { EMAIL_CONFIG as SIMPLE_EMAIL_CONFIG } from '../config/email';

/**
 * Sends email using EmailJS (if configured) or fallback to mailto
 * @param {Object} formData - Form data object
 * @returns {Promise} - Email sending promise
 */
export async function sendEmail(formData) {
  // For now, always use the fallback method since EmailJS is not configured
  console.log('Using mailto fallback for email sending');
  sendEmailFallback(formData);
  return { status: 'mailto_sent' };
}

/**
 * Fallback: Sends email using mailto link
 * @param {Object} formData - Form data object
 */
export function sendEmailFallback(formData) {
  const subject = encodeURIComponent(`[SenHarvest] ${formData.subject}`);
  const body = encodeURIComponent(`
Nouvelle demande de contact - SenHarvest Group

INFORMATIONS CLIENT:
Nom: ${formData.name}
Email: ${formData.email}
Téléphone: ${formData.phone}

DÉTAILS DE LA DEMANDE:
Sujet: ${formData.subject}
Quantité: ${formData.quantity}
Destination: ${formData.destination}
Incoterm: ${formData.incoterm}
Mode de paiement: ${formData.payment}

MESSAGE:
${formData.message}

---
Email envoyé depuis le site web SenHarvest Group
Date: ${new Date().toLocaleString('fr-FR')}
  `);
  
  const mailtoLink = `mailto:${SIMPLE_EMAIL_CONFIG.toEmail}?subject=${subject}&body=${body}`;
  window.open(mailtoLink);
}
