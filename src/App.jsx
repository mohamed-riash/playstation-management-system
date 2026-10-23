import React, { useState } from 'react';
import { AudioProvider } from './context/AudioContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CashierPinModal } from './components/layout/CashierPinModal';

// Feature Views
import { DevicesView } from './components/devices/DevicesView';
import { WalkInPOS } from './components/pos/WalkInPOS';
import { InvoicesTable } from './components/invoices/InvoicesTable';
import { InvoiceReceiptModal } from './components/invoices/InvoiceReceiptModal';
import { ShiftClosureModal } from './components/invoices/ShiftClosureModal';
import { StockTable } from './components/inventory/StockTable';
import { ReportsView } from './components/reports/ReportsView';
import { ExpensesView } from './components/reports/ExpensesView';
import { SettingsView } from './components/settings/SettingsView';

function DashboardContent() {
  const { activeTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'devices':
        return <DevicesView />;
      case 'pos':
        return <WalkInPOS />;
      case 'invoices':
        return <InvoicesTable />;
      case 'inventory':
        return <StockTable />;
      case 'reports':
        return <ReportsView />;
      case 'expenses':
        return <ExpensesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DevicesView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (Offset for Right Sidebar in RTL on lg screens) */}
      <div className="lg:mr-72 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Dynamic Page View Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <InvoiceReceiptModal />
      <ShiftClosureModal />
      <CashierPinModal />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppProvider>
        <DashboardContent />
      </AppProvider>
    </AudioProvider>
  );
}
