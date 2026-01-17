import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { storage } from "@/lib/storage";
import { Settings } from "@/lib/types";
import { Save } from "lucide-react";
import StyledSelect, { Option } from "./ui/StyledSelect";

const currencyOptions: Option[] = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
];

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(storage.getSettings());
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Manage your company information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Your business details that appear on documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  required
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email *</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  required
                  value={settings.companyEmail}
                  onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input
                  id="companyPhone"
                  type="tel"
                  value={settings.companyPhone || ""}
                  onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxNumber">Tax Number</Label>
                <Input
                  id="taxNumber"
                  value={settings.taxNumber || ""}
                  onChange={(e) => setSettings({ ...settings, taxNumber: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <textarea
                  id="companyAddress"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  value={settings.companyAddress || ""}
                  onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Settings</CardTitle>
            <CardDescription>Default values for financial calculations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency *</Label>
                <StyledSelect
                  id="defaultCurrency"
                  options={currencyOptions}
                  value={currencyOptions.find(opt => opt.value === settings.defaultCurrency)}
                  onChange={(option) => setSettings({ ...settings, defaultCurrency: option?.value || "USD" })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTaxRate">Default Tax Rate (%) *</Label>
                <Input
                  id="defaultTaxRate"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={settings.defaultTaxRate}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultTaxRate: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Prefixes */}
        <Card>
          <CardHeader>
            <CardTitle>Document Numbering</CardTitle>
            <CardDescription>Prefixes for document numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Invoice Prefix *</Label>
                <Input
                  id="invoicePrefix"
                  required
                  placeholder="INV-"
                  value={settings.invoicePrefix}
                  onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiptPrefix">Receipt Prefix *</Label>
                <Input
                  id="receiptPrefix"
                  required
                  placeholder="REC-"
                  value={settings.receiptPrefix}
                  onChange={(e) => setSettings({ ...settings, receiptPrefix: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditNotePrefix">Credit Note Prefix *</Label>
                <Input
                  id="creditNotePrefix"
                  required
                  placeholder="CN-"
                  value={settings.creditNotePrefix}
                  onChange={(e) => setSettings({ ...settings, creditNotePrefix: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          {saved && (
            <span className="flex items-center text-sm text-green-600">
              Settings saved successfully!
            </span>
          )}
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
