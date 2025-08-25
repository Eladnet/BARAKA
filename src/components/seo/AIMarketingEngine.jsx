
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Rocket,
  Target, // Used for the new strategies section
  TrendingUp,
  Zap,
  Globe,
  Users,
  MessageSquare,
  Eye,
  Activity,
  CheckCircle
} from "lucide-react";

export default function AIMarketingEngine() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'AI Communities Penetration',
      type: 'Community Marketing',
      status: 'active',
      platforms: ['Reddit AI', 'Discord AI Servers', 'LinkedIn AI Groups'],
      activities: 12,
      mentions: 34,
      leads: 8,
      sentiment: 'positive'
    },
    {
      id: 2,
      name: 'Industry Influencer Network',
      type: 'Influencer Marketing',
      status: 'active',
      platforms: ['LinkedIn', 'Twitter', 'YouTube'],
      activities: 8,
      mentions: 156,
      leads: 23,
      sentiment: 'very_positive'
    },
    {
      id: 3,
      name: 'Automated PR Campaign',
      type: 'PR & Media',
      status: 'planning',
      platforms: ['Tech Blogs', 'Industry Publications', 'Podcasts'],
      activities: 3,
      mentions: 7,
      leads: 2,
      sentiment: 'neutral'
    }
  ]);

  const [autonomousActions] = useState([
    {
      timestamp: '2 hours ago',
      action: 'Posted thought leadership article on LinkedIn',
      platform: 'LinkedIn',
      engagement: '247 views, 23 likes, 8 comments',
      ai_confidence: 92
    },
    {
      timestamp: '4 hours ago', 
      action: 'Engaged in AI discussion on Reddit r/MachineLearning',
      platform: 'Reddit',
      engagement: '12 upvotes, 5 replies',
      ai_confidence: 87
    },
    {
      timestamp: '6 hours ago',
      action: 'Shared case study in Discord AI community',
      platform: 'Discord',
      engagement: '8 reactions, 3 DMs',
      ai_confidence: 94
    },
    {
      timestamp: '1 day ago',
      action: 'Commented on industry influencer\'s post',
      platform: 'Twitter',
      engagement: '15 likes, 2 retweets',
      ai_confidence: 89
    }
  ]);

  // New state for AI Marketing Strategies
  const [marketingStrategies] = useState([
    {
      id: 1,
      title: 'AI Nightlife Revolution Campaign',
      description: 'Position TICKET PULSE as the first AI-powered nightlife marketing platform',
      channels: ['LinkedIn', 'Twitter', 'Industry Blogs', 'AI Communities'],
      timeline: '2-4 weeks',
      priority: 'high',
      estimated_reach: 50000,
      tactics: [
        'Create viral AI vs Human promoter comparison videos',
        'Guest posting on AI and nightlife industry blogs',
        'LinkedIn thought leadership content series',
        'Twitter spaces about AI in hospitality'
      ]
    },
    {
      id: 2,
      title: 'Social Proof & Case Study Blitz',
      description: 'Showcase real results from Tel Aviv nightclub case study',
      channels: ['Facebook', 'Instagram', 'YouTube', 'PR Media'],
      timeline: '1-3 weeks',
      priority: 'high',
      estimated_reach: 75000,
      tactics: [
        'Create documentary-style case study video',
        'Influencer partnerships with nightlife personalities',
        'PR campaign targeting hospitality media',
        'Social media contest with club partnerships'
      ]
    },
  ]);

  const [isLaunching, setIsLaunching] = useState(false);

  const launchAICampaign = async () => {
    setIsLaunching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const newCampaign = {
        id: campaigns.length + 1,
        name: 'Tech Startup Community Outreach',
        type: 'Community Marketing',
        status: 'active',
        platforms: ['Hacker News', 'Product Hunt', 'Indie Hackers'],
        activities: 5,
        mentions: 12,
        leads: 3,
        sentiment: 'positive'
      };
      
      setCampaigns(prev => [newCampaign, ...prev]);
      
    } catch (error) {
      console.error('Error launching AI campaign:', error);
    }
    setIsLaunching(false);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'very_positive': return 'bg-emerald-500/20 text-emerald-300';
      case 'positive': return 'bg-green-500/20 text-green-300';
      case 'neutral': return 'bg-yellow-500/20 text-yellow-300';
      case 'negative': return 'bg-red-500/20 text-red-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Community Marketing': return 'bg-blue-500/20 text-blue-300';
      case 'Influencer Marketing': return 'bg-purple-500/20 text-purple-300';
      case 'PR & Media': return 'bg-pink-500/20 text-pink-300';
      case 'Content Marketing': return 'bg-emerald-500/20 text-emerald-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const totalMentions = campaigns.reduce((sum, c) => sum + c.mentions, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const totalActivities = campaigns.reduce((sum, c) => sum + c.activities, 0);

  return (
    <div className="space-y-6">
      {/* AI Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalActivities}</div>
            <div className="text-sm text-purple-300">AI Activities</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalMentions}</div>
            <div className="text-sm text-blue-300">Brand Mentions</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalLeads}</div>
            <div className="text-sm text-emerald-300">AI-Generated Leads</div>
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

      {/* Launch New AI Campaign */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-yellow-400" />
            Launch AI Marketing Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Campaign Name</label>
              <Input 
                placeholder="e.g., Tech Influencer Outreach"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Campaign Type</label>
              <select className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white">
                <option value="community">Community Marketing</option>
                <option value="influencer">Influencer Outreach</option>
                <option value="pr">PR & Media</option>
                <option value="content">Content Marketing</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-slate-300 text-sm mb-2 block">Target Platforms</label>
            <Input 
              placeholder="LinkedIn, Twitter, Reddit, Discord, etc."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <div>
            <label className="text-slate-300 text-sm mb-2 block">Campaign Objectives</label>
            <Textarea 
              placeholder="Increase brand awareness, generate leads, build thought leadership..."
              className="bg-slate-800 border-slate-700 text-white"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={launchAICampaign}
            disabled={isLaunching}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isLaunching ? (
              <>
                <Rocket className="w-4 h-4 mr-2 animate-spin" />
                Launching Campaign...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Launch AI Campaign
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Active AI Campaigns */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">AI Marketing Campaigns</h3>
        
        {campaigns.map(campaign => (
          <Card key={campaign.id} className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{campaign.name}</h4>
                    <Badge className={getTypeColor(campaign.type)}>
                      {campaign.type}
                    </Badge>
                    <Badge className={getSentimentColor(campaign.sentiment)}>
                      {campaign.sentiment.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">{campaign.activities}</div>
                  <div className="text-xs text-slate-400">AI Activities</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-purple-400">{campaign.mentions}</div>
                  <div className="text-xs text-slate-400">Mentions</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">{campaign.leads}</div>
                  <div className="text-xs text-slate-400">Leads</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">{campaign.platforms.length}</div>
                  <div className="text-xs text-slate-400">Platforms</div>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <span className="text-slate-400 text-sm mb-2 block">Active Platforms</span>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map(platform => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Autonomous AI Activities */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-emerald-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            Recent Autonomous AI Activities
          </CardTitle>
          <p className="text-slate-300 text-sm">AI is automatically promoting TICKET PULSE across the web</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {autonomousActions.map((action, index) => (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium">{action.action}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-slate-400">{action.timestamp}</span>
                      <Badge variant="outline" className="text-xs">
                        {action.platform}
                      </Badge>
                      <span className="text-emerald-400">
                        AI Confidence: {action.ai_confidence}%
                      </span>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                </div>
                <p className="text-slate-300 text-sm">{action.engagement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Marketing Strategies */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-yellow-400" />
          AI Marketing Strategies
        </h3>
        {marketingStrategies.map(strategy => (
          <Card key={strategy.id} className="bg-slate-900/80 backdrop-blur-xl border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {strategy.title}
                <Badge className={`ml-auto ${strategy.priority === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                  Priority: {strategy.priority.charAt(0).toUpperCase() + strategy.priority.slice(1)}
                </Badge>
              </CardTitle>
              <p className="text-slate-300 text-sm">{strategy.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400">Timeline</div>
                  <div className="text-sm font-bold text-blue-400">{strategy.timeline}</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400">Estimated Reach</div>
                  <div className="text-sm font-bold text-purple-400">{strategy.estimated_reach.toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-slate-400 text-sm mb-2 block">Key Channels</span>
                <div className="flex flex-wrap gap-2">
                  {strategy.channels.map(channel => (
                    <Badge key={channel} variant="outline" className="text-xs border-blue-400/50 text-blue-300">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-sm mb-2 block">Tactics</span>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                  {strategy.tactics.map((tactic, i) => (
                    <li key={i}>{tactic}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
