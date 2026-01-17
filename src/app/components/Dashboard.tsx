import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileText, Receipt, FileCheck, DollarSign, TrendingUp, Clock, Plus } from "lucide-react";
import { storage } from "@/lib/storage";
import { Document } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const docs = storage.getDocuments();
    setDocuments(docs);

    const invoices = docs.filter((d) => d.type === "invoice");
    const paid = invoices.filter((d) => d.status === "paid");
    const unpaid = invoices.filter((d) => d.status === "sent" || d.status === "draft");
    const overdue = invoices.filter((d) => {
      if (d.status !== "paid" && d.dueDate) {
        return new Date(d.dueDate) < new Date();
      }
      return false;
    });

    setStats({
      totalInvoices: invoices.length,
      paidInvoices: paid.length,
      unpaidInvoices: unpaid.length,
      overdueInvoices: overdue.length,
      totalRevenue: paid.reduce((sum, inv) => sum + inv.total, 0),
    });
  }, []);

  const recentDocuments = documents.slice(0, 5);

  const chartData = [
    { name: "Invoices", value: stats.totalInvoices },
    { name: "Paid", value: stats.paidInvoices },
    { name: "Unpaid", value: stats.unpaidInvoices },
    { name: "Overdue", value: stats.overdueInvoices },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Here's your financial overview</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/invoices/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices}
          icon={<FileText className="h-6 w-6 text-blue-600" />}
          trend="+12%"
        />
        <StatCard
          title="Paid Invoices"
          value={stats.paidInvoices}
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          trend="+8%"
        />
        <StatCard
          title="Unpaid Invoices"
          value={stats.unpaidInvoices}
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
          trend="-3%"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueInvoices}
          icon={<TrendingUp className="h-6 w-6 text-red-600" />}
          trend={stats.overdueInvoices > 0 ? "Alert" : "Good"}
        />
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-gray-900">
            {formatCurrency(stats.totalRevenue, storage.getSettings().defaultCurrency)}
          </div>
          <p className="mt-2 text-sm text-gray-600">From paid invoices</p>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDocuments.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No documents yet</p>
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
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Type</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td className="py-3 text-sm font-medium text-gray-900">{doc.number}</td>
                      <td className="py-3 text-sm text-gray-600 capitalize">{doc.type.replace("_", " ")}</td>
                      <td className="py-3 text-sm text-gray-600">{formatDate(doc.issueDate)}</td>
                      <td className="py-3">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="py-3 text-right text-sm font-medium text-gray-900">
                        {formatCurrency(doc.total, storage.getSettings().defaultCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            <p className="mt-1 text-sm text-gray-600">{trend}</p>
          </div>
          <div className="rounded-full bg-gray-100 p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
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
