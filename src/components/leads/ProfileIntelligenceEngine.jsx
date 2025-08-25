
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Retained, though not explicitly used in new logic, it's a UI component that might be re-used.
import { Alert, AlertDescription } from "@/components/ui/alert"; // Retained, might be used for errors.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Retained, might be used for other parts of the app.
import { Textarea } from "@/components/ui/textarea"; // Retained
import { Input } from "@/components/ui/input"; // Retained
import { Label } from "@/components/ui/label"; // Retained
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Retained
import {
  Brain,
  Loader2,
  CheckCircle,
  AlertTriangle, // Retained for error display
  DollarSign,
  Instagram // Newly added for outline's UI
} from "lucide-react";
// Removed Lead and InvokeLLM as the new outline explicitly replaces their usage with mock data and setTimeout.


export default function ProfileIntelligenceEngine({ leadData, onIntelligenceComplete }) {
  // Replaced existing state variables with those from the outline
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [investigationCost] = useState(0.25);
  const [userBalance, setUserBalance] = useState(50.00); // Mock user balance
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Removed all existing useEffects and related functions like loadInvestigationHistory
  // as the outline implies a direct, mock investigation flow.

  // Replaced the original performProfessionalInvestigation with the new flow from the outline
  const handleInvestigation = async () => {
    if (userBalance < investigationCost) {
      alert(`Insufficient balance. You need $${investigationCost.toFixed(2)} but have $${userBalance.toFixed(2)}`);
      return;
    }

    setShowConfirmation(true);
  };

  const confirmInvestigation = async () => {
    setShowConfirmation(false);
    setIsInvestigating(true);
    setIntelligenceData(null);

    try {
      // Simulate AI investigation delay
      await new Promise(resolve => setTimeout(resolve, 5000));

      const mockIntelligenceData = {
        confidence_level: Math.floor(Math.random() * 30) + 70,
        wealth_analysis: {
          estimated_income: ['high', 'very_high'][Math.floor(Math.random() * 2)],
          luxury_indicators: ['Designer brands', 'Expensive venues', 'Premium locations'],
          spending_category: ['premium', 'luxury'][Math.floor(Math.random() * 2)],
          score: Math.floor(Math.random() * 40) + 60
        },
        social_media_intel: {
          instagram_analysis: {
            follower_quality: 85,
            engagement_rate: 4.2,
            luxury_content: 67,
            nightlife_activity: 89
          },
          network_analysis: {
            vip_connections: 12,
            industry_connections: 23,
            influence_score: 78
          }
        },
        investigation_cost: investigationCost,
        timestamp: new Date().toISOString()
      };

      setIntelligenceData(mockIntelligenceData);
      setUserBalance(prev => prev - investigationCost); // Deduct cost

      if (onIntelligenceComplete) {
        onIntelligenceComplete(mockIntelligenceData);
      }

    } catch (error) {
      console.error('Intelligence investigation failed:', error);
      alert('Investigation failed. Please try again.');
    }
    setIsInvestigating(false);
  };

  // Removed all other LLM-related and report generation/saving functions
  // as they are replaced by the mock investigation flow.

  return (
    <div className="space-y-6">
      {/* Header with Balance */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Profile Intelligence
        </h3>
        <div className="text-sm">
          <span className="text-slate-400">Balance: </span>
          <span className="text-emerald-400 font-bold">${userBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium mb-1">Deep Profile Investigation</h4>
            <p className="text-purple-200 text-sm">Advanced AI analysis of customer profile and network</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-300">${investigationCost.toFixed(2)}</div>
            <div className="text-xs text-slate-400">per investigation</div>
          </div>
        </div>
      </div>

      {/* Investigation Content */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Target:</span>
              <span className="text-white ml-2">{leadData.first_name} {leadData.last_name}</span>
            </div>
            <div>
              <span className="text-slate-400">Phone:</span>
              <span className="text-white ml-2 font-mono">{leadData.phone_number}</span>
            </div>
            <div>
              <span className="text-slate-400">Instagram:</span>
              <span className="text-purple-300 ml-2">{leadData.instagram_handle || 'Not available'}</span>
            </div>
            <div>
              <span className="text-slate-400">Location:</span>
              <span className="text-white ml-2">{leadData.location || 'Unknown'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <h5 className="text-white font-medium mb-3">Investigation Features:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle className="w-4 h-4" />
                Social Media Deep Scan
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle className="w-4 h-4" />
                Wealth Analysis
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle className="w-4 h-4" />
                Network Investigation
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle className="w-4 h-4" />
                Behavioral Profiling
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle className="w-4 h-4" />
                Contact Information Search
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <CheckCircle className="w-4 h-4" />
                VIP Potential Assessment
              </div>
            </div>
          </div>

          <Button
            onClick={handleInvestigation}
            disabled={isInvestigating || userBalance < investigationCost}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-6"
          >
            {isInvestigating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Investigating Profile...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Start Deep Investigation (${investigationCost.toFixed(2)})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-purple-500/30 p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Investigation</h3>
            <div className="space-y-4">
              <p className="text-slate-300">
                This will perform a deep AI investigation of <strong>{leadData.first_name} {leadData.last_name}</strong> for <strong>${investigationCost.toFixed(2)}</strong>.
              </p>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="text-emerald-400">${userBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Investigation Cost:</span>
                  <span className="text-red-400">-${investigationCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-700 mt-2">
                  <span className="text-white">Remaining Balance:</span>
                  <span className="text-emerald-400">${(userBalance - investigationCost).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmInvestigation}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Confirm & Pay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Investigation Results */}
      {intelligenceData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
            <h5 className="text-white font-medium">Investigation Results</h5>
            <Badge className="bg-emerald-500/20 text-emerald-300">
              Confidence: {intelligenceData.confidence_level}%
            </Badge>
          </div>

          {/* Results Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <h6 className="text-emerald-300 font-medium mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Wealth Analysis
              </h6>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Income Level:</span>
                  <span className="text-white capitalize">{intelligenceData.wealth_analysis.estimated_income}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spending Category:</span>
                  <span className="text-purple-300 capitalize">{intelligenceData.wealth_analysis.spending_category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wealth Score:</span>
                  <span className="text-emerald-400 font-bold">{intelligenceData.wealth_analysis.score}/100</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <h6 className="text-blue-300 font-medium mb-3 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Social Media Intel
              </h6>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Follower Quality:</span>
                  <span className="text-white">{intelligenceData.social_media_intel.instagram_analysis.follower_quality}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Engagement Rate:</span>
                  <span className="text-blue-300">{intelligenceData.social_media_intel.instagram_analysis.engagement_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Influence Score:</span>
                  <span className="text-purple-400 font-bold">{intelligenceData.social_media_intel.network_analysis.influence_score}/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Investigation completed on:</span>
              <span className="text-white">{new Date(intelligenceData.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-400">Cost charged:</span>
              <span className="text-red-400 font-bold">${intelligenceData.investigation_cost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
