import { Entity, Document, Settings } from "./types";
import { generateId } from "./utils";

export const sampleEntities: Entity[] = [
  {
    id: generateId(),
    name: "Acme Corporation",
    email: "billing@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, Suite 100\nNew York, NY 10001",
    taxNumber: "TAX-123456",
    vatRate: 20,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: generateId(),
    name: "Tech Solutions LLC",
    email: "accounts@techsolutions.com",
    phone: "+1 (555) 987-6543",
    address: "456 Innovation Drive\nSan Francisco, CA 94102",
    taxNumber: "TAX-789012",
    vatRate: 18,
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: generateId(),
    name: "Global Enterprises",
    email: "finance@globalent.com",
    phone: "+1 (555) 246-8135",
    address: "789 Corporate Plaza\nChicago, IL 60601",
    taxNumber: "TAX-345678",
    vatRate: 20,
    createdAt: "2026-01-10T00:00:00.000Z",
  },
];

export function initializeSampleData() {
  // Only initialize if no data exists
  const existingDocs = localStorage.getItem("invoiceapp_documents");
  const existingEntities = localStorage.getItem("invoiceapp_entities");
  
  if (!existingEntities) {
    localStorage.setItem("invoiceapp_entities", JSON.stringify(sampleEntities));
  }

  if (!existingDocs) {
    const sampleInvoice: Document = {
      id: generateId(),
      type: "invoice",
      number: "INV-0001",
      entityId: sampleEntities[0].id,
      status: "paid",
      issueDate: "2026-01-15T00:00:00.000Z",
      dueDate: "2026-02-15T00:00:00.000Z",
      lineItems: [
        {
          id: generateId(),
          description: "Website Development Services",
          quantity: 40,
          unitPrice: 150,
          taxRate: 20,
          amount: 7200,
        },
        {
          id: generateId(),
          description: "UI/UX Design",
          quantity: 20,
          unitPrice: 100,
          taxRate: 20,
          amount: 2400,
        },
      ],
      subtotal: 8000,
      taxAmount: 1600,
      total: 9600,
      notes: "Thank you for your business!",
      createdAt: "2026-01-15T00:00:00.000Z",
      updatedAt: "2026-01-15T00:00:00.000Z",
    };

    const sampleInvoice2: Document = {
      id: generateId(),
      type: "invoice",
      number: "INV-0002",
      entityId: sampleEntities[1].id,
      status: "sent",
      issueDate: "2026-01-16T00:00:00.000Z",
      dueDate: "2026-02-16T00:00:00.000Z",
      lineItems: [
        {
          id: generateId(),
          description: "Consulting Services",
          quantity: 10,
          unitPrice: 200,
          taxRate: 18,
          amount: 2360,
        },
      ],
      subtotal: 2000,
      taxAmount: 360,
      total: 2360,
      notes: "Payment due within 30 days",
      createdAt: "2026-01-16T00:00:00.000Z",
      updatedAt: "2026-01-16T00:00:00.000Z",
    };

    localStorage.setItem("invoiceapp_documents", JSON.stringify([sampleInvoice, sampleInvoice2]));
  }
}
