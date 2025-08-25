import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Megaphone, TrendingUp, Users, MessageCircle, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignPerformance({ campaigns = [], usage = [], isLoading = false }) {
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
  const safeUsage = Array.isArray(usage) ? usage : [];

  // Generate sample data if no campaigns exist
  const sampleCampaigns = [
    {
      id: 'camp-1',
      name: 'Summer VIP Night',
      status: 'active',
      conversions: 28,
      contacts_reached: 156,
      responses_received: 89,
      revenue_generated: 4200,
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'camp-2',
      name: 'Weekend Party',
      status: 'completed',
      conversions: 15,
      contacts_reached: 89,
      responses_received: 45,
      revenue_generated: 2100,
      start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'camp-3',
      name: 'Exclusive Club',
      status: 'scheduled',
      conversions: 0,
      contacts_reached: 0,
      responses_received: 0,
      revenue_generated: 0,
      start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const displayCampaigns = safeCampaigns.length > 0 ? safeCampaigns : sampleCampaigns;

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      scheduled: 'bg-purple-100 text-purple-800 border-purple-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.draft;
  };

  const calculateConversionRate = (campaign) => {
    if (!campaign) return 0;
    const contacts = campaign.contacts_reached || 0;
    const conversions = campaign.conversions || 0;
    return contacts > 0 ? (conversions / contacts * 100) : 0;
  };

  const calculateResponseRate = (campaign) => {
    if (!campaign) return 0;
    const contacts = campaign.contacts_reached || 0;
    const responses = campaign.responses_received || 0;
    return contacts > 0 ? (responses / contacts * 100) : 0;
  };

  // Prepare chart data
  const chartData = displayCampaigns.map(campaign => ({
    name: campaign?.name?.substring(0, 10) || 'Unknown',
    conversions: campaign?.conversions || 0,
    contacts: campaign?.contacts_reached || 0,
    revenue: campaign?.revenue_generated || 0
  }));

  if (isLoading) {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-3" />
                  <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Chart */}
      <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            Campaign Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="conversions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="contacts" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <div className="text-lg font-bold text-purple-600">
                {displayCampaigns.reduce((sum, c) => sum + (c?.conversions || 0), 0)}
              </div>
              <div className="text-xs text-gray-600">Total Conversions</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-lg font-bold text-blue-600">
                {displayCampaigns.reduce((sum, c) => sum + (c?.contacts_reached || 0), 0)}
              </div>
              <div className="text-xs text-gray-600">Total Contacts</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
              <div className="text-lg font-bold text-emerald-600">
                ₪{displayCampaigns.reduce((sum, c) => sum + (c?.revenue_generated || 0), 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <div className="text-lg font-bold text-yellow-600">
                {displayCampaigns.filter(c => c?.status === 'active').length}
              </div>
              <div className="text-xs text-gray-600">Active Campaigns</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Campaign Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayCampaigns.map((campaign, index) => {
          if (!campaign) return null;
          
          const conversionRate = calculateConversionRate(campaign);
          const responseRate = calculateResponseRate(campaign);
          
          return (
            <Card key={campaign.id || `campaign-${index}`} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900 mb-2">
                      {campaign.name || 'Unnamed Campaign'}
                    </CardTitle>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status || 'unknown'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">
                      ₪{(campaign.revenue_generated || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.conversions || 0} conversions
                        </div>
                        <div className="text-xs text-gray-500">
                          {conversionRate.toFixed(1)}% rate
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.responses_received || 0} responses
                        </div>
                        <div className="text-xs text-gray-500">
                          {responseRate.toFixed(1)}% rate
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span className="font-medium">{conversionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={conversionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="font-medium">{responseRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={responseRate} className="h-2" />
                    </div>
                  </div>

                  {/* Contact Stats */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Contacts Reached
                      </span>
                      <span className="font-medium text-gray-900">
                        {(campaign.contacts_reached || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}