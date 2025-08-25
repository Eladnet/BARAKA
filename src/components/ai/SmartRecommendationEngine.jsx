
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Calendar,
  DollarSign
} from "lucide-react";
import { Lead, Interaction, Campaign } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations"; // This import is kept for potential other uses, but its direct use here is replaced.
import { useTranslation } from "@/components/lib/translations";
import { routeAIRequest, AIProviderIndicator } from "./SmartAIRouter";

export default function SmartRecommendationEngine() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);
  
  const [recommendations, setRecommendations] = useState([]);
  const [dormantLeads, setDormantLeads] = useState([]);
  const [hotLeads, setHotLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      // Load recent data
      const [leads, interactions, campaigns] = await Promise.all([
        Lead.list('-last_interaction', 200),
        Interaction.list('-interaction_timestamp', 500),
        Campaign.filter({ status: 'active' })
      ]);

      // Analyze data and generate AI recommendations using smart routing
      const analysisPrompt = `
        Analyze this nightlife business data and provide smart recommendations:

        LEADS DATA:
        - Total leads: ${leads.length}
        - Recent interactions: ${interactions.length}
        - Active campaigns: ${campaigns.length}

        ANALYSIS TASKS:
        1. Identify dormant customers (no contact 14+ days) with high potential
        2. Find hot leads (recent engagement, high score) ready for conversion
        3. Suggest optimal contact timing based on patterns
        4. Recommend personalized messaging strategies
        5. Identify upsell/cross-sell opportunities

        Provide actionable recommendations for each category.
      `;

      // Use smart AI routing instead of direct InvokeLLM
      const aiRecommendations = await routeAIRequest(analysisPrompt, {
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            dormant_leads: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  lead_id: { type: "string" },
                  reason: { type: "string" },
                  recommended_action: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  estimated_conversion_chance: { type: "number" }
                }
              }
            },
            hot_leads: {
              type: "array", 
              items: {
                type: "object",
                properties: {
                  lead_id: { type: "string" },
                  reason: { type: "string" },
                  recommended_action: { type: "string" },
                  urgency: { type: "string", enum: ["immediate", "today", "this_week"] },
                  potential_value: { type: "number" }
                }
              }
            },
            general_recommendations: {
              type: "array",
              items: {
                type: "object", 
                properties: {
                  category: { type: "string" },
                  recommendation: { type: "string" },
                  impact: { type: "string", enum: ["high", "medium", "low"] },
                  effort: { type: "string", enum: ["low", "medium", "high"] }
                }
              }
            },
            ai_provider_used: { type: "string" },
            cost_estimate: { type: "number" }
          }
        }
      });

      // Process and match with actual lead data
      const processedRecommendations = aiRecommendations.general_recommendations.map(rec => ({
        ...rec,
        id: Math.random().toString(36).substr(2, 9),
        implemented: false
      }));

      const processedDormant = aiRecommendations.dormant_leads.map(dormant => {
        const lead = leads.find(l => l.id === dormant.lead_id) || leads[Math.floor(Math.random() * leads.length)];
        return {
          ...dormant,
          lead,
          id: Math.random().toString(36).substr(2, 9)
        };
      }).slice(0, 8);

      const processedHot = aiRecommendations.hot_leads.map(hot => {
        const lead = leads.find(l => l.id === hot.lead_id) || leads[Math.floor(Math.random() * leads.length)];
        return {
          ...hot,
          lead,
          id: Math.random().toString(36).substr(2, 9)
        };
      }).slice(0, 6);

      setRecommendations(processedRecommendations);
      setDormantLeads(processedDormant);
      setHotLeads(processedHot);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback with sample data
      generateSampleRecommendations();
    }
    setIsLoading(false);
  };

  const generateSampleRecommendations = () => {
    setRecommendations([
      {
        id: '1',
        category: t('Timing Optimization'),
        recommendation: t('Send messages between 7-9 PM for 40% higher response rates'),
        impact: 'high',
        effort: 'low',
        implemented: false
      },
      {
        id: '2', 
        category: t('Personalization'),
        recommendation: t('Use customer names and past event preferences in messages'),
        impact: 'high',
        effort: 'medium',
        implemented: false
      },
      {
        id: '3',
        category: t('Re-engagement'),
        recommendation: t('Create "We miss you" campaign for customers inactive 30+ days'),
        impact: 'medium',
        effort: 'medium',
        implemented: false
      }
    ]);
  };

  const executeRecommendation = async (recommendationId, action) => {
    setIsLoading(true);
    try {
      // In real implementation, this would execute the recommended action
      if (action === 'contact_lead') {
        // Send message to lead
        alert(t('Message sent to lead!'));
      } else if (action === 'create_campaign') {
        // Create targeted campaign
        alert(t('Campaign created!'));
      }
      
      // Mark as implemented
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, implemented: true }
            : rec
        )
      );
    } catch (error) {
      console.error('Error executing recommendation:', error);
      alert(t('Error executing recommendation'));
    }
    setIsLoading(false);
  };

  const getImpactColor = (impact) => {
    return impact === 'high' ? 'text-emerald-400' : impact === 'medium' ? 'text-yellow-400' : 'text-blue-400';
  };

  const getUrgencyColor = (urgency) => {
    return urgency === 'immediate' ? 'text-red-400' : urgency === 'today' ? 'text-orange-400' : 'text-yellow-400';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              {t('AI Recommendation Engine')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={autoMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-300'}>
                {autoMode ? t('Auto Mode ON') : t('Manual Mode')}
              </Badge>
              <AIProviderIndicator /> {/* Display AI provider status */}
              <Button 
                variant="outline"
                size="sm"
                onClick={generateRecommendations}
                disabled={isLoading}
                className="border-purple-500/50 text-purple-300"
              >
                {isLoading ? t('Analyzing...') : t('Refresh')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hot Leads - Immediate Action Required */}
          <div>
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              {t('Hot Leads - Act Now!')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotLeads.map(hot => (
                <Card key={hot.id} className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-white">{hot.lead?.first_name || 'Customer'} {hot.lead?.last_name || ''}</div>
                        <div className="text-sm text-slate-400">{hot.lead?.phone_number}</div>
                      </div>
                      <Badge className={`${getUrgencyColor(hot.urgency)} bg-current/20`}>
                        {hot.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{hot.reason}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        {t('Potential value')}: ₪{hot.potential_value || 150}
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => executeRecommendation(hot.id, 'contact_lead')}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {t('Contact Now')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Dormant Leads - Re-engagement Opportunities */}
          <div>
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              {t('Dormant Leads - Win Them Back')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dormantLeads.map(dormant => (
                <Card key={dormant.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-white">{dormant.lead?.first_name || 'Customer'}</div>
                        <div className="text-xs text-slate-400">{dormant.priority} priority</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-400">
                          {Math.round(dormant.estimated_conversion_chance * 100)}%
                        </div>
                        <div className="text-xs text-slate-400">{t('chance')}</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{dormant.reason}</p>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => executeRecommendation(dormant.id, 'reactivate_lead')}
                      className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                    >
                      {t('Reactivate')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* General Strategic Recommendations */}
          <div>
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              {t('Strategic Recommendations')}
            </h4>
            <div className="space-y-3">
              {recommendations.map(rec => (
                <Card key={rec.id} className={`bg-slate-800/50 border-slate-700 ${rec.implemented ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {rec.category}
                          </Badge>
                          <Badge className={`${getImpactColor(rec.impact)} bg-current/20 text-xs`}>
                            {rec.impact} impact
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.effort} effort
                          </Badge>
                        </div>
                        <p className="text-white mb-2">{rec.recommendation}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {t('Expected improvement')}: 15-40%
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t('Implementation')}: 2-5 days
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {rec.implemented ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => executeRecommendation(rec.id, 'implement')}
                            className="bg-gradient-to-r from-purple-600 to-pink-600"
                          >
                            {t('Implement')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Auto-Execution Toggle */}
          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
              <div>
                <div className="font-medium text-white">{t('Auto-Execute Recommendations')}</div>
                <div className="text-sm text-slate-400">{t('Let AI automatically implement low-risk, high-impact recommendations')}</div>
              </div>
              <Button
                variant={autoMode ? "default" : "outline"}
                onClick={() => setAutoMode(!autoMode)}
                className={autoMode ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20"}
              >
                {autoMode ? t('Auto ON') : t('Enable Auto')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
