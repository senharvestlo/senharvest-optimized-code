// Service NCNDA simplifié sans Firebase
const KIND = 'ncnda';

export async function listNCNDA({ max=200 } = {}) {
  console.log('Listing NCNDA documents');
  return [];
}

export async function createNCNDA(data) {
  console.log('Creating NCNDA:', data);
  return { id: Date.now() };
}

export async function getNCNDA(id) {
  console.log('Getting NCNDA:', id);
  return null;
}

export async function updateNCNDA(id, data) {
  console.log('Updating NCNDA:', id, data);
}

export async function deleteNCNDA(id) {
  console.log('Deleting NCNDA:', id);
}

// Compat
export const saveNCNDA = async (id, data) => {
  if (!id) return createNCNDA(data);
  await updateNCNDA(id, data);
  return { id };
};