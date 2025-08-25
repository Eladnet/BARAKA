import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Upload, 
  FileText, 
  Settings, 
  Download, 
  Zap,
  Bot,
  Users,
  Megaphone,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions() {
  const quickActions = [
    {
      title: "Create Campaign",
      description: "Launch new marketing",
      icon: Megaphone,
      color: "from-blue-500 to-cyan-500",
      url: createPageUrl("Campaigns"),
      action: "create"
    },
    {
      title: "Add AI Promoter",
      description: "Create intelligent promoter",
      icon: Bot,
      color: "from-purple-500 to-pink-500",
      url: createPageUrl("Promoters"),
      action: "create"
    },
    {
      title: "Import Leads",
      description: "Upload customer data",
      icon: Upload,
      color: "from-emerald-500 to-green-500",
      url: createPageUrl("Leads"),
      action: "import"
    },
    {
      title: "View Analytics",
      description: "Check performance",
      icon: BarChart3,
      color: "from-yellow-500 to-orange-500",
      url: createPageUrl("Analytics"),
      action: "view"
    },
    {
      title: "System Settings",
      description: "Configure platform",
      icon: Settings,
      color: "from-gray-500 to-slate-500",
      url: createPageUrl("Settings"),
      action: "configure"
    },
    {
      title: "Generate Report",
      description: "Export performance",
      icon: FileText,
      color: "from-indigo-500 to-purple-500",
      url: "#",
      action: "export"
    }
  ];

  const handleExportReport = () => {
    // Generate sample report data
    const reportData = {
      date: new Date().toISOString().split('T')[0],
      totalLeads: 128,
      conversions: 23,
      revenue: 4580,
      campaigns: 6
    };

    const csvContent = [
      ['Metric', 'Value'],
      ['Date', reportData.date],
      ['Total Leads', reportData.totalLeads],
      ['Conversions', reportData.conversions],
      ['Revenue (₪)', reportData.revenue],
      ['Active Campaigns', reportData.campaigns]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-pulse-report-${reportData.date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleActionClick = (action, url) => {
    if (action === 'export') {
      handleExportReport();
    } else if (url && url !== '#') {
      window.location.href = url;
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            if (!action) return null;
            
            const IconComponent = action.icon || Plus;
            
            return (
              <Button
                key={`action-${index}`}
                variant="outline"
                className="h-auto p-3 justify-start border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                onClick={() => handleActionClick(action.action, action.url)}
              >
                <div className="flex items-center gap-3 w-full min-w-0">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color || 'from-gray-400 to-gray-500'} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                    <IconComponent className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">
                      {action.title || 'Unknown Action'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {action.description || 'No description'}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Additional Quick Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">24/7</div>
              <div className="text-xs text-blue-600">AI Active</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <div className="text-lg font-bold text-emerald-700">95%</div>
              <div className="text-xs text-emerald-600">Uptime</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}