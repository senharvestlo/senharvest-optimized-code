/* utils/pdfExport.js
 * Export propre d'un conteneur HTML en PDF (A4) + Impression via IFRAME (évite about:blank)
 */

export function exportHtmlToPdf(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el || !window.html2pdf) {
    console.error('html2pdf not loaded or element not found');
    return;
  }

  // Évite les coupures de blocs
  el.querySelectorAll('.pdf-avoid-break').forEach(n => {
    n.style.breakInside = 'avoid';
    n.style.pageBreakInside = 'avoid';
  });

  window.html2pdf().set({
    margin: [10, 10, 12, 10], // mm
    filename: filename || 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }).from(el).save();
}

export async function previewPdf(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el || !window.html2pdf) {
    console.error('html2pdf not loaded or element not found');
    return null;
  }

  // Évite les coupures de blocs
  el.querySelectorAll('.pdf-avoid-break').forEach(n => {
    n.style.breakInside = 'avoid';
    n.style.pageBreakInside = 'avoid';
  });

  const opt = {
    margin: [10, 10, 12, 10],
    filename: filename || 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  // Génère le PDF et retourne le blob
  const pdf = await window.html2pdf().set(opt).from(el).toPdf().get('pdf');
  const blob = pdf.output('blob');
  
  // Crée une URL pour le blob
  const url = URL.createObjectURL(blob);
  
  return { url, blob, filename };
}
