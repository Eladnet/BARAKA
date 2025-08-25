import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Link as LinkIcon, 
  Globe,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  Zap,
  Star,
  Users,
  MessageSquare
} from "lucide-react";

export default function BacklinkBuilder() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Tech Blog Outreach',
      status: 'active',
      progress: 65,
      target_sites: 50,
      contacted: 32,
      responses: 12,
      links_built: 8,
      domain_authority_avg: 67,
      tactics: ['Guest posting', 'Resource page inclusion', 'Broken link building']
    },
    {
      id: 2,
      name: 'Industry Publication Campaign',
      status: 'active',
      progress: 45,
      target_sites: 25,
      contacted: 18,
      responses: 7,
      links_built: 4,
      domain_authority_avg: 78,
      tactics: ['Expert interviews', 'Industry reports', 'Thought leadership']
    },
    {
      id: 3,
      name: 'Nightlife Influencer Network',
      status: 'planning',
      progress: 15,
      target_sites: 40,
      contacted: 5,
      responses: 2,
      links_built: 1,
      domain_authority_avg: 45,
      tactics: ['Influencer partnerships', 'Event collaborations', 'Social mentions']
    }
  ]);

  const [opportunitiesFound] = useState([
    {
      domain: 'techcrunch.com',
      da: 93,
      opportunity_type: 'Guest Post',
      topic: 'AI in Hospitality Industry',
      contact_email: 'editors@techcrunch.com',
      likelihood: 'medium',
      estimated_value: 'high'
    },
    {
      domain: 'hospitalitynet.org',
      da: 71,
      opportunity_type: 'Resource Page',
      topic: 'Marketing Technology Tools',
      contact_email: 'content@hospitalitynet.org', 
      likelihood: 'high',
      estimated_value: 'high'
    },
    {
      domain: 'eventmanagerblog.com',
      da: 58,
      opportunity_type: 'Expert Interview',
      topic: 'Future of Event Marketing',
      contact_email: 'interviews@eventmanagerblog.com',
      likelihood: 'high',
      estimated_value: 'medium'
    }
  ]);

  const [isBuilding, setIsBuilding] = useState(false);

  const startBacklinkCampaign = async () => {
    setIsBuilding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate campaign update
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === 1 ? {
          ...campaign,
          contacted: campaign.contacted + 5,
          responses: campaign.responses + 2,
          links_built: campaign.links_built + 1,
          progress: Math.min(campaign.progress + 10, 100)
        } : campaign
      ));
      
    } catch (error) {
      console.error('Error building backlinks:', error);
    }
    setIsBuilding(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-300';
      case 'planning': return 'bg-yellow-500/20 text-yellow-300';
      case 'completed': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getLikelihoodColor = (likelihood) => {
    switch (likelihood) {
      case 'high': return 'bg-emerald-500/20 text-emerald-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-red-500/20 text-red-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <LinkIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {campaigns.reduce((sum, c) => sum + c.links_built, 0)}
            </div>
            <div className="text-sm text-emerald-300">Links Built</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {campaigns.reduce((sum, c) => sum + c.contacted, 0)}
            </div>
            <div className="text-sm text-blue-300">Sites Contacted</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {campaigns.reduce((sum, c) => sum + c.responses, 0)}
            </div>
            <div className="text-sm text-purple-300">Responses</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {Math.round(campaigns.reduce((sum, c) => sum + c.domain_authority_avg, 0) / campaigns.length)}
            </div>
            <div className="text-sm text-yellow-300">Avg DA</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Link Builder */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            AI Backlink Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 mb-2">Automatically find and build high-quality backlinks</p>
              <p className="text-slate-400 text-sm">AI identifies opportunities, crafts outreach emails, and tracks results</p>
            </div>
            <Button 
              onClick={startBacklinkCampaign}
              disabled={isBuilding}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {isBuilding ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Building Links...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Start Campaign
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Active Link Building Campaigns</h3>
        
        {campaigns.map(campaign => (
          <Card key={campaign.id} className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{campaign.name}</h4>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-slate-400 text-sm">Progress:</span>
                    <Progress value={campaign.progress} className="flex-1 max-w-xs" />
                    <span className="text-white font-bold text-sm">{campaign.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">{campaign.target_sites}</div>
                  <div className="text-xs text-slate-400">Target Sites</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">{campaign.contacted}</div>
                  <div className="text-xs text-slate-400">Contacted</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-purple-400">{campaign.responses}</div>
                  <div className="text-xs text-slate-400">Responses</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">{campaign.links_built}</div>
                  <div className="text-xs text-slate-400">Links Built</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-orange-400">{campaign.domain_authority_avg}</div>
                  <div className="text-xs text-slate-400">Avg DA</div>
                </div>
              </div>

              {/* Tactics */}
              <div>
                <span className="text-slate-400 text-sm mb-2 block">Tactics</span>
                <div className="flex flex-wrap gap-2">
                  {campaign.tactics.map(tactic => (
                    <Badge key={tactic} variant="outline" className="text-xs">
                      {tactic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Link Opportunities */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Discovered Link Opportunities</h3>
        
        {opportunitiesFound.map((opportunity, index) => (
          <Card key={index} className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{opportunity.domain}</h4>
                    <Badge className="bg-blue-500/20 text-blue-300">
                      DA {opportunity.da}
                    </Badge>
                    <Badge className={getLikelihoodColor(opportunity.likelihood)}>
                      {opportunity.likelihood} likelihood
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-slate-400 text-sm">Opportunity Type</span>
                      <div className="text-white font-medium">{opportunity.opportunity_type}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Topic</span>
                      <div className="text-white font-medium">{opportunity.topic}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Estimated Value</span>
                      <div className="text-emerald-400 font-bold capitalize">{opportunity.estimated_value}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-slate-400">Contact: </span>
                    <span className="text-blue-400">{opportunity.contact_email}</span>
                  </div>
                </div>
                
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}