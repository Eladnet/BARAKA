import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  TrendingUp,
  Users,
  Clock,
  Target,
  Zap
} from "lucide-react";

export default function EngagementAnalyzer({ profile }) {
  if (!profile) return null;

  const engagementMetrics = {
    averageLikes: Math.floor(profile.followers * 0.03),
    averageComments: Math.floor(profile.followers * 0.005),
    averageShares: Math.floor(profile.followers * 0.001),
    engagementRate: parseFloat(profile.engagementRate),
    responseRate: 78,
    storyViews: Math.floor(profile.followers * 0.25),
    bestPostingTime: '19:00-21:00',
    audienceGrowth: '+12.5%'
  };

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {engagementMetrics.averageLikes.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Avg. Likes</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {engagementMetrics.averageComments.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Avg. Comments</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Share className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {engagementMetrics.averageShares.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Avg. Shares</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {engagementMetrics.engagementRate}%
            </div>
            <div className="text-sm text-gray-600">Engagement Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Engagement Analysis */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Engagement Quality Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Engagement Rate</span>
              <span className="font-bold text-purple-600">{engagementMetrics.engagementRate}%</span>
            </div>
            <Progress value={engagementMetrics.engagementRate} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Industry average: 2.1%</div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="font-bold text-blue-600">{engagementMetrics.responseRate}%</span>
            </div>
            <Progress value={engagementMetrics.responseRate} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Responds to comments and DMs</div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Authentic Interactions</span>
              <span className="font-bold text-green-600">{profile.authenticFollowers}%</span>
            </div>
            <Progress value={profile.authenticFollowers} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Real vs. bot interactions</div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Patterns */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Engagement Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Best Posting Times</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Peak Hours:</span>
                  <Badge className="bg-indigo-100 text-indigo-800">{engagementMetrics.bestPostingTime}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Days:</span>
                  <Badge className="bg-green-100 text-green-800">Wed, Thu, Fri</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Audience Growth</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last 30 days:</span>
                  <Badge className="bg-emerald-100 text-emerald-800">{engagementMetrics.audienceGrowth}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Story Views:</span>
                  <Badge className="bg-blue-100 text-blue-800">{engagementMetrics.storyViews.toLocaleString()}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Engagement Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">High-quality engagement with authentic interactions</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Active community engagement and regular responses</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Content resonates well with target audience</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Consistent posting schedule maintains audience interest</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}