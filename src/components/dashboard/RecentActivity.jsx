import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MessageCircle, DollarSign, UserCheck, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivity({ interactions = [], isLoading = false }) {
  const safeInteractions = Array.isArray(interactions) ? interactions : [];
  
  const getActivityIcon = (type) => {
    const icons = {
      message_sent: MessageCircle,
      message_received: MessageCircle,
      conversion: DollarSign,
      rsvp: UserCheck,
      click: Activity
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colors = {
      message_sent: 'text-blue-600 bg-blue-50',
      message_received: 'text-green-600 bg-green-50',
      conversion: 'text-emerald-600 bg-emerald-50',
      rsvp: 'text-purple-600 bg-purple-50',
      click: 'text-gray-600 bg-gray-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      return 'Unknown time';
    }
  };

  const getActivityText = (interaction) => {
    if (!interaction) return 'Unknown activity';
    
    const type = interaction.interaction_type || 'unknown';
    const leadId = interaction.lead_id || 'Unknown';
    
    switch (type) {
      case 'message_sent':
        return `Sent message to Lead ${leadId}`;
      case 'message_received':
        return `Received response from Lead ${leadId}`;
      case 'conversion':
        return `Conversion completed by Lead ${leadId}`;
      case 'rsvp':
        return `RSVP received from Lead ${leadId}`;
      case 'click':
        return `Link clicked by Lead ${leadId}`;
      default:
        return `Activity with Lead ${leadId}`;
    }
  };

  // Generate sample data if no interactions
  const displayInteractions = safeInteractions.length > 0 ? safeInteractions.slice(0, 8) : [
    {
      id: 'sample-1',
      interaction_type: 'message_sent',
      lead_id: 'L001',
      interaction_timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      sentiment: 'positive'
    },
    {
      id: 'sample-2',
      interaction_type: 'conversion',
      lead_id: 'L002',
      interaction_timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      conversion_value: 150
    },
    {
      id: 'sample-3',
      interaction_type: 'message_received',
      lead_id: 'L003',
      interaction_timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      sentiment: 'positive'
    }
  ];

  if (isLoading) {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
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
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayInteractions.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No recent activity</p>
            <p className="text-sm text-gray-400">Activity will appear here as interactions happen</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayInteractions.map((interaction, index) => {
              if (!interaction) return null;
              
              const ActivityIcon = getActivityIcon(interaction.interaction_type);
              const colorClasses = getActivityColor(interaction.interaction_type);
              
              return (
                <div key={interaction.id || `activity-${index}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${colorClasses}`}>
                    <ActivityIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      {getActivityText(interaction)}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(interaction.interaction_timestamp)}
                      </span>
                      
                      {interaction.sentiment && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0.5 ${
                            interaction.sentiment === 'positive' 
                              ? 'border-green-200 text-green-700 bg-green-50' 
                              : interaction.sentiment === 'negative'
                              ? 'border-red-200 text-red-700 bg-red-50'
                              : 'border-gray-200 text-gray-700 bg-gray-50'
                          }`}
                        >
                          {interaction.sentiment}
                        </Badge>
                      )}
                      
                      {interaction.conversion_value && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">
                          ₪{interaction.conversion_value}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Clock className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}