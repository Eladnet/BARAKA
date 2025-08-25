import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Sparkles,
  MessageCircle,
  Users,
  Bot,
  BarChart3,
  Shield,
  Headphones
} from "lucide-react";
import { User } from "@/api/entities";
import { PricingPlan } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

export default function PricingPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [pricingPlans, setPricingPlans] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    setIsLoading(true);
    try {
      const [user, plans] = await Promise.all([
        User.me(),
        PricingPlan.list()
      ]);

      setCurrentUser(user);
      
      // Generate sample pricing plans if none exist
      const samplePlans = plans.length > 0 ? plans : [
        {
          id: 'starter',
          name: 'Starter',
          description: 'Perfect for small venues getting started',
          whatsapp_message_cost: 0.25,
          facebook_message_cost: 0.20,
          instagram_message_cost: 0.20,
          monthly_base_fee: 299,
          max_promoters: 2,
          max_venues: 1,
          features: [
            'Up to 2 AI Promoters',
            '1 Venue Integration',
            '1,000 messages/month included',
            'Basic Analytics',
            'Email Support',
            'Standard Templates'
          ],
          popular: false
        },
        {
          id: 'pro',
          name: 'Professional',
          description: 'Most popular plan for growing businesses',
          whatsapp_message_cost: 0.20,
          facebook_message_cost: 0.15,
          instagram_message_cost: 0.15,
          monthly_base_fee: 599,
          max_promoters: 5,
          max_venues: 3,
          features: [
            'Up to 5 AI Promoters',
            '3 Venue Integrations',
            '5,000 messages/month included',
            'Advanced Analytics & Reports',
            'Priority Support',
            'Custom AI Personalities',
            'A/B Testing',
            'Campaign Automation',
            'Lead Scoring'
          ],
          popular: true
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          description: 'For large venues and chains',
          whatsapp_message_cost: 0.15,
          facebook_message_cost: 0.10,
          instagram_message_cost: 0.10,
          monthly_base_fee: 1299,
          max_promoters: 20,
          max_venues: 10,
          features: [
            'Unlimited AI Promoters',
            'Unlimited Venues',
            '20,000 messages/month included',
            'Enterprise Analytics',
            '24/7 Dedicated Support',
            'Custom Integrations',
            'White-label Solution',
            'Advanced Automation',
            'Multi-location Management',
            'Custom Reporting',
            'API Access'
          ],
          popular: false
        }
      ];

      setPricingPlans(samplePlans);

    } catch (error) {
      console.error('Error loading pricing data:', error);
    }
    setIsLoading(false);
  };

  const planIcons = {
    starter: Sparkles,
    pro: Zap,
    enterprise: Crown
  };

  const planColors = {
    starter: 'from-blue-500 to-cyan-500',
    pro: 'from-purple-500 to-pink-500',
    enterprise: 'from-yellow-500 to-orange-500'
  };

  const PricingCard = ({ plan }) => {
    const Icon = planIcons[plan.id] || Star;
    const gradient = planColors[plan.id] || planColors.pro;
    const isSelected = selectedPlan === plan.id;

    return (
      <Card className={`bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
        plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
      } ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}>
        {plan.popular && (
          <div className="absolute top-0 left-0 right-0">
            <div className={`bg-gradient-to-r ${gradient} text-white text-center py-2 text-sm font-medium`}>
              ⭐ Most Popular
            </div>
          </div>
        )}
        
        <CardHeader className={`${plan.popular ? 'pt-12' : 'pt-6'} pb-4`}>
          <div className="text-center">
            <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mx-auto mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                ₪{plan.monthly_base_fee}
              </div>
              <div className="text-gray-600 text-sm">per month</div>
              <div className="text-xs text-gray-500 mt-2">
                + ₪{plan.whatsapp_message_cost} per WhatsApp message
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <div className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => setSelectedPlan(plan.id)}
            className={`w-full ${
              plan.popular 
                ? `bg-gradient-to-r ${gradient} hover:opacity-90` 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            {isSelected ? 'Selected Plan' : 'Choose Plan'}
          </Button>

          {plan.id === 'enterprise' && (
            <div className="text-center mt-3">
              <Button variant="outline" size="sm">
                <Headphones className="w-4 h-4 mr-2" />
                Contact Sales
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scale your nightlife business with AI-powered customer engagement. 
              Start with any plan and upgrade as you grow.
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map(plan => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="bg-white border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">
              Feature Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Professional</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">AI Promoters</td>
                    <td className="py-4 px-4 text-center">2</td>
                    <td className="py-4 px-4 text-center">5</td>
                    <td className="py-4 px-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Venues</td>
                    <td className="py-4 px-4 text-center">1</td>
                    <td className="py-4 px-4 text-center">3</td>
                    <td className="py-4 px-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Messages/Month</td>
                    <td className="py-4 px-4 text-center">1,000</td>
                    <td className="py-4 px-4 text-center">5,000</td>
                    <td className="py-4 px-4 text-center">20,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Analytics</td>
                    <td className="py-4 px-4 text-center">Basic</td>
                    <td className="py-4 px-4 text-center">Advanced</td>
                    <td className="py-4 px-4 text-center">Enterprise</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">Support</td>
                    <td className="py-4 px-4 text-center">Email</td>
                    <td className="py-4 px-4 text-center">Priority</td>
                    <td className="py-4 px-4 text-center">24/7 Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-white border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How does message pricing work?</h3>
                <p className="text-gray-600 text-sm">
                  Each plan includes a monthly message allowance. Additional messages are charged per platform at the rates shown.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can change your plan at any time. Changes take effect at the next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! We offer a 14-day free trial with all Professional features included.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What integrations are included?</h3>
                <p className="text-gray-600 text-sm">
                  All plans include WhatsApp, Facebook, and Instagram integrations. Enterprise includes custom APIs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center pb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Nightlife Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of venues already using AI to boost their customer engagement and revenue
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-lg">
              <Headphones className="w-5 h-5 mr-2" />
              Talk to Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}