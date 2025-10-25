// Service de documents simplifié sans Firebase
export async function listDocs(type) {
  // Simulation de liste de documents
  console.log('Listing docs for type:', type);
  return [];
}

export async function getDocById(type, id) {
  // Simulation de récupération de document
  console.log('Getting doc:', type, id);
  return null;
}

export async function createDoc(type, data) {
  // Simulation de création de document
  console.log('Creating doc:', type, data);
  return { id: Date.now() };
}

export async function updateDocById(type, id, data) {
  // Simulation de mise à jour de document
  console.log('Updating doc:', type, id, data);
}

export async function deleteDocById(type, id) {
  // Simulation de suppression de document
  console.log('Deleting doc:', type, id);
}

// Compat (là où ton code appelait "saveDoc")
export async function saveDoc(type, id, data) {
  if (!id) {
    const res = await createDoc(type, data);
    return res;
  }
  await updateDocById(type, id, data);
  return { id };
}