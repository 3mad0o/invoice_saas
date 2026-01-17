// Generic component for Receipts and Credit Notes
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Plus, Search, Download, Trash2 } from "lucide-react";
import { storage } from "@/lib/storage";
import { Document, DocumentType } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function DocumentList({ type }: { type: DocumentType }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const titles = {
    receipt: { singular: "Receipt", plural: "Receipts" },
    credit_note: { singular: "Credit Note", plural: "Credit Notes" },
    invoice: { singular: "Invoice", plural: "Invoices" },
  };

  const createPaths = {
    receipt: "/dashboard/receipts/create",
    credit_note: "/dashboard/credit-notes/create",
    invoice: "/dashboard/invoices/create",
  };

  useEffect(() => {
    loadDocuments();
  }, [type]);

  const loadDocuments = () => {
    const docs = storage.getDocuments().filter((d) => d.type === type);
    setDocuments(docs);
  };

  const filteredDocs = documents.filter((doc) =>
    doc.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${titles[type].singular.toLowerCase()}?`)) {
      storage.deleteDocument(id);
      loadDocuments();
    }
  };

  const handleDownloadPDF = (doc: Document) => {
    const pdf = new jsPDF();
    const settings = storage.getSettings();
    const entity = storage.getEntities().find((e) => e.id === doc.entityId);

    pdf.setFontSize(24);
    pdf.text(titles[type].singular.toUpperCase(), 20, 20);
    
    pdf.setFontSize(10);
    pdf.text(`${titles[type].singular} #: ${doc.number}`, 20, 35);
    pdf.text(`Date: ${formatDate(doc.issueDate)}`, 20, 42);

    pdf.text(settings.companyName, 140, 35);

    if (entity) {
      pdf.text("To:", 20, 60);
      pdf.text(entity.name, 20, 67);
    }

    const tableData = doc.lineItems.map((item) => [
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice, settings.defaultCurrency),
      formatCurrency(item.amount, settings.defaultCurrency),
    ]);

    autoTable(pdf, {
      startY: 80,
      head: [["Description", "Quantity", "Unit Price", "Amount"]],
      body: tableData,
      foot: [
        ["", "", "Total:", formatCurrency(doc.total, settings.defaultCurrency)],
      ],
    });

    pdf.save(`${type}-${doc.number}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{titles[type].plural}</h1>
          <p className="mt-1 text-gray-600">Manage and track all your {titles[type].plural.toLowerCase()}</p>
        </div>
        <Button className="gap-2" onClick={() => navigate(createPaths[type])}>
          <Plus className="h-4 w-4" />
          New {titles[type].singular}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={`Search ${titles[type].plural.toLowerCase()}...`}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All {titles[type].plural} ({filteredDocs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocs.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No {titles[type].plural.toLowerCase()} found</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate(createPaths[type])}>
                Create your first {titles[type].singular.toLowerCase()}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Number</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Client</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Date</th>
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
                        <td className="py-3">
                          <Badge variant="success" className="capitalize">
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right text-sm font-medium text-gray-900">
                          {formatCurrency(doc.total, storage.getSettings().defaultCurrency)}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleDownloadPDF(doc)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(doc.id)}>
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
