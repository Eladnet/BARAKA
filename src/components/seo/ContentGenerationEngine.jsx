
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Zap, 
  Eye,
  TrendingUp,
  FileText,
  Video,
  Image,
  Mic,
  Calendar,
  Globe
} from "lucide-react";

export default function ContentGenerationEngine() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentQueue, setContentQueue] = useState([
    {
      id: 1,
      title: 'The Future of AI in Nightlife Marketing',
      type: 'blog',
      status: 'published',
      keywords: ['AI nightlife', 'automated marketing'],
      estimated_views: 2500,
      actual_views: 1847,
      platforms: ['Company Blog', 'Medium', 'LinkedIn']
    },
    {
      id: 2,
      title: '5 Ways AI Revolutionizes Club Promotion',
      type: 'video',
      status: 'in_production',
      keywords: ['club promotion', 'AI marketing'],
      estimated_views: 5000,
      platforms: ['YouTube', 'Instagram', 'TikTok']
    },
    {
      id: 3,
      title: 'TICKET PULSE Case Study: 300% ROI Increase',
      type: 'whitepaper',
      status: 'planning',
      keywords: ['case study', 'ROI', 'nightlife success'],
      estimated_views: 1200,
      platforms: ['Website', 'LinkedIn', 'Industry Sites']
    }
  ]);

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const newContent = {
        id: contentQueue.length + 1,
        title: 'How AI Promoters Outperform Human Promoters',
        type: 'infographic',
        status: 'generated',
        keywords: ['AI vs human', 'promoter comparison', 'efficiency'],
        estimated_views: 3200,
        platforms: ['Instagram', 'LinkedIn', 'Twitter']
      };
      
      setContentQueue(prev => [newContent, ...prev]);
    } catch (error) {
      console.error('Error generating content:', error);
    }
    setIsGenerating(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'blog': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'infographic': return <Image className="w-4 h-4" />;
      case 'podcast': return <Mic className="w-4 h-4" />;
      case 'whitepaper': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-emerald-500/20 text-emerald-300';
      case 'in_production': return 'bg-blue-500/20 text-blue-300';
      case 'planning': return 'bg-yellow-500/20 text-yellow-300';
      case 'generated': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {contentQueue.filter(c => c.status === 'published').length}
            </div>
            <div className="text-sm text-emerald-300">Published</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {contentQueue.filter(c => c.status === 'in_production').length}
            </div>
            <div className="text-sm text-blue-300">In Production</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {contentQueue.reduce((sum, c) => sum + (c.actual_views || c.estimated_views), 0).toLocaleString()}
            </div>
            <div className="text-sm text-yellow-300">Total Views</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {[...new Set(contentQueue.flatMap(c => c.platforms))].length}
            </div>
            <div className="text-sm text-purple-300">Platforms</div>
          </CardContent>
        </Card>
      </div>

      {/* TICKET PULSE Content Generator */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            TICKET PULSE Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Content Topic</label>
              <Input 
                placeholder="e.g., AI nightlife trends, club marketing tips"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Content Type</label>
              <select className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white">
                <option value="blog">Blog Post</option>
                <option value="video">Video Script</option>
                <option value="infographic">Infographic</option>
                <option value="social">Social Media Posts</option>
                <option value="whitepaper">Whitepaper</option>
                <option value="podcast">Podcast Script</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-slate-300 text-sm mb-2 block">Target Keywords</label>
            <Input 
              placeholder="nightlife AI, club automation, smart marketing"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <div>
            <label className="text-slate-300 text-sm mb-2 block">Additional Instructions</label>
            <Textarea 
              placeholder="Include case studies, focus on ROI, target club owners..."
              className="bg-slate-800 border-slate-700 text-white"
              rows={3}
            />
          </div>

          {/* New Viral Content Ideas Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Viral Content Ideas</h3>
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
          </div>
          
          <Button 
            onClick={generateContent}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isGenerating ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Content Queue */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Content Pipeline</h3>
        
        {contentQueue.map(content => (
          <Card key={content.id} className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(content.type)}
                    <h4 className="text-lg font-semibold text-white">{content.title}</h4>
                    <Badge className={getStatusColor(content.status)}>
                      {content.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-slate-400 text-sm">Type</span>
                      <div className="text-white font-medium capitalize">{content.type}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">
                        {content.actual_views ? 'Actual Views' : 'Est. Views'}
                      </span>
                      <div className="text-emerald-400 font-bold">
                        {(content.actual_views || content.estimated_views).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Platforms</span>
                      <div className="text-blue-400 font-medium">
                        {content.platforms.length} platforms
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 text-sm mb-2 block">Keywords</span>
                  <div className="flex flex-wrap gap-2">
                    {content.keywords.map(keyword => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-sm mb-2 block">Distribution Platforms</span>
                  <div className="flex flex-wrap gap-2">
                    {content.platforms.map(platform => (
                      <Badge key={platform} className="bg-blue-500/20 text-blue-300 text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
