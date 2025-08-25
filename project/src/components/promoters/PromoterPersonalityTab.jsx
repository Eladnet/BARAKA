import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  Save,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import { AIPromoter } from "@/api/entities";
import AIPersonalityEngine from "../ai/AIPersonalityEngine";

export default function PromoterPersonalityTab({ promoter, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [personalityData, setPersonalityData] = useState({
    conversation_style: promoter && promoter.conversation_style ? promoter.conversation_style : '',
    learning_keywords: promoter && promoter.learning_keywords ? promoter.learning_keywords : [],
    success_patterns: promoter && promoter.success_patterns ? promoter.success_patterns : [],
    avoid_topics: promoter && promoter.avoid_topics ? promoter.avoid_topics : [],
    greeting_style: promoter && promoter.greeting_style ? promoter.greeting_style : '',
    closing_style: promoter && promoter.closing_style ? promoter.closing_style : ''
  });

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const updated = await AIPromoter.update(promoter.id, {
        ...personalityData,
        updated_date: new Date().toISOString()
      });
      onUpdate(updated);
    } catch (error) {
      console.error('Error updating promoter personality:', error);
    }
    setIsUpdating(false);
  };

  const addKeyword = (keyword) => {
    if (keyword && !personalityData.learning_keywords.includes(keyword)) {
      setPersonalityData(prev => ({
        ...prev,
        learning_keywords: [...prev.learning_keywords, keyword]
      }));
    }
  };

  const removeKeyword = (keyword) => {
    setPersonalityData(prev => ({
      ...prev,
      learning_keywords: prev.learning_keywords.filter(k => k !== keyword)
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="personality">אישיות AI</TabsTrigger>
          <TabsTrigger value="learning">למידה</TabsTrigger>
          <TabsTrigger value="analytics">ביצועים</TabsTrigger>
        </TabsList>

        <TabsContent value="personality" className="space-y-6">
          <AIPersonalityEngine 
            promoter={promoter} 
            onPersonalityUpdate={onUpdate}
          />
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                למידה ושיפור
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">סגנון שיחה:</label>
                <Textarea
                  value={personalityData.conversation_style}
                  onChange={(e) => setPersonalityData(prev => ({
                    ...prev, 
                    conversation_style: e.target.value
                  }))}
                  placeholder="איך היחצ״ן צריך לדבר? לדוגמה: חמים וידידותי, משתמש בסלנג רחוב..."
                  className="bg-slate-800 border-slate-700 text-white h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">פתיחת שיחה:</label>
                  <Input
                    value={personalityData.greeting_style}
                    onChange={(e) => setPersonalityData(prev => ({
                      ...prev, 
                      greeting_style: e.target.value
                    }))}
                    placeholder="איך לפתוח שיחה..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">סגירת שיחה:</label>
                  <Input
                    value={personalityData.closing_style}
                    onChange={(e) => setPersonalityData(prev => ({
                      ...prev, 
                      closing_style: e.target.value
                    }))}
                    placeholder="איך לסגור שיחה..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-slate-300 text-sm">מילות מפתח ללמידה:</label>
                <div className="flex flex-wrap gap-2">
                  {personalityData.learning_keywords.map((keyword, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline" 
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30 cursor-pointer hover:bg-red-500/20"
                      onClick={() => removeKeyword(keyword)}
                    >
                      {keyword} ✕
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="הוסף מילת מפתח..."
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addKeyword(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <Button 
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isUpdating ? 'שומר...' : 'שמור הגדרות'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  שיחות היום
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">247</div>
                <div className="text-xs text-slate-400">+12% מאתמול</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  שיעור הצלחה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">73%</div>
                <div className="text-xs text-slate-400">+5% השבוע</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  דירוג AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">A+</div>
                <div className="text-xs text-slate-400">משתפר בהתמדה</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                ביצועי למידה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">מילות מפתח שזוהו</span>
                  <Badge className="bg-blue-500/20 text-blue-300">156</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">תבניות הצלחה</span>
                  <Badge className="bg-green-500/20 text-green-300">23</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">שיפורים השבוע</span>
                  <Badge className="bg-purple-500/20 text-purple-300">8</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}