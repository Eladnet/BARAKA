import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket,
  Users,
  DollarSign,
  Target,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function ProductionPlan() {
  const launchPhases = [
    {
      phase: "Beta Launch",
      duration: "2 שבועות",
      status: "ready",
      venues: "5-10 מועדונים נבחרים",
      focus: "בדיקות ואופטימיזציה",
      revenue: "₪25,000",
      milestones: [
        "הפעלת 5 מועדונים בת״א",
        "יצירת 25 יחצנים AI",
        "שליחת 2,500 הודעות",
        "איסוף משוב ושיפורים"
      ]
    },
    {
      phase: "Regional Expansion", 
      duration: "4 שבועות",
      status: "planned",
      venues: "25+ מועדונים",
      focus: "הרחבה ארצית",
      revenue: "₪100,000",
      milestones: [
        "השקה בירושלים וחיפה",
        "שיתופי פעולה עם רשתות",
        "קמפיין שיווקי",
        "הגדלת צוות תמיכה"
      ]
    },
    {
      phase: "International Launch",
      duration: "8 שבועות", 
      status: "planned",
      venues: "15+ מועדונים בינ״ל",
      focus: "השקה בינלאומית",
      revenue: "₪250,000",
      milestones: [
        "השקה בקפריסין ויוון",
        "תמיכה רב-לשונית מלאה",
        "אמצעי תשלום מקומיים",
        "שותפויות מקומיות"
      ]
    }
  ];

  const technicalRequirements = [
    {
      category: "Infrastructure",
      items: [
        { name: "Production Database", status: "ready" },
        { name: "Load Balancer", status: "configured" },
        { name: "CDN Setup", status: "ready" },
        { name: "SSL Certificates", status: "active" },
        { name: "Backup Systems", status: "configured" }
      ]
    },
    {
      category: "Security",
      items: [
        { name: "API Security", status: "implemented" },
        { name: "Data Encryption", status: "active" },
        { name: "Access Control", status: "configured" },
        { name: "Monitoring", status: "active" },
        { name: "Incident Response", status: "ready" }
      ]
    },
    {
      category: "Integrations",
      items: [
        { name: "WhatsApp Business API", status: "active" },
        { name: "OpenAI Integration", status: "optimized" },
        { name: "Payment Gateways", status: "testing" },
        { name: "Analytics Tools", status: "configured" },
        { name: "Email Services", status: "active" }
      ]
    }
  ];

  const businessProjections = {
    year1: {
      venues: 150,
      revenue: "₪2.4M",
      users: "45,000",
      messages: "1.2M"
    },
    year2: {
      venues: 400,
      revenue: "₪8.5M", 
      users: "120,000",
      messages: "4.5M"
    },
    year3: {
      venues: 850,
      revenue: "₪18M",
      users: "280,000", 
      messages: "12M"
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 neon-text">
            📋 Production Launch Plan
          </h1>
          <p className="text-xl text-purple-300">
            TICKET PULSE v2.2 - Strategic Rollout Plan
          </p>
        </div>

        {/* Launch Phases */}
        <div className="grid gap-6 mb-8">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Rocket className="w-6 h-6 text-purple-400" />
                🚀 Launch Phases Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {launchPhases.map((phase, index) => (
                  <div key={index} className="relative">
                    {index < launchPhases.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-20 bg-purple-500/30"></div>
                    )}
                    
                    <div className="flex gap-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                        phase.status === 'ready' ? 'bg-emerald-500' : 
                        phase.status === 'active' ? 'bg-yellow-500' : 'bg-slate-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{phase.phase}</h3>
                          <Badge className={`${
                            phase.status === 'ready' ? 'bg-emerald-500/20 text-emerald-300' :
                            phase.status === 'active' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-slate-500/20 text-slate-300'
                          }`}>
                            {phase.status}
                          </Badge>
                          <Badge variant="outline">{phase.duration}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-slate-800/50 p-3 rounded-lg">
                            <p className="text-slate-400 text-sm">Venues</p>
                            <p className="text-white font-semibold">{phase.venues}</p>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg">
                            <p className="text-slate-400 text-sm">Focus</p>
                            <p className="text-white font-semibold">{phase.focus}</p>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg">
                            <p className="text-slate-400 text-sm">Expected Revenue</p>
                            <p className="text-emerald-400 font-semibold">{phase.revenue}</p>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg">
                            <p className="text-slate-400 text-sm">Status</p>
                            <p className="text-purple-400 font-semibold">{phase.status}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {phase.milestones.map((milestone, mIndex) => (
                            <div key={mIndex} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">{milestone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {technicalRequirements.map((category, index) => (
            <Card key={index} className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between">
                      <span className="text-slate-300">{item.name}</span>
                      <Badge className={
                        item.status === 'active' || item.status === 'ready' || item.status === 'implemented' || item.status === 'optimized' ? 
                        'bg-emerald-500/20 text-emerald-300' :
                        item.status === 'configured' ?
                        'bg-blue-500/20 text-blue-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Projections */}
        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              📈 3-Year Business Projections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(businessProjections).map(([year, data], index) => (
                <div key={year} className="bg-slate-800/50 p-6 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-purple-400 mb-4">
                    Year {index + 1}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Active Venues</p>
                      <p className="text-white text-xl font-semibold">{data.venues}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Annual Revenue</p>
                      <p className="text-emerald-400 text-xl font-semibold">{data.revenue}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Active Users</p>
                      <p className="text-blue-400 text-xl font-semibold">{data.users}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Messages/Month</p>
                      <p className="text-purple-400 text-xl font-semibold">{data.messages}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Launch Readiness */}
        <Card className="bg-gradient-to-r from-emerald-900/90 to-blue-900/90 backdrop-blur-xl border-emerald-500/50 text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">
              ✅ Production Ready
            </h3>
            <p className="text-emerald-200 mb-6 text-lg">
              TICKET PULSE v2.2 is fully prepared for production launch
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg">
                🚀 Initialize Launch Sequence
              </Button>
              <Button variant="outline" className="border-emerald-500 text-emerald-300 px-8 py-3 text-lg">
                📋 Review Final Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}