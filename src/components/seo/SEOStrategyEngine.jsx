import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Search, 
  Globe,
  Zap,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function SEOStrategyEngine() {
  const [strategies, setStrategies] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStrategies, setActiveStrategies] = useState(0);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = () => {
    const mockStrategies = [
      {
        id: 1,
        name: 'Nightlife AI Revolution Keywords',
        status: 'active',
        progress: 78,
        keywords: ['AI nightlife marketing', 'automated club promotion', 'smart event marketing'],
        estimated_traffic: 2500,
        current_ranking: 12,
        target_ranking: 3,
        activities: [
          'Creating high-quality blog content about AI in nightlife',
          'Building topic authority through expert interviews',
          'Optimizing landing pages for target keywords'
        ]
      },
      {
        id: 2,
        name: 'Local SEO Domination',
        status: 'active',
        progress: 65,
        keywords: ['nightclub marketing Tel Aviv', 'event promotion Israel', 'party marketing software'],
        estimated_traffic: 1800,
        current_ranking: 8,
        target_ranking: 1,
        activities: [
          'Optimizing Google My Business profiles',
          'Building local citations and directories',
          'Creating location-specific landing pages'
        ]
      },
      {
        id: 3,
        name: 'Industry Authority Building',
        status: 'planning',
        progress: 25,
        keywords: ['hospitality tech trends', 'event management software', 'customer engagement platforms'],
        estimated_traffic: 4200,
        current_ranking: 45,
        target_ranking: 5,
        activities: [
          'Publishing thought leadership whitepapers',
          'Speaking at industry conferences',
          'Guest posting on major hospitality blogs'
        ]
      }
    ];
    
    setStrategies(mockStrategies);
    setActiveStrategies(mockStrategies.filter(s => s.status === 'active').length);
  };

  const generateNewStrategy = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newStrategy = {
        id: strategies.length + 1,
        name: 'Social Media Integration SEO',
        status: 'planning',
        progress: 10,
        keywords: ['social media nightlife marketing', 'Instagram club promotion', 'viral party marketing'],
        estimated_traffic: 3100,
        current_ranking: 0,
        target_ranking: 8,
        activities: [
          'Creating social-first content strategy',
          'Building social signal optimization',
          'Cross-platform content syndication'
        ]
      };
      
      setStrategies(prev => [...prev, newStrategy]);
    } catch (error) {
      console.error('Error generating strategy:', error);
    }
    setIsGenerating(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paused': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'planning': return <Clock className="w-4 h-4" />;
      case 'paused': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{strategies.length}</div>
            <div className="text-sm text-gray-600">Total Strategies</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{activeStrategies}</div>
            <div className="text-sm text-gray-600">Active Now</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {strategies.reduce((sum, s) => sum + s.estimated_traffic, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Est. Traffic</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Search className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {strategies.reduce((sum, s) => sum + s.keywords.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Target Keywords</div>
          </CardContent>
        </Card>
      </div>

      {/* Generate New Strategy */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI Strategy Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 mb-2">Generate new SEO strategy based on market analysis</p>
              <p className="text-gray-500 text-sm">AI will analyze competitors, trends, and opportunities</p>
            </div>
            <Button 
              onClick={generateNewStrategy}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Strategy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Strategies */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Active SEO Strategies</h3>
        
        {strategies.map(strategy => (
          <Card key={strategy.id} className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{strategy.name}</h4>
                    <Badge className={getStatusColor(strategy.status)}>
                      {getStatusIcon(strategy.status)}
                      <span className="ml-1 capitalize">{strategy.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-gray-500 text-sm">Progress</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={strategy.progress} className="flex-1" />
                        <span className="text-gray-900 font-bold text-sm">{strategy.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Current → Target Ranking</span>
                      <div className="text-gray-900 font-bold">
                        #{strategy.current_ranking} → #{strategy.target_ranking}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Estimated Traffic</span>
                      <div className="text-emerald-600 font-bold">
                        {strategy.estimated_traffic.toLocaleString()}/month
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 text-sm mb-2 block">Target Keywords</span>
                  <div className="flex flex-wrap gap-2">
                    {strategy.keywords.map(keyword => (
                      <Badge key={keyword} variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 text-sm mb-2 block">Current Activities</span>
                  <ul className="space-y-1">
                    {strategy.activities.map((activity, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-1 flex-shrink-0" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}