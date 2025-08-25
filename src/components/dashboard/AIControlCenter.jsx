import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Brain, 
  Zap, 
  Users, 
  MessageCircle, 
  TrendingUp,
  Settings,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIControlCenter({ 
  promoters = [], 
  interactions = [], 
  leads = [], 
  onDataRefresh = () => {}, 
  onUpdateLead = () => {} 
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPromoter, setSelectedPromoter] = useState(null);

  const safePromoters = Array.isArray(promoters) ? promoters : [];
  const safeInteractions = Array.isArray(interactions) ? interactions : [];
  const safeLeads = Array.isArray(leads) ? leads : [];

  // Generate sample data if no data exists
  const samplePromoters = [
    {
      id: 'ai-1',
      name: 'Maya AI',
      persona: 'friendly',
      is_active: true,
      total_contacts: 245,
      total_conversions: 38,
      location: 'Tel Aviv'
    },
    {
      id: 'ai-2', 
      name: 'Alex AI',
      persona: 'elegant',
      is_active: true,
      total_contacts: 189,
      total_conversions: 29,
      location: 'Tel Aviv'
    },
    {
      id: 'ai-3',
      name: 'Sarah AI',
      persona: 'exclusive',
      is_active: false,
      total_contacts: 156,
      total_conversions: 22,
      location: 'Tel Aviv'
    }
  ];

  const displayPromoters = safePromoters.length > 0 ? safePromoters : samplePromoters;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onDataRefresh && typeof onDataRefresh === 'function') {
        await onDataRefresh();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const togglePromoterStatus = async (promoter) => {
    if (!promoter) return;
    
    try {
      const updatedStatus = !promoter.is_active;
      // Here you would normally update the promoter in the database
      console.log(`Toggling promoter ${promoter.name} to ${updatedStatus ? 'active' : 'inactive'}`);
      
      if (onDataRefresh && typeof onDataRefresh === 'function') {
        await onDataRefresh();
      }
    } catch (error) {
      console.error('Error toggling promoter:', error);
    }
  };

  const getPromoterStats = (promoterId) => {
    const promoterInteractions = safeInteractions.filter(interaction => 
      interaction && interaction.promoter_id === promoterId
    );
    
    const recentInteractions = promoterInteractions.filter(interaction => {
      if (!interaction || !interaction.interaction_timestamp) return false;
      
      try {
        const interactionDate = new Date(interaction.interaction_timestamp);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return interactionDate > yesterday;
      } catch (error) {
        return false;
      }
    });

    return {
      totalInteractions: promoterInteractions.length,
      recentInteractions: recentInteractions.length,
      messagesLast24h: recentInteractions.filter(i => i && i.interaction_type === 'message_sent').length,
      conversionsLast24h: recentInteractions.filter(i => i && i.interaction_type === 'conversion').length
    };
  };

  const getPersonaColor = (persona) => {
    const colors = {
      friendly: 'bg-green-100 text-green-800 border-green-200',
      elegant: 'bg-purple-100 text-purple-800 border-purple-200',
      flirty: 'bg-pink-100 text-pink-800 border-pink-200',
      exclusive: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      energetic: 'bg-orange-100 text-orange-800 border-orange-200',
      cool: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[persona] || colors.friendly;
  };

  const calculateOverallPerformance = () => {
    const totalContacts = displayPromoters.reduce((sum, p) => sum + (p?.total_contacts || 0), 0);
    const totalConversions = displayPromoters.reduce((sum, p) => sum + (p?.total_conversions || 0), 0);
    const activeCount = displayPromoters.filter(p => p?.is_active).length;
    
    return {
      totalContacts,
      totalConversions,
      activeCount,
      conversionRate: totalContacts > 0 ? (totalConversions / totalContacts * 100) : 0,
      averagePerformance: totalContacts > 0 ? (totalConversions / displayPromoters.length) : 0
    };
  };

  const overallStats = calculateOverallPerformance();

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            AI Control Center
          </CardTitle>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-700">{overallStats.activeCount}</div>
            <div className="text-sm text-indigo-600">Active AI</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{overallStats.totalContacts.toLocaleString()}</div>
            <div className="text-sm text-blue-600">Total Contacts</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-700">{overallStats.totalConversions}</div>
            <div className="text-sm text-emerald-600">Conversions</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">{overallStats.conversionRate.toFixed(1)}%</div>
            <div className="text-sm text-purple-600">Success Rate</div>
          </div>
        </div>

        {/* AI Promoters List */}
        {displayPromoters.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No AI promoters configured</p>
            <p className="text-sm text-gray-400">Create AI promoters to see control options here</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Promoters Control</h3>
            {displayPromoters.map((promoter, index) => {
              if (!promoter) return null;
              
              const stats = getPromoterStats(promoter.id);
              const personaColor = getPersonaColor(promoter.persona);
              const conversionRate = promoter.total_contacts > 0 ? 
                ((promoter.total_conversions || 0) / promoter.total_contacts * 100) : 0;
              
              return (
                <div key={promoter.id || `promoter-${index}`} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        {promoter.is_active && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white">
                            <Zap className="w-2 h-2 text-white ml-0.5 mt-0.5" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">{promoter.name || 'Unnamed Promoter'}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={`${personaColor} text-xs px-2 py-1`}>
                            {promoter.persona || 'unknown'}
                          </Badge>
                          <span className="text-xs text-gray-500">{promoter.location || 'No location'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={promoter.is_active ? 'default' : 'secondary'} className="px-3 py-1">
                        {promoter.is_active ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                      
                      <Button
                        onClick={() => togglePromoterStatus(promoter)}
                        variant="outline"
                        size="sm"
                        className={promoter.is_active ? 
                          'border-red-200 text-red-600 hover:bg-red-50' : 
                          'border-green-200 text-green-600 hover:bg-green-50'
                        }
                      >
                        {promoter.is_active ? (
                          <>
                            <Pause className="w-3 h-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{(promoter.total_contacts || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Total Contacts</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">{promoter.total_conversions || 0}</div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{stats.messagesLast24h}</div>
                      <div className="text-xs text-gray-500">Messages (24h)</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{conversionRate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                      <Progress value={conversionRate} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* System Health */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">System Health</h4>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <div className="text-sm font-medium text-emerald-700">AI Response Time</div>
              <div className="text-lg font-bold text-emerald-600">1.2s</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-700">Message Queue</div>
              <div className="text-lg font-bold text-blue-600">0</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-700">Active Sessions</div>
              <div className="text-lg font-bold text-purple-600">{overallStats.activeCount}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}