// html2pdf options centralisés, no about:blank
export async function downloadElementAsPDF(el, filename = 'document.pdf', extra = {}) {
  if (!el) return;
  const opt = {
    margin:       18,                  // ~0.25in
    filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'] },
    ...extra
  };
  const { default: html2pdf } = await import('html2pdf.js');
  return html2pdf().set(opt).from(el).save();
}

/**
 * Calcule et applique un scale() CSS pour que le contenu tienne en <= N pages A4.
 * - container: élément racine (celui passé à html2pdf)
 * - inner: l'enfant réel à scaler (pour ne pas bouger les marges)
 * Retourne la scale appliquée (nombre).
 */
export function fitToPages(container, inner, maxPages = 2) {
  if (!container || !inner) return 1;
  // Taille A4 en points avec marge ~18pt (déjà dans html2pdf). On utilise le pixel layout.
  const A4_PX = 1122; // approx hauteur A4 @96dpi (11.69in * 96)
  const usablePerPage = A4_PX - 36; // un peu de marge
  const maxHeight = usablePerPage * maxPages;

  // reset scale pour mesurer
  inner.style.transform = 'none';
  const h = inner.scrollHeight;

  if (h <= maxHeight) return 1;

  const scale = maxHeight / h;
  inner.style.transform = `scale(${scale})`;
  inner.style.width = `${(1/scale)*100}%`; // garder la largeur visible
  return scale;
}

/** Supprime le scale appliqué par fitToPages */
export function clearFit(inner) {
  if (!inner) return;
  inner.style.transform = 'none';
  inner.style.width = '';
}
