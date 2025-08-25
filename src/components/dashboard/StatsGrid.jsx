import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  DollarSign, 
  Bot, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Crown,
  Activity,
  CheckCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsGrid({ stats = {}, isLoading = false }) {
  const safeStats = stats || {};

  // Default values for all stats
  const defaultStats = {
    totalRevenue: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    totalLeads: 0,
    newLeads: 0,
    returningCustomers: 0,
    totalConversions: 0,
    todayContacts: 0,
    responseRate: 0,
    activePromoters: 0,
    activeCampaigns: 0,
    avgROI: 0,
    ...safeStats
  };

  const statCards = [
    {
      title: "Daily Revenue",
      value: `₪${(defaultStats.dailyRevenue || 0).toLocaleString()}`,
      change: "+15% from yesterday",
      changeType: "positive",
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Active Promoters", 
      value: defaultStats.activePromoters || 0,
      change: "All Systems Active",
      changeType: "neutral",
      icon: Bot,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Leads",
      value: defaultStats.totalLeads || 0,
      change: `+${defaultStats.newLeads || 0} this week`,
      changeType: "positive",
      icon: Users,
      color: "from-purple-500 to-pink-500", 
      bgColor: "bg-purple-50"
    },
    {
      title: "Average ROI",
      value: `${(defaultStats.avgROI || 0).toFixed(1)}%`,
      change: "Target: 150%",
      changeType: defaultStats.avgROI >= 150 ? "positive" : "neutral",
      icon: Target,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Today's Contacts",
      value: defaultStats.todayContacts || 0,
      change: `${(defaultStats.responseRate || 0).toFixed(1)}% response rate`,
      changeType: "neutral",
      icon: MessageCircle,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Conversions",
      value: defaultStats.totalConversions || 0,
      change: `${defaultStats.returningCustomers || 0} returning`,
      changeType: "positive",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Campaigns",
      value: defaultStats.activeCampaigns || 0,
      change: "Running smoothly",
      changeType: "neutral",
      icon: Activity,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Weekly Revenue",
      value: `₪${(defaultStats.weeklyRevenue || 0).toLocaleString()}`,
      change: "+22% from last week",
      changeType: "positive",
      icon: TrendingUp,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50"
    }
  ];

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive':
        return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
      case 'negative':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <Zap className="w-4 h-4 text-blue-500" />;
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-emerald-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} className="bg-white border-0 shadow-lg animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        if (!stat) return null;
        
        const IconComponent = stat.icon || Activity;
        
        return (
          <Card 
            key={`stat-${index}`} 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 font-medium">
                  {stat.title || 'Unknown Metric'}
                </CardTitle>
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {stat.value || '0'}
              </div>
              <div className="flex items-center gap-2">
                {getChangeIcon(stat.changeType)}
                <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                  {stat.change || 'No change'}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}