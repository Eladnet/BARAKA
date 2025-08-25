import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, RefreshCw } from "lucide-react";

export default function AnalyticsToolbar({ 
  timeRange, 
  setTimeRange, 
  filters, 
  setFilters, 
  campaigns = [] // ברירת מחדל בטוחה
}) {
  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '365d', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  const leadStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'cold', label: 'Cold' },
    { value: 'warm', label: 'Warm' },
    { value: 'engaged', label: 'Engaged' },
    { value: 'converted', label: 'Converted' },
    { value: 'vip', label: 'VIP' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // בדיקת בטיחות למערך campaigns
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  return (
    <Card className="bg-white border-0 shadow-lg mb-8">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span className="text-gray-900 font-medium">Filter Data:</span>
          </div>
          
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select 
                value={timeRange || '30d'} 
                onValueChange={(value) => setTimeRange && setTimeRange(value)}
              >
                <SelectTrigger className="w-40 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {dateRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select 
              value={filters?.status || 'all'} 
              onValueChange={(value) => setFilters && setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-40 bg-white border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {leadStatusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-gray-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters?.campaign || 'all'} 
              onValueChange={(value) => setFilters && setFilters(prev => ({ ...prev, campaign: value }))}
            >
              <SelectTrigger className="w-40 bg-white border-gray-200">
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-gray-700">All Campaigns</SelectItem>
                {safeCampaigns.map(campaign => (
                  <SelectItem 
                    key={campaign?.id || `campaign-${Math.random()}`} 
                    value={campaign?.id || 'unknown'} 
                    className="text-gray-700"
                  >
                    {campaign?.name || 'Unnamed Campaign'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters?.source || 'all'} 
              onValueChange={(value) => setFilters && setFilters(prev => ({ ...prev, source: value }))}
            >
              <SelectTrigger className="w-40 bg-white border-gray-200">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-gray-700">All Sources</SelectItem>
                <SelectItem value="whatsapp" className="text-gray-700">WhatsApp</SelectItem>
                <SelectItem value="facebook" className="text-gray-700">Facebook</SelectItem>
                <SelectItem value="instagram" className="text-gray-700">Instagram</SelectItem>
                <SelectItem value="website" className="text-gray-700">Website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}