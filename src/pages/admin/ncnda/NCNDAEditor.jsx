// src/pages/admin/ncnda/NCNDAEditor.jsx
import React, { useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

// ======= Texte ICC (Anglais, clauses intégrales fournies) =======
const ICC_NCNDA = {
  headerTitle: 'NON-CIRCUMVENTION, NON-DISCLOSURE AND WORKING AGREEMENT',
  preface: (dateStr) =>
    `Whereas the Undersigned Parties wish to enter into this Agreement on ${dateStr} to define certain parameters of their future legal obligations, and considering their mutual promise herein and other good and valuable considerations the receipt of which is acknowledged hereby, the Parties hereto mutually and voluntarily agree as follows:`,

  clauses: [
    `1.
The parties hereto and/or their affiliates, which includes, but is not limited to, any licensors, contractors, buyer's appointed consignee(s), suppliers, manufacturers, producers, wholesalers, retailers, customers, clients, financial sources, representatives, agents or consultants, of what-so-ever nature shall not, in any manner solicit and/or accept any business from sources that have been made available through the parties hereto, nor in any manner shall access, contact solicit and/or conduct any transaction with such said sources, without the expressed and specific permission of the party who made such said sources available.`,

    `2.
The Parties shall maintain complete confidentiality regarding each other's business and/or their affiliates and shall only disclose knowledge pertaining to these specifically named Parties as permitted by the concerned Party, unless agreed and granted an expressed written permission of and by the Party whom made the source available.`,

    `3.
The Parties shall not in any way whatsoever circumvent each other and/or attempt such circumvention of each other and/or any of the parties involved in any of the transactions the Parties wish to enter and to the best of their abilities shall ensure that the original transaction codes, data and proprietary information established are not altered.`,

    `4.
The Parties shall not disclose any contact revealed by either Party to any third Parties as they fully recognized such information and contact(s) of the respective Party, and shall not enter into direct and/or indirect offers, negotiations and/or transaction with such contacts revealed by the other Party who made the contact(s) available.`,

    `5.
In the event of circumvention by any of the undersigned Parties, whether direct and/or indirect, the circumvented Party shall be entitled to a legal monetary compensation equal to the maximum service it should realize from such a transaction, plus any and all expenses, including any and all legal fees incurred in lieu of the recovery of such compensation.`,

    `6.
All considerations, benefits, bonuses, participation, fees, and/or commissions received as a result of the contributions of the Parties to this agreement, relating to any and all transaction shall be allocated as mutually agreed. Specific arrangements, fee for each transaction shall be made available and/or submitted to the recipient on the very day due and payable as per each and every transaction, unless otherwise agreed.`,

    `7.
This agreement is valid for Three (3) year from the date upon date of signature, for any and all transactions between the Parties therein, with renewal to be agreed upon between the signatories.`,

    `8.
It is further agreed that any controversy, claims, and or dispute arising out of and/or relating to any part of the whole of this agreement or breach thereof and which is not settled between the signatories themselves, shall be settled and binding by and through arbitration in accordance with the rules and through the institution of the International Chamber of Commerce. Any decision and/or award made by the arbitrators shall be final, conclusive and binding for the Parties and enforceable in the Court of Law in the Country of choice of an award by the arbitrators.`,

    `9.
This Agreement shall be binding upon the Parties hereto and in the case of individual parties, their respective heirs, administrators and executors and in the case of all corporate Parties, their successors and assigns
a. The non-circumvention damages, i.e., the total commissions, fees, or profits which would have been due, and;
b. All loss sustained by the non-defaulting party by reason of such breach, and;
c. All expenses incurred in enforcing any legal remedy rights based upon or arising out of this Agreement.`,

    `10.
Signature of this agreement shall be deemed to be an executed agreement enforceable and admissible for all purposes as may be necessary under the terms of this agreement.`,

    `11.
All signatories hereto acknowledge that they have read and each Party fully understands the terms and conditions contained in this Agreement and by their initials and signature hereby unconditionally agree to its terms as of the date noted herein.`,

    `12.
The purpose of this instrument is to establish an internationally recognized Non-Circumvention, Non-Disclosure, and Working Agreement between the participating Parties. This and future transactions shall be conducted under the guidelines of the International Chamber of Commerce.`,
  ],

  edtTitle: 'EDT (Electronic document transmissions)',
  edtBody: `EDT (Electronic document transmissions) shall be deemed valid and enforceable in respect of any provisions of this Contract. As applicable, this agreement shall be:
1 Incorporate U.S. Public Law 106-229, "Electronic Signatures in Global and National Commerce Act" such other applicable law conforming to the UNCITRAL Model Law on Electronic Signatures (2001) and
2 ELECTRONIC COMMERCE AGREEMENT (ECE/TRADE/257, Geneva, May 2000) adopted by the United Nations Centre for Trade Facilitation and Electronic Business (UN/CEFACT).
3 EDT documents shall be subject to European Community Directive No. 95/46/EC, as applicable. Either Party may request hard copy of any document that has been previously transmitted by electronic means provided however, that any such request shall in no manner delay the parties from performing their respective obligations and duties under EDT instruments.`,

  footer: `This agreement may be signed in one or more counterparts and the Parties agree that electronic or facsimile copies of this Agreement to be considered as a legal original and signatures thereon shall be legal and binding. If any dispute between the language, abide by the English.
ICC (INTERNATIONAL CHAMBER OF COMMERCE) – http://www.iccwbo.org/index.asp
INCOTERMS 2010 – INCOTERMS ARE STANDARD TRADE DEFINITIONS MOST COMMONLY USED IN INTERNATIONAL SALES CONTRACTS: http://www.iccwbo.org/incoterms/understanding.asp`,
};

const fmtDate = (iso) =>
  new Date(iso || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

export default function NCNDAEditor() {
  const [form, setForm] = useState({
    ref: '',
    dateIssued: new Date().toISOString(),
    party1: { nameTitle:'', company:'', address:'', phone:'', email:'' },
    party2: { nameTitle:'', company:'', address:'', phone:'', email:'' },
  });

  const docRef = useRef(null);
  const dateStr = useMemo(() => fmtDate(form.dateIssued), [form.dateIssued]);

  const onChange = (path, val) => {
    setForm((f) => {
      const c = { ...f };
      const segs = path.split('.');
      let cur = c;
      for (let i = 0; i < segs.length - 1; i++) cur = cur[segs[i]];
      cur[segs.at(-1)] = val;
      return c;
    });
  };

  const onDownload = async () => {
    await new Promise((r) => setTimeout(r, 0));
    const node = docRef.current;
    const filename = `NCNDA-${form.ref || new Date().toISOString().slice(0,10)}.pdf`;
    const opt = {
      margin: 0.5,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all','css','legacy'] },
    };
    await html2pdf().set(opt).from(node).save();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* --- Barre de saisie --- */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm">
          Reference
          <input
            className="w-full border rounded px-2 py-1"
            value={form.ref}
            onChange={(e)=>onChange('ref', e.target.value)}
            placeholder="NCNDA-2025-001"
          />
        </label>
        <label className="text-sm">
          Date
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={(form.dateIssued||'').slice(0,10)}
            onChange={(e)=>onChange('dateIssued', new Date(e.target.value).toISOString())}
          />
        </label>
        <div className="flex items-end">
          <button onClick={onDownload} className="px-3 py-2 border rounded w-full">Download PDF</button>
        </div>
      </div>

      {/* --- Parties --- */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <PartyBlock title="Party 1" data={form.party1} onChange={(k,v)=>onChange(`party1.${k}`, v)} />
        <PartyBlock title="Party 2" data={form.party2} onChange={(k,v)=>onChange(`party2.${k}`, v)} />
      </div>

      {/* --- Aperçu Document --- */}
      <div
        id="ncnda-document"
        ref={docRef}
        className="max-w-5xl mx-auto bg-white shadow border rounded p-8 print:p-0 print:shadow-none"
      >
        {/* En-tête ICC */}
        <div className="flex items-start gap-4 border-b pb-4">
          <img
            src="/icc%20logo.png"
            alt="ICC - International Chamber of Commerce"
            className="h-14"
            onError={(e)=>{ e.currentTarget.style.display='none'; }}
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">{ICC_NCNDA.headerTitle}</h1>
            <p className="text-xs text-gray-500 mt-1">
              {form.ref ? `Ref: ${form.ref}` : ''} {form.ref && ' · '} {dateStr}
            </p>
          </div>
        </div>

        {/* Préambule */}
        <p className="mt-6 text-justify whitespace-pre-wrap">
          {ICC_NCNDA.preface(dateStr)}
        </p>

        {/* Clauses */}
        <div className="space-y-3 mt-4">
          {ICC_NCNDA.clauses.map((c, i) => (
            <p key={i} className="text-justify whitespace-pre-wrap">{c}</p>
          ))}
        </div>

        {/* EDT */}
        <div className="bg-gray-50 p-4 rounded border mt-6">
          <h2 className="font-semibold mb-2">{ICC_NCNDA.edtTitle}</h2>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{ICC_NCNDA.edtBody}</pre>
        </div>

        {/* Footer ICC */}
        <div className="text-xs text-gray-600 mt-6">
          <pre className="whitespace-pre-wrap">{ICC_NCNDA.footer}</pre>
        </div>

        {/* Signature Page */}
        <div className="mt-8 pt-6 border-t">
          <h2 className="font-semibold mb-3">SIGNATURE PAGE</h2>

          <SignatureCard title="Party 1" data={form.party1} />
          <SignatureCard title="Party 2" data={form.party2} />
        </div>
      </div>
    </div>
  );
}

function PartyBlock({ title, data, onChange }) {
  return (
    <div className="border rounded p-3 space-y-2">
      <h4 className="font-semibold mb-1">{title}</h4>
      <LabeledInput label="Full Name/Title" value={data.nameTitle} onChange={(v)=>onChange('nameTitle', v)} />
      <LabeledInput label="Corporation"     value={data.company}   onChange={(v)=>onChange('company', v)} />
      <LabeledInput label="Address"         value={data.address}   onChange={(v)=>onChange('address', v)} />
      <LabeledInput label="Tel"             value={data.phone}     onChange={(v)=>onChange('phone', v)} />
      <LabeledInput label="E-mail"          value={data.email}     onChange={(v)=>onChange('email', v)} />
    </div>
  );
}
function LabeledInput({ label, value, onChange }) {
  return (
    <label className="text-sm block">
      {label}
      <input className="w-full border rounded px-2 py-1" value={value||''} onChange={(e)=>onChange(e.target.value)} />
    </label>
  );
}
function SignatureCard({ title, data }) {
  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p><strong>Full Name/Title:</strong> {data.nameTitle || '___________________'}</p>
      <p><strong>Corporation:</strong> {data.company || '___________________'}</p>
      <p><strong>Address:</strong> {data.address || '___________________'}</p>
      <p><strong>Tel:</strong> {data.phone || '___________________'}</p>
      <p><strong>E-mail:</strong> {data.email || '___________________'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-center">
        <div>
          <div className="border-t mt-10 mb-1 w-48 mx-auto"></div>
          <p>Name: ___________________</p>
          <p>Position: ___________________</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Authorized Signature and Corporate Seal</p>
          <div className="border rounded h-24 mt-2"></div>
        </div>
      </div>
    </div>
  );
}
