import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { storage } from "@/lib/storage";
import { Document, LineItem, Entity } from "@/lib/types";
import { generateId } from "@/lib/utils";
import StyledSelect, { Option } from "./ui/StyledSelect";

const statusOptions: Option[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
];

export function InvoiceCreate() {
  const navigate = useNavigate();
  const settings = storage.getSettings();
  const [entities, setEntities] = useState<Entity[]>([]);
  
  const [formData, setFormData] = useState({
    entityId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "draft" as const,
    notes: "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: generateId(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: settings.defaultTaxRate,
      amount: 0,
    },
  ]);

  useEffect(() => {
    setEntities(storage.getEntities());
  }, []);

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: settings.defaultTaxRate,
        amount: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate amount
          const subtotal = updated.quantity * updated.unitPrice;
          updated.amount = subtotal + (subtotal * updated.taxRate) / 100;
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = lineItems.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate) / 100,
      0
    );
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { subtotal, taxAmount, total } = calculateTotals();
    const documentNumber = storage.getDocuments().filter((d) => d.type === "invoice").length + 1;

    const invoice: Document = {
      id: generateId(),
      type: "invoice",
      number: `${settings.invoicePrefix}${String(documentNumber).padStart(4, "0")}`,
      entityId: formData.entityId,
      status: formData.status,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      lineItems,
      subtotal,
      taxAmount,
      total,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.addDocument(invoice);
    navigate("/dashboard/invoices");
  };

  const { subtotal, taxAmount, total } = calculateTotals();
  const entityOptions = entities.map(entity => ({ value: entity.id, label: entity.name }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/invoices")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
          <p className="mt-1 text-gray-600">Fill in the details to create a new invoice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="entity">Client *</Label>
                <StyledSelect
                  id="entity"
                  options={entityOptions}
                  value={entityOptions.find(opt => opt.value === formData.entityId)}
                  onChange={(option) => setFormData({ ...formData, entityId: option?.value || "" })}
                  placeholder="Select a client"
                  isClearable
                />
                {entities.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No clients found.{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/clients")}
                      className="text-blue-600 hover:underline"
                    >
                      Add a client first
                    </button>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <StyledSelect
                  id="status"
                  options={statusOptions}
                  value={statusOptions.find(opt => opt.value === formData.status)}
                  onChange={(option) => setFormData({ ...formData, status: option?.value as any || "draft" })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  required
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={handleAddLineItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={item.id} className="space-y-4 rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveLineItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Description *</Label>
                    <Input
                      placeholder="Item description"
                      required
                      value={item.description}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "description", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={item.quantity}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "quantity", parseFloat(e.target.value) || 1)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit Price *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.taxRate}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "taxRate", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <Label>Amount (incl. tax)</Label>
                    <Input value={item.amount.toFixed(2)} disabled />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{subtotal.toFixed(2)} {settings.defaultCurrency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{taxAmount.toFixed(2)} {settings.defaultCurrency}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                <span>Total:</span>
                <span>{total.toFixed(2)} {settings.defaultCurrency}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/invoices")}>
            Cancel
          </Button>
          <Button type="submit">Create Invoice</Button>
        </div>
      </form>
    </div>
  );
}
