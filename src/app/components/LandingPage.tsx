import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { FileText, Receipt, FileCheck, Users, Settings, Download, CheckCircle } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">InvoiceHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Professionalllll Invoice Management
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Create, manage, and track invoices, receipts, and credit notes effortlessly.
            Perfect for SMEs, accountants, and enterprises.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need</h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features to streamline your financial operations
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-blue-600" />}
              title="Invoices"
              description="Create professional invoices with custom branding and automatic calculations"
            />
            <FeatureCard
              icon={<Receipt className="h-10 w-10 text-green-600" />}
              title="Receipts"
              description="Generate detailed receipts for all your transactions with ease"
            />
            <FeatureCard
              icon={<FileCheck className="h-10 w-10 text-purple-600" />}
              title="Credit Notes"
              description="Manage refunds and adjustments with credit note generation"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-orange-600" />}
              title="Entity Management"
              description="Store and manage client information, tax details, and addresses"
            />
            <FeatureCard
              icon={<Download className="h-10 w-10 text-red-600" />}
              title="PDF Export"
              description="Download professional PDFs ready for printing or email"
            />
            <FeatureCard
              icon={<Settings className="h-10 w-10 text-indigo-600" />}
              title="Customization"
              description="Configure tax rates, currency, branding, and document prefixes"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Why Choose InvoiceHub?</h2>
              <ul className="mt-8 space-y-4">
                <BenefitItem text="Real-time financial dashboard with key metrics" />
                <BenefitItem text="Track payment status and overdue invoices" />
                <BenefitItem text="Multi-currency support" />
                <BenefitItem text="VAT/Tax calculations per entity" />
                <BenefitItem text="Responsive design for all devices" />
                <BenefitItem text="Secure local storage for your data" />
              </ul>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 p-12">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600">10K+</div>
                <div className="mt-2 text-lg text-gray-700">Businesses Trust Us</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-lg text-blue-100">
            Join thousands of businesses managing their finances with InvoiceHub
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button size="lg" className="h-12 bg-white px-8 text-blue-600 hover:bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2026 InvoiceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
      <span className="text-gray-700">{text}</span>
    </li>
  );
}
