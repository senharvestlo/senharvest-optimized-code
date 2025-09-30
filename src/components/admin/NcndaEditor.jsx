import React, { useMemo, useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { saveTradeDoc, getTradeDoc } from '../../services/firebaseService';

/* ========= Utilitaires PDF sans about:blank ========= */
// (1) Téléchargement propre
function downloadPdfBlob(blob, filename = 'document.pdf') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
// (2) Impression via iframe caché
function printPdfBlob(blob) {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0'
  });
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => { URL.revokeObjectURL(url); iframe.remove(); }, 1200);
  };
}
// (3) Génération HTML → PDF (robuste)
async function elementToPdfBlob(el, filename) {
  if (!el) throw new Error('elementToPdfBlob: element null');
  // clone hors-écran pour éviter PDF vide si modal caché
  const mount = document.createElement('div');
  mount.style.position = 'fixed';
  mount.style.left = '-99999px';
  mount.style.top = '0';
  mount.style.zIndex = '-1';
  document.body.appendChild(mount);
  const clone = el.cloneNode(true);
  mount.appendChild(clone);

  // images/fonts
  const imgs = Array.from(clone.querySelectorAll('img'));
  await Promise.all(imgs.map(img => (img.complete && img.naturalWidth > 0) ? null : new Promise(res => {
    img.addEventListener('load', res); img.addEventListener('error', res);
  })));
  if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch {} }

  const opt = {
    margin: [10, 12, 10, 12],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };
  const pdf = await html2pdf().set(opt).from(clone).toPdf().get('pdf');
  const buffer = pdf.output('arraybuffer');
  mount.remove();
  return new Blob([buffer], { type: 'application/pdf' });
}
/* ========= Fin utilitaires ========= */

export default function NcndaEditor({ docId, onBack }) {
  const [lang, setLang] = useState('fr'); // 'fr' | 'en'
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(docId));
  const [data, setData] = useState(() => ({
    type: 'ncnda',
    number: `NCNDA-${new Date().toISOString().slice(0,10)}-${Date.now()}`,
    effectiveDate: new Date().toISOString().slice(0,10),
    termYears: 3,
    iccUrl: 'https://www.iccwbo.org',
    broker: {
      fullName: 'Mr. Abdou Lahat Lo',
      title: 'Manager',
      corporation: 'SenHarvest LLC',
      address: '1209 MOUNTAIN ROAD PL NE STE N, ALBUQUERQUE, NM 87110, USA',
      phone: '+1 819 319 8464',
      email: 'manager@senharvest.com',
    },
    seller: { fullName: '', title: '', corporation: '', address: '', phone: '', email: '' },
    buyer:  { fullName: '', title: '', corporation: '', address: '', phone: '', email: '' },
    clauses: [],
    language: 'fr',
  }));
  const docRef = useRef(null);

  // Charger le document existant
  useEffect(() => {
    if (!docId) return;
    (async () => {
      setLoading(true);
      try {
        const doc = await getTradeDoc(docId);
        if (doc) {
          setData(doc);
          setLang(doc.language || 'fr');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [docId]);

  const t = useMemo(() => {
    const FR = {
      title: 'Accord de Non-Contournement, Non-Divulgation et Collaboration (NCNDA)',
      subtitle: 'Rédigé conformément aux standards de la Chambre de Commerce Internationale (ICC)',
      partiesHeader: 'PARTIES AU PRÉSENT ACCORD',
      broker: 'Intermédiaire',
      seller: 'Vendeur',
      buyer: 'Acheteur',
      fullName: 'Nom/Prénom & Titre',
      corp: 'Société',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      clausesHeader: 'Clauses Principales',
      edtHeader: 'TRANSMISSIONS ÉLECTRONIQUES (EDT)',
      edtText: `Les transmissions électroniques (EDT) seront réputées valides. Le présent accord incorpore la Loi US 106-229, la Loi type de la CNUDCI et l'Accord UN/CEFACT sur le commerce électronique. Une copie papier peut être demandée sans retarder l'exécution.`,
      termText: (y) => `Le présent accord est valable pour ${y} an(s) à compter de la date de signature.`,
      iccNote: 'Cet instrument établit un NCNDA reconnu internationalement selon les lignes directrices ICC.',
      signatures: 'SIGNATURES',
      signBroker: 'Signature – Intermédiaire',
      signSeller: 'Signature – Vendeur',
      signBuyer: 'Signature – Acheteur',
      date: 'Date',
      generate: '📥 Télécharger PDF',
      print: '🖨️ Imprimer',
      save: '💾 Enregistrer',
      language: 'Langue',
      duration: 'Durée du contrat (années)',
      ref: 'Réf. contrat',
      dateLabel: 'Date',
      defaultClauses: [
        "Aucune des Parties ni ses affiliées ne sollicitera/contractera avec les sources fournies par l'autre sans autorisation écrite.",
        "Les Parties maintiendront la confidentialité complète des informations d'affaires réciproques.",
        "Les Parties s'engagent à ne pas se contourner, directement ou indirectement.",
        "Les contacts révélés ne seront pas divulgués à des tiers sans accord préalable.",
        "En cas de contournement, la Partie lésée aura droit à une compensation intégrale, frais juridiques inclus.",
        "Les commissions et avantages seront répartis comme convenu d'un commun accord.",
        "Tout différend sera réglé par arbitrage selon les règles de la Chambre de Commerce Internationale.",
        "Le présent accord lie les héritiers, successeurs et ayants droit.",
        "La signature électronique est juridiquement valable."
      ]
    };
    const EN = {
      title: 'NON-CIRCUMVENTION, NON-DISCLOSURE AND WORKING AGREEMENT (NCNDA)',
      subtitle: 'Prepared in line with International Chamber of Commerce (ICC) standards',
      partiesHeader: 'PARTIES TO THIS AGREEMENT',
      broker: 'Intermediary / Broker',
      seller: 'Seller / Exporter',
      buyer: 'Buyer / Importer',
      fullName: 'Full Name/Title',
      corp: 'Corporation',
      address: 'Address',
      phone: 'Tel',
      email: 'Email',
      clausesHeader: 'Core Clauses',
      edtHeader: 'ELECTRONIC DOCUMENT TRANSMISSIONS (EDT)',
      edtText: `EDT shall be deemed valid. This agreement incorporates U.S. Public Law 106-229, UNCITRAL Model Law, and UN/CEFACT E-Commerce Agreement. A hard copy may be requested but shall not delay performance.`,
      termText: (y) => `This agreement is valid for ${y} year(s) from the date of signature.`,
      iccNote: 'This instrument establishes an internationally recognized NCNDA under ICC guidelines.',
      signatures: 'SIGNATURES',
      signBroker: 'Authorized Signature – Broker',
      signSeller: 'Authorized Signature – Seller',
      signBuyer: 'Authorized Signature – Buyer',
      date: 'Date',
      generate: '📥 Download PDF',
      print: '🖨️ Print',
      save: '💾 Save',
      language: 'Language',
      duration: 'Contract term (years)',
      ref: 'Contract Ref.',
      dateLabel: 'Date',
      defaultClauses: [
        "The Parties and/or their affiliates shall not solicit or transact with sources introduced by the other Party without prior written consent.",
        "The Parties shall maintain strict confidentiality of each other's business information.",
        "The Parties shall not circumvent each other in any way.",
        "Contacts revealed by either Party shall not be disclosed to third Parties.",
        "In case of circumvention, the injured Party is entitled to full compensation including legal fees.",
        "All commissions and benefits shall be distributed as mutually agreed.",
        "Any dispute shall be settled by arbitration under ICC rules.",
        "This Agreement shall be binding upon heirs, successors and assigns.",
        "Electronic signatures are legally binding."
      ]
    };
    return lang === 'fr' ? FR : EN;
  }, [lang]);

  const clauses = useMemo(
    () => (data.clauses?.length ? data.clauses : t.defaultClauses),
    [data.clauses, t]
  );

  const updateParty = (who, key, val) => {
    setData(d => ({ ...d, [who]: { ...d[who], [key]: val } }));
  };

  const onSave = async () => {
    setBusy(true);
    try {
      const payload = { 
        ...data, 
        type: 'ncnda',
        language: lang,
        docNumber: data.number,
        // Informations pour l'affichage dans la liste
        buyerCompany: data.buyer?.corporation || '',
        status: data.status || 'draft',
      };
      // saveTradeDoc(id, data) - id en premier
      const savedId = await saveTradeDoc(docId || null, payload);
      if (!docId) {
        setData(prev => ({ ...prev, id: savedId }));
      }
      alert(lang === 'fr' ? 'NCNDA enregistré.' : 'NCNDA saved.');
    } catch (error) {
      console.error('Erreur sauvegarde NCNDA:', error);
      alert(lang === 'fr' ? `Erreur: ${error.message}` : `Error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async () => {
    const blob = await elementToPdfBlob(docRef.current, `${data.number}.pdf`);
    downloadPdfBlob(blob, `${data.number}.pdf`);
  };

  const onPrint = async () => {
    const blob = await elementToPdfBlob(docRef.current, `${data.number}.pdf`);
    printPdfBlob(blob);
  };

  if (loading) return <div className="p-6">Chargement du document...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Toolbar */}
      <div className="no-print bg-white border rounded p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">{t.language}</label>
          <select className="border rounded px-2 py-1" value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">{t.duration}</label>
          <input
            type="number" min={1} className="border rounded px-2 py-1 w-20"
            value={data.termYears}
            onChange={e=>setData(d=>({ ...d, termYears: Math.max(1, parseInt(e.target.value||'1',10)) }))}
          />
        </div>

        <input
          className="border rounded px-2 py-1"
          value={data.number}
          onChange={e=>setData(d=>({ ...d, number: e.target.value }))}
          placeholder={t.ref}
        />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={data.effectiveDate}
          onChange={e=>setData(d=>({ ...d, effectiveDate: e.target.value }))}
          aria-label={t.dateLabel}
        />

        <div className="ml-auto flex gap-2">
          {onBack && (
            <button onClick={onBack} className="px-3 py-2 rounded border bg-gray-100">
              ← Retour
            </button>
          )}
          <button disabled={busy} onClick={onSave} className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">
            {busy ? '⏳' : t.save}
          </button>
          <button onClick={onDownload} className="px-3 py-2 rounded bg-blue-600 text-white">
            {t.generate}
          </button>
          <button onClick={onPrint} className="px-3 py-2 rounded bg-gray-800 text-white">
            {t.print}
          </button>
        </div>
      </div>

      {/* Formulaire de saisie rapide (auto-fill parties) */}
      <div className="no-print grid md:grid-cols-3 gap-4">
        {/* Broker */}
        <div className="bg-white border rounded p-3">
          <h3 className="font-semibold mb-2">{t.broker}</h3>
          {[
            ['fullName', t.fullName],
            ['title', 'Title'],
            ['corporation', t.corp],
            ['address', t.address],
            ['phone', t.phone],
            ['email', t.email],
          ].map(([k, label]) => (
            <div key={k} className="mb-2">
              <label className="block text-xs text-gray-600">{label}</label>
              <input className="border rounded px-2 py-1 w-full"
                value={data.broker[k]||''}
                onChange={e=>updateParty('broker', k, e.target.value)}
              />
            </div>
          ))}
        </div>
        {/* Seller */}
        <div className="bg-white border rounded p-3">
          <h3 className="font-semibold mb-2">{t.seller}</h3>
          {[
            ['fullName', t.fullName],
            ['title', 'Title'],
            ['corporation', t.corp],
            ['address', t.address],
            ['phone', t.phone],
            ['email', t.email],
          ].map(([k, label]) => (
            <div key={k} className="mb-2">
              <label className="block text-xs text-gray-600">{label}</label>
              <input className="border rounded px-2 py-1 w-full"
                value={data.seller[k]||''}
                onChange={e=>updateParty('seller', k, e.target.value)}
              />
            </div>
          ))}
        </div>
        {/* Buyer */}
        <div className="bg-white border rounded p-3">
          <h3 className="font-semibold mb-2">{t.buyer}</h3>
          {[
            ['fullName', t.fullName],
            ['title', 'Title'],
            ['corporation', t.corp],
            ['address', t.address],
            ['phone', t.phone],
            ['email', t.email],
          ].map(([k, label]) => (
            <div key={k} className="mb-2">
              <label className="block text-xs text-gray-600">{label}</label>
              <input className="border rounded px-2 py-1 w-full"
                value={data.buyer[k]||''}
                onChange={e=>updateParty('buyer', k, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ========== APERÇU / DOCUMENT (basé sur le template QWEN, adapté) ========== */}
      <div ref={docRef} id="ncnda-document" className="max-w-5xl mx-auto bg-white shadow border rounded p-8 text-sm leading-relaxed">
        <style>{`
          @page { size: A4; margin: 15mm; }
          @media print { 
            .no-print { display:none !important; } 
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page-break { page-break-before: always; }
            .avoid-break { page-break-inside: avoid; }
          }
          .signature-line { border-top: 1px solid #000; width: 80%; margin: 40px auto 8px; }
          .clause { margin-bottom: 1.2rem; text-align: justify; line-height: 1.6; }
          ol { counter-reset: item; list-style-type: none; padding-left: 0; }
          ol li { 
            counter-increment: item;
            margin-bottom: 1rem;
            display: flex;
            align-items: flex-start;
          }
          ol li:before { 
            content: counter(item) ". ";
            font-weight: bold;
            min-width: 2em;
            margin-right: 0.5em;
          }
          .icc-logo-container { 
            display: flex; 
            align-items: center; 
            gap: 16px; 
            margin-bottom: 24px; 
          }
          .icc-logo-container img {
            width: 80px;
            height: auto;
            object-fit: contain;
          }
        `}</style>

        {/* Logo + titre */}
        <div className="icc-logo-container">
          <img
            src="/icc logo.png"
            alt="ICC - International Chamber of Commerce"
            crossOrigin="anonymous"
          />
          <div>
            <h1 className="text-xl font-bold text-blue-800">
              {lang === 'fr'
                ? 'ACCORD DE NON-CONTOURNEMENT, NON-DIVULGATION ET COLLABORATION'
                : 'NON-CIRCUMVENTION, NON-DISCLOSURE AND WORKING AGREEMENT'}
            </h1>
            <p className="text-gray-600 text-xs mt-1">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Intro */}
        <p className="mt-6 clause">
          {lang === 'fr'
            ? `Les Parties soussignées conviennent en date du ${data.effectiveDate} de définir certains paramètres relatifs à leurs obligations légales futures. En considération des engagements mutuels figurant aux présentes, les Parties conviennent de ce qui suit :`
            : `The undersigned Parties agree on ${data.effectiveDate} to define certain parameters of their future legal obligations. In consideration of the mutual promises herein, the Parties agree as follows:`}
        </p>

        {/* Clauses - Page 1 */}
        <ol className="mt-6">
          {clauses.map((c, i) => (<li key={i}><span className="clause">{c}</span></li>))}
          <li><span className="clause"><strong>{t.termText(data.termYears)}</strong></span></li>
          <li><span className="clause">{t.iccNote}</span></li>
        </ol>

        {/* EDT */}
        <div className="bg-gray-50 p-4 rounded border mt-6 avoid-break">
          <h2 className="font-semibold text-gray-800 mb-2">{t.edtHeader}</h2>
          <p className="text-sm leading-relaxed">{t.edtText}</p>
        </div>

        {/* Page break avant les parties */}
        <div className="page-break"></div>

        {/* Parties - Page 2 */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">{t.partiesHeader}</h2>

          <div className="bg-blue-50 p-4 rounded border mb-4">
            <h3 className="font-semibold text-blue-800">{t.broker}</h3>
            <p><strong>{t.fullName}:</strong> {data.broker.fullName} / {data.broker.title}</p>
            <p><strong>{t.corp}:</strong> {data.broker.corporation}</p>
            <p><strong>{t.address}:</strong> {data.broker.address}</p>
            <p><strong>{t.phone}:</strong> {data.broker.phone}</p>
            <p><strong>{t.email}:</strong> {data.broker.email}</p>
          </div>

          <div className="bg-green-50 p-4 rounded border mb-4">
            <h3 className="font-semibold text-green-800">{t.seller}</h3>
            <p><strong>{t.fullName}:</strong> {data.seller.fullName} / {data.seller.title}</p>
            <p><strong>{t.corp}:</strong> {data.seller.corporation}</p>
            <p><strong>{t.address}:</strong> {data.seller.address}</p>
            <p><strong>{t.phone}:</strong> {data.seller.phone}</p>
            <p><strong>{t.email}:</strong> {data.seller.email}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded border">
            <h3 className="font-semibold text-purple-800">{t.buyer}</h3>
            <p><strong>{t.fullName}:</strong> {data.buyer.fullName} / {data.buyer.title}</p>
            <p><strong>{t.corp}:</strong> {data.buyer.corporation}</p>
            <p><strong>{t.address}:</strong> {data.buyer.address}</p>
            <p><strong>{t.phone}:</strong> {data.buyer.phone}</p>
            <p><strong>{t.email}:</strong> {data.buyer.email}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center avoid-break">
          <div>
            <p className="font-semibold">{t.signBroker}</p>
            <div className="signature-line"></div>
            <p>{data.broker.fullName}</p>
            <p className="text-xs text-gray-500">{t.date}: ________</p>
          </div>
          <div>
            <p className="font-semibold">{t.signSeller}</p>
            <div className="signature-line"></div>
            <p>{data.seller.fullName || '[Seller Name]'}</p>
            <p className="text-xs text-gray-500">{t.date}: ________</p>
          </div>
          <div>
            <p className="font-semibold">{t.signBuyer}</p>
            <div className="signature-line"></div>
            <p>{data.buyer.fullName || '[Buyer Name]'}</p>
            <p className="text-xs text-gray-500">{t.date}: ________</p>
          </div>
        </div>

        {/* Footer ICC */}
        <div className="text-xs text-gray-600 mt-10 pt-6 border-t">
          <p><strong>ICC:</strong> <span className="underline">{data.iccUrl}</span></p>
          <p className="mt-1">
            {lang === 'fr'
              ? "Ce document peut être signé électroniquement. En cas de divergence, la version anglaise prévaut."
              : "This agreement may be signed electronically. In case of conflict, English prevails."}
          </p>
        </div>
      </div>
    </div>
  );
}
