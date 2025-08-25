import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Plus, 
  Bot, 
  Users, 
  Target,
  Zap,
  Settings,
  Play,
  Pause
} from "lucide-react";
import { ConversationFlow, AIPromoter } from "@/api/entities";

export default function ConversationBuilder({ promoterId, onFlowCreated }) {
  const [conversationFlow, setConversationFlow] = useState({
    flow_name: '',
    promoter_id: promoterId,
    target_persona: 'party_lover',
    conversation_stages: [
      {
        stage_name: 'פתיחה',
        stage_order: 1,
        trigger_conditions: ['first_contact'],
        message_templates: ['היי! איך אתה? שמעתי שאתה אוהב מוזיקה טובה! 🎵'],
        expected_responses: ['כן', 'אוהב', 'תלוי'],
        success_criteria: 'positive_response',
        next_stage: 'warming_up'
      }
    ],
    ai_instructions: {
      personality_prompt: '',
      conversation_goals: ['build_rapport', 'identify_preferences', 'create_interest'],
      tone_guidelines: 'friendly and casual',
      forbidden_topics: ['politics', 'religion']
    },
    is_active: true
  });

  const [currentStage, setCurrentStage] = useState(0);

  const personaOptions = [
    { value: 'young_professional', label: 'מקצוען צעיר', description: 'גילאי 25-35, בעל הכנסה טובה' },
    { value: 'party_lover', label: 'אוהב מסיבות', description: 'בא לבלות, אוהב מוזיקה חזקה' },
    { value: 'vip_client', label: 'לקוח VIP', description: 'מוכן לשלם יותר, רוצה יחס מיוחד' },
    { value: 'tourist', label: 'תייר', description: 'מחפש חוויות מקומיות' },
    { value: 'local_regular', label: 'קבוע מקומי', description: 'מכיר את הסצנה, בא לעיתים קרובות' }
  ];

  const addStage = () => {
    const newStage = {
      stage_name: `שלב ${conversationFlow.conversation_stages.length + 1}`,
      stage_order: conversationFlow.conversation_stages.length + 1,
      trigger_conditions: [],
      message_templates: [''],
      expected_responses: [],
      success_criteria: '',
      next_stage: ''
    };

    setConversationFlow(prev => ({
      ...prev,
      conversation_stages: [...prev.conversation_stages, newStage]
    }));
  };

  const updateStage = (index, field, value) => {
    const updatedStages = [...conversationFlow.conversation_stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    
    setConversationFlow(prev => ({
      ...prev,
      conversation_stages: updatedStages
    }));
  };

  const saveConversationFlow = async () => {
    try {
      const savedFlow = await ConversationFlow.create(conversationFlow);
      onFlowCreated?.(savedFlow);
      alert('תסריט השיחה נשמר בהצלחה! 🎉');
    } catch (error) {
      console.error('Error saving conversation flow:', error);
      alert('שגיאה בשמירת התסריט');
    }
  };

  const generateAIPersonality = () => {
    const persona = personaOptions.find(p => p.value === conversationFlow.target_persona);
    const aiPersonality = `
אתה יחצן מועדון לילה מקצועי ומקסים.
קהל היעד שלך: ${persona?.label} - ${persona?.description}

הגישה שלך:
1. תמיד מתחיל בחברותיות ובחום
2. מזהה במהירות את הטעם המוזיקלי של הלקוח
3. מתאים את ההצעה שלך לפרופיל שלו
4. יוצר תחושת דחיפות (הצעה מוגבלת בזמן)
5. תמיד נותן ערך לפני שמבקש משהו

נושאים לא לדבר עליהם: ${conversationFlow.ai_instructions.forbidden_topics.join(', ')}

המטרה שלך: להביא אותו למועדון ולוודא שהוא יבוא עם חברים!
    `.trim();

    setConversationFlow(prev => ({
      ...prev,
      ai_instructions: {
        ...prev.ai_instructions,
        personality_prompt: aiPersonality
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Flow Header */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            בונה תסריטי שיחה חכמים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">שם התסריט</label>
              <Input
                value={conversationFlow.flow_name}
                onChange={(e) => setConversationFlow(prev => ({ ...prev, flow_name: e.target.value }))}
                placeholder="תסריט קיץ 2024"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">קהל יעד</label>
              <Select 
                value={conversationFlow.target_persona} 
                onValueChange={(value) => setConversationFlow(prev => ({ ...prev, target_persona: value }))}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {personaOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-slate-300">
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-slate-400">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateAIPersonality}
            variant="outline" 
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            <Zap className="w-4 h-4 mr-2" />
            יצר אישיות AI אוטומטית
          </Button>
        </CardContent>
      </Card>

      {/* AI Personality */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            הגדרות אישיות AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">הוראות אישיות מפורטות</label>
            <Textarea
              value={conversationFlow.ai_instructions.personality_prompt}
              onChange={(e) => setConversationFlow(prev => ({
                ...prev,
                ai_instructions: { ...prev.ai_instructions, personality_prompt: e.target.value }
              }))}
              placeholder="תאר איך הAI צריך להתנהג, מה הטון שלו, איך הוא מגיב..."
              className="bg-slate-800 border-slate-700 text-white h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">מטרות השיחה</label>
              <div className="flex flex-wrap gap-2">
                {['build_rapport', 'identify_preferences', 'create_interest', 'close_sale', 'get_referrals'].map(goal => (
                  <Badge 
                    key={goal}
                    variant={conversationFlow.ai_instructions.conversation_goals.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const goals = conversationFlow.ai_instructions.conversation_goals.includes(goal)
                        ? conversationFlow.ai_instructions.conversation_goals.filter(g => g !== goal)
                        : [...conversationFlow.ai_instructions.conversation_goals, goal];
                      
                      setConversationFlow(prev => ({
                        ...prev,
                        ai_instructions: { ...prev.ai_instructions, conversation_goals: goals }
                      }));
                    }}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm">נושאים אסורים</label>
              <Input
                value={conversationFlow.ai_instructions.forbidden_topics.join(', ')}
                onChange={(e) => setConversationFlow(prev => ({
                  ...prev,
                  ai_instructions: { 
                    ...prev.ai_instructions, 
                    forbidden_topics: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  }
                }))}
                placeholder="פוליטיקה, דת, רכילות..."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Stages */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              שלבי השיחה
            </div>
            <Button onClick={addStage} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              הוסף שלב
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {conversationFlow.conversation_stages.map((stage, index) => (
              <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-white">שלב {index + 1}</h4>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
                    {stage.stage_name}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">שם השלב</label>
                    <Input
                      value={stage.stage_name}
                      onChange={(e) => updateStage(index, 'stage_name', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">תנאי הפעלה</label>
                    <Input
                      value={stage.trigger_conditions.join(', ')}
                      onChange={(e) => updateStage(index, 'trigger_conditions', e.target.value.split(',').map(t => t.trim()))}
                      placeholder="first_contact, positive_response"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">תבניות הודעות</label>
                  <Textarea
                    value={stage.message_templates.join('\n')}
                    onChange={(e) => updateStage(index, 'message_templates', e.target.value.split('\n').filter(t => t.trim()))}
                    placeholder="היי! איך אתה?\nשמעתי שאתה אוהב מוזיקה טובה!"
                    className="bg-slate-800 border-slate-700 text-white h-24"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">תגובות צפויות</label>
                    <Input
                      value={stage.expected_responses.join(', ')}
                      onChange={(e) => updateStage(index, 'expected_responses', e.target.value.split(',').map(t => t.trim()))}
                      placeholder="כן, בטח, תלוי"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">קריטריון הצלחה</label>
                    <Input
                      value={stage.success_criteria}
                      onChange={(e) => updateStage(index, 'success_criteria', e.target.value)}
                      placeholder="positive_response"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={saveConversationFlow}
          disabled={!conversationFlow.flow_name.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3"
        >
          <Play className="w-5 h-5 mr-2" />
          שמור והפעל תסריט
        </Button>
      </div>
    </div>
  );
}