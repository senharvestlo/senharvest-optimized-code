// utils/pdfIo.js - Fonctions pour télécharger et imprimer des PDFs sans about:blank

/**
 * Télécharge un PDF via un blob sans ouvrir de nouvelle fenêtre
 * @param {Blob} blob - Le blob du PDF à télécharger
 * @param {string} filename - Nom du fichier à télécharger
 */
export function downloadPdfBlob(blob, filename = 'document.pdf') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Imprime un PDF via un iframe caché sans about:blank dans la barre d'adresse
 * @param {Blob} blob - Le blob du PDF à imprimer
 */
export function printPdfBlob(blob) {
  const url = URL.createObjectURL(blob);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = url;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    // Ensure focus -> print
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    // Cleanup after a short delay (lets the print dialog open)
    setTimeout(() => {
      URL.revokeObjectURL(url);
      iframe.remove();
    }, 1000);
  };
}
