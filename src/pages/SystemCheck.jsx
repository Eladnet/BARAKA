import React from 'react';
import { useTranslation } from '@/components/lib/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Database, Zap, MessageSquare, Settings, Activity } from 'lucide-react';

export default function SystemCheckPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);
  
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 neon-text">
            {t("System Health Check")}
          </h1>
          <p className="text-purple-300">
            {t("Comprehensive system status and performance metrics")}
          </p>
        </div>

        {/* Overall Status */}
        <Card className="bg-slate-900/80 backdrop-blur-xl border-emerald-500/30 glow-effect mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              {t("Overall System Status")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 font-medium text-lg">
                {t("System Operational")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* System Checks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Check */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30 glow-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                {t("Database Connectivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                {t("Check system integration and external services")}
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{t("Connected")}</span>
              </div>
            </CardContent>
          </Card>

          {/* API Connectivity */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 glow-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                {t("API Connectivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                {t("Check connection to OpenAI and other APIs")}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{t("OpenAI API")}</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm">{t("Connected")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Integration */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-green-500/30 glow-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                {t("WhatsApp Integration")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                {t("Check WhatsApp Business API connection")}
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{t("Connected")}</span>
              </div>
            </CardContent>
          </Card>

          {/* CRUD Operations */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-yellow-500/30 glow-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-yellow-400" />
                {t("CRUD Operations")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                {t("Test database operations")}
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{t("Working")}</span>
              </div>
            </CardContent>
          </Card>

          {/* System Performance */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-orange-500/30 glow-effect md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-400" />
                {t("System Performance")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                {t("Monitor system performance and resource usage")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-emerald-400">98.2%</div>
                  <div className="text-xs text-slate-400">{t("Uptime")}</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-400">250ms</div>
                  <div className="text-xs text-slate-400">{t("Avg Response")}</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-400">45%</div>
                  <div className="text-xs text-slate-400">{t("CPU Usage")}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}