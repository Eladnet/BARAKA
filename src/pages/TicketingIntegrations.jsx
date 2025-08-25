import React from 'react';
import TicketingIntegrationEngine from '../components/integrations/TicketingIntegrationEngine';

export default function TicketingIntegrationsPage() {
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <TicketingIntegrationEngine />
      </div>
    </div>
  );
}