
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  Star, 
  Gift, 
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Plus,
  Calendar,
  DollarSign,
  Trophy,
  Target,
  Heart,
  Zap,
  Medal,
  RefreshCw,
  ArrowUpRight,
  CheckCircle,
  Flame,
  Gem,
  Shield,
  MessageCircle
} from "lucide-react";
import { User } from "@/api/entities";
import { CustomerLoyalty } from "@/api/entities";
import { LoyaltyTransaction } from "@/api/entities";
import { Lead } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

import LoyaltyEngine from "../components/gamification/LoyaltyEngine";

export default function LoyaltyPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [loyaltyData, setLoyaltyData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    vipMembers: 0,
    pointsDistributed: 0,
    redemptions: 0
  });

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const [loyalty, txns, leads] = await Promise.all([
        CustomerLoyalty.filter({ created_by: user.email }, '-created_date', 500),
        LoyaltyTransaction.filter({ created_by: user.email }, '-created_date', 500),
        Lead.filter({ created_by: user.email })
      ]);

      setLoyaltyData(loyalty);
      setTransactions(txns);
      setCustomers(leads);

      // Calculate stats
      const totalMembers = loyalty.length;
      const vipMembers = loyalty.filter(l => l.current_tier === 'vip' || l.current_tier === 'ambassador').length;
      const pointsDistributed = txns
        .filter(t => t.transaction_type === 'earned')
        .reduce((sum, t) => sum + t.points_change, 0);
      const redemptions = txns.filter(t => t.transaction_type === 'redeemed').length;

      setStats({
        totalMembers,
        vipMembers,
        pointsDistributed,
        redemptions
      });

    } catch (error) {
      console.error('Error loading loyalty data:', error);
    }
    setIsLoading(false);
  };

  const tierColors = {
    bronze: 'from-amber-600 to-yellow-600',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    vip: 'from-purple-500 to-pink-500',
    ambassador: 'from-indigo-500 to-purple-600'
  };

  const tierIcons = {
    bronze: Medal,
    silver: Star,
    gold: Crown,
    vip: Sparkles,
    ambassador: Trophy
  };

  const tierBgColors = {
    bronze: 'bg-amber-50 border-amber-200',
    silver: 'bg-slate-50 border-slate-200',
    gold: 'bg-yellow-50 border-yellow-200',
    vip: 'bg-purple-50 border-purple-200',
    ambassador: 'bg-indigo-50 border-indigo-200'
  };

  // חבילות התמחור החדשות
  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter Loyalty',
      subtitle: 'מושלם לעסקים קטנים',
      price: 149,
      originalPrice: 199,
      features: [
        'עד 100 לקוחות פעילים',
        'מערכת נקודות בסיסית',
        '3 דרגות נאמנות',
        'תגמולים קבועים מוגדרים',
        'דוחות חודשיים',
        'תמיכה במייל'
      ],
      popular: false,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600'
    },
    {
      id: 'professional',
      name: 'Professional VIP',
      subtitle: 'הפתרון הפופולרי ביותר',
      price: 299,
      originalPrice: 399,
      features: [
        'עד 500 לקוחות פעילים',
        'מערכת נקודות מתקדמת + בונוסים',
        '5 דרגות נאמנות מלאות',
        'תגמולים דינמיים וחכמים',
        'אנליטיקס מתקדם בזמן אמת',
        'אוטומציה מלאה',
        'אירועים בלעדיים ל-VIP',
        'תמיכה 24/7 + מנהל חשבון'
      ],
      popular: true,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Suite',
      subtitle: 'פתרון מלא לעסקים גדולים',
      price: 599,
      originalPrice: 799,
      features: [
        'לקוחות ללא הגבלה',
        'בינה מלאכותית לניתוח התנהגות',
        'דרגות נאמנות מותאמות אישית',
        'מערכת המלצות חכמה',
        'אינטגרציה עם כל המערכות',
        'דוחות מותאמים אישית',
        'ניהול מספר סניפים',
        'API מלא למפתחים',
        'יועץ אסטרטגי אישי',
        'הדרכות צוות מקצועיות'
      ],
      popular: false,
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ultra Modern Header */}
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20 scale-150"></div>
            <div className="relative flex items-center justify-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center shadow-2xl animate-pulse">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  Loyalty Program
                </h1>
                <p className="text-2xl text-gray-600 font-medium">
                  Build customer loyalty with rewards and VIP experiences
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 mb-12">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-8 py-3 text-lg font-bold shadow-2xl">
              🚀 Gamification Engine
            </Badge>
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none px-8 py-3 text-lg font-bold shadow-2xl">
              💎 VIP System
            </Badge>
            <Badge className="bg-gradient-to-r from-pink-600 to-red-600 text-white border-none px-8 py-3 text-lg font-bold shadow-2xl">
              🏆 Rewards Hub
            </Badge>
          </div>

          <Button 
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl px-12 py-6 text-xl font-bold transform hover:scale-110"
          >
            <Plus className="w-6 h-6 mr-3" />
            Add VIP Reward
          </Button>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Total Members */}
          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5"></div>
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 font-bold uppercase tracking-widest">
                  Total Members
                </CardTitle>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all duration-500">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-black text-gray-900 mb-3">{stats.totalMembers.toLocaleString()}</div>
              <div className="flex items-center gap-2 text-blue-600 text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+23% this month</span>
              </div>
            </CardContent>
          </Card>

          {/* VIP Members */}
          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5"></div>
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 font-bold uppercase tracking-widest">
                  VIP Members
                </CardTitle>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all duration-500">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-black text-purple-600 mb-3">{stats.vipMembers.toLocaleString()}</div>
              <div className="flex items-center gap-2 text-purple-600 text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Elite Status</span>
              </div>
            </CardContent>
          </Card>

          {/* Points Distributed */}
          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/5"></div>
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 font-bold uppercase tracking-widest">
                  Points Distributed
                </CardTitle>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all duration-500">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-black text-yellow-600 mb-3">{stats.pointsDistributed.toLocaleString()}</div>
              <div className="flex items-center gap-2 text-yellow-600 text-sm font-bold">
                <Flame className="w-4 h-4" />
                <span>Total Points</span>
              </div>
            </CardContent>
          </Card>

          {/* Redemptions */}
          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5"></div>
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 font-bold uppercase tracking-widest">
                  Redemptions
                </CardTitle>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all duration-500">
                  <Gift className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-black text-emerald-600 mb-3">{stats.redemptions.toLocaleString()}</div>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Rewards Claimed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section - חדש */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Choose Your Loyalty Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scale your customer engagement with our AI-powered loyalty solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 border-0 shadow-2xl ${
                  plan.popular 
                    ? 'ring-4 ring-purple-300 bg-white' 
                    : 'bg-white/90 backdrop-blur-sm hover:shadow-3xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className={`bg-gradient-to-r ${plan.color} text-white text-center py-3 text-sm font-bold`}>
                      ⭐ הכי פופולרי
                    </div>
                  </div>
                )}
                
                <CardHeader className={`${plan.popular ? 'pt-16' : 'pt-8'} pb-4 text-center`}>
                  <div className={`w-20 h-20 bg-gradient-to-r ${plan.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mb-6">
                    {plan.subtitle}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">₪{plan.price}</span>
                      <span className="text-lg text-gray-500 line-through">₪{plan.originalPrice}</span>
                    </div>
                    <div className="text-gray-600 text-sm">per month</div>
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full py-4 text-lg font-bold transition-all duration-200 ${
                      plan.popular 
                        ? `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white shadow-xl hover:shadow-2xl` 
                        : `border-2 border-gray-300 bg-white ${plan.textColor} hover:bg-gray-50`
                    }`}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                  </Button>

                  {plan.id === 'enterprise' && (
                    <div className="text-center mt-4">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Sales
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* תכונות נוספות */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Setup in Minutes</h3>
              <p className="text-gray-600">Get started with your loyalty program in under 10 minutes</p>
            </div>

            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with 99.9% uptime guarantee</p>
            </div>

            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600">Average 3x increase in customer retention within 90 days</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Customer Loyalty?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join 500+ businesses already using our AI-powered loyalty platform to boost customer engagement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold">
                Start 14-Day Free Trial
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-bold">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Ultra Modern Tabs */}
        <Tabs defaultValue="overview" className="space-y-10">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-3 h-20">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-2xl rounded-2xl font-bold transition-all duration-300 text-lg py-4"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-2xl rounded-2xl font-bold transition-all duration-300 text-lg py-4"
            >
              <Users className="w-5 h-5 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-2xl rounded-2xl font-bold transition-all duration-300 text-lg py-4"
            >
              <Gift className="w-5 h-5 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-2xl rounded-2xl font-bold transition-all duration-300 text-lg py-4"
            >
              <Target className="w-5 h-5 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-10">
            {/* Tier Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-purple-600" />
                    Membership Tiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-6">
                    {Object.entries(tierColors).map(([tier, gradient]) => {
                      const count = loyaltyData.filter(l => l.current_tier === tier).length;
                      const percentage = loyaltyData.length > 0 ? (count / loyaltyData.length * 100) : 0;
                      const IconComponent = tierIcons[tier];
                      const bgColor = tierBgColors[tier];
                      
                      return (
                        <div key={tier} className={`flex items-center justify-between p-6 rounded-2xl border-2 ${bgColor} hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-xl`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="font-black text-gray-900 capitalize text-xl">{tier}</h3>
                              <p className="text-gray-600 font-semibold">{count} members</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-gray-900 mb-2">{percentage.toFixed(1)}%</div>
                            <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-emerald-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white/60 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                            transaction.transaction_type === 'earned' ? 'bg-emerald-100 text-emerald-600' :
                            transaction.transaction_type === 'redeemed' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {transaction.transaction_type === 'earned' ? '+' : 
                             transaction.transaction_type === 'redeemed' ? '-' : '='}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{transaction.reason}</p>
                            <p className="text-gray-600 font-semibold capitalize">{transaction.transaction_type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-black ${
                            transaction.transaction_type === 'earned' ? 'text-emerald-600' :
                            transaction.transaction_type === 'redeemed' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {transaction.transaction_type === 'earned' ? '+' : 
                             transaction.transaction_type === 'redeemed' ? '-' : ''}
                            {Math.abs(transaction.points_change)}
                          </div>
                          <p className="text-gray-500 font-bold text-sm">POINTS</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-8">
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <Users className="w-8 h-8 text-indigo-600" />
                  VIP Loyalty Members
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-6">
                  {loyaltyData.map((member) => {
                    const customer = customers.find(c => c.id === member.lead_id);
                    const TierIcon = tierIcons[member.current_tier];
                    const tierGradient = tierColors[member.current_tier];
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl">
                            <span className="text-white font-black text-xl">
                              {customer?.first_name?.[0] || 'M'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-black text-gray-900 text-xl">
                              {customer?.first_name} {customer?.last_name}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge className={`bg-gradient-to-r ${tierGradient} text-white border-none px-4 py-2 font-bold`}>
                                <TierIcon className="w-4 h-4 mr-2" />
                                {member.current_tier.toUpperCase()}
                              </Badge>
                              <span className="text-gray-600 font-bold">
                                {member.visits_count} visits
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-gray-900 mb-1">
                            {member.total_points.toLocaleString()}
                          </div>
                          <p className="text-gray-600 font-bold">POINTS</p>
                          <p className="text-emerald-600 font-black text-lg">
                            ₪{member.total_spent.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <LoyaltyEngine 
              loyaltyData={loyaltyData}
              transactions={transactions}
              customers={customers}
              onUpdate={loadLoyaltyData}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                    Engagement Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="h-80 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl mb-6">
                      <TrendingUp className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-600 text-center">Advanced Analytics Dashboard</p>
                    <p className="text-gray-500 font-semibold mt-2">Real-time engagement metrics coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <Gift className="w-8 h-8 text-purple-600" />
                    Redemption Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="h-80 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl mb-6">
                      <Gift className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-600 text-center">Reward Analytics Hub</p>
                    <p className="text-gray-500 font-semibold mt-2">Customer behavior insights loading</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
