import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Star, 
  Gift, 
  Calendar,
  TrendingUp,
  Award,
  Users,
  Zap
} from "lucide-react";

export default function LoyaltyDashboard({ loyaltyData, currentUser }) {
  // ברירות מחדל אם אין נתוני נאמנות
  const loyalty = loyaltyData || {
    total_points: 0,
    current_tier: 'bronze',
    visits_count: 0,
    total_spent: 0,
    referrals_made: 0,
    available_rewards: [],
    tier_benefits: {
      discount_percentage: 0,
      free_entries_per_month: 0,
      priority_booking: false,
      exclusive_events: false,
      personal_promoter: false
    }
  };

  const tierInfo = {
    bronze: {
      name: 'Bronze',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      nextTier: 'silver',
      pointsNeeded: 1000,
      icon: Star
    },
    silver: {
      name: 'Silver',
      color: 'text-gray-300',
      bgColor: 'bg-gray-500/20',
      nextTier: 'gold',
      pointsNeeded: 2500,
      icon: Award
    },
    gold: {
      name: 'Gold',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      nextTier: 'vip',
      pointsNeeded: 5000,
      icon: Crown
    },
    vip: {
      name: 'VIP',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      nextTier: 'ambassador',
      pointsNeeded: 10000,
      icon: Crown
    },
    ambassador: {
      name: 'Ambassador',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      nextTier: null,
      pointsNeeded: null,
      icon: Zap
    }
  };

  const currentTierInfo = tierInfo[loyalty.current_tier];
  const TierIcon = currentTierInfo.icon;

  const calculateProgress = () => {
    if (!currentTierInfo.pointsNeeded) return 100;
    return Math.min((loyalty.total_points / currentTierInfo.pointsNeeded) * 100, 100);
  };

  const pointsToNextTier = () => {
    if (!currentTierInfo.pointsNeeded) return 0;
    return Math.max(currentTierInfo.pointsNeeded - loyalty.total_points, 0);
  };

  const demoRewards = [
    { id: 1, title: 'כניסה חופשית', points: 500, available: loyalty.total_points >= 500 },
    { id: 2, title: 'משקה חינם', points: 200, available: loyalty.total_points >= 200 },
    { id: 3, title: 'הנחה 20%', points: 300, available: loyalty.total_points >= 300 },
    { id: 4, title: 'שולחן VIP', points: 1000, available: loyalty.total_points >= 1000 }
  ];

  return (
    <div className="space-y-6">
      {/* Current Tier Status */}
      <Card className={`bg-slate-900/80 backdrop-blur-xl border-purple-500/30 ${currentTierInfo.bgColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TierIcon className={`w-8 h-8 ${currentTierInfo.color}`} />
              <div>
                <CardTitle className="text-white">{currentTierInfo.name} Member</CardTitle>
                <p className="text-slate-300">רמת הנאמנות הנוכחית שלכם</p>
              </div>
            </div>
            <Badge className={`${currentTierInfo.bgColor} ${currentTierInfo.color} border-0`}>
              {loyalty.total_points} נקודות
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {currentTierInfo.nextTier && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">התקדמות ל-{tierInfo[currentTierInfo.nextTier].name}</span>
                <span className="text-white">{pointsToNextTier()} נקודות נותרו</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{loyalty.visits_count}</div>
            <div className="text-slate-400 text-sm">ביקורים</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-green-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">₪{loyalty.total_spent}</div>
            <div className="text-slate-400 text-sm">הוצאות</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{loyalty.referrals_made}</div>
            <div className="text-slate-400 text-sm">הפניות</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <Gift className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{demoRewards.filter(r => r.available).length}</div>
            <div className="text-slate-400 text-sm">תגמולים זמינים</div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Benefits */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-400" />
            הטבות הרמה שלכם
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loyalty.tier_benefits.discount_percentage > 0 && (
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">הנחה של {loyalty.tier_benefits.discount_percentage}% על כל הזמנה</span>
              </div>
            )}
            
            {loyalty.tier_benefits.free_entries_per_month > 0 && (
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">{loyalty.tier_benefits.free_entries_per_month} כניסות חופשיות בחודש</span>
              </div>
            )}
            
            {loyalty.tier_benefits.priority_booking && (
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">הזמנות עדיפות</span>
              </div>
            )}
            
            {loyalty.tier_benefits.exclusive_events && (
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-slate-300">גישה לאירועים בלעדיים</span>
              </div>
            )}
            
            {loyalty.tier_benefits.personal_promoter && (
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-slate-300">יחצן אישי</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-400" />
            תגמולים זמינים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoRewards.map(reward => (
              <div 
                key={reward.id}
                className={`p-4 rounded-lg border ${
                  reward.available 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-slate-800/50 border-slate-700 opacity-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-white">{reward.title}</h4>
                  <Badge variant={reward.available ? "default" : "secondary"}>
                    {reward.points} נקודות
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  disabled={!reward.available}
                  className={reward.available ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
                >
                  {reward.available ? 'פדה עכשיו' : 'לא זמין'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}