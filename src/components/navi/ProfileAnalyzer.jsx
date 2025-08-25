import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Users, 
  MessageSquare, 
  Heart, 
  Share, 
  TrendingUp,
  Calendar,
  MapPin,
  Link,
  Verified,
  Star
} from "lucide-react";

export default function ProfileAnalyzer({ profile }) {
  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.profilePicture} alt={profile.fullName} />
              <AvatarFallback className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {profile.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
                {profile.verified && <Verified className="w-5 h-5 text-blue-500" />}
              </div>
              <p className="text-gray-600 mb-2">@{profile.username}</p>
              <p className="text-gray-700 mb-3">{profile.bio}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{profile.followers?.toLocaleString()} עוקבים</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{profile.following?.toLocaleString()} עוקבים אחרי</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{profile.posts} פוסטים</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{profile.qualityScore}%</div>
              <div className="text-sm text-gray-600">Quality Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {profile.engagementRate}%
            </div>
            <div className="text-sm text-gray-600">Engagement Rate</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {profile.authenticFollowers}%
            </div>
            <div className="text-sm text-gray-600">Authentic Followers</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {profile.influencerScore || 8.5}
            </div>
            <div className="text-sm text-gray-600">Influencer Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Profile Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Content Quality</span>
              <span className="font-bold text-indigo-600">{profile.qualityScore}%</span>
            </div>
            <Progress value={profile.qualityScore} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Engagement Rate</span>
              <span className="font-bold text-red-600">{profile.engagementRate}%</span>
            </div>
            <Progress value={parseFloat(profile.engagementRate)} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Authentic Followers</span>
              <span className="font-bold text-green-600">{profile.authenticFollowers}%</span>
            </div>
            <Progress value={profile.authenticFollowers} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Interests & Lifestyle */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Interests & Lifestyle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Lifestyle: {profile.lifestyle}</h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Dominant Colors</h4>
              <div className="flex gap-2">
                {profile.dominantColors?.map((color, index) => (
                  <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {color}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.keyInsights?.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      {profile.riskFactors?.length > 0 && (
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 text-red-600">Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{risk}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}