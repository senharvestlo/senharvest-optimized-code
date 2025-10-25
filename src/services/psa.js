// Service PSA simplifié sans Firebase
const KIND = 'psa';

export async function listPSA({ max=200 } = {}) {
  console.log('Listing PSA documents');
  return [];
}

export async function createPSA(data) {
  console.log('Creating PSA:', data);
  return { id: Date.now() };
}

export async function getPSA(id) {
  console.log('Getting PSA:', id);
  return null;
}

export async function updatePSA(id, data) {
  console.log('Updating PSA:', id, data);
}

export async function deletePSA(id) {
  console.log('Deleting PSA:', id);
}

// Compat
export const savePSA = async (id, data) => {
  if (!id) return createPSA(data);
  await updatePSA(id, data);
  return { id };
};