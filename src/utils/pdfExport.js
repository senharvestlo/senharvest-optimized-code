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

export function printHtmlElement(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html><head>
      <title>Print</title>
      <style>
        @page { size: A4 portrait; margin: 10mm; }
        @media print {
          html, body { height: auto !important; }
          .no-print { display: none !important; }
        }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #e5e7eb; padding: 6px; }
        .pdf-avoid-break { break-inside: avoid; page-break-inside: avoid; }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.10/dist/tailwind.min.css">
    </head><body>${el.outerHTML}</body></html>
  `);
  doc.close();

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 100);
  };
}
