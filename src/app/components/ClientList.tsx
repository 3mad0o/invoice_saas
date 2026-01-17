import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { storage } from "@/lib/storage";
import { Entity } from "@/lib/types";
import { generateId } from "@/lib/utils";

export function ClientList() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    taxNumber: "",
    vatRate: 0,
  });

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = () => {
    setEntities(storage.getEntities());
  };

  const filteredEntities = entities.filter((entity) =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      taxNumber: "",
      vatRate: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (entity: Entity) => {
    setFormData({
      name: entity.name,
      email: entity.email,
      phone: entity.phone || "",
      address: entity.address || "",
      taxNumber: entity.taxNumber || "",
      vatRate: entity.vatRate || 0,
    });
    setEditingId(entity.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      storage.deleteEntity(id);
      loadEntities();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      storage.updateEntity(editingId, formData);
    } else {
      const entity: Entity = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      storage.addEntity(entity);
    }

    loadEntities();
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="mt-1 text-gray-600">Manage your client information and contacts</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      {!showForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search clients..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Client" : "Add New Client"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vatRate">VAT Rate (%)</Label>
                  <Input
                    id="vatRate"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.vatRate}
                    onChange={(e) =>
                      setFormData({ ...formData, vatRate: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <textarea
                    id="address"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update" : "Add"} Client</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Client List */}
      {!showForm && (
        <Card>
          <CardHeader>
            <CardTitle>All Clients ({filteredEntities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEntities.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p>No clients found</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
                  Add your first client
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Name</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Email</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Phone</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Tax Number</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">VAT Rate</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEntities.map((entity) => (
                      <tr key={entity.id}>
                        <td className="py-3 text-sm font-medium text-gray-900">{entity.name}</td>
                        <td className="py-3 text-sm text-gray-600">{entity.email}</td>
                        <td className="py-3 text-sm text-gray-600">{entity.phone || "-"}</td>
                        <td className="py-3 text-sm text-gray-600">{entity.taxNumber || "-"}</td>
                        <td className="py-3 text-sm text-gray-600">{entity.vatRate || 0}%</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(entity)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(entity.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
