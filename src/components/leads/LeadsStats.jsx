import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Crown, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadsStats({ allLeads, isLoading }) {
  const stats = {
    total: allLeads.length,
    converted: allLeads.filter(l => l.status === 'converted').length,
    vips: allLeads.filter(l => l.status === 'vip').length,
    engagement: allLeads.length > 0 ? ((allLeads.filter(l => l.status === 'engaged' || l.status === 'converted' || l.status === 'vip').length / allLeads.length) * 100).toFixed(1) : 0,
  };

  const statCards = [
    { 
      title: "Total Leads", 
      value: stats.total, 
      icon: Users, 
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      title: "Converted", 
      value: stats.converted, 
      icon: UserCheck, 
      color: "text-emerald-600", 
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    { 
      title: "VIPs", 
      value: stats.vips, 
      icon: Crown, 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    { 
      title: "Engagement", 
      value: `${stats.engagement}%`, 
      icon: Activity, 
      color: "text-pink-600", 
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
  ];

  return (
    <>
      {statCards.map(stat => (
        <Card 
          key={stat.title} 
          className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-md transition-shadow duration-200 h-32 flex flex-col`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 flex-shrink-0">
            <CardTitle className="text-sm font-medium text-gray-700 truncate">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex items-center">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className={`text-3xl font-bold ${stat.color} leading-none`}>{stat.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}