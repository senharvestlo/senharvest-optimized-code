import React, { useRef, useState, useEffect } from 'react';
import { downloadElementAsPDF, fitToPages, clearFit } from '../../services/pdf';

export default function ProformaHTML() {
  const shellRef = useRef(null);
  const fitRef = useRef(null);
  const [limitTwoPages, setLimitTwoPages] = useState(true);
  const [wmOn, setWmOn] = useState(false);
  const [wmText, setWmText] = useState('DRAFT');

  const [lang, setLang] = useState('fr');
  const [currency, setCurrency] = useState('USD');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [seller, setSeller] = useState({
    name:'SenHarvest Group',
    address:'Dakar, Sénégal / Montréal, Canada',
    phone:'+1 819 319 8464',
    email:'manager@senharvest.com'
  });
  const [buyer, setBuyer] = useState({ name:'', address:'', phone:'', email:'' });
  const [showBank, setShowBank] = useState(false);
  const [bank, setBank] = useState({ bankName:'', beneficiary:'', iban:'', swift:'' });
  const [lines, setLines] = useState([
    { product:'', quality:'', qty:'', unit:'MT', pack:'', hsCode:'', unitPrice:'' }
  ]);
  const [terms, setTerms] = useState([
    'Offre valable 15 jours', 'Livraison 30-45 jours', 'Incoterms 2020'
  ]);
  const total = lines.reduce((s,l)=> s + (+l.qty||0)*(+l.unitPrice||0), 0);

  const addLine = () => setLines(a=>[...a, { product:'', quality:'', qty:'', unit:'MT', pack:'', hsCode:'', unitPrice:'' }]);
  const delLine = (i) => setLines(a=>a.filter((_,x)=>x!==i));
  const setLine = (i,k,v)=> setLines(a=>{ const c=[...a]; c[i]={...c[i],[k]:v}; return c; });

  const T = (fr,en)=> lang==='fr'?fr:en;

  useEffect(()=>{
    if (!limitTwoPages) { clearFit(fitRef.current); return; }
    const id = setTimeout(()=> fitToPages(shellRef.current, fitRef.current, 2), 0);
    return ()=>clearTimeout(id);
  }, [limitTwoPages, lang, currency, number, date, seller, buyer, showBank, bank, lines, terms]);

  const handleDownload = async () => {
    let scaled = 1;
    if (limitTwoPages) scaled = fitToPages(shellRef.current, fitRef.current, 2);
    await downloadElementAsPDF(shellRef.current, `Proforma-${number||date}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded p-4">
        <div className="grid2">
          <label className="text-sm inline-flex items-center gap-2">
            <input type="checkbox" checked={limitTwoPages} onChange={e=>setLimitTwoPages(e.target.checked)} />
            {T('Deux pages max (A4)','Max two pages (A4)')}
          </label>
          <span />
          <label className="text-sm inline-flex items-center gap-2">
            <input type="checkbox" checked={wmOn} onChange={e=>setWmOn(e.target.checked)} />
            {T('Filigrane','Watermark')}
          </label>
          <input className="border rounded px-2 py-1" value={wmText} onChange={e=>setWmText(e.target.value)} placeholder={T('Texte filigrane','Watermark text')} />
        </div>

        <div className="grid2 mt-4">
          <label className="text-sm">Lang
            <select value={lang} onChange={e=>setLang(e.target.value)} className="mt-1 w-full border rounded px-2 py-1">
              <option value="fr">FR</option><option value="en">EN</option>
            </select>
          </label>
          <label className="text-sm">{T('Devise','Currency')}
            <input value={currency} onChange={e=>setCurrency(e.target.value)} className="mt-1 w-full border rounded px-2 py-1"/>
          </label>
          <label className="text-sm">{T('Référence','Reference')}
            <input value={number} onChange={e=>setNumber(e.target.value)} className="mt-1 w-full border rounded px-2 py-1"/>
          </label>
          <label className="text-sm">{T('Date','Date')}
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full border rounded px-2 py-1"/>
          </label>
        </div>

        <div className="grid2 mt-4">
          <fieldset className="border rounded p-3">
            <legend className="px-2 text-sm font-semibold">{T('Vendeur','Seller')}</legend>
            {['name','address','phone','email'].map(k=>(
              <input key={k} placeholder={k} className="w-full border rounded px-2 py-1 mb-2"
                     value={seller[k]} onChange={e=>setSeller(s=>({...s,[k]:e.target.value}))}/>
            ))}
          </fieldset>
          <fieldset className="border rounded p-3">
            <legend className="px-2 text-sm font-semibold">{T('Acheteur','Buyer')}</legend>
            {['name','address','phone','email'].map(k=>(
              <input key={k} placeholder={k} className="w-full border rounded px-2 py-1 mb-2"
                     value={buyer[k]} onChange={e=>setBuyer(s=>({...s,[k]:e.target.value}))}/>
            ))}
          </fieldset>
        </div>

        <div className="mt-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={showBank} onChange={e=>setShowBank(e.target.checked)}/>
            <span>{T('Afficher infos bancaires','Show bank details')}</span>
          </label>
          {showBank && (
            <div className="grid2 mt-2">
              <input placeholder={T('Banque','Bank')} className="border rounded px-2 py-1" value={bank.bankName} onChange={e=>setBank(b=>({...b,bankName:e.target.value}))}/>
              <input placeholder={T('Bénéficiaire','Beneficiary')} className="border rounded px-2 py-1" value={bank.beneficiary} onChange={e=>setBank(b=>({...b,beneficiary:e.target.value}))}/>
              <input placeholder="IBAN / Account" className="border rounded px-2 py-1" value={bank.iban} onChange={e=>setBank(b=>({...b,iban:e.target.value}))}/>
              <input placeholder="SWIFT/BIC" className="border rounded px-2 py-1" value={bank.swift} onChange={e=>setBank(b=>({...b,swift:e.target.value}))}/>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">{T('Lignes de produits','Line items')}</h4>
          <div className="space-y-2">
            {lines.map((l,i)=>(
              <div key={i} className="bg-gray-50 p-2 rounded border">
                <div className="grid2 mb-2">
                  <input placeholder={T('Produit','Product')} value={l.product} onChange={e=>setLine(i,'product',e.target.value)} className="border rounded px-2 py-1"/>
                  <input placeholder={T('Qualité','Quality')} value={l.quality} onChange={e=>setLine(i,'quality',e.target.value)} className="border rounded px-2 py-1"/>
                </div>
                <div className="grid3 mb-2">
                  <input placeholder={T('Qté','Qty')} type="number" value={l.qty} onChange={e=>setLine(i,'qty',e.target.value)} className="border rounded px-2 py-1"/>
                  <input placeholder={T('Unité','Unit')} value={l.unit} onChange={e=>setLine(i,'unit',e.target.value)} className="border rounded px-2 py-1"/>
                  <input placeholder="HS" value={l.hsCode} onChange={e=>setLine(i,'hsCode',e.target.value)} className="border rounded px-2 py-1"/>
                </div>
                <div className="grid2">
                  <input placeholder={T('Conditionnement','Packing')} value={l.pack} onChange={e=>setLine(i,'pack',e.target.value)} className="border rounded px-2 py-1"/>
                  <input placeholder={T('PU','Unit Price')} type="number" value={l.unitPrice} onChange={e=>setLine(i,'unitPrice',e.target.value)} className="border rounded px-2 py-1"/>
                </div>
                <button type="button" onClick={()=>delLine(i)} className="text-xs text-red-600 underline mt-1">{T('Supprimer','Remove')}</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addLine} className="border rounded px-3 py-2 mt-2">+ {T('Ajouter ligne','Add line')}</button>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">{T('Termes & Conditions','Terms & Conditions')}</h4>
          <textarea className="w-full border rounded px-2 py-2 min-h-[100px]"
            value={terms.join('\n')}
            onChange={(e)=>setTerms(e.target.value.split('\n').filter(Boolean))}
          />
        </div>
      </div>

      <div className="pdf-shell pdf-outline" ref={shellRef}>
        {wmOn && (
          <div className="watermark">
            <div className="watermark-inner">{wmText || 'DRAFT'}</div>
          </div>
        )}
        <div className="pdf-fit-wrap">
          <div className="pdf-sheet" ref={fitRef}>
            <div className="header">
              <div>
                <div className="badge">PROFORMA INVOICE</div>
                <h1 className="h1 mt-2">{T('Facture Proforma','Proforma Invoice')}</h1>
                <div className="small mt-2">{T('Réf','Ref')}: <b>{number||'—'}</b> • {T('Date','Date')}: {date} • {T('Devise','Currency')}: {currency}</div>
              </div>
              <img src="/logo192.png" alt="SenHarvest" className="logo" />
            </div>

            <div className="grid2 mt-4">
              <div className="section">
                <div className="h2">{T('Vendeur','Seller')}</div>
                <div className="small mt-2"><b>{seller.name}</b></div>
                <div className="small">{seller.address}</div>
                <div className="small">{seller.phone} • {seller.email}</div>
              </div>
              <div className="section">
                <div className="h2">{T('Acheteur','Buyer')}</div>
                <div className="small mt-2"><b>{buyer.name||'—'}</b></div>
                <div className="small">{buyer.address||'—'}</div>
                <div className="small">{buyer.phone||'—'} • {buyer.email||'—'}</div>
              </div>
            </div>

            <div className="table-wrap mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>{T('Produit','Product')}</th>
                    <th>{T('Qualité','Quality')}</th>
                    <th>{T('Qté','Qty')}</th>
                    <th>{T('Unité','Unit')}</th>
                    <th>HS</th>
                    <th>{T('Pack','Pack')}</th>
                    <th>{T('PU','Unit Price')} ({currency})</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l,i)=>(
                    <tr key={i}>
                      <td>{l.product}</td>
                      <td>{l.quality}</td>
                      <td style={{textAlign:'right'}}>{l.qty||0}</td>
                      <td>{l.unit}</td>
                      <td>{l.hsCode}</td>
                      <td>{l.pack}</td>
                      <td style={{textAlign:'right'}}>{(+l.unitPrice||0).toFixed(2)}</td>
                      <td style={{textAlign:'right'}}>{((+l.qty||0)*(+l.unitPrice||0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="7" style={{textAlign:'right', fontWeight:600}}>TOTAL ({currency})</td>
                    <td style={{textAlign:'right', fontWeight:600}}>{total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {showBank && (
              <div className="section mt-4">
                <div className="h2">{T('Informations bancaires','Bank Details')}</div>
                <div className="small mt-2"><b>{bank.bankName}</b></div>
                <div className="small">{T('Bénéficiaire','Beneficiary')}: {bank.beneficiary}</div>
                <div className="small">IBAN / Account: {bank.iban} • SWIFT/BIC: {bank.swift}</div>
              </div>
            )}

            <div className="section mt-4">
              <div className="h2">{T('Termes & Conditions','Terms & Conditions')}</div>
              <ul className="small mt-2" style={{listStyle:'disc', paddingLeft:16}}>
                {terms.map((t,i)=><li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleDownload}
          className="no-print bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2"
        >
          {T('Télécharger le PDF','Download PDF')}
        </button>
      </div>
    </div>
  );
}
