// src/pages/admin/ncnda/NCNDAEditor.jsx
import React, { useMemo, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

const fmtDate = (iso) =>
  new Date(iso || Date.now()).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

const waitTick = () => new Promise(r => setTimeout(r, 0));

export default function NCNDAEditor() {
  const [form, setForm] = useState({
    ref: 'NCNDA-2025-001',
    dateIssued: new Date().toISOString(),
    includeBroker: false,
    party1: { 
      nameTitle: 'Mr. Abdou Lahat Lo',
      company: 'SenHarvest LLC',
      address: '1209 MOUNTAIN ROAD PL NE STE N, ALBUQUERQUE, NM 87110, USA',
      phone: '+1 819 319 8464',
      email: 'abdou.lo@senharvestllc.com',
      position: 'Manager'
    },
    party2: { 
      nameTitle: '',
      company: '',
      address: '',
      phone: '',
      email: '',
      position: ''
    },
    broker: {
      nameTitle: 'SenHarvest LLC',
      company: 'SenHarvest LLC',
      address: 'Dakar, Senegal / Montreal, Canada',
      phone: '+1 819 319 8464',
      email: 'manager@senharvest.com',
      position: 'Intermediary'
    }
  });

  const docRef = useRef(null);
  const dateStr = useMemo(() => fmtDate(form.dateIssued), [form.dateIssued]);

  const onChange = (path, val) => {
    setForm(f => {
      const c = { ...f };
      const segs = path.split('.');
      let cur = c;
      for (let i = 0; i < segs.length - 1; i++) cur = cur[segs[i]];
      cur[segs.at(-1)] = val;
      return c;
    });
  };

  const onDownload = async () => {
    await waitTick();
    const node = docRef.current;
    const filename = `NCNDA-${form.ref || new Date().toISOString().slice(0,10)}.pdf`;
    const opt = {
      margin: [0.5, 0.8],
      filename,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    await html2pdf().set(opt).from(node).save();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      
      {/* CSS spécifique PDF */}
      <style>{`
        @media print {
          .avoid-break { page-break-inside: avoid; }
          ol, ul { page-break-inside: avoid; }
          li { page-break-inside: avoid; }
        }
        #ncnda-document ol { 
          list-style-position: inside;   /* ✅ numéro aligné avec le texte */
          margin-left: 0; 
          padding-left: 1rem;            /* espace uniforme */
          counter-reset: none;
        }
        #ncnda-document li { 
          margin-bottom: 0.8rem; 
          text-indent: 0;                /* pas de retrait supplémentaire */
          display: list-item;
          line-height: 1.5;              /* améliore la lisibilité */
        }
      `}</style>

      {/* Barre de commandes */}
      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm">
          Reference
          <input
            className="w-full border rounded px-2 py-1"
            value={form.ref}
            onChange={(e) => onChange('ref', e.target.value)}
            placeholder="NCNDA-2025-001"
          />
        </label>
        <label className="text-sm">
          Date Issued
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={(form.dateIssued || '').slice(0, 10)}
            onChange={(e) => onChange('dateIssued', new Date(e.target.value).toISOString())}
          />
        </label>
        <div className="flex items-end">
          <button onClick={onDownload} className="w-full px-3 py-2 border rounded bg-blue-600 text-white font-semibold">
            📥 Download PDF
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm col-span-3">
          <input
            type="checkbox"
            checked={form.includeBroker}
            onChange={(e) => onChange('includeBroker', e.target.checked)}
          />
          Include Broker (3rd Party) - NCNDA with Intermediary
        </label>
      </div>

      {/* Blocs Parties */}
      <div className={`bg-white border rounded p-3 grid ${form.includeBroker ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-3`}>
        <PartyBlock title="Party 1" data={form.party1} onChange={(k, v) => onChange(`party1.${k}`, v)} />
        <PartyBlock title="Party 2" data={form.party2} onChange={(k, v) => onChange(`party2.${k}`, v)} />
        {form.includeBroker && (
          <PartyBlock title="Broker (Intermediary)" data={form.broker} onChange={(k, v) => onChange(`broker.${k}`, v)} />
        )}
      </div>

      {/* DOCUMENT PREVIEW */}
      <div
        id="ncnda-document"
        ref={docRef}
        className="max-w-5xl mx-auto bg-white shadow-lg border rounded-lg p-8 print:p-0 print:shadow-none"
      >
        {/* Logo ICC et titre */}
        <div className="flex items-start gap-4 border-b pb-4 avoid-break">
          <img
            src="/icc%20logo.png"
            alt="ICC - International Chamber of Commerce"
            className="h-14"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              NON-CIRCUMVENTION, NON-DISCLOSURE AND WORKING AGREEMENT
            </h1>
            <p className="text-gray-600 text-sm mt-1">The world business organization</p>
            <p className="text-xs text-gray-500 mt-1">
              {form.ref ? `Ref: ${form.ref}` : ''} {form.ref && ' · '} {dateStr}
            </p>
          </div>
        </div>

        {/* Introduction */}
        <p className="mt-6 text-justify leading-relaxed avoid-break">
          Whereas the Undersigned Parties wish to enter into this Agreement on <strong>{dateStr}</strong> to define certain parameters of their future legal obligations, and considering their mutual promise herein and other good and valuable considerations the receipt of which is acknowledged hereby, the Parties hereto mutually and voluntarily agree as follows:
        </p>

        {/* Clauses ICC officielles (1-12) */}
        <ol className="list-decimal ml-6 space-y-4 mt-6 avoid-break">
          <li className="text-justify leading-relaxed avoid-break">
            The parties hereto and/or their affiliates, which includes, but is not limited to, any licensors, contractors, buyer's appointed consignee(s), suppliers, manufacturers, producers, wholesalers, retailers, customers, clients, financial sources, representatives, agents or consultants, of what-so-ever nature shall not, in any manner solicit and/or accept any business from sources that have been made available by and through the parties hereto, nor in any manner shall access, contact solicit and/or conduct any transaction with such said sources, without the expressed and specific permission of the party who made such said sources available.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            The Parties shall maintain complete confidentiality regarding each other's business and/or their affiliates and shall only disclose knowledge pertaining to these specifically named Parties as permitted by the concerned Party, unless agreed and granted an expressed written permission of and by the Party whom made the source available.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            The Parties shall not in any way whatsoever circumvent each other and/or attempt such circumvention of each other and/or any of the Parties involved in any of the transactions the Parties wish to enter and to the best of their abilities shall ensure that the original transaction codes, data and proprietary information established are not altered.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            The Parties shall not disclose any contact revealed by either Party to any third Parties as they fully recognized such information and contact(s) of the respective Party, and shall not enter into direct and/or indirect offers, negotiations and/or transaction with such contacts revealed by the other Party who made the contact(s) available.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            In the event of circumvention by any of the undersigned Parties, whether direct and/or indirect, the circumvented Party shall be entitled to a legal monetary compensation equal to the maximum service it should realize from such a transaction, plus any and all expenses, including any and all legal fees incurred in lieu of the recovery of such compensation.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            All considerations, benefits, bonuses, participation, fees, and/or commissions received as a result of the contributions of the Parties to this agreement, relating to any and all transactions shall be allocated and distributed as mutually agreed. Specific arrangements, fee for each transaction shall be made available and/or submitted to the recipient on the very day due and payable as per each and every transaction, unless otherwise agreed.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            This agreement is valid for Three (3) years from the date of signature, for any and all transactions between the Parties therein, with renewal to be agreed upon between the signatories.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            It is further agreed that any controversy, claims, and/or dispute arising out of and/or relating to any part of the whole of this agreement or breach thereof and which is not settled between the signatories themselves, shall be settled and binding by and through arbitration in accordance with the rules and through the institution of the International Chamber of Commerce. Any decision and/or award made by the arbitrators shall be final, conclusive and binding for the Parties and enforceable in the Court of Law in the Country of choice of an award by the arbitrators.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            This Agreement shall be binding upon the Parties hereto and in the case of individual parties, their respective heirs, administrators and executors and in the case of all corporate Parties, their successors and assigns.
            <ul className="list-disc ml-6 mt-2 avoid-break">
              <li>The non-circumvention damages, i.e., the total commissions, fees, or profits which would have been due; and,</li>
              <li>All loss sustained by the non-defaulting party by reason of such breach; and,</li>
              <li>All expenses incurred in enforcing any legal remedy rights based upon or arising out of this Agreement.</li>
            </ul>
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            Signature of this agreement shall be deemed to be an executed agreement enforceable and admissible for all purposes as may be necessary under the terms of this agreement.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            All signatories hereto acknowledge that they have read and each Party fully understands the terms and conditions contained in this Agreement and by their initials and signature hereby unconditionally agree to its terms as of the date noted herein.
          </li>

          <li className="text-justify leading-relaxed avoid-break">
            The purpose of this instrument is to establish an internationally recognized Non-Circumvention, Non-Disclosure, and Working Agreement between the participating Parties. This and future transactions shall be conducted under the guidelines of the International Chamber of Commerce.
          </li>
        </ol>

        {/* Clause de fin sur langues et copies électroniques */}
        <p className="mt-6 text-justify leading-relaxed avoid-break">
          This agreement may be signed in one or more counterparts and the Parties agree that electronic or facsimile copies of this Agreement to be considered as a legal original and signatures thereon shall be legal and binding. If any dispute between the language, abide by the English.
        </p>

        {/* Références ICC */}
        <div className="mt-8 border-t pt-6 avoid-break">
          <h2 className="font-semibold text-gray-800 mb-3">ICC REFERENCES</h2>
          <p className="text-xs text-gray-600">
            <strong>ICC (INTERNATIONAL CHAMBER OF COMMERCE)</strong> – http://www.iccwbo.org/index.asp<br />
            <strong>INCOTERMS 2010</strong> – http://www.iccwbo.org/incoterms/understanding.asp
          </p>
        </div>

        {/* EDT */}
        <div className="mt-8 bg-gray-50 p-5 rounded border avoid-break">
          <h2 className="font-semibold text-gray-800 mb-3">EDT (Electronic document transmissions)</h2>
          <p className="text-sm text-justify leading-relaxed">
            Electronic document transmissions (EDT) shall be deemed valid and enforceable in respect of any provisions of this Contract. As applicable, this agreement shall be:
          </p>
          <ol className="list-decimal ml-6 mt-2 text-sm text-justify leading-relaxed space-y-2 avoid-break">
            <li>Incorporate U.S. Public Law 106-229, "Electronic Signatures in Global and National Commerce Act" as well other applicable law conforming to the UNCITRAL Model Law on Electronic Signatures (2001) and</li>
            <li>ELECTRONIC COMMERCE AGREEMENT (ECE/TRADE/257, Geneva, May 2000) adopted by the United Nations Centre for Trade Facilitation and Electronic Business (UN/CEFACT).</li>
            <li>EDT documents shall be subject to European Council Directive No. 95/46/EEC, as applicable. Either Party may request hard copy of any document that has been previously transmitted by electronic means provided however, that any such request shall in no manner delay the Parties from performing their respective obligations and duties under EDT instruments.</li>
          </ol>
        </div>

        {/* SIGNATURE PAGE */}
        <div className="mt-12 avoid-break">
          <h2 className="text-xl font-semibold text-center mb-6">SIGNATURE PAGE</h2>
          
          <SignatureBlock title="Party 1" data={form.party1} color="blue" />
          <SignatureBlock title="Party 2" data={form.party2} color="green" />
          
          {form.includeBroker && (
            <SignatureBlock title="Broker (Intermediary)" data={form.broker} color="purple" />
          )}
        </div>

        {/* Notes */}
        <div className="border-t pt-6 mt-8 text-xs text-gray-600 avoid-break">
          <p>Note: This agreement may be printed and signed manually, or signed electronically. For international use, English version prevails.</p>
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function PartyBlock({ title, data, onChange }) {
  return (
    <div className="border rounded p-3 space-y-2 avoid-break">
      <h4 className="font-semibold mb-1">{title}</h4>
      <LabeledInput label="Full Name/Title" value={data.nameTitle} onChange={(v) => onChange('nameTitle', v)} />
      <LabeledInput label="Company/Corporation" value={data.company} onChange={(v) => onChange('company', v)} />
      <LabeledInput label="Address" value={data.address} onChange={(v) => onChange('address', v)} />
      <LabeledInput label="Phone" value={data.phone} onChange={(v) => onChange('phone', v)} />
      <LabeledInput label="Email" value={data.email} onChange={(v) => onChange('email', v)} />
      <LabeledInput label="Position" value={data.position} onChange={(v) => onChange('position', v)} />
    </div>
  );
}

function LabeledInput({ label, value, onChange }) {
  return (
    <label className="text-sm block">
      {label}
      <input
        className="w-full border rounded px-2 py-1"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SignatureBlock({ title, data, color = 'blue' }) {
  const colorClass = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  }[color] || 'bg-gray-50 border-gray-200 text-gray-800';

  return (
    <div className="mb-8 avoid-break">
      <div className={`${colorClass.split(' ')[0]} p-5 rounded border mb-6`}>
        <h3 className="font-semibold mb-3" style={{ color: colorClass.split(' ')[2] === 'text-blue-800' ? '#1e40af' : colorClass.split(' ')[2] === 'text-green-800' ? '#166534' : '#7c3aed' }}>
          {title}:
        </h3>
        <p className="text-sm"><strong>Full Name/Title:</strong> {data.nameTitle || '___________________'}</p>
        <p className="text-sm"><strong>Corporation:</strong> {data.company || '___________________'}</p>
        <p className="text-sm"><strong>Address:</strong> {data.address || '___________________'}</p>
        <p className="text-sm"><strong>Tel:</strong> {data.phone || '___________________'}</p>
        <p className="text-sm"><strong>E-mail:</strong> {data.email || '___________________'}</p>
      </div>
      <div className="text-center">
        <p className="font-semibold">Authorized Signature and Corporate Seal</p>
        <div className="border-t border-black w-56 mx-auto mt-8 mb-2"></div>
        <p><strong>Name:</strong> {data.nameTitle || '___________________'}</p>
        <p><strong>Position:</strong> {data.position || '___________________'}</p>
      </div>
    </div>
  );
}
