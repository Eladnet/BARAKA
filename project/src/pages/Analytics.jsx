
import React, { useState, useEffect } from "react";
import { Lead } from "@/api/entities";
import { Campaign } from "@/api/entities";
import { Interaction } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  MessageCircle,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { useTranslation } from '@/components/lib/translations';

import AnalyticsToolbar from "../components/analytics/AnalyticsToolbar";
import KPIStats from "../components/analytics/KPIStats";
import LeadsOverTimeChart from "../components/analytics/LeadsOverTimeChart";
import ConversionsByCampaignChart from "../components/analytics/ConversionsByCampaignChart";
import LeadStatusDistributionChart from "../components/analytics/LeadStatusDistributionChart";
import HotLeadsTable from "../components/analytics/HotLeadsTable";

export default function AnalyticsPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [analyticsData, setAnalyticsData] = useState({
    leads: [],
    campaigns: [],
    interactions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    campaign: 'all'
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, filters]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const userFilter = { created_by: user.email };

      const [leads, campaigns, interactions] = await Promise.all([
        Lead.filter(userFilter, '-created_date', 1000).catch(() => []),
        Campaign.filter(userFilter, '-created_date', 100).catch(() => []),
        Interaction.filter(userFilter, '-interaction_timestamp', 1000).catch(() => [])
      ]);

      // Ensure all arrays are properly initialized
      setAnalyticsData({
        leads: Array.isArray(leads) ? leads : [],
        campaigns: Array.isArray(campaigns) ? campaigns : [],
        interactions: Array.isArray(interactions) ? interactions : []
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Safe fallbacks
      setAnalyticsData({
        leads: [],
        campaigns: [],
        interactions: []
      });
    }
    setIsLoading(false);
  };

  const handleExportData = () => {
    const safeLeads = analyticsData.leads || [];

    // Export analytics data as CSV
    const csvData = safeLeads.map(lead => ({
      name: `${lead.first_name || ''} ${lead.last_name || ''}`,
      status: lead.status || 'unknown',
      score: lead.score || 0,
      total_spent: lead.total_spent || 0,
      created_date: lead.created_date || ''
    }));

    const csv = [
      ['Name', 'Status', 'Score', 'Total Spent', 'Created Date'],
      ...csvData.map(row => [row.name, row.status, row.score, row.total_spent, row.created_date])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-export.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Deep insights into your customer data and campaign performance
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={loadAnalyticsData}
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExportData}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Toolbar */}
        <AnalyticsToolbar
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          filters={filters}
          setFilters={setFilters}
          campaigns={analyticsData.campaigns || []}
        />

        {/* KPI Stats - Safe prop passing */}
        <KPIStats
          leads={analyticsData.leads || []}
          campaigns={analyticsData.campaigns || []}
          interactions={analyticsData.interactions || []}
          isLoading={isLoading}
        />

        {/* Main Analytics Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white border-0 shadow-lg rounded-xl p-1 h-14">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="leads"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              Leads Analysis
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              Campaign Performance
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-lg">
                <LeadsOverTimeChart
                  leads={analyticsData.leads}
                  timeRange={timeRange}
                  isLoading={isLoading}
                />
              </Card>
              <Card className="bg-white border-0 shadow-lg">
                <LeadStatusDistributionChart
                  leads={analyticsData.leads}
                  isLoading={isLoading}
                />
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-white border-0 shadow-lg">
                  <ConversionsByCampaignChart
                    campaigns={analyticsData.campaigns}
                    isLoading={isLoading}
                  />
                </Card>
              </div>
              <Card className="bg-white border-0 shadow-lg">
                <HotLeadsTable
                  leads={analyticsData.leads}
                  isLoading={isLoading}
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Lead Quality Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['vip', 'converted', 'engaged', 'warm', 'cold'].map(status => {
                      const count = (analyticsData.leads || []).filter(l => l.status === status).length;
                      const percentage = (analyticsData.leads && analyticsData.leads.length > 0) ? (count / analyticsData.leads.length * 100) : 0;

                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`
                              ${status === 'vip' ? 'border-purple-500 text-purple-600' :
                                status === 'converted' ? 'border-green-500 text-green-600' :
                                status === 'engaged' ? 'border-blue-500 text-blue-600' :
                                status === 'warm' ? 'border-yellow-500 text-yellow-600' :
                                'border-gray-500 text-gray-600'}
                            `}>
                              {status.toUpperCase()}
                            </Badge>
                            <span className="text-gray-700">{count} leads</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₪{(analyticsData.leads || []).reduce((sum, l) => sum + (l.total_spent || 0), 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average per Lead</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₪{(analyticsData.leads && analyticsData.leads.length > 0) ?
                          Math.round(analyticsData.leads.reduce((sum, l) => sum + (l.total_spent || 0), 0) / analyticsData.leads.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Top Spenders</span>
                      <span className="text-lg font-semibold text-purple-600">
                        {(analyticsData.leads || []).filter(l => (l.total_spent || 0) > 1000).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <ConversionsByCampaignChart
                campaigns={analyticsData.campaigns}
                isLoading={isLoading}
                detailed={true}
              />
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">📈 Growth Opportunity</h4>
                      <p className="text-blue-800 text-sm">
                        Your conversion rate from warm to engaged leads is 15% above industry average.
                        Consider increasing outreach to warm leads.
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Attention Needed</h4>
                      <p className="text-yellow-800 text-sm">
                        Cold leads haven't been contacted in 30+ days.
                        Schedule a re-engagement campaign to reactivate them.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">✅ Success Pattern</h4>
                      <p className="text-green-800 text-sm">
                        VIP customers typically convert after 3-4 touchpoints.
                        Current average is 2.8 touchpoints - nearly optimal.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    Engagement Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Best Contact Time</span>
                      <span className="font-semibold text-gray-900">7-9 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Highest Response Rate</span>
                      <span className="font-semibold text-green-600">WhatsApp (78%)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Avg Response Time</span>
                      <span className="font-semibold text-blue-600">15 minutes</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Top Conversion Day</span>
                      <span className="font-semibold text-purple-600">Thursday</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
