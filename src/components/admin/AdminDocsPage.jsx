import React, { useState } from "react";
import DocsDashboard from "./DocsDashboard";
import ProformaHtmlEditor from "@/components/pdf/ProformaHtmlEditor";
import QuotationHtmlEditor from "@/components/pdf/QuotationHtmlEditor";

export default function AdminDocsPage(){
  const [mode, setMode] = useState('list');
  const [editId, setEditId] = useState(null);

  function goList(){ setMode('list'); setEditId(null); }
  function newProforma(){ setMode('proforma'); setEditId(null); }
  function newQuotation(){ setMode('quotation'); setEditId(null); }
  function editDoc(id, type){ setEditId(id); setMode(type === 'proforma' ? 'proforma' : 'quotation'); }

  if (mode === 'proforma') return <ProformaHtmlEditor docId={editId} onBack={goList} />;
  if (mode === 'quotation') return <QuotationHtmlEditor docId={editId} onBack={goList} />;

  return (
    <DocsDashboard
      onOpenNewProforma={newProforma}
      onOpenNewQuotation={newQuotation}
      onOpenEdit={editDoc}
    />
  );
}


