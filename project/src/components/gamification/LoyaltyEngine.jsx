
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Trophy,
  Crown,
  Gift,
  Users,
  TrendingUp,
  Medal,
  Sparkles,
  Heart,
  Zap,
  Target,
  Award,
  Plus
} from "lucide-react";
import { CustomerLoyalty, LoyaltyTransaction, Lead } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

export default function LoyaltyEngine({ loyaltyData, transactions, customers, onUpdate }) {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [selectedLead, setSelectedLead] = useState(null);
  const [pointsToAward, setPointsToAward] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // הוספת פונקציונליות חדשה לחבילות
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const tierSystem = {
    bronze: { min: 0, max: 100, color: 'text-amber-600', benefits: [t('Basic rewards'), t('Birthday bonus')] },
    silver: { min: 101, max: 500, color: 'text-slate-400', benefits: [t('5% discount'), t('Priority booking'), t('Free drink monthly')] },
    gold: { min: 501, max: 1000, color: 'text-yellow-400', benefits: [t('10% discount'), t('VIP line skip'), t('Free entry 2x/month'), t('Personal promoter')] },
    vip: { min: 1001, max: 5000, color: 'text-purple-400', benefits: [t('15% discount'), t('Exclusive events'), t('Bottle service deals'), t('Guest list +1')] },
    ambassador: { min: 5001, max: Infinity, color: 'text-pink-400', benefits: [t('20% discount'), t('Revenue sharing'), t('Event planning input'), t('Unlimited guests')] }
  };

  const rewardTypes = [
    { id: 'visit', points: 50, name: t('Event Attendance'), icon: '🎉' },
    { id: 'purchase', points: 10, name: t('Money Spent (₪10 = 1pt)'), icon: '💰' },
    { id: 'referral', points: 200, name: t('Friend Referral'), icon: '👥' },
    { id: 'social', points: 25, name: t('Social Media Share'), icon: '📱' },
    { id: 'review', points: 75, name: t('Review/Testimonial'), icon: '⭐' },
    { id: 'birthday', points: 100, name: t('Birthday Bonus'), icon: '🎂' },
    { id: 'milestone', points: 500, name: t('Milestone Achievement'), icon: '🏆' }
  ];

  const availableRewards = [
    { id: 'free_entry', cost: 100, name: t('Free Entry'), description: t('Skip the line and enter free'), icon: '🎫' },
    { id: 'drinks', cost: 200, name: t('2 Free Drinks'), description: t('Complimentary drinks at the bar'), icon: '🍹' },
    { id: 'vip_table', cost: 500, name: t('VIP Table (4hrs)'), description: t('Reserved table in VIP section'), icon: '🛋️' },
    { id: 'bottle_service', cost: 800, name: t('Bottle Service 50% Off'), description: t('Half-price bottle service'), icon: '🍾' },
    { id: 'birthday_party', cost: 1000, name: t('Birthday Party Package'), description: t('Complete birthday celebration'), icon: '🎂' },
    { id: 'meet_dj', cost: 2000, name: t('Meet the DJ'), description: t('Backstage access and meet & greet'), icon: '🎧' },
    { id: 'exclusive_event', cost: 3000, name: t('Exclusive Event Invite'), description: t('VIP-only private events'), icon: '👑' }
  ];

  const getTierFromPoints = (points) => {
    for (const [tier, config] of Object.entries(tierSystem)) {
      if (points >= config.min && points <= config.max) {
        return tier;
      }
    }
    return 'bronze';
  };

  const awardPoints = async () => {
    if (!selectedLead || !pointsToAward || !reason.trim()) {
      alert(t('Please fill all fields'));
      return;
    }

    setIsLoading(true);
    try {
      // Create loyalty transaction
      await LoyaltyTransaction.create({
        lead_id: selectedLead.id,
        transaction_type: 'earned',
        points_change: parseInt(pointsToAward),
        reason: reason
      });

      // Update customer loyalty record
      const existingLoyalty = loyaltyData.find(l => l.lead_id === selectedLead.id);
      const newTotal = (existingLoyalty?.total_points || 0) + parseInt(pointsToAward);
      const newTier = getTierFromPoints(newTotal);

      if (existingLoyalty) {
        await CustomerLoyalty.update(existingLoyalty.id, {
          total_points: newTotal,
          current_tier: newTier
        });
      } else {
        await CustomerLoyalty.create({
          lead_id: selectedLead.id,
          total_points: newTotal,
          current_tier: newTier,
          visits_count: 1
        });
      }

      alert(t(`Successfully awarded ${pointsToAward} points to ${selectedLead.first_name}!`));
      setPointsToAward('');
      setReason('');
      setSelectedLead(null);

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error awarding points:', error);
      alert(t('Error awarding points'));
    }
    setIsLoading(false);
  };

  const redeemReward = async (leadId, rewardId, cost) => {
    setIsLoading(true);
    try {
      const customerLoyalty = loyaltyData.find(l => l.lead_id === leadId);
      if (!customerLoyalty || customerLoyalty.total_points < cost) {
        alert(t('Insufficient points'));
        return;
      }

      // Create redemption transaction
      await LoyaltyTransaction.create({
        lead_id: leadId,
        transaction_type: 'redeemed',
        points_change: -cost,
        reason: `Redeemed: ${availableRewards.find(r => r.id === rewardId)?.name}`
      });

      // Update loyalty points
      await CustomerLoyalty.update(customerLoyalty.id, {
        total_points: customerLoyalty.total_points - cost
      });

      alert(t('Reward redeemed successfully!'));

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert(t('Error redeeming reward'));
    }
    setIsLoading(false);
  };

  const handlePlanUpgrade = (planId) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  return (
    <div className="space-y-8">
      {/* תוכן קיים של LoyaltyEngine */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {t('Loyalty & Gamification Engine')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
              <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
              <TabsTrigger value="tiers">{t('Tier System')}</TabsTrigger>
              <TabsTrigger value="rewards">{t('Rewards')}</TabsTrigger>
              <TabsTrigger value="award">{t('Award Points')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('Analytics')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{loyaltyData.reduce((sum, l) => sum + (l.total_points || 0), 0).toLocaleString()}</div>
                  <div className="text-sm text-slate-400">{t('Total Points Issued')}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{loyaltyData.length}</div>
                  <div className="text-sm text-slate-400">{t('Active Members')}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{loyaltyData.filter(l => l.current_tier === 'vip' || l.current_tier === 'ambassador').length}</div>
                  <div className="text-sm text-slate-400">{t('VIP+ Members')}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">89%</div>
                  <div className="text-sm text-slate-400">{t('Retention Rate')}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">{t('Point Earning Activities')}</h4>
                  <div className="space-y-2">
                    {rewardTypes.map(reward => (
                      <div key={reward.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{reward.icon}</span>
                          <span className="text-white">{reward.name}</span>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-300">
                          +{reward.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">{t('Recent Transactions')}</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {transactions.slice(0, 8).map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-2 rounded bg-slate-800/30">
                        <div className="text-sm">
                          <div className="text-white font-medium">{transaction.reason}</div>
                          <div className="text-slate-400 text-xs">{new Date(transaction.created_date).toLocaleDateString()}</div>
                        </div>
                        <Badge className={transaction.points_change > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}>
                          {transaction.points_change > 0 ? '+' : ''}{transaction.points_change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tiers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(tierSystem).map(([tier, config]) => {
                  const membersInTier = loyaltyData.filter(l => l.current_tier === tier).length;
                  const TierIcon = tier === 'ambassador' ? Crown : tier === 'vip' ? Trophy : tier === 'gold' ? Medal : tier === 'silver' ? Award : Star;

                  return (
                    <Card key={tier} className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="text-center pb-3">
                        <TierIcon className={`w-12 h-12 mx-auto ${config.color} mb-2`} />
                        <CardTitle className={`capitalize ${config.color} text-lg`}>
                          {t(tier.charAt(0).toUpperCase() + tier.slice(1))}
                        </CardTitle>
                        <div className="text-sm text-slate-400">
                          {config.min === 0 ? config.max : `${config.min}-${config.max === Infinity ? '∞' : config.max}`} {t('points')}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center mb-3">
                          <div className="text-2xl font-bold text-white">{membersInTier}</div>
                          <div className="text-xs text-slate-400">{t('members')}</div>
                        </div>

                        <div className="space-y-1">
                          {config.benefits.map((benefit, index) => (
                            <div key={index} className="text-xs text-slate-300 flex items-center gap-1">
                              <span className="w-1 h-1 bg-current rounded-full flex-shrink-0" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                <h4 className="font-medium text-white mb-2">{t('Tier Progression Strategy')}</h4>
                <p className="text-sm text-slate-300">
                  {t('Each tier unlocks exclusive benefits and creates strong incentives for customers to return and spend more. The gamification element drives engagement and builds emotional connection to your venues.')}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRewards.map(reward => (
                  <Card key={reward.id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">{reward.icon}</div>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {reward.cost} pts
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-base">{reward.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 mb-3">{reward.description}</p>
                      <div className="text-xs text-slate-500">
                        {loyaltyData.filter(l => (l.total_points || 0) >= reward.cost).length} {t('customers can afford this')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('Create Custom Reward')}
              </Button>
            </TabsContent>

            <TabsContent value="award" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">{t('Award Points to Customer')}</h4>

                  <div>
                    <label className="text-slate-300 text-sm">{t('Select Customer')}</label>
                    <select
                      value={selectedLead?.id || ''}
                      onChange={(e) => {
                        const lead = loyaltyData.find(l => l.lead_id === e.target.value);
                        setSelectedLead(lead ? { id: lead.lead_id, first_name: lead.lead?.first_name || 'Unknown' } : null);
                      }}
                      className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded text-white"
                    >
                      <option value="">{t('Choose customer...')}</option>
                      {loyaltyData.map(loyalty => (
                        <option key={loyalty.lead_id} value={loyalty.lead_id}>
                          {loyalty.lead?.first_name || 'Unknown'} ({loyalty.total_points || 0} pts)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm">{t('Points to Award')}</label>
                    <Input
                      type="number"
                      value={pointsToAward}
                      onChange={(e) => setPointsToAward(e.target.value)}
                      placeholder="100"
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm">{t('Reason')}</label>
                    <Input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={t('Event attendance, referral, etc.')}
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>

                  <Button
                    onClick={awardPoints}
                    disabled={isLoading || !selectedLead || !pointsToAward || !reason.trim()}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    {isLoading ? t('Awarding...') : t('Award Points')}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">{t('Quick Award Templates')}</h4>
                  <div className="space-y-2">
                    {rewardTypes.map(template => (
                      <Button
                        key={template.id}
                        variant="outline"
                        onClick={() => {
                          setPointsToAward(template.points.toString());
                          setReason(template.name);
                        }}
                        className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <span className="mr-3 text-lg">{template.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-slate-400">+{template.points} points</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">{t('Loyalty Impact')}</h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">{t('Average Visit Frequency')}</span>
                        <span className="text-emerald-400 font-bold">+127%</span>
                      </div>
                      <div className="text-xs text-slate-400">{t('Loyalty members vs non-members')}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">{t('Average Spending per Visit')}</span>
                        <span className="text-blue-400 font-bold">+89%</span>
                      </div>
                      <div className="text-xs text-slate-400">{t('Higher spending from loyalty members')}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">{t('Customer Lifetime Value')}</span>
                        <span className="text-purple-400 font-bold">+234%</span>
                      </div>
                      <div className="text-xs text-slate-400">{t('Long-term value increase')}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">{t('Referral Rate')}</span>
                        <span className="text-yellow-400 font-bold">+156%</span>
                      </div>
                      <div className="text-xs text-slate-400">{t('More referrals from engaged customers')}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">{t('Top Performers')}</h4>
                  <div className="space-y-2">
                    {loyaltyData.sort((a, b) => (b.total_points || 0) - (a.total_points || 0)).slice(0, 10).map((customer, index) => (
                      <div key={customer.id} className="flex items-center gap-3 p-2 rounded bg-slate-800/30">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm">{customer.lead?.first_name || 'Unknown'}</div>
                          <div className="text-slate-400 text-xs">{customer.current_tier} • {customer.visits_count || 0} visits</div>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {(customer.total_points || 0).toLocaleString()} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* הוספת אזור לניהול תוכנית הנאמנות הפעילה */}
      <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Crown className="w-8 h-8 text-purple-600" />
            {t('Current Loyalty Plan')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('Professional VIP Plan')}</h3>
              <p className="text-gray-600">{t('Active until December 2024')}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800">{t('500 Active Customers')}</Badge>
                <Badge className="bg-blue-100 text-blue-800">{t('Advanced Analytics')}</Badge>
                <Badge className="bg-purple-100 text-purple-800">{t('24/7 Support')}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">₪299</div>
              <div className="text-gray-500">{t('per month')}</div>
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {t('Upgrade Plan')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
