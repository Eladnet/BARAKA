import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Network, 
  Users, 
  UserCheck, 
  Link, 
  Crown,
  Star,
  MessageCircle,
  Eye,
  TrendingUp
} from "lucide-react";

export default function SocialMapper({ profile }) {
  if (!profile) return null;

  // Mock social network data
  const networkData = {
    mutualConnections: profile.mutualConnections || 15,
    networkQuality: profile.networkQuality || 78,
    influencerConnections: profile.influencerConnections || 3,
    commonInterests: ['Nightlife', 'Fashion', 'Travel', 'Food'],
    frequentInteractions: [
      { name: 'Maya Cohen', username: '@maya_style', mutualFriends: 8, interaction: 'High' },
      { name: 'Alex Levi', username: '@alexlevi', mutualFriends: 12, interaction: 'Medium' },
      { name: 'Sarah Ben', username: '@sarahben', mutualFriends: 5, interaction: 'Low' }
    ],
    networkInsights: [
      'Strong connections in Tel Aviv nightlife scene',
      'Active in fashion and lifestyle community',
      'Regular interactions with verified accounts',
      'Part of influencer circle in age range 25-35'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {networkData.mutualConnections}
            </div>
            <div className="text-sm text-gray-600">Mutual Connections</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {networkData.influencerConnections}
            </div>
            <div className="text-sm text-gray-600">Influencer Connections</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {networkData.networkQuality}%
            </div>
            <div className="text-sm text-gray-600">Network Quality</div>
          </CardContent>
        </Card>
      </div>

      {/* Network Analysis */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-500" />
            Social Network Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Network Strength</span>
              <span className="font-bold text-indigo-600">{networkData.networkQuality}%</span>
            </div>
            <Progress value={networkData.networkQuality} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Mutual Connection Rate</span>
              <span className="font-bold text-blue-600">85%</span>
            </div>
            <Progress value={85} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Influencer Engagement</span>
              <span className="font-bold text-purple-600">72%</span>
            </div>
            <Progress value={72} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Frequent Interactions */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            Frequent Interactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {networkData.frequentInteractions.map((person, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.username}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    className={
                      person.interaction === 'High' ? 'bg-green-100 text-green-800' :
                      person.interaction === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {person.interaction}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {person.mutualFriends} mutual friends
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Insights */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-orange-500" />
            Network Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {networkData.networkInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Interests */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-pink-500" />
            Common Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {networkData.commonInterests.map((interest, index) => (
              <Badge key={index} variant="outline" className="border-pink-200 text-pink-700">
                {interest}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}