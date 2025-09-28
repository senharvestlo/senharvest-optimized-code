import React, { useState } from "react";
import DocsDashboard from "./DocsDashboard";
import ProformaHtmlEditor from "../pdf/ProformaHtmlEditor";
import QuotationHtmlEditor from "../pdf/QuotationHtmlEditor";

export default function AdminDocsPage(){
  const [mode, setMode] = useState('list');
  const [editId, setEditId] = useState(null);

  function goList(){ setMode('list'); setEditId(null); }
  function newQuotation(){ setMode('quotation'); setEditId(null); }
  function editDoc(id, type){ setEditId(id); setMode(type === 'proforma' ? 'proforma' : 'quotation'); }

  // Proforma editor route removed from navigation (still accessible if editing existing proforma)
  if (mode === 'proforma') return <ProformaHtmlEditor docId={editId} onBack={goList} />;
  if (mode === 'quotation') return <QuotationHtmlEditor docId={editId} onBack={goList} />;

  return (
    <DocsDashboard
      onOpenNewQuotation={newQuotation}
      onOpenEdit={editDoc}
    />
  );
}


