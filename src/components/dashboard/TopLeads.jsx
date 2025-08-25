import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Star, Phone, Mail, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopLeads({ leads = [], isLoading = false, showAll = false }) {
  const safeLeads = Array.isArray(leads) ? leads : [];

  // Generate sample data if no leads
  const sampleLeads = [
    {
      id: 'sample-1',
      first_name: 'David',
      last_name: 'Cohen',
      status: 'vip',
      total_spent: 3500,
      events_attended: 8,
      phone_number: '+972-50-123-4567',
      email: 'david.cohen@example.com',
      location: 'Tel Aviv',
      last_interaction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'sample-2',
      first_name: 'Sarah',
      last_name: 'Levi',
      status: 'converted',
      total_spent: 2100,
      events_attended: 5,
      phone_number: '+972-54-987-6543',
      email: 'sarah.levi@example.com',
      location: 'Ramat Gan',
      last_interaction: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'sample-3',
      first_name: 'Michael',
      last_name: 'Ben-David',
      status: 'engaged',
      total_spent: 1800,
      events_attended: 3,
      phone_number: '+972-52-555-7890',
      email: 'michael.bd@example.com',
      location: 'Herzliya',
      last_interaction: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];

  const displayLeads = safeLeads.length > 0 ? safeLeads : sampleLeads;
  const topLeads = showAll ? displayLeads : displayLeads.slice(0, 5);

  const getStatusColor = (status) => {
    const colors = {
      vip: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      engaged: 'bg-blue-100 text-blue-800 border-blue-200',
      warm: 'bg-orange-100 text-orange-800 border-orange-200',
      cold: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.cold;
  };

  const getStatusIcon = (status) => {
    if (status === 'vip') return Crown;
    return Star;
  };

  const formatLastInteraction = (timestamp) => {
    if (!timestamp) return 'No interaction';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return `${Math.floor(diffInHours / 168)}w ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Top Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-16 h-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            {showAll ? 'All Leads' : 'Top Leads'}
          </CardTitle>
          {!showAll && topLeads.length > 0 && (
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {topLeads.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No leads yet</p>
            <p className="text-sm text-gray-400">Start adding customers to see them here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topLeads.map((lead, index) => {
              if (!lead) return null;
              
              const StatusIcon = getStatusIcon(lead.status);
              const statusColor = getStatusColor(lead.status);
              
              return (
                <div key={lead.id || `lead-${index}`} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {(lead.first_name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {lead.status === 'vip' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {lead.first_name || 'Unknown'} {lead.last_name || ''}
                      </h4>
                      <Badge className={`${statusColor} text-xs px-2 py-1`}>
                        {lead.status || 'unknown'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{lead.phone_number || 'No phone'}</span>
                      </div>
                      {lead.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{lead.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-gray-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatLastInteraction(lead.last_interaction)}
                      </div>
                      <div className="text-sm font-bold text-emerald-600">
                        ₪{(lead.total_spent || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="text-sm font-bold text-gray-900">
                      {lead.events_attended || 0}
                    </div>
                    <div className="text-xs text-gray-500">events</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Summary Stats */}
        {topLeads.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="text-lg font-bold text-emerald-700">
                  ₪{topLeads.reduce((sum, lead) => sum + (lead?.total_spent || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600">Total Value</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-700">
                  {topLeads.reduce((sum, lead) => sum + (lead?.events_attended || 0), 0)}
                </div>
                <div className="text-xs text-blue-600">Total Events</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}