import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Zap,
  Shield,
  Database,
  Globe,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  FileText,
  Rocket,
  Target,
  TrendingUp,
  Award,
  Lock,
  Server,
  Smartphone,
  Brain,
  Headphones,
  CreditCard,
  Mail
} from "lucide-react";

export default function ProductionReadiness() {
  const [readinessScore, setReadinessScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const productionChecklist = {
    "🛡️ Security & Compliance": {
      items: [
        { name: "SSL Certificate Configuration", status: "completed", priority: "critical" },
        { name: "API Keys Security", status: "completed", priority: "critical" },
        { name: "Database Encryption", status: "completed", priority: "critical" },
        { name: "GDPR Compliance", status: "completed", priority: "high" },
        { name: "Rate Limiting", status: "completed", priority: "high" },
        { name: "Input Validation", status: "completed", priority: "critical" },
        { name: "Session Management", status: "completed", priority: "critical" }
      ]
    },
    "🚀 Performance & Scalability": {
      items: [
        { name: "Database Optimization", status: "completed", priority: "high" },
        { name: "Caching Strategy", status: "in-progress", priority: "medium" },
        { name: "CDN Configuration", status: "pending", priority: "medium" },
        { name: "Load Balancing", status: "pending", priority: "low" },
        { name: "API Response Times", status: "completed", priority: "high" },
        { name: "Mobile Optimization", status: "completed", priority: "high" }
      ]
    },
    "🤖 AI & Core Features": {
      items: [
        { name: "OpenAI Integration", status: "completed", priority: "critical" },
        { name: "Voice AI System", status: "completed", priority: "high" },
        { name: "WhatsApp Integration", status: "completed", priority: "critical" },
        { name: "Auto Follow-Up Engine", status: "completed", priority: "high" },
        { name: "AI Personality Engine", status: "completed", priority: "high" },
        { name: "Smart Lead Scoring", status: "completed", priority: "medium" },
        { name: "Conversation Analytics", status: "completed", priority: "medium" }
      ]
    },
    "💰 Payment & Billing": {
      items: [
        { name: "Payment Gateway Integration", status: "pending", priority: "critical" },
        { name: "Subscription Management", status: "pending", priority: "critical" },
        { name: "Usage Tracking", status: "completed", priority: "high" },
        { name: "Invoice Generation", status: "pending", priority: "high" },
        { name: "Multi-Currency Support", status: "pending", priority: "medium" }
      ]
    },
    "🌍 Internationalization": {
      items: [
        { name: "Multi-Language Support", status: "completed", priority: "high" },
        { name: "RTL Support", status: "completed", priority: "medium" },
        { name: "Timezone Management", status: "in-progress", priority: "medium" },
        { name: "Local Compliance", status: "pending", priority: "medium" },
        { name: "Currency Localization", status: "pending", priority: "low" }
      ]
    },
    "📊 Monitoring & Analytics": {
      items: [
        { name: "Error Tracking", status: "completed", priority: "critical" },
        { name: "Performance Monitoring", status: "in-progress", priority: "high" },
        { name: "User Analytics", status: "completed", priority: "medium" },
        { name: "Business Intelligence", status: "completed", priority: "medium" },
        { name: "Custom Dashboards", status: "completed", priority: "low" }
      ]
    },
    "📚 Documentation & Support": {
      items: [
        { name: "API Documentation", status: "completed", priority: "high" },
        { name: "User Manual", status: "completed", priority: "high" },
        { name: "Admin Guide", status: "completed", priority: "medium" },
        { name: "Help Center", status: "completed", priority: "medium" },
        { name: "Video Tutorials", status: "pending", priority: "low" }
      ]
    }
  };

  useEffect(() => {
    let completed = 0;
    let total = 0;
    
    Object.values(productionChecklist).forEach(category => {
      category.items.forEach(item => {
        total++;
        if (item.status === 'completed') completed++;
      });
    });
    
    setCompletedTasks(completed);
    setTotalTasks(total);
    setReadinessScore(Math.round((completed / total) * 100));
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'in-progress': return 'text-yellow-400';
      case 'pending': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const deploymentSteps = [
    {
      step: 1,
      title: "🔧 Environment Setup",
      description: "Configure production environment variables and secrets",
      status: "completed",
      tasks: [
        "Set production API keys",
        "Configure database connection",
        "Setup SSL certificates",
        "Environment variables validation"
      ]
    },
    {
      step: 2,
      title: "🗄️ Database Migration",
      description: "Migrate database schema and seed data",
      status: "completed",
      tasks: [
        "Run database migrations",
        "Seed initial data",
        "Setup database backups",
        "Performance optimization"
      ]
    },
    {
      step: 3,
      title: "🚀 Application Deployment",
      description: "Deploy application to production servers",
      status: "ready",
      tasks: [
        "Build production bundle",
        "Deploy to servers",
        "Configure load balancer",
        "Setup monitoring"
      ]
    },
    {
      step: 4,
      title: "🧪 Production Testing",
      description: "Run comprehensive tests in production environment",
      status: "pending",
      tasks: [
        "End-to-end testing",
        "Performance testing",
        "Security testing",
        "User acceptance testing"
      ]
    },
    {
      step: 5,
      title: "📊 Monitoring Setup",
      description: "Configure monitoring and alerting systems",
      status: "pending",
      tasks: [
        "Error tracking setup",
        "Performance monitoring",
        "Uptime monitoring",
        "Alert configuration"
      ]
    },
    {
      step: 6,
      title: "🎯 Go Live",
      description: "Launch application and onboard first customers",
      status: "pending",
      tasks: [
        "DNS configuration",
        "Customer onboarding",
        "Support team training",
        "Launch announcement"
      ]
    }
  ];

  const businessMetrics = {
    marketSize: {
      tam: "כ-50 מיליארד ש״ח",
      sam: "כ-2.5 מיליארד ש״ח",
      som: "כ-250 מיליון ש״ח"
    },
    competitive: [
      { name: "Playpass", strength: "Mobile ticketing", weakness: "No AI promoters" },
      { name: "Fever", strength: "Event discovery", weakness: "Limited CRM" },
      { name: "Tablelist", strength: "VIP booking", weakness: "US focused" },
      { name: "DICE", strength: "Social features", weakness: "No AI automation" }
    ],
    pricing: {
      starter: "₪299/חודש + ₪0.50 להודעה",
      pro: "₪799/חודש + ₪0.30 להודעה", 
      enterprise: "מחיר מותאם אישית"
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 neon-text">
            🚀 Production Readiness
          </h1>
          <p className="text-xl text-purple-300 mb-6">
            TICKET PULSE v2.2 - Ready for Global Launch
          </p>
          
          {/* Overall Progress */}
          <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-emerald-500/50 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Overall Readiness</h3>
                <Badge className={`text-lg px-4 py-2 ${readinessScore >= 90 ? 'bg-emerald-500/20 text-emerald-300' : readinessScore >= 75 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                  {readinessScore}%
                </Badge>
              </div>
              <Progress value={readinessScore} className="h-4 mb-2" />
              <p className="text-slate-400 text-sm">
                {completedTasks} out of {totalTasks} tasks completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="checklist">📋 Readiness Checklist</TabsTrigger>
            <TabsTrigger value="deployment">🚀 Deployment Plan</TabsTrigger>
            <TabsTrigger value="business">💼 Business Metrics</TabsTrigger>
            <TabsTrigger value="launch">🎯 Launch Strategy</TabsTrigger>
          </TabsList>

          {/* Readiness Checklist */}
          <TabsContent value="checklist">
            <div className="grid gap-6">
              {Object.entries(productionChecklist).map(([category, data]) => (
                <Card key={category} className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {category}
                      <Badge variant="outline" className="ml-auto">
                        {data.items.filter(item => item.status === 'completed').length}/{data.items.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.status)}
                            <span className={`font-medium ${getStatusColor(item.status)}`}>
                              {item.name}
                            </span>
                          </div>
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Deployment Plan */}
          <TabsContent value="deployment">
            <div className="grid gap-6">
              {deploymentSteps.map((step) => (
                <Card key={step.step} className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        step.status === 'completed' ? 'bg-emerald-500' : 
                        step.status === 'ready' ? 'bg-yellow-500' : 'bg-slate-600'
                      }`}>
                        {step.step}
                      </div>
                      {step.title}
                      <Badge className={`ml-auto ${
                        step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        step.status === 'ready' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-slate-500/20 text-slate-300'
                      }`}>
                        {step.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">{step.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-300">{task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Business Metrics */}
          <TabsContent value="business">
            <div className="grid gap-6">
              {/* Market Size */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-400" />
                    Market Analysis (TAM/SAM/SOM)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-blue-400">{businessMetrics.marketSize.tam}</h4>
                      <p className="text-slate-400">TAM - Total Addressable Market</p>
                      <p className="text-xs text-slate-500 mt-1">Global nightlife & events</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-purple-400">{businessMetrics.marketSize.sam}</h4>
                      <p className="text-slate-400">SAM - Serviceable Addressable</p>
                      <p className="text-xs text-slate-500 mt-1">AI-enabled venues</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-yellow-400">{businessMetrics.marketSize.som}</h4>
                      <p className="text-slate-400">SOM - Serviceable Obtainable</p>
                      <p className="text-xs text-slate-500 mt-1">Target 3-5 years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Competitive Analysis */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                    Competitive Landscape
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businessMetrics.competitive.map((competitor, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <h5 className="text-white font-semibold">{competitor.name}</h5>
                          <p className="text-emerald-400 text-sm">✓ {competitor.strength}</p>
                          <p className="text-red-400 text-sm">✗ {competitor.weakness}</p>
                        </div>
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-300">
                          Competitor
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Strategy */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                    Pricing Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="text-blue-400 font-semibold mb-2">Starter</h4>
                      <p className="text-white text-lg">{businessMetrics.pricing.starter}</p>
                      <p className="text-slate-400 text-sm">Up to 5 promoters</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
                      <h4 className="text-purple-400 font-semibold mb-2">Pro</h4>
                      <p className="text-white text-lg">{businessMetrics.pricing.pro}</p>
                      <p className="text-slate-400 text-sm">Unlimited promoters</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="text-yellow-400 font-semibold mb-2">Enterprise</h4>
                      <p className="text-white text-lg">{businessMetrics.pricing.enterprise}</p>
                      <p className="text-slate-400 text-sm">White label solution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Launch Strategy */}
          <TabsContent value="launch">
            <div className="grid gap-6">
              {/* Launch Timeline */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-purple-400" />
                    Launch Timeline & Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Phase 1 */}
                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h4 className="text-emerald-400 font-semibold mb-2">Phase 1: Beta Launch (Week 1-2)</h4>
                      <ul className="text-slate-300 space-y-1">
                        <li>• 5-10 selected venues in Tel Aviv</li>
                        <li>• Intensive support and feedback collection</li>
                        <li>• Performance optimization based on real usage</li>
                        <li>• Staff training and documentation refinement</li>
                      </ul>
                    </div>

                    {/* Phase 2 */}
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="text-yellow-400 font-semibold mb-2">Phase 2: Regional Expansion (Week 3-6)</h4>
                      <ul className="text-slate-300 space-y-1">
                        <li>• Launch in Jerusalem, Haifa, Eilat</li>
                        <li>• Partner with local venue groups</li>
                        <li>• Marketing campaign launch</li>
                        <li>• Customer success team scaling</li>
                      </ul>
                    </div>

                    {/* Phase 3 */}
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-purple-400 font-semibold mb-2">Phase 3: International (Month 2-3)</h4>
                      <ul className="text-slate-300 space-y-1">
                        <li>• Launch in Cyprus, Greece</li>
                        <li>• Multi-language support activation</li>
                        <li>• International payment methods</li>
                        <li>• Local compliance and partnerships</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Metrics */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                    Success Metrics & KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-emerald-400 font-semibold mb-3">Month 1 Targets</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Active Venues</span>
                          <span className="text-white font-semibold">25+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">AI Promoters Created</span>
                          <span className="text-white font-semibold">100+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Messages Sent</span>
                          <span className="text-white font-semibold">10,000+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Monthly Revenue</span>
                          <span className="text-white font-semibold">₪50,000+</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-purple-400 font-semibold mb-3">Quarter 1 Goals</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">International Venues</span>
                          <span className="text-white font-semibold">15+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Customer Retention</span>
                          <span className="text-white font-semibold">85%+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">AI Response Rate</span>
                          <span className="text-white font-semibold">65%+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Quarterly Revenue</span>
                          <span className="text-white font-semibold">₪500,000+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ready to Launch Button */}
              <Card className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-xl border-purple-500/50 text-center">
                <CardContent className="p-8">
                  <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    🚀 Ready for Production Launch
                  </h3>
                  <p className="text-purple-200 mb-6">
                    TICKET PULSE v2.2 is production-ready with {readinessScore}% completion rate
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                      🎯 Deploy to Production
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-300 px-8 py-3">
                      📊 View Deployment Logs
                    </Button>
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