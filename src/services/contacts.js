/**
 * Service de contact utilisant EmailJS
 * Envoie les formulaires de contact directement par email
 */
import emailjs from '@emailjs/browser';

// Configuration EmailJS
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_ykhg5ox';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_1sh586m';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'oa2dvrH8lCJf974vD';

/**
 * Sauvegarde une demande de contact et envoie un email
 * @param {Object} payload - Données du formulaire de contact
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export async function saveContactRequest(payload) {
  console.log('📧 Envoi de la demande de contact via EmailJS...', payload);
  
  try {
    // Préparer les données pour EmailJS
    // 🔥 EmailJS requires SPECIFIC variable names
    const emailData = {
      from_name: payload.name || 'Utilisateur anonyme',
      from_email: payload.email || '',
      phone: payload.phone || '',
      subject: payload.subject || 'Nouvelle demande de contact',
      quantity: payload.quantity || '',
      destination: payload.destination || '',
      incoterm: payload.incoterm || '',
      payment: payload.payment || '',
      message: payload.message || '',
    };

    // Envoyer via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailData,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Email envoyé avec succès:', response);
    
    return { 
      success: true, 
      id: Date.now(),
      status: response.status,
      message: 'Email envoyé avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    // Fallback : sauvegarder dans localStorage en cas d'échec
    try {
      const savedRequests = JSON.parse(localStorage.getItem('senharvest_contact_requests') || '[]');
      savedRequests.push({
        ...payload,
        timestamp: new Date().toISOString(),
        error: true
      });
      localStorage.setItem('senharvest_contact_requests', JSON.stringify(savedRequests));
      console.log('📦 Demande sauvegardée localement en fallback');
    } catch (storageError) {
      console.error('❌ Impossible de sauvegarder localement:', storageError);
    }
    
    throw new Error('Erreur lors de l\'envoi. Veuillez réessayer plus tard.');
  }
}

// Compat pour Contact.jsx
export const saveContact = saveContactRequest;