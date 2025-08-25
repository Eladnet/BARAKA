import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityLog } from "@/api/entities";
import { ConversationState } from "@/api/entities";
import { User } from "@/api/entities";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, Users, MessageCircle, TrendingUp, Filter } from "lucide-react";

export default function ActivityAnalytics() {
  const [activities, setActivities] = useState([]);
  const [conversationStates, setConversationStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedComponent, setSelectedComponent] = useState('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, selectedComponent]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const userFilter = { created_by: user.email };

      // טווח תאריכים
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      // טעינת נתונים
      const [activitiesData, conversationsData] = await Promise.all([
        ActivityLog.filter(
          {
            ...userFilter,
            ...(selectedComponent !== 'all' && { component: selectedComponent })
          }, 
          '-created_date', 
          1000
        ).catch(() => []),
        ConversationState.filter(userFilter, '-created_date', 500).catch(() => [])
      ]);

      // סינון לפי תאריך
      const filteredActivities = activitiesData.filter(activity => {
        const activityDate = new Date(activity.created_date);
        return activityDate >= startDate && activityDate <= endDate;
      });

      const filteredConversations = conversationsData.filter(conversation => {
        const conversationDate = new Date(conversation.created_date);
        return conversationDate >= startDate && conversationDate <= endDate;
      });

      setActivities(filteredActivities);
      setConversationStates(filteredConversations);

    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
    setIsLoading(false);
  };

  // חישוב סטטיסטיקות
  const stats = {
    totalActivities: activities.length,
    uniqueUsers: new Set(activities.map(a => a.user_id)).size,
    conversionsCount: activities.filter(a => a.activity_type === 'conversion').length,
    avgSessionDuration: activities.reduce((sum, a) => sum + (a.response_time_ms || 0), 0) / activities.length || 0,
    topComponents: Object.entries(
      activities.reduce((acc, a) => {
        acc[a.component] = (acc[a.component] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a).slice(0, 5)
  };

  // נתוני גרפים
  const activityByHour = activities.reduce((acc, activity) => {
    const hour = new Date(activity.created_date).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    activities: activityByHour[i] || 0
  }));

  const componentData = stats.topComponents.map(([component, count]) => ({
    name: component,
    value: count,
    percentage: Math.round((count / activities.length) * 100)
  }));

  const conversionFunnelData = [
    { stage: 'Opening', count: conversationStates.filter(c => c.stage_history?.some(s => s.stage === 'opening')).length },
    { stage: 'Discovery', count: conversationStates.filter(c => c.stage_history?.some(s => s.stage === 'needs_discovery')).length },
    { stage: 'Value Prop', count: conversationStates.filter(c => c.stage_history?.some(s => s.stage === 'value_proposition')).length },
    { stage: 'Objections', count: conversationStates.filter(c => c.stage_history?.some(s => s.stage === 'objection_handling')).length },
    { stage: 'Closing', count: conversationStates.filter(c => c.stage_history?.some(s => s.stage === 'closing')).length },
    { stage: 'Converted', count: conversationStates.filter(c => c.conversion_outcome?.converted).length }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* כותרת ופילטרים */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Analytics</h2>
          <p className="text-gray-600">מעקב מקיף אחר כל הפעולות במערכת</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 שעות</SelectItem>
              <SelectItem value="7d">7 ימים</SelectItem>
              <SelectItem value="30d">30 ימים</SelectItem>
              <SelectItem value="90d">90 ימים</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedComponent} onValueChange={setSelectedComponent}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הרכיבים</SelectItem>
              <SelectItem value="dashboard">Dashboard</SelectItem>
              <SelectItem value="conversations">Conversations</SelectItem>
              <SelectItem value="campaigns">Campaigns</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* סטטיסטיקות מהירות */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Total Activities</CardTitle>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalActivities.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">In selected period</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Active Users</CardTitle>
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.uniqueUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Unique users</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Conversions</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.conversionsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Successful conversions</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Avg Response</CardTitle>
              <MessageCircle className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{Math.round(stats.avgSessionDuration)}ms</div>
            <p className="text-xs text-gray-500 mt-1">Average response time</p>
          </CardContent>
        </Card>
      </div>

      {/* גרפים */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* פעילות לפי שעות */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Activity by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activities" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* פילוח לפי רכיבים */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Activity by Component</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={componentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {componentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* משפך המרות */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={conversionFunnelData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* פעילויות אחרונות */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.slice(0, 20).map((activity, index) => (
              <div key={activity.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {activity.activity_type}
                  </Badge>
                  <span className="text-sm text-gray-700">
                    {activity.component} - {activity.action_details?.element_text?.substr(0, 50) || 'No details'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.created_date).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}