import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Ticket,
  Calendar,
  Target,
  PieChart
} from "lucide-react";

export default function StatisticsTab({ tickets = [], venues = [], leads = [] }) {
  // חישוב סטטיסטיקות
  const stats = {
    totalRevenue: tickets.reduce((sum, t) => sum + (t.ticket_price || 0), 0),
    totalTickets: tickets.length,
    usedTickets: tickets.filter(t => t.is_used).length,
    totalCustomers: leads.length,
    activeVenues: venues.filter(v => v.is_active).length,
    averageTicketPrice: tickets.length > 0 ? 
      tickets.reduce((sum, t) => sum + (t.ticket_price || 0), 0) / tickets.length : 0,
    conversionRate: tickets.length > 0 ? 
      (tickets.filter(t => t.is_used).length / tickets.length * 100) : 0
  };

  // נתונים לתצוגה גרפית
  const monthlyData = {
    labels: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני'],
    revenue: [15000, 18000, 22000, 19000, 25000, 30000],
    tickets: [150, 180, 220, 190, 250, 300]
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">סה"כ הכנסות</p>
                <p className="text-3xl font-bold text-gray-900">₪{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-emerald-600 text-xs flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% מהחודש הקודם
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">כרטיסים שנמכרו</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTickets.toLocaleString()}</p>
                <p className="text-blue-600 text-xs flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% מהחודש הקודם
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">אחוז שימוש</p>
                <p className="text-3xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
                <p className="text-purple-600 text-xs flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  יעד: 85%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">לקוחות פעילים</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <p className="text-yellow-600 text-xs flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  +15 החודש
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              הכנסות חודשיות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.labels.map((month, index) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{month}</span>
                  <div className="flex items-center gap-4 flex-1 mx-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(monthlyData.revenue[index] / 30000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-emerald-600 font-bold min-w-[80px] text-right">
                      ₪{monthlyData.revenue[index].toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Types Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              התפלגות סוגי אירועים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'מסיבות טכנו', percentage: 45, color: 'bg-purple-500' },
                { name: 'אירועים פרטיים', percentage: 25, color: 'bg-blue-500' },
                { name: 'קונצרטים', percentage: 20, color: 'bg-emerald-500' },
                { name: 'פסטיבלים', percentage: 10, color: 'bg-yellow-500' }
              ].map((type) => (
                <div key={type.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">{type.name}</span>
                    <span className="text-gray-900 font-bold">{type.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${type.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">מדדי ביצוע מפתח</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">מחיר כרטיס ממוצע</span>
              <span className="text-emerald-600 font-bold">₪{stats.averageTicketPrice.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">מקומות פעילים</span>
              <span className="text-blue-600 font-bold">{stats.activeVenues}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">כרטיסים שנוצלו</span>
              <span className="text-purple-600 font-bold">{stats.usedTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">הכנסה לכרטיס</span>
              <span className="text-yellow-600 font-bold">
                ₪{stats.totalTickets > 0 ? (stats.totalRevenue / stats.totalTickets).toFixed(0) : 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">טרנדים שבועיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day, index) => {
              const sales = [12, 8, 6, 10, 25, 35, 40][index];
              return (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-gray-700 w-16 font-medium">{day}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(sales / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-blue-600 font-bold w-8 text-right">{sales}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">יעדים והישגים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">יעד הכנסות חודשי</span>
                <span className="text-emerald-600 font-bold">₪50,000</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.totalRevenue / 50000) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {((stats.totalRevenue / 50000) * 100).toFixed(1)}% מהיעד
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">יעד כרטיסים חודשי</span>
                <span className="text-blue-600 font-bold">500</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.totalTickets / 500) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {((stats.totalTickets / 500) * 100).toFixed(1)}% מהיעד
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">יעד לקוחות חודשי</span>
                <span className="text-purple-600 font-bold">100</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.totalCustomers / 100) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {((stats.totalCustomers / 100) * 100).toFixed(1)}% מהיעד
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}