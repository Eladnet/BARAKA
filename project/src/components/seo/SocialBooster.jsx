import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare,
  TrendingUp,
  Heart,
  Share,
  Eye,
  Zap,
  Target,
  Activity,
  Star
} from "lucide-react";

export default function SocialBooster() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      platform: 'LinkedIn',
      campaign_name: 'AI Thought Leadership',
      status: 'active',
      posts_scheduled: 15,
      posts_published: 8,
      engagement_rate: 12.4,
      reach: 45000,
      leads_generated: 23,
      content_types: ['Articles', 'Industry Insights', 'Case Studies']
    },
    {
      id: 2,
      platform: 'Twitter',
      campaign_name: 'Nightlife Tech Trends',
      status: 'active',
      posts_scheduled: 30,
      posts_published: 22,
      engagement_rate: 8.7,
      reach: 78000,
      leads_generated: 12,
      content_types: ['Threads', 'Industry News', 'Quick Tips']
    },
    {
      id: 3,
      platform: 'Instagram',
      campaign_name: 'Behind the Scenes',
      status: 'planning',
      posts_scheduled: 12,
      posts_published: 3,
      engagement_rate: 15.2,
      reach: 25000,
      leads_generated: 7,
      content_types: ['Stories', 'Reels', 'Carousel Posts']
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateSocialContent = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate campaign updates
      setCampaigns(prev => prev.map(campaign => ({
        ...campaign,
        posts_published: campaign.posts_published + Math.floor(Math.random() * 3) + 1,
        reach: campaign.reach + Math.floor(Math.random() * 5000) + 1000,
        leads_generated: campaign.leads_generated + Math.floor(Math.random() * 3)
      })));
      
    } catch (error) {
      console.error('Error generating social content:', error);
    }
    setIsGenerating(false);
  };

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return 'bg-blue-500/20 text-blue-300';
      case 'twitter': return 'bg-cyan-500/20 text-cyan-300';
      case 'instagram': return 'bg-pink-500/20 text-pink-300';
      case 'facebook': return 'bg-indigo-500/20 text-indigo-300';
      case 'tiktok': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-300';
      case 'planning': return 'bg-yellow-500/20 text-yellow-300';
      case 'paused': return 'bg-red-500/20 text-red-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads_generated, 0);
  const avgEngagement = (campaigns.reduce((sum, c) => sum + c.engagement_rate, 0) / campaigns.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Social Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {(totalReach / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-blue-300">Total Reach</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalLeads}</div>
            <div className="text-sm text-emerald-300">Leads Generated</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{avgEngagement}%</div>
            <div className="text-sm text-purple-300">Avg Engagement</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-yellow-300">Active Campaigns</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Content Generator */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            AI Social Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 mb-2">Generate viral social media content across all platforms</p>
              <p className="text-slate-400 text-sm">AI creates platform-optimized content that drives engagement and leads</p>
            </div>
            <Button 
              onClick={generateSocialContent}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Campaigns */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Social Media Campaigns</h3>
        
        {campaigns.map(campaign => (
          <Card key={campaign.id} className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{campaign.campaign_name}</h4>
                    <Badge className={getPlatformColor(campaign.platform)}>
                      {campaign.platform}
                    </Badge>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-slate-400 text-sm">Content Progress:</span>
                    <Progress 
                      value={(campaign.posts_published / campaign.posts_scheduled) * 100} 
                      className="flex-1 max-w-xs" 
                    />
                    <span className="text-white font-bold text-sm">
                      {campaign.posts_published}/{campaign.posts_scheduled}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">
                    {(campaign.reach / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-slate-400">Reach</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-purple-400">
                    {campaign.engagement_rate}%
                  </div>
                  <div className="text-xs text-slate-400">Engagement</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">
                    {campaign.leads_generated}
                  </div>
                  <div className="text-xs text-slate-400">Leads</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">
                    {campaign.posts_published}
                  </div>
                  <div className="text-xs text-slate-400">Posts</div>
                </div>
              </div>

              {/* Content Types */}
              <div>
                <span className="text-slate-400 text-sm mb-2 block">Content Types</span>
                <div className="flex flex-wrap gap-2">
                  {campaign.content_types.map(type => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Viral Content Ideas */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            AI-Generated Viral Content Ideas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
              <h5 className="text-white font-semibold mb-2">LinkedIn: "AI vs Human Promoter Challenge"</h5>
              <p className="text-slate-300 text-sm mb-2">
                Create a side-by-side comparison showing AI promoter results vs traditional methods
              </p>
              <div className="flex gap-2">
                <Badge className="bg-blue-500/20 text-blue-300">High Engagement Potential</Badge>
                <Badge variant="outline" className="text-xs">B2B Focus</Badge>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-pink-500">
              <h5 className="text-white font-semibold mb-2">Instagram: "Behind the AI: How TICKET PULSE Works"</h5>
              <p className="text-slate-300 text-sm mb-2">
                Animated carousel showing AI decision-making process in nightlife marketing
              </p>
              <div className="flex gap-2">
                <Badge className="bg-pink-500/20 text-pink-300">Visual Storytelling</Badge>
                <Badge variant="outline" className="text-xs">Educational</Badge>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-cyan-500">
              <h5 className="text-white font-semibold mb-2">Twitter: "Nightlife Tech Predictions 2025"</h5>
              <p className="text-slate-300 text-sm mb-2">
                Thread about upcoming trends in nightlife technology and AI integration
              </p>
              <div className="flex gap-2">
                <Badge className="bg-cyan-500/20 text-cyan-300">Thought Leadership</Badge>
                <Badge variant="outline" className="text-xs">Thread Series</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}