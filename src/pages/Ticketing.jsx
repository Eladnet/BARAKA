import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  QrCode, 
  Ticket, 
  Plus,
  Users,
  DollarSign,
  Scan,
  Calendar,
  TrendingUp,
  Eye,
  CheckCircle,
  Sparkles,
  RefreshCw,
  ArrowUpRight
} from "lucide-react";
import { User } from "@/api/entities";
import { EventQR } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

import TicketingStats from "../components/ticketing/TicketingStats";
import QRGenerator from "../components/ticketing/QRGenerator";
import TicketScanner from "../components/ticketing/TicketScanner";
import CreateEventForm from "../components/ticketing/CreateEventForm";
import CustomersTab from "../components/ticketing/CustomersTab";
import StatisticsTab from "../components/ticketing/StatisticsTab";
import SalesTeamTab from "../components/ticketing/SalesTeamTab";

export default function TicketingPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalSold: 0,
    scannedEntries: 0,
    revenue: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    loadTicketingData();
  }, []);

  const loadTicketingData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const ticketData = await EventQR.filter({ created_by: user.email }, '-created_date', 500);
      
      setTickets(ticketData);
      
      // Calculate stats
      const totalSold = ticketData.length;
      const scannedEntries = ticketData.filter(ticket => ticket.is_used).length;
      const revenue = ticketData.reduce((sum, ticket) => sum + (ticket.ticket_price || 0), 0);
      const pendingPayments = ticketData.filter(ticket => 
        ticket.payment_status === 'pending'
      ).reduce((sum, ticket) => sum + (ticket.ticket_price || 0), 0);

      setStats({
        totalSold,
        scannedEntries,
        revenue,
        pendingPayments
      });

    } catch (error) {
      console.error('Error loading ticketing data:', error);
    }
    setIsLoading(false);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      console.log('Creating event:', eventData);
      setShowCreateEvent(false);
      loadTicketingData();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const renderStatsCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {t("Tickets Sold")}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.totalSold}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">
                +12% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {t("Scanned Entries")}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.scannedEntries}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600 font-medium">
                96% entry rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {t("Total Revenue")}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ₪{stats.revenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 font-medium">
                Total earned
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600 font-medium">
                {t("Pending Payments")}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ₪{stats.pendingPayments}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 font-medium">
                Awaiting payment
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
        {/* Header */}
        <div className="py-8">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Ticket className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {t("Advanced Ticketing System")}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {t("Complete management of events, tickets, and sales")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadTicketingData}
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
              </div>
            </div>

            {/* Stats Cards */}
            {renderStatsCards()}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="events" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-2 h-16">
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200"
            >
              {t("Events")}
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200"
            >
              {t("Customers")}
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200"
            >
              {t("Statistics")}
            </TabsTrigger>
            <TabsTrigger
              value="sales-team"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200"
            >
              {t("Sales Team")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{t("Event management")}</h2>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowCreateEvent(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("Create new event")}
                </Button>
                <Button 
                  onClick={() => setShowQRGenerator(true)}
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR
                </Button>
                <Button 
                  onClick={() => setShowScanner(true)}
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {t("QR scanner")}
                </Button>
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("No events yet")}</h3>
                  <p className="text-gray-600 mb-6">{t("Create and manage your events")}</p>
                  <Button 
                    onClick={() => setShowCreateEvent(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("Create new event")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <CustomersTab tickets={tickets} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsTab tickets={tickets} stats={stats} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="sales-team">
            <SalesTeamTab tickets={tickets} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showCreateEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateEvent(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <CreateEventForm 
                  onEventCreated={handleCreateEvent}
                  venues={[]}
                />
              </div>
            </div>
          </div>
        )}

        {showQRGenerator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQRGenerator(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <QRGenerator />
              </div>
            </div>
          </div>
        )}

        {showScanner && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Ticket Scanner</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScanner(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <TicketScanner />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}