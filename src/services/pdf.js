import html2pdf from 'html2pdf.js';

export function downloadElementAsPDF(el, filename, { margin = 0.5, format = 'a4', orientation = 'portrait' } = {}) {
  const opt = {
    margin,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'cm', format, orientation },
  };
  return html2pdf().set(opt).from(el).save();
}
