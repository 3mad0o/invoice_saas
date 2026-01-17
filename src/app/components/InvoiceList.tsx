import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Plus, Search, Download, Eye, Edit, Trash2 } from "lucide-react";
import { storage } from "@/lib/storage";
import { Document } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import StyledSelect, { Option } from "./ui/StyledSelect";

const statusOptions: Option[] = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

export function InvoiceList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const docs = storage.getDocuments().filter((d) => d.type === "invoice");
    setDocuments(docs);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      storage.deleteDocument(id);
      loadDocuments();
    }
  };

  const handleDownloadPDF = (doc: Document) => {
    const pdf = new jsPDF();
    const settings = storage.getSettings();
    const entity = storage.getEntities().find((e) => e.id === doc.entityId);

    // Header
    pdf.setFontSize(24);
    pdf.text("INVOICE", 20, 20);
    
    pdf.setFontSize(10);
    pdf.text(`Invoice #: ${doc.number}`, 20, 35);
    pdf.text(`Date: ${formatDate(doc.issueDate)}`, 20, 42);
    if (doc.dueDate) {
      pdf.text(`Due Date: ${formatDate(doc.dueDate)}`, 20, 49);
    }

    // Company Info
    pdf.text(settings.companyName, 140, 35);
    if (settings.companyEmail) pdf.text(settings.companyEmail, 140, 42);
    if (settings.companyPhone) pdf.text(settings.companyPhone, 140, 49);

    // Client Info
    if (entity) {
      pdf.text("Bill To:", 20, 65);
      pdf.text(entity.name, 20, 72);
      if (entity.email) pdf.text(entity.email, 20, 79);
      if (entity.address) pdf.text(entity.address, 20, 86);
    }

    // Line Items Table
    const tableData = doc.lineItems.map((item) => [
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice, settings.defaultCurrency),
      `${item.taxRate}%`,
      formatCurrency(item.amount, settings.defaultCurrency),
    ]);

    autoTable(pdf, {
      startY: 100,
      head: [["Description", "Quantity", "Unit Price", "Tax", "Amount"]],
      body: tableData,
      foot: [
        ["", "", "", "Subtotal:", formatCurrency(doc.subtotal, settings.defaultCurrency)],
        ["", "", "", "Tax:", formatCurrency(doc.taxAmount, settings.defaultCurrency)],
        ["", "", "", "Total:", formatCurrency(doc.total, settings.defaultCurrency)],
      ],
    });

    pdf.save(`invoice-${doc.number}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-gray-600">Manage and track all your invoices</p>
        </div>
        <Link to="/dashboard/invoices/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <StyledSelect
              options={statusOptions}
              value={statusOptions.find(opt => opt.value === filterStatus)}
              onChange={(option) => setFilterStatus(option?.value || "all")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices ({filteredDocs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocs.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No invoices found</p>
              <Link to="/dashboard/invoices/create">
                <Button variant="outline" className="mt-4">
                  Create your first invoice
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Number</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Client</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Issue Date</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Due Date</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600">Amount</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocs.map((doc) => {
                    const entity = storage.getEntities().find((e) => e.id === doc.entityId);
                    return (
                      <tr key={doc.id}>
                        <td className="py-3 text-sm font-medium text-gray-900">{doc.number}</td>
                        <td className="py-3 text-sm text-gray-600">{entity?.name || "Unknown"}</td>
                        <td className="py-3 text-sm text-gray-600">{formatDate(doc.issueDate)}</td>
                        <td className="py-3 text-sm text-gray-600">
                          {doc.dueDate ? formatDate(doc.dueDate) : "-"}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="py-3 text-right text-sm font-medium text-gray-900">
                          {formatCurrency(doc.total, storage.getSettings().defaultCurrency)}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadPDF(doc)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "success" | "warning" | "error" | "secondary"> = {
    draft: "secondary",
    sent: "default",
    paid: "success",
    overdue: "error",
    cancelled: "error",
  };

  return (
    <Badge variant={variants[status] || "default"} className="capitalize">
      {status}
    </Badge>
  );
}
