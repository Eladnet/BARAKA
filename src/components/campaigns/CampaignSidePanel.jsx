import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Target, 
  Users, 
  DollarSign, 
  MessageCircle, 
  Eye, 
  Play, 
  Pause,
  Edit,
  TestTube,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Campaign } from "@/api/entities";

export default function CampaignSidePanel({ campaign, promoters, onCampaignUpdate }) {
  const [isActivating, setIsActivating] = React.useState(false);
  const [isPausing, setIsPausing] = React.useState(false);

  if (!campaign) {
    return (
      <Card className="bg-white border-0 shadow-lg h-full">
        <CardHeader>
          <CardTitle className="text-gray-900">Select Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Choose a campaign from the list to view details.</p>
        </CardContent>
      </Card>
    );
  }

  const promoter = promoters.find(p => p.id === campaign.promoter_id);

  const handleActivateAI = async () => {
    if (!campaign.id) return;
    
    setIsActivating(true);
    
    try {
      // עדכון סטטוס הקמפיין לפעיל
      await Campaign.update(campaign.id, {
        status: 'active',
        start_date: new Date().toISOString(),
        last_activity: new Date().toISOString()
      });
      
      // הודעת הצלחה
      alert('🚀 AI הופעל בהצלחה! הקמפיין כעת פעיל ויתחיל לשלוח הודעות.');
      
      // עדכון הנתונים בעמוד הראשי
      if (onCampaignUpdate) {
        onCampaignUpdate();
      }
      
    } catch (error) {
      console.error('Error activating campaign:', error);
      alert(`❌ שגיאה בהפעלת AI: ${error.message}`);
    }
    
    setIsActivating(false);
  };

  const handlePauseAI = async () => {
    if (!campaign.id) return;
    
    setIsPausing(true);
    
    try {
      // השהיית הקמפיין
      await Campaign.update(campaign.id, {
        status: 'paused',
        paused_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      });
      
      alert('⏸️ AI הושהה בהצלחה! הקמפיין הופסק זמנית.');
      
      // עדכון הנתונים
      if (onCampaignUpdate) {
        onCampaignUpdate();
      }
      
    } catch (error) {
      console.error('Error pausing campaign:', error);
      alert(`❌ שגיאה בהשהיית AI: ${error.message}`);
    }
    
    setIsPausing(false);
  };

  const handleEditCampaign = () => {
    alert('🔧 פתיחת עורך הקמפיין - בקרוב!');
  };

  const stats = [
    { label: "Messages Sent", value: campaign.messages_sent || 0, icon: MessageCircle },
    { label: "Responses", value: campaign.responses_received || 0, icon: Users },
    { label: "Conversions", value: campaign.conversions || 0, icon: Target },
    { label: "Revenue", value: `₪${campaign.revenue_generated || 0}`, icon: DollarSign },
  ];
  
  const abTestResults = {
    a: { responses: 58, conversions: 12 },
    b: { responses: 72, conversions: 18 }
  };

  const responseRate = campaign.messages_sent > 0 ? 
    ((campaign.responses_received || 0) / campaign.messages_sent * 100).toFixed(1) : 0;

  // קביעת צבע ואייקון לפי סטטוס
  const getStatusInfo = () => {
    switch (campaign.status) {
      case 'active':
        return {
          color: 'bg-emerald-600 hover:bg-emerald-700',
          icon: Pause,
          text: 'Pause AI',
          action: handlePauseAI,
          loading: isPausing
        };
      case 'paused':
        return {
          color: 'bg-blue-600 hover:bg-blue-700',
          icon: Play,
          text: 'Resume AI',
          action: handleActivateAI,
          loading: isActivating
        };
      default:
        return {
          color: 'bg-emerald-600 hover:bg-emerald-700',
          icon: Play,
          text: 'Activate AI',
          action: handleActivateAI,
          loading: isActivating
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="bg-white border-0 shadow-lg sticky top-6">
      <CardHeader>
        <CardTitle className="text-gray-900 truncate">{campaign.name}</CardTitle>
        <p className="text-indigo-600">{campaign.event_name}</p>
        
        {/* סטטוס הקמפיין */}
        <div className="flex items-center gap-2 mt-2">
          <Badge 
            className={
              campaign.status === 'active' 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : campaign.status === 'paused'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }
          >
            {campaign.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
            {campaign.status === 'paused' && <Pause className="w-3 h-3 mr-1" />}
            {campaign.status === 'draft' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {campaign.status || 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* כפתורי בקרה */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className={`flex-1 ${statusInfo.color}`}
            onClick={statusInfo.action}
            disabled={statusInfo.loading}
          >
            {statusInfo.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {statusInfo.loading && isActivating ? 'מפעיל...' : 'משהה...'}
              </>
            ) : (
              <>
                <statusInfo.icon className="w-4 h-4 mr-2" /> 
                {statusInfo.text}
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleEditCampaign}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-200"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        {/* סטטיסטיקות ביצועים */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-600" />
            AI Performance
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-xs">{stat.label}</span>
                  <stat.icon className="w-3 h-3" />
                </div>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Response Rate</span>
              <span className="text-xs font-bold text-gray-900">{responseRate}%</span>
            </div>
            <Progress value={parseFloat(responseRate)} className="h-2" />
          </div>
        </div>
        
        {/* תוצאות A/B Testing */}
        {campaign.is_ab_test && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <TestTube className="w-4 h-4 text-blue-600" />
              A/B Test Results
            </h4>
            <div className="p-3 bg-gray-50 rounded-lg space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Template A</span>
                  <span className="text-xs font-bold text-gray-900">{abTestResults.a.conversions} conversions</span>
                </div>
                <Progress value={(abTestResults.a.conversions / abTestResults.a.responses) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Template B 
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] px-1 py-0 ml-1">Winner</Badge>
                  </span>
                  <span className="text-xs font-bold text-gray-900">{abTestResults.b.conversions} conversions</span>
                </div>
                <Progress value={(abTestResults.b.conversions / abTestResults.b.responses) * 100} className="h-2" />
              </div>
            </div>
          </div>
        )}

        {/* פרטי הקמפיין */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Campaign Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">AI Promoter:</span>
              <span className="text-gray-900 font-medium">{promoter?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Message Budget:</span>
              <span className="text-gray-900 font-medium">₪{campaign.message_budget || 'Unlimited'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost per Message:</span>
              <span className="text-gray-900 font-medium">₪2.50</span>
            </div>
            {campaign.start_date && (
              <div className="flex justify-between">
                <span className="text-gray-600">Started:</span>
                <span className="text-gray-900 font-medium">
                  {new Date(campaign.start_date).toLocaleDateString('he-IL')}
                </span>
              </div>
            )}
            {campaign.trigger_rules && Object.keys(campaign.trigger_rules).length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600">Smart Triggers:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(campaign.trigger_rules).map(([key, value]) => value !== 'any' && (
                    <Badge key={key} variant="outline" className="text-xs border-gray-200 text-gray-700">{`${key}: ${value}`}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* אזהרות והודעות */}
        {campaign.status === 'draft' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>הקמפיין עדיין בטיוטה - הפעל כדי להתחיל לשלוח הודעות</span>
            </div>
          </div>
        )}
        
        {campaign.status === 'active' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-800 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>🚀 AI פעיל ושולח הודעות!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}