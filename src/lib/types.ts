export type DocumentStatus = "draft" | "sent" | "paid" | "cancelled" | "overdue";
export type DocumentType = "invoice" | "receipt" | "credit_note";

export interface Entity {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  vatRate?: number;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
}

export interface Document {
  id: string;
  type: DocumentType;
  number: string;
  entityId: string;
  status: DocumentStatus;
  issueDate: string;
  dueDate?: string;
  lineItems: LineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  taxNumber?: string;
  logo?: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  invoicePrefix: string;
  receiptPrefix: string;
  creditNotePrefix: string;
}
