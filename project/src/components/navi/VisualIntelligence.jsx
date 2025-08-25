import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Eye, 
  Palette, 
  Image,
  Sparkles,
  Star,
  MapPin,
  Users,
  Heart
} from "lucide-react";

export default function VisualIntelligence({ profile }) {
  if (!profile) return null;

  const visualData = {
    contentCategories: [
      { name: 'Lifestyle', percentage: 35, color: 'bg-pink-500' },
      { name: 'Fashion', percentage: 25, color: 'bg-purple-500' },
      { name: 'Travel', percentage: 20, color: 'bg-blue-500' },
      { name: 'Food', percentage: 15, color: 'bg-green-500' },
      { name: 'Fitness', percentage: 5, color: 'bg-orange-500' }
    ],
    aestheticScore: 87,
    brandMentions: ['Zara', 'Nike', 'Starbucks', 'iPhone'],
    locations: ['Tel Aviv', 'New York', 'Paris', 'London'],
    visualQuality: 92,
    luxuryIndicators: ['Designer bags', 'Premium restaurants', 'First class travel', 'Luxury hotels']
  };

  return (
    <div className="space-y-6">
      {/* Visual Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {visualData.visualQuality}%
            </div>
            <div className="text-sm text-gray-600">Visual Quality</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Palette className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {visualData.aestheticScore}%
            </div>
            <div className="text-sm text-gray-600">Aesthetic Score</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {visualData.luxuryIndicators.length}
            </div>
            <div className="text-sm text-gray-600">Luxury Indicators</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Categories */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Image className="w-5 h-5 text-indigo-500" />
            Content Categories Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {visualData.contentCategories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">{category.name}</span>
                <span className="font-bold text-gray-900">{category.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${category.color}`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Visual Analysis */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-green-500" />
            Visual Content Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Photo Quality</span>
              <span className="font-bold text-green-600">{visualData.visualQuality}%</span>
            </div>
            <Progress value={visualData.visualQuality} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Aesthetic Consistency</span>
              <span className="font-bold text-purple-600">{visualData.aestheticScore}%</span>
            </div>
            <Progress value={visualData.aestheticScore} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Brand Alignment</span>
              <span className="font-bold text-indigo-600">84%</span>
            </div>
            <Progress value={84} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Dominant Colors */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-500" />
            Dominant Colors & Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Color Palette</h4>
              <div className="flex gap-2">
                {profile.dominantColors?.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-${color.toLowerCase()}-500`}></div>
                    <span className="text-sm text-gray-700">{color}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Visual Style</h4>
              <Badge className="bg-indigo-100 text-indigo-800">
                {profile.lifestyle || 'Modern Minimalist'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Mentions */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-500" />
            Brand Mentions & Luxury Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Frequently Mentioned Brands</h4>
              <div className="flex flex-wrap gap-2">
                {visualData.brandMentions.map((brand, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Luxury Indicators</h4>
              <div className="space-y-2">
                {visualData.luxuryIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Frequent Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {visualData.locations.map((location, index) => (
              <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <MapPin className="w-3 h-3 mr-1" />
                {location}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Intelligence Insights */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            Visual Intelligence Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">High visual quality with professional photography style</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Consistent aesthetic matching luxury lifestyle brands</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Strong luxury indicators suggest high spending capacity</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Travel content indicates international lifestyle</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}