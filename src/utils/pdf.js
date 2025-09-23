// Simple helper for consistent html2pdf usage + print safety
export function saveElementAsPDF(el, filename = 'document.pdf') {
  const opt = {
    margin:       [10, 10, 10, 10],           // mm
    filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'] }, // respects .page-break rules
  };
  return window.html2pdf().set(opt).from(el).save();
}

export async function elementToPdfBlob(el) {
  const opt = {
    margin: [10,10,10,10],
    image: { type:'jpeg', quality:0.98 },
    html2canvas: { scale:2, useCORS:true },
    jsPDF: { unit:'mm', format:'a4', orientation:'portrait' },
    pagebreak: { mode:['css','legacy'] },
  };
  return await window.html2pdf().set(opt).from(el).outputPdf('blob');
}

export const printStyles = `
@media print {
  .no-print { display: none !important; }
  .avoid-break-inside { break-inside: avoid; page-break-inside: avoid; }
  .page-break { page-break-before: always; break-before: page; }
  .pb-safe { padding-bottom: 8mm; }
}
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;


