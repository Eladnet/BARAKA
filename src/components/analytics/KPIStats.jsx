import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Target,
  Calendar,
  Repeat
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function KPIStats({ leads = [], campaigns = [], interactions = [], isLoading = false }) {
  // Calculate KPIs safely with default values
  const calculateKPIs = () => {
    const safeLeads = Array.isArray(leads) ? leads : [];
    const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
    const safeInteractions = Array.isArray(interactions) ? interactions : [];

    const totalRevenue = safeLeads.reduce((sum, lead) => sum + (lead.total_spent || 0), 0);
    const totalLeads = safeLeads.length;
    const conversionRate = totalLeads > 0 ? (safeLeads.filter(l => l.status === 'converted' || l.status === 'vip').length / totalLeads * 100) : 0;
    const avgDealSize = totalLeads > 0 ? totalRevenue / totalLeads : 0;
    const customerLifetimeValue = avgDealSize * 2.5; // Estimated CLV
    const monthlyRecurringRevenue = totalRevenue * 0.15; // Estimated MRR

    return {
      totalRevenue,
      totalLeads,
      conversionRate,
      avgDealSize,
      customerLifetimeValue,
      monthlyRecurringRevenue
    };
  };

  const kpis = calculateKPIs();

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `₪${kpis.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
      change: "+18.2%"
    },
    {
      title: "Total Leads",
      value: kpis.totalLeads.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      change: "+12.5%"
    },
    {
      title: "Conversion Rate",
      value: `${kpis.conversionRate.toFixed(1)}%`,
      icon: Target,
      color: "from-purple-500 to-pink-500",
      change: "+3.1%"
    },
    {
      title: "Average Deal",
      value: `₪${kpis.avgDealSize.toFixed(0)}`,
      icon: TrendingUp,
      color: "from-yellow-500 to-orange-500",
      change: "+8.7%"
    },
    {
      title: "CLV",
      value: `₪${kpis.customerLifetimeValue.toFixed(0)}`,
      icon: Repeat,
      color: "from-indigo-500 to-purple-500",
      change: "+15.3%"
    },
    {
      title: "MRR",
      value: `₪${kpis.monthlyRecurringRevenue.toFixed(0)}`,
      icon: Calendar,
      color: "from-pink-500 to-rose-500",
      change: "+22.1%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
      {kpiCards.map((kpi, index) => (
        <Card key={kpi.title} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {kpi.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${kpi.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-200`}>
              <kpi.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 sm:h-8 w-20 sm:w-24 mb-2" />
            ) : (
              <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {kpi.value}
              </div>
            )}
            <div className="flex items-center gap-1">
              <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                {kpi.change}
              </span>
              <span className="text-xs text-gray-400 ml-1">This Month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}