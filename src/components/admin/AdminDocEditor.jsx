import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getTradeDoc } from "../../services/firebaseService";
import ProformaQwenWrapper from "../pdf/ProformaQwenWrapper";
import QuotationQwenWrapper from "../pdf/QuotationQwenWrapper";
import NcndaEditor from "./NcndaEditor";

export default function AdminDocEditor({ id: propId }) {
  const params = useParams();
  const location = useLocation();
  const routeId = params?.id || null;
  const id = propId != null ? propId : routeId;
  const navigate = useNavigate();

  // Détecter le type depuis la route
  const isNcndaRoute = location.pathname.includes('/ncnda');
  const initialType = isNcndaRoute ? "ncnda" : "proforma";
  
  const [type, setType] = useState(initialType);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(()=>{ (async()=>{
    if (!id) return setLoading(false);
    const d = await getTradeDoc(id);
    if (d) setType(d.type || "proforma");
    setLoading(false);
  })(); },[id]);

  if (loading) return <div className="p-6">Chargement…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      {!id && !isNcndaRoute && (
        <div className="bg-white border rounded p-4">
          <label className="mr-3">Type :</label>
          <select className="border rounded px-2 py-1" value={type} onChange={e=>setType(e.target.value)}>
            <option value="proforma">Proforma</option>
            <option value="quotation">Devis</option>
          </select>
        </div>
      )}
      <div className="bg-white border rounded">
        {type === "proforma" ? (
          <ProformaQwenWrapper docId={id || null} onBack={()=>navigate(-1)} />
        ) : type === "ncnda" ? (
          <NcndaEditor docId={id || null} onBack={()=>navigate(-1)} />
        ) : (
          <QuotationQwenWrapper docId={id || null} onBack={()=>navigate(-1)} />
        )}
      </div>
    </div>
  );
}


