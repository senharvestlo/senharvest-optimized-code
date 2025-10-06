import html2pdf from 'html2pdf.js';

// attend qu'images & fonts soient prêtes
function waitForAssets(root) {
  const imgs = Array.from(root.querySelectorAll('img')).filter(i => !i.complete);
  const promises = imgs.map(img => new Promise(res => { img.addEventListener('load', res); img.addEventListener('error', res); }));
  return Promise.all(promises);
}

// éviter about:blank et PDF vide
export async function downloadCleanPDF(node, filename) {
  if (!node) throw new Error('PDF node missing');
  await waitForAssets(node);

  // micro-rafraîchissement DOM
  await new Promise(r => setTimeout(r, 0));

  const opt = {
    margin: [10, 10, 14, 10], // top,right,bottom,left (mm)
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  // évite l'ouverture d'une fenêtre: utilise .save() direct
  return html2pdf().set(opt).from(node).save();
}

// Version qui retourne un blob (pour compatibilité avec les anciens services)
export async function elementToPdfBlob(node, filename, customOpts = {}) {
  if (!node) throw new Error('PDF node missing');
  await waitForAssets(node);

  // micro-rafraîchissement DOM
  await new Promise(r => setTimeout(r, 0));

  const defaultOpts = {
    margin: [10, 10, 14, 10], // top,right,bottom,left (mm)
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  const opt = { ...defaultOpts, ...customOpts };
  
  // Retourne un blob au lieu de sauvegarder
  return html2pdf().set(opt).from(node).outputPdf();
}