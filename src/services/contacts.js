// Service de contact simplifié sans Firebase
export async function saveContactRequest(payload) {
  // Simulation d'enregistrement (remplacer par votre logique)
  console.log('Contact request saved:', payload);
  
  // Ici vous pouvez ajouter votre logique d'enregistrement
  // Par exemple : envoi d'email, sauvegarde locale, etc.
  
  return { success: true, id: Date.now() };
}

// Compat pour ton Contact.jsx
export const saveContact = saveContactRequest;