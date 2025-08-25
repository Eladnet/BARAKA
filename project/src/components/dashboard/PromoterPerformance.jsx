import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Zap,
  Play,
  Pause,
  Settings,
  Eye,
  Target,
  Activity,
  Crown
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromoterPerformance({ 
  promoters = [], 
  interactions = [], 
  isLoading = false 
}) {
  const safePromoters = Array.isArray(promoters) ? promoters : [];
  const safeInteractions = Array.isArray(interactions) ? interactions : [];

  // Generate sample data if no promoters exist
  const samplePromoters = [
    {
      id: 'promo-1',
      name: 'Maya AI',
      persona: 'friendly',
      is_active: true,
      total_contacts: 234,
      total_conversions: 42,
      total_revenue: 6300,
      location: 'Tel Aviv',
      created_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'promo-2',
      name: 'Alex AI',
      persona: 'elegant',
      is_active: true,
      total_contacts: 189,
      total_conversions: 28,
      total_revenue: 4200,
      location: 'Tel Aviv',
      created_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'promo-3',
      name: 'Sarah AI',
      persona: 'exclusive',
      is_active: false,
      total_contacts: 156,
      total_conversions: 31,
      total_revenue: 5500,
      location: 'Tel Aviv',
      created_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const displayPromoters = safePromoters.length > 0 ? safePromoters : samplePromoters;

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

  const calculateConversionRate = (promoter) => {
    if (!promoter) return 0;
    const contacts = promoter.total_contacts || 0;
    const conversions = promoter.total_conversions || 0;
    return contacts > 0 ? (conversions / contacts * 100) : 0;
  };

  const calculateRevenuePerContact = (promoter) => {
    if (!promoter) return 0;
    const contacts = promoter.total_contacts || 0;
    const revenue = promoter.total_revenue || 0;
    return contacts > 0 ? (revenue / contacts) : 0;
  };

  const getPromoterInteractions = (promoterId) => {
    if (!promoterId) return [];
    
    return safeInteractions.filter(interaction => 
      interaction && interaction.promoter_id === promoterId
    );
  };

  const getRecentActivity = (promoterId) => {
    if (!promoterId) return { messages: 0, responses: 0, conversions: 0 };
    
    const promoterInteractions = getPromoterInteractions(promoterId);
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentInteractions = promoterInteractions.filter(interaction => {
      if (!interaction || !interaction.interaction_timestamp) return false;
      
      try {
        const interactionDate = new Date(interaction.interaction_timestamp);
        return interactionDate > last24Hours;
      } catch (error) {
        return false;
      }
    });

    return {
      messages: recentInteractions.filter(i => i && i.interaction_type === 'message_sent').length,
      responses: recentInteractions.filter(i => i && i.interaction_type === 'message_received').length,
      conversions: recentInteractions.filter(i => i && i.interaction_type === 'conversion').length
    };
  };

  const togglePromoterStatus = async (promoter) => {
    if (!promoter) return;
    
    try {
      console.log(`Toggling promoter ${promoter.name} status`);
      // Here you would normally update the promoter status
      // await AIPromoter.update(promoter.id, { is_active: !promoter.is_active });
    } catch (error) {
      console.error('Error toggling promoter status:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">AI Promoter Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="w-16 h-6" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            AI Promoter Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600">
                {displayPromoters.length}
              </div>
              <div className="text-sm text-gray-600">Total Promoters</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">
                {displayPromoters.filter(p => p && p.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Active Now</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {displayPromoters.reduce((sum, p) => sum + (p?.total_contacts || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Contacts</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">
                ₪{displayPromoters.reduce((sum, p) => sum + (p?.total_revenue || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Promoter Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayPromoters.map((promoter, index) => {
          if (!promoter) return null;
          
          const conversionRate = calculateConversionRate(promoter);
          const revenuePerContact = calculateRevenuePerContact(promoter);
          const recentActivity = getRecentActivity(promoter.id);
          
          return (
            <Card 
              key={promoter.id || `promoter-${index}`} 
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">
                        {promoter.name || 'Unnamed Promoter'}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getPersonaColor(promoter.persona)}>
                          {promoter.persona || 'unknown'}
                        </Badge>
                        <Badge variant={promoter.is_active ? 'default' : 'secondary'}>
                          {promoter.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePromoterStatus(promoter)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {promoter.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {promoter.total_conversions || 0}
                      </div>
                      <div className="text-xs text-gray-600">Conversions</div>
                      <div className="text-xs text-emerald-600 font-medium">
                        {conversionRate.toFixed(1)}% rate
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {promoter.total_contacts || 0}
                      </div>
                      <div className="text-xs text-gray-600">Total Contacts</div>
                      <div className="text-xs text-blue-600 font-medium">
                        ₪{revenuePerContact.toFixed(0)}/contact
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Last 24 Hours</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <div className="text-sm font-bold text-blue-600">
                          {recentActivity.messages}
                        </div>
                        <div className="text-xs text-gray-600">Messages</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <div className="text-sm font-bold text-green-600">
                          {recentActivity.responses}
                        </div>
                        <div className="text-xs text-gray-600">Responses</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <div className="text-sm font-bold text-purple-600">
                          {recentActivity.conversions}
                        </div>
                        <div className="text-xs text-gray-600">Conversions</div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-medium">{conversionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(conversionRate, 100)} className="h-2" />
                  </div>

                  {/* Revenue & Location */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-bold text-emerald-600">
                        ₪{(promoter.total_revenue || 0).toLocaleString()}
                      </span>
                    </div>
                    {promoter.location && (
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-gray-600">Location</span>
                        <span className="text-gray-900">{promoter.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Promoters State */}
      {displayPromoters.length === 0 && (
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No AI Promoters Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first AI promoter to start automating your marketing
            </p>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Bot className="w-4 h-4 mr-2" />
              Create AI Promoter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}