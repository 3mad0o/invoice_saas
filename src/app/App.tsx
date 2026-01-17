import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import { InvoiceList } from "./components/InvoiceList";
import { InvoiceCreate } from "./components/InvoiceCreate";
import { DocumentList } from "./components/DocumentList";
import { DocumentCreate } from "./components/DocumentCreate";
import { ClientList } from "./components/ClientList";
import { SettingsPage } from "./components/SettingsPage";
import { storage } from "@/lib/storage";
import { AccountStatement } from "./components/AccountStatement";

function App() {
  const isAuthenticated = () => {
    return storage.getUser() !== null;
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
          {/* Invoices */}
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/create" element={<InvoiceCreate />} />
          
          {/* Receipts */}
          <Route path="receipts" element={<DocumentList type="receipt" />} />
          <Route path="receipts/create" element={<DocumentCreate type="receipt" />} />
          
          {/* Credit Notes */}
          <Route path="credit-notes" element={<DocumentList type="credit_note" />} />
          <Route path="credit-notes/create" element={<DocumentCreate type="credit_note" />} />
          
          {/* Clients */}
          <Route path="clients" element={<ClientList />} />
          
          {/* Account Statement */}
          <Route path="account-statement" element={<AccountStatement />} />
          
          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
