
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Bot,
  Zap,
  ArrowUpRight,
  Activity,
  Crown,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  Sparkles,
  Star,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "@/components/lib/translations";

// Import components with safe fallbacks
import StatsGrid from "../components/dashboard/StatsGrid";
import RevenueChart from "../components/dashboard/RevenueChart";
import CampaignPerformance from "../components/dashboard/CampaignPerformance";
import PromoterPerformance from "../components/dashboard/PromoterPerformance";
import RecentActivity from "../components/dashboard/RecentActivity";
import TopLeads from "../components/dashboard/TopLeads";
import AIControlCenter from "../components/dashboard/AIControlCenter";
import NotificationCenter from "../components/dashboard/NotificationCenter";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [dashboardData, setDashboardData] = useState({
    promoters: [],
    leads: [],
    campaigns: [],
    interactions: [],
    purchases: [],
    usage: [],
    stats: {
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
      avgROI: 0
    },
    notifications: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Safe data loading with fallbacks
      const sampleData = {
        promoters: [
          { id: 'p1', name: 'Maya', is_active: true, total_conversions: 25 },
          { id: 'p2', name: 'Alex', is_active: true, total_conversions: 18 },
          { id: 'p3', name: 'Sarah', is_active: false, total_conversions: 12 }
        ],
        leads: [
          { id: 'l1', first_name: 'John', last_name: 'Doe', status: 'converted', total_spent: 1200, events_attended: 3 },
          { id: 'l2', first_name: 'Jane', last_name: 'Smith', status: 'vip', total_spent: 2500, events_attended: 5 },
          { id: 'l3', first_name: 'Mike', last_name: 'Johnson', status: 'engaged', total_spent: 800, events_attended: 2 }
        ],
        campaigns: [
          { id: 'c1', name: 'Summer Party', status: 'active', conversions: 15 },
          { id: 'c2', name: 'VIP Night', status: 'completed', conversions: 22 }
        ],
        interactions: [
          {
            id: 'i1',
            interaction_type: 'message_sent',
            lead_id: 'l1',
            campaign_id: 'c1',
            interaction_timestamp: new Date().toISOString(),
            sentiment: 'positive'
          },
          {
            id: 'i2',
            interaction_type: 'conversion',
            lead_id: 'l2',
            conversion_value: 150,
            interaction_timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            sentiment: 'positive'
          }
        ],
        usage: [
          { date: new Date().toISOString().split('T')[0], total_cost: 45, whatsapp_messages_sent: 20, facebook_messages_sent: 15, instagram_messages_sent: 10, conversions: 3 }
        ]
      };

      const stats = calculateDetailedStats(
        sampleData.promoters,
        sampleData.leads,
        sampleData.campaigns,
        sampleData.interactions,
        [],
        sampleData.usage
      );

      const notifications = generateNotifications(sampleData.promoters, sampleData.leads, sampleData.campaigns, sampleData.interactions);

      setDashboardData({
        ...sampleData,
        stats,
        notifications
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set safe fallback data
      setDashboardData({
        promoters: [],
        leads: [],
        campaigns: [],
        interactions: [],
        purchases: [],
        usage: [],
        stats: {
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
          avgROI: 0
        },
        notifications: []
      });
    }
    setIsLoading(false);
  };

  const calculateDetailedStats = (promoters = [], leads = [], campaigns = [], interactions = [], purchases = [], usage = []) => {
    const safePromoters = Array.isArray(promoters) ? promoters : [];
    const safeLeads = Array.isArray(leads) ? leads : [];
    const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
    const safeInteractions = Array.isArray(interactions) ? interactions : [];
    const safeUsage = Array.isArray(usage) ? usage : [];

    const totalRevenue = safeLeads.reduce((sum, l) => sum + (l?.total_spent || 0), 0);
    const dailyRevenue = totalRevenue * 0.1; // Simulate daily portion
    const weeklyRevenue = totalRevenue * 0.3; // Simulate weekly portion
    const monthlyRevenue = totalRevenue * 0.8; // Simulate monthly portion

    const newLeads = Math.floor(safeLeads.length * 0.3);
    const returningCustomers = safeLeads.filter(l => (l?.events_attended || 0) > 1).length;
    const totalConversions = safeLeads.filter(l => l?.status === 'converted' || l?.status === 'vip').length;

    const todayContacts = safeInteractions.filter(i => i?.interaction_type === 'message_sent').length;
    const todayResponses = safeInteractions.filter(i => i?.interaction_type === 'message_received').length;
    const responseRate = todayContacts > 0 ? (todayResponses / todayContacts * 100) : 0;

    const activePromoters = safePromoters.filter(p => p?.is_active).length;
    const activeCampaigns = safeCampaigns.filter(c => c?.status === 'active').length;

    const totalCampaignCost = safeUsage.reduce((sum, u) => sum + (u?.total_cost || 0), 0);
    const avgROI = totalCampaignCost > 0 ? ((totalRevenue - totalCampaignCost) / totalCampaignCost * 100) : 150;

    return {
      totalRevenue,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalLeads: safeLeads.length,
      newLeads,
      returningCustomers,
      totalConversions,
      todayContacts,
      responseRate,
      activePromoters,
      activeCampaigns,
      avgROI
    };
  };

  const generateNotifications = (promoters = [], leads = [], campaigns = [], interactions = []) => {
    const notifications = [];

    try {
      const safeLeads = Array.isArray(leads) ? leads : [];

      // Sample notifications
      if (safeLeads.length > 0) {
        const highSpender = safeLeads.find(l => (l?.total_spent || 0) > 1000);
        if (highSpender) {
          notifications.push({
            id: `notification_${Date.now()}`,
            type: 'success',
            title: 'VIP Customer Active!',
            message: `${highSpender.first_name || 'Customer'} ${highSpender.last_name || ''} (₪${highSpender.total_spent}) is engaging`,
            timestamp: new Date().toISOString(),
            action: 'view_lead',
            actionData: { leadId: highSpender.id }
          });
        }
      }
    } catch (error) {
      console.error('Error generating notifications:', error);
    }

    return notifications;
  };

  const handleUpdateLead = async (leadId, updateData) => {
    try {
      if (!leadId || !updateData) {
        throw new Error('Missing required parameters');
      }

      console.log('Updating lead:', { leadId, updateData });

      // Simulate update
      await new Promise(resolve => setTimeout(resolve, 500));

      await loadDashboardData();

      return { success: true };
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  };

  // Safe component rendering with fallbacks
  const renderStatsCards = () => {
    const stats = dashboardData?.stats || {};

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {t("Daily Revenue")}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ₪{(stats.dailyRevenue || 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600 font-medium">
                {t("+15% from yesterday")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {t("Active Promoters")}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.activePromoters || 0}
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">
                All Systems Active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {t("Total Leads")}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.totalLeads || 0}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-purple-600 font-medium">
                +{stats.newLeads || 0} this week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {t("Average ROI")}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {(stats.avgROI || 0).toFixed(1)}%
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 font-medium">
                {t("Excellent Performance")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="py-8">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {t("Control Center")}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {t("Real-time business analytics and insights")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDashboardData}
                  disabled={isLoading}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                <div className="flex bg-white rounded-2xl p-1 shadow-lg border border-gray-100">
                  {['day', 'week', 'month'].map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                      className={`text-sm px-4 py-2 rounded-xl transition-all ${
                        timeRange === range
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {t(range === 'day' ? 'Day' : range === 'week' ? 'Week' : 'Month')}
                    </Button>
                  ))}
                </div>

                <NotificationCenter notifications={dashboardData.notifications || []} />
              </div>
            </div>

            {/* Quick Stats Cards */}
            {renderStatsCards()}
          </div>
        </div>

        {/* Modern Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-2 h-16">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200 text-sm"
            >
              {t("Overview")}
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200 text-sm"
            >
              {t("Campaigns")}
            </TabsTrigger>
            <TabsTrigger
              value="promoters"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200 text-sm"
            >
              {t("Promoters")}
            </TabsTrigger>
            <TabsTrigger
              value="ai-control"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200 text-sm hidden sm:block"
            >
              {t("AI Control")}
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200 text-sm hidden sm:block"
            >
              {t("Customers")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RevenueChart
                  data={dashboardData.usage || []}
                  timeRange={timeRange}
                  isLoading={isLoading}
                />
              </div>

              <QuickActions />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentActivity
                interactions={dashboardData.interactions || []}
                isLoading={isLoading}
              />
              <TopLeads
                leads={dashboardData.leads || []}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignPerformance
              campaigns={dashboardData.campaigns || []}
              usage={dashboardData.usage || []}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="promoters">
            <PromoterPerformance
              promoters={dashboardData.promoters || []}
              interactions={dashboardData.interactions || []}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="ai-control">
            <AIControlCenter
              promoters={dashboardData.promoters || []}
              interactions={dashboardData.interactions || []}
              leads={dashboardData.leads || []}
              onDataRefresh={loadDashboardData}
              onUpdateLead={handleUpdateLead}
            />
          </TabsContent>

          <TabsContent value="customers">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TopLeads
                  leads={dashboardData.leads || []}
                  isLoading={isLoading}
                  showAll={true}
                />
              </div>
              <div>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      {t("Customer Insights")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                      <span className="text-gray-700 font-medium">
                        {t("VIP Customers")}
                      </span>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
                        {(dashboardData.leads || []).filter(l => l?.status === 'vip').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <span className="text-gray-700 font-medium">
                        {t("Returning Customers")}
                      </span>
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none">
                        {dashboardData.stats?.returningCustomers || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                      <span className="text-gray-700 font-medium">
                        {t("New This Week")}
                      </span>
                      <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none">
                        {dashboardData.stats?.newLeads || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
