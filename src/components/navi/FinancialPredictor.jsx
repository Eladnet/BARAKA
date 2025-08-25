import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Target,
  Wallet,
  Star,
  Crown,
  ShoppingBag
} from "lucide-react";

export default function FinancialPredictor({ profile }) {
  if (!profile) return null;

  const financialData = {
    estimatedIncome: 'High',
    spendingCapacity: profile.financialPotential || 'High',
    postValue: profile.estimatedPostValue || 850,
    conversionProb: profile.conversionProbability || 76,
    lifetimeValue: 4200,
    luxuryScore: 84,
    financialStability: 91,
    spendingPatterns: [
      { category: 'Fashion & Beauty', percentage: 30, amount: 2500 },
      { category: 'Travel & Leisure', percentage: 25, amount: 2100 },
      { category: 'Dining & Entertainment', percentage: 20, amount: 1600 },
      { category: 'Technology', percentage: 15, amount: 1200 },
      { category: 'Others', percentage: 10, amount: 800 }
    ]
  };

  const getSpendingColor = (potential) => {
    const colors = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-emerald-100 text-emerald-800',
      'Very High': 'bg-purple-100 text-purple-800'
    };
    return colors[potential] || colors['Medium'];
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              ₪{financialData.postValue}
            </div>
            <div className="text-sm text-gray-600">Est. Post Value</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {financialData.conversionProb}%
            </div>
            <div className="text-sm text-gray-600">Conversion Prob.</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Wallet className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              ₪{financialData.lifetimeValue}
            </div>
            <div className="text-sm text-gray-600">Lifetime Value</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">
              {financialData.luxuryScore}%
            </div>
            <div className="text-sm text-gray-600">Luxury Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Capacity Analysis */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Financial Capacity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Spending Capacity</span>
            <Badge className={getSpendingColor(financialData.spendingCapacity)}>
              {financialData.spendingCapacity}
            </Badge>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Conversion Probability</span>
              <span className="font-bold text-blue-600">{financialData.conversionProb}%</span>
            </div>
            <Progress value={financialData.conversionProb} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Luxury Lifestyle Score</span>
              <span className="font-bold text-purple-600">{financialData.luxuryScore}%</span>
            </div>
            <Progress value={financialData.luxuryScore} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Financial Stability</span>
              <span className="font-bold text-green-600">{financialData.financialStability}%</span>
            </div>
            <Progress value={financialData.financialStability} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Spending Patterns */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-500" />
            Predicted Spending Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialData.spendingPatterns.map((pattern, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{pattern.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">₪{pattern.amount}</span>
                  <span className="text-xs text-gray-500">({pattern.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                  style={{ width: `${pattern.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Revenue Potential */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-500" />
            Revenue Potential Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Collaboration Value</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sponsored Post:</span>
                  <Badge className="bg-green-100 text-green-800">₪{financialData.postValue}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Story Mention:</span>
                  <Badge className="bg-blue-100 text-blue-800">₪{Math.floor(financialData.postValue * 0.3)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Event Appearance:</span>
                  <Badge className="bg-purple-100 text-purple-800">₪{Math.floor(financialData.postValue * 1.5)}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Value</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Event Tickets:</span>
                  <Badge className="bg-indigo-100 text-indigo-800">₪{Math.floor(financialData.lifetimeValue * 0.2)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">VIP Packages:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">₪{Math.floor(financialData.lifetimeValue * 0.6)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lifetime Value:</span>
                  <Badge className="bg-emerald-100 text-emerald-800">₪{financialData.lifetimeValue}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Insights */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            Financial Intelligence Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">High disposable income with luxury spending patterns</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Strong conversion potential for premium events and experiences</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Excellent candidate for VIP packages and exclusive offers</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">High lifetime value potential with repeat business probability</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}