import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Target, 
  MessageCircle, 
  Star,
  Calendar,
  Gift,
  Users,
  Zap,
  Heart,
  Crown
} from "lucide-react";

export default function SmartRecommendations({ profile }) {
  if (!profile) return null;

  const recommendations = {
    approach: {
      strategy: 'Luxury Experience Marketing',
      timing: 'Evening (7-9 PM)',
      platform: 'Instagram DM',
      tone: 'Exclusive & Personal'
    },
    offers: [
      {
        type: 'VIP Event Invitation',
        description: 'Exclusive rooftop party with premium DJ',
        value: '₪500',
        probability: 89,
        urgency: 'High',
        icon: Crown
      },
      {
        type: 'Influencer Collaboration',
        description: 'Sponsored post for nightlife event',
        value: '₪850',
        probability: 76,
        urgency: 'Medium',
        icon: Star
      },
      {
        type: 'Table Reservation',
        description: 'Premium table booking with bottle service',
        value: '₪1,200',
        probability: 65,
        urgency: 'Low',
        icon: Gift
      }
    ],
    messaging: [
      {
        type: 'Opening Message',
        content: 'Hi! I noticed your amazing lifestyle content. We have an exclusive event that would be perfect for you...',
        tone: 'Personal & Engaging'
      },
      {
        type: 'Follow-up',
        content: 'This is a limited invitation for our VIP rooftop experience. Only 20 selected influencers...',
        tone: 'Exclusive & Urgent'
      },
      {
        type: 'Closing',
        content: 'Would love to have you join us! Let me know if you\'re interested and I\'ll send the details.',
        tone: 'Friendly & Direct'
      }
    ],
    timing: [
      { day: 'Tuesday', time: '19:00', effectiveness: 'High' },
      { day: 'Wednesday', time: '20:30', effectiveness: 'Very High' },
      { day: 'Thursday', time: '18:45', effectiveness: 'High' }
    ]
  };

  const getProbabilityColor = (prob) => {
    if (prob >= 80) return 'bg-green-100 text-green-800';
    if (prob >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return colors[urgency] || colors['Medium'];
  };

  return (
    <div className="space-y-6">
      {/* Recommended Approach */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI-Recommended Approach Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Strategy:</span>
                <Badge className="bg-purple-100 text-purple-800">{recommendations.approach.strategy}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Platform:</span>
                <Badge className="bg-pink-100 text-pink-800">{recommendations.approach.platform}</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Optimal Timing:</span>
                <Badge className="bg-blue-100 text-blue-800">{recommendations.approach.timing}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tone:</span>
                <Badge className="bg-indigo-100 text-indigo-800">{recommendations.approach.tone}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Offers */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            Recommended Offers (By Success Probability)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.offers.map((offer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <offer.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{offer.type}</h4>
                      <p className="text-sm text-gray-600">{offer.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-emerald-600">{offer.value}</div>
                    <div className="text-sm text-gray-500">Est. Value</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getProbabilityColor(offer.probability)}>
                      {offer.probability}% Success Rate
                    </Badge>
                    <Badge className={getUrgencyColor(offer.urgency)}>
                      {offer.urgency} Priority
                    </Badge>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Start Campaign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            AI-Generated Message Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.messaging.map((message, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{message.type}</h4>
                  <Badge variant="outline" className="text-xs">
                    {message.tone}
                  </Badge>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic">
                  "{message.content}"
                </p>
                <div className="mt-2 flex justify-end">
                  <Button size="sm" variant="outline">
                    Copy Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimal Timing */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Optimal Contact Timing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.timing.map((time, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-gray-900">{time.day}</span>
                  <span className="text-gray-600">{time.time}</span>
                </div>
                <Badge className={
                  time.effectiveness === 'Very High' ? 'bg-green-100 text-green-800' :
                  time.effectiveness === 'High' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {time.effectiveness}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Next Steps & Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">
                <strong>Step 1:</strong> Send personalized DM using the opening template between 7-9 PM
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">
                <strong>Step 2:</strong> Follow up with VIP event invitation if positive response
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">
                <strong>Step 3:</strong> Offer collaboration opportunity as alternative if not interested in events
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">
                <strong>Step 4:</strong> Track engagement and adjust approach based on response patterns
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}