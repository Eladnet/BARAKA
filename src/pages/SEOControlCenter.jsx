import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Search, 
  Globe, 
  BarChart3,
  Eye,
  MousePointer,
  Star,
  Link,
  Users,
  Target,
  Zap,
  Award,
  Rocket,
  Crown
} from "lucide-react";
import { User } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

import SEOStrategyEngine from "../components/seo/SEOStrategyEngine";
import ContentGenerationEngine from "../components/seo/ContentGenerationEngine";
import CompetitorAnalysis from "../components/seo/CompetitorAnalysis";
import BacklinkBuilder from "../components/seo/BacklinkBuilder";
import SocialBooster from "../components/seo/SocialBooster";
import AIMarketingEngine from "../components/seo/AIMarketingEngine";

export default function SEOControlCenterPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seoStats, setSeoStats] = useState({
    organicTraffic: 0,
    keywordRankings: 0,
    backlinks: 0,
    domainAuthority: 0,
    conversionRate: 0,
    socialEngagement: 0
  });

  useEffect(() => {
    checkSuperAdminAccess();
    loadSEOStats();
  }, []);

  const checkSuperAdminAccess = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Check if user is super admin
      const superAdminEmails = [
        'elad@bigcohen.com', 
        'dor.azriel@gmail.com', 
        'alihassanvirk.ahv@gmail.com'
      ];
      
      if (!superAdminEmails.includes(user.email)) {
        alert('Access denied. Super Admin privileges required.');
        window.location.href = '/dashboard';
        return;
      }
      
    } catch (error) {
      console.error('Error checking super admin access:', error);
      window.location.href = '/login';
    }
    setIsLoading(false);
  };

  const loadSEOStats = async () => {
    try {
      // Mock SEO data - in real app this would come from SEO APIs
      setSeoStats({
        organicTraffic: 12500,
        keywordRankings: 847,
        backlinks: 1250,
        domainAuthority: 68,
        conversionRate: 3.4,
        socialEngagement: 89
      });
      
    } catch (error) {
      console.error('Error loading SEO stats:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SEO Control Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Rocket className="w-8 h-8 text-emerald-500" />
                🚀 SEO Control Center
              </h1>
              <p className="text-gray-600 text-lg">
                Advanced SEO automation and marketing intelligence platform
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-none">
                  <Crown className="w-3 h-3 mr-1" />
                  SEO Master
                </Badge>
                <Badge variant="outline" className="border-gray-300 text-gray-700">
                  Domain Authority: {seoStats.domainAuthority}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Zap className="w-4 h-4 mr-2" />
                Run SEO Audit
              </Button>
            </div>
          </div>
        </div>

        {/* SEO Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Organic Traffic
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{seoStats.organicTraffic.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 mt-1">
                +23% vs last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Keyword Rankings
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{seoStats.keywordRankings}</div>
              <div className="text-xs text-gray-500 mt-1">
                Top 10 positions
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Quality Backlinks
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Link className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{seoStats.backlinks.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 mt-1">
                +45 this week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Domain Authority
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{seoStats.domainAuthority}</div>
              <div className="text-xs text-emerald-600 mt-1">
                +3 points
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Conversion Rate
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{seoStats.conversionRate}%</div>
              <div className="text-xs text-emerald-600 mt-1">
                +0.8% improvement
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  Social Engagement
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{seoStats.socialEngagement}%</div>
              <div className="text-xs text-emerald-600 mt-1">
                Engagement score
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SEO Control Tabs */}
        <Tabs defaultValue="strategy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-white border-0 shadow-lg rounded-xl p-1 h-14">
            <TabsTrigger 
              value="strategy" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200 text-xs"
            >
              <Target className="w-4 h-4 mr-1" />
              Strategy
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200 text-xs"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="competitors" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200 text-xs"
            >
              <Eye className="w-4 h-4 mr-1" />
              Competitors
            </TabsTrigger>
            <TabsTrigger 
              value="backlinks" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200 text-xs"
            >
              <Link className="w-4 h-4 mr-1" />
              Backlinks
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200 text-xs"
            >
              <Users className="w-4 h-4 mr-1" />
              Social
            </TabsTrigger>
            <TabsTrigger 
              value="ai-marketing" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200 text-xs"
            >
              <Zap className="w-4 h-4 mr-1" />
              AI Marketing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strategy" className="space-y-6">
            <SEOStrategyEngine seoStats={seoStats} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentGenerationEngine />
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <CompetitorAnalysis />
          </TabsContent>

          <TabsContent value="backlinks" className="space-y-6">
            <BacklinkBuilder />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <SocialBooster />
          </TabsContent>

          <TabsContent value="ai-marketing" className="space-y-6">
            <AIMarketingEngine seoStats={seoStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}