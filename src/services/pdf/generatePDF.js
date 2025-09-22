/**
 * PDF Generator Service
 * Supports Proforma & Quotation
 * Options: banking info (Proforma only), currency conversion, signatures
 */

import jsPDF from "jspdf";

export function generatePDF(data, type = "proforma", opts = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const isProforma = type === "proforma";
  const title = isProforma ? "PROFORMA INVOICE" : "QUOTATION / DEVIS";

  const margin = 15;
  let y = margin;

  // Header
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text("SenHarvest Group", margin, y);
  doc.setFontSize(12).setFont("helvetica", "normal");
  doc.text(data.company?.address || "Dakar, Sénégal", margin, (y += 8));
  doc.text(`Email: ${data.company?.email || "info@senharvest.com"}`, margin, (y += 6));
  doc.text(`Tel: ${data.company?.phone || "+221 ..."}`, margin, (y += 6));

  // Title
  doc.setFontSize(16).setFont("helvetica", "bold");
  doc.text(title, margin, (y += 15));

  // Document meta
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(`No: ${data.proforma?.number || "REF-001"}`, margin, (y += 8));
  doc.text(`Date: ${data.proforma?.date || new Date().toLocaleDateString("fr-FR")}`, margin, (y += 6));
  doc.text(
    `Validity: ${data.proforma?.validity || "30 days"}`,
    margin,
    (y += 6)
  );

  // Parties
  y += 10;
  doc.setFont("helvetica", "bold").text("Exporter / Seller:", margin, y);
  doc.setFont("helvetica", "normal").text(data.company?.name || "SenHarvest LLC", margin, (y += 6));
  doc.text(data.company?.address || "", margin, (y += 6));

  y += 8;
  doc.setFont("helvetica", "bold").text("Importer / Buyer:", margin, y);
  doc.setFont("helvetica", "normal").text(data.client?.name || "Client Name", margin, (y += 6));
  doc.text(data.client?.address || "", margin, (y += 6));

  // Banking info (Proforma only)
  if (isProforma && opts.showBank) {
    y += 10;
    doc.setFont("helvetica", "bold").text("Banking Information:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Bank: ${data.company?.bankName || "-"}`, margin, (y += 6));
    doc.text(`IBAN: ${data.company?.iban || "-"}`, margin, (y += 6));
    doc.text(`SWIFT: ${data.company?.swift || "-"}`, margin, (y += 6));
  }

  // Table headers
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Description", margin, y);
  doc.text("Qty", 110, y);
  doc.text("Unit", 130, y);
  doc.text("Unit Price", 150, y);
  doc.text("Total", 180, y);

  doc.setFont("helvetica", "normal");
  let total = 0;

  (data.products || []).forEach((p) => {
    y += 8;
    const subtotal = Number(p.quantity) * Number(p.unitPrice);
    total += subtotal;
    doc.text(p.description, margin, y);
    doc.text(String(p.quantity), 110, y);
    doc.text(p.unit || "", 130, y);
    doc.text(`${p.unitPrice} ${data.proforma?.currency || "USD"}`, 150, y);
    doc.text(`${subtotal.toFixed(2)} ${data.proforma?.currency || "USD"}`, 180, y);
  });

  // Totals
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${total.toFixed(2)} ${data.proforma?.currency || "USD"}`, 150, y);

  // Terms & Conditions
  y += 15;
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("Terms & Conditions:", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  (data.terms || []).forEach((t) => {
    y += 6;
    doc.text(`- ${t}`, margin, y);
  });

  // Signatures
  y += 20;
  doc.setFont("helvetica", "bold").text("Seller:", margin, y);
  if (isProforma) doc.text("Buyer:", 120, y);

  return doc.output("blob");
}
