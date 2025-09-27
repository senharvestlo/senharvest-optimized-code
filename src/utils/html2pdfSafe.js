// src/utils/html2pdfSafe.js
import html2pdf from 'html2pdf.js';

function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  const promises = imgs.map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise(res => {
      img.addEventListener('load', res);
      img.addEventListener('error', res);
    });
  });
  return Promise.all(promises);
}

function waitNextFrame() {
  return new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
}

/**
 * Clone l'élément dans un conteneur offscreen mais visible (display:block)
 * => évite PDF vide quand l'original est dans un modal hidden/opacity:0
 */
function mountClone(el) {
  const mount = document.createElement('div');
  mount.style.position = 'fixed';
  mount.style.left = '-99999px';
  mount.style.top = '0';
  mount.style.width = el.offsetWidth ? `${el.offsetWidth}px` : '794px'; // ≈ A4 width en px @96dpi
  mount.style.zIndex = '-1';
  document.body.appendChild(mount);

  const clone = el.cloneNode(true);
  // enlever éléments non imprimables
  clone.querySelectorAll('.no-print,[data-no-print="true"]').forEach(n => n.remove());

  mount.appendChild(clone);
  return { mount, clone };
}

export async function elementToPdfBlob(el, filename = 'document.pdf', opts = {}) {
  if (!el) throw new Error('elementToPdfBlob: element is null');

  const { mount, clone } = mountClone(el);

  // Attendre layout + images + polices
  await waitNextFrame();
  await waitForImages(clone);
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch {}
  }

  // Options robustes
  const options = {
    margin: [10, 12, 10, 12],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#FFFFFF',
      // important pour tableaux : pas de "scroll capture"
      ignoreElements: (node) => node?.dataset?.noPrint === 'true'
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] },
    ...opts
  };

  // Générer en mémoire (pas de .save())
  const pdf = await html2pdf().set(options).from(clone).toPdf().get('pdf');
  const buffer = pdf.output('arraybuffer');
  const blob = new Blob([buffer], { type: 'application/pdf' });

  mount.remove();
  return blob;
}
