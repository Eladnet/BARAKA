import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Search,
  Globe,
  Users,
  Activity,
  Target,
  AlertTriangle
} from "lucide-react";

export default function CompetitorAnalysis() {
  const [competitors, setCompetitors] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = () => {
    const mockCompetitors = [
      {
        id: 1,
        name: 'EventBrite',
        domain: 'eventbrite.com',
        category: 'Event Management',
        domain_authority: 87,
        monthly_traffic: 45000000,
        top_keywords: ['event tickets', 'event management', 'online events'],
        backlinks: 2500000,
        social_followers: 850000,
        threat_level: 'high',
        strengths: ['Brand recognition', 'Global reach', 'Established platform'],
        weaknesses: ['Not nightlife focused', 'No AI features', 'Generic approach'],
        opportunities: ['AI integration gap', 'Nightlife specialization', 'Personalized marketing']
      },
      {
        id: 2,
        name: 'Nightout',
        domain: 'nightout.com',
        category: 'Nightlife Discovery',
        domain_authority: 42,
        monthly_traffic: 750000,
        top_keywords: ['nightlife events', 'club tickets', 'party finder'],
        backlinks: 85000,
        social_followers: 120000,
        threat_level: 'medium',
        strengths: ['Nightlife focus', 'Local market knowledge', 'User reviews'],
        weaknesses: ['Limited AI', 'Manual processes', 'Regional limitation'],
        opportunities: ['AI automation', 'Promoter tools', 'Advanced analytics']
      },
      {
        id: 3,
        name: 'PartyWith',
        domain: 'partywith.com',
        category: 'Party Planning',  
        domain_authority: 28,
        monthly_traffic: 320000,
        top_keywords: ['party planning', 'club promoter', 'vip table booking'],
        backlinks: 12000,
        social_followers: 45000,
        threat_level: 'low',
        strengths: ['Promoter network', 'VIP focus', 'Social integration'],
        weaknesses: ['Small scale', 'No automation', 'Limited features'],
        opportunities: ['Complete AI overhaul', 'Market leadership', 'Feature differentiation']
      }
    ];
    
    setCompetitors(mockCompetitors);
  };

  const analyzeCompetitor = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Simulate updating competitor data
      setCompetitors(prev => prev.map(comp => ({
        ...comp,
        monthly_traffic: comp.monthly_traffic + Math.floor(Math.random() * 50000),
        backlinks: comp.backlinks + Math.floor(Math.random() * 1000)
      })));
      
    } catch (error) {
      console.error('Error analyzing competitors:', error);
    }
    setIsAnalyzing(false);
  };

  const getThreatColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-emerald-500/20 text-emerald-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getThreatIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      case 'low': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-red-500/30">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {competitors.filter(c => c.threat_level === 'high').length}
            </div>
            <div className="text-sm text-red-300">High Threat</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {competitors.filter(c => c.threat_level === 'medium').length}
            </div>
            <div className="text-sm text-yellow-300">Medium Threat</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {competitors.filter(c => c.threat_level === 'low').length}
            </div>
            <div className="text-sm text-emerald-300">Low Threat</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {Math.round(competitors.reduce((sum, c) => sum + c.domain_authority, 0) / competitors.length)}
            </div>
            <div className="text-sm text-blue-300">Avg DA</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Button */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-400" />
            AI Competitor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 mb-2">Run comprehensive AI analysis of competitors</p>
              <p className="text-slate-400 text-sm">Analyzes SEO, content, social media, and market positioning</p>
            </div>
            <Button 
              onClick={analyzeCompetitor}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {isAnalyzing ? (
                <>
                  <Search className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze All
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Competitor Analysis</h3>
        
        {competitors.map(competitor => (
          <Card key={competitor.id} className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-semibold text-white">{competitor.name}</h4>
                    <Badge className={getThreatColor(competitor.threat_level)}>
                      {getThreatIcon(competitor.threat_level)}
                      <span className="ml-1 capitalize">{competitor.threat_level} Threat</span>
                    </Badge>
                  </div>
                  <p className="text-slate-400 mb-1">{competitor.domain}</p>
                  <p className="text-slate-300">{competitor.category}</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">{competitor.domain_authority}</div>
                  <div className="text-xs text-slate-400">Domain Authority</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">
                    {(competitor.monthly_traffic / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-slate-400">Monthly Traffic</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-purple-400">
                    {(competitor.backlinks / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-slate-400">Backlinks</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">
                    {(competitor.social_followers / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-slate-400">Social Followers</div>
                </div>
              </div>

              {/* SWOT Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-emerald-400 font-semibold mb-2">Strengths</h5>
                  <ul className="space-y-1">
                    {competitor.strengths.map((strength, index) => (
                      <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-red-400 font-semibold mb-2">Weaknesses</h5>
                  <ul className="space-y-1">
                    {competitor.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                        <TrendingDown className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-yellow-400 font-semibold mb-2">Our Opportunities</h5>
                  <ul className="space-y-1">
                    {competitor.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                        <Target className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Top Keywords */}
              <div className="mt-6">
                <h5 className="text-slate-400 text-sm mb-2">Top Keywords</h5>
                <div className="flex flex-wrap gap-2">
                  {competitor.top_keywords.map(keyword => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}