import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  QrCode, 
  DollarSign, 
  Users, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TicketingStats({ tickets, venues, isLoading }) {
  // Calculate stats from the tickets data
  const stats = {
    totalTickets: tickets?.length || 0,
    scannedTickets: tickets?.filter(t => t.is_used).length || 0,
    revenue: tickets?.reduce((sum, t) => sum + (t.ticket_price || 0), 0) || 0,
    pendingPayments: tickets?.filter(t => t.payment_status === 'pending').length || 0
  };

  const statCards = [
    {
      title: "Tickets Sold",
      value: stats.totalTickets,
      icon: QrCode,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "Scanned Entries", 
      value: stats.scannedTickets,
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      subtitle: `${stats.totalTickets > 0 ? Math.round((stats.scannedTickets / stats.totalTickets) * 100) : 0}% of tickets`
    },
    {
      title: "Ticket Revenue",
      value: `₪${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-400", 
      bgColor: "bg-yellow-500/20"
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={stat.title} className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 glow-effect group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <div className={`text-2xl font-bold ${stat.color} mb-2 group-hover:text-white transition-colors`}>
                {stat.value}
              </div>
            )}
            {stat.subtitle && (
              <p className="text-xs text-slate-400">{stat.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}