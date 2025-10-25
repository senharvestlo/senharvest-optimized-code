// Service Product Specs simplifié sans Firebase
const KIND = 'productSpecs';

export function defaultSpec() {
  return {
    productKey: '',
    title: '',
    lang: 'fr',
    visible: true,
    sections: [
      { label: 'Qualité', items: [] },
      { label: 'Conditionnement', items: [] },
      { label: 'Origine', items: [] },
      { label: 'Inspection', items: [] },
    ],
    createdAt: null,
    updatedAt: null,
  };
}

export async function listSpecs({ max=200 } = {}) {
  console.log('Listing product specs');
  return [];
}

export async function getSpec(id) {
  console.log('Getting spec:', id);
  return null;
}

export async function createSpec(data) {
  console.log('Creating spec:', data);
  return { id: Date.now() };
}

export async function updateSpec(id, data) {
  console.log('Updating spec:', id, data);
}

export async function deleteSpec(id) {
  console.log('Deleting spec:', id);
}

// Compat
export const saveSpec = async (id, data) => {
  if (!id) return createSpec(data);
  await updateSpec(id, data);
  return { id };
};