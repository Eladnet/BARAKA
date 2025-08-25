import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  Users, 
  Database, 
  Settings, 
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Mail,
  Bell,
  Key,
  Server,
  BarChart3,
  FileText,
  Zap
} from "lucide-react";
import { User } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

import SuperAdminPanel from "../components/admin/SuperAdminPanel";
import SystemErrorManager from "../components/admin/SystemErrorManager";
import MassCommunications from "../components/admin/MassCommunications";
import FinancialManager from "../components/admin/FinancialManager";

export default function SuperAdminPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    systemHealth: 'good',
    activeErrors: 0,
    totalMessages: 0
  });

  useEffect(() => {
    checkSuperAdminAccess();
    loadSystemStats();
  }, []);

  const checkSuperAdminAccess = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Check if user is super admin
      const superAdminEmails = [
        'elad@bigcohen.com', 
        'dor.azriel@gmail.com', 
        'alihassanvirk.ahv@gmail.com'
      ];
      
      if (!superAdminEmails.includes(user.email)) {
        alert('Access denied. Super Admin privileges required.');
        window.location.href = '/dashboard';
        return;
      }
      
    } catch (error) {
      console.error('Error checking super admin access:', error);
      window.location.href = '/login';
    }
    setIsLoading(false);
  };

  const loadSystemStats = async () => {
    try {
      // Load system statistics
      const allUsers = await User.list();
      
      setSystemStats({
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter(u => u.status === 'active').length,
        totalRevenue: 125000, // Mock data
        systemHealth: 'good',
        activeErrors: 3,
        totalMessages: 45678
      });
      
    } catch (error) {
      console.error('Error loading system stats:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying super admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                👑 Super Admin Panel
              </h1>
              <p className="text-gray-600 text-lg">
                System administration and management console
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
                  <Shield className="w-3 h-3 mr-1" />
                  Super Admin
                </Badge>
                <Badge variant="outline">
                  {currentUser?.email}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                System Alerts
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Total Users
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                {systemStats.activeUsers} active
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  System Health
                </CardTitle>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  systemStats.systemHealth === 'good' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}>
                  {systemStats.systemHealth === 'good' ? 
                    <CheckCircle className="w-4 h-4 text-white" /> :
                    <AlertTriangle className="w-4 h-4 text-white" />
                  }
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                systemStats.systemHealth === 'good' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {systemStats.systemHealth === 'good' ? 'Operational' : 'Issues'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {systemStats.activeErrors} active errors
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Total Revenue
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">₪{systemStats.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                +12% this month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Messages Sent
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{systemStats.totalMessages.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                Today
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Super Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-white border-0 shadow-lg rounded-xl p-1 h-14">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <Server className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger 
              value="communications" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              Communications
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Financial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Database Connection</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">API Services</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Message Queue</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Delayed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Background Jobs</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Running</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-900">High API Error Rate</p>
                          <p className="text-xs text-red-700">WhatsApp API returning 429 errors</p>
                          <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Memory Usage Warning</p>
                          <p className="text-xs text-yellow-700">Server memory usage at 85%</p>
                          <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">System Update Complete</p>
                          <p className="text-xs text-blue-700">Version 2.1.3 deployed successfully</p>
                          <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <SuperAdminPanel />
          </TabsContent>

          <TabsContent value="system">
            <SystemErrorManager />
          </TabsContent>

          <TabsContent value="communications">
            <MassCommunications />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}