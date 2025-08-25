import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bot, 
  MessageCircle, 
  MousePointer, 
  ShoppingBag, 
  TrendingUp,
  DollarSign 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignsStats({ campaigns, isLoading }) {
  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalMessages: campaigns.reduce((sum, c) => sum + (c.messages_sent || 0), 0),
    totalResponses: campaigns.reduce((sum, c) => sum + (c.responses_received || 0), 0),
    totalConversions: campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0),
    totalRevenue: campaigns.reduce((sum, c) => sum + (c.revenue_generated || 0), 0)
  };

  const responseRate = stats.totalMessages > 0 ? 
    ((stats.totalResponses / stats.totalMessages) * 100).toFixed(1) : 0;
  
  const conversionRate = stats.totalMessages > 0 ? 
    ((stats.totalConversions / stats.totalMessages) * 100).toFixed(1) : 0;

  const statCards = [
    {
      title: "Active AI Campaigns",
      value: stats.activeCampaigns,
      total: stats.totalCampaigns,
      icon: Bot,
      color: "from-blue-500 to-cyan-500",
      subtitle: `${stats.totalCampaigns} total campaigns`
    },
    {
      title: "Messages Sent",
      value: stats.totalMessages.toLocaleString(),
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
      subtitle: `${responseRate}% response rate`
    },
    {
      title: "Conversions",
      value: stats.totalConversions,
      icon: ShoppingBag,
      color: "from-emerald-500 to-green-500",
      subtitle: `${conversionRate}% conversion rate`
    },
    {
      title: "Revenue Generated",
      value: `₪${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      subtitle: "From AI campaigns"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={stat.title} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon className="w-4 h-4 text-gray-700" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500">
                  {stat.subtitle}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}