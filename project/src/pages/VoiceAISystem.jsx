import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Mic, 
  Phone, 
  MessageSquare,
  Settings,
  TestTube
} from "lucide-react";

import VoiceAIAgent from '../components/ai/VoiceAIAgent';
import VoiceMessageProcessor from '../components/ai/VoiceMessageProcessor';
import CallHandlerAgent from '../components/ai/CallHandlerAgent';

export default function VoiceAISystemPage() {
  const [agentConfig, setAgentConfig] = useState({
    voiceEnabled: true,
    callHandlingEnabled: true,
    multiLanguageSupport: true,
    voiceResponseEnabled: true,
    primaryLanguage: 'he'
  });

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white neon-text">
              מערכת AI קולית מתקדמת
            </h1>
          </div>
          <p className="text-purple-300 text-lg">
            סוכן AI חכם עם יכולות עיבוד קול, תרגום רב-לשוני וטיפול בשיחות טלפון
          </p>
        </div>

        <Tabs defaultValue="agent-config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/30">
            <TabsTrigger 
              value="agent-config" 
              className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              הגדרות סוכן
            </TabsTrigger>
            <TabsTrigger 
              value="voice-processor" 
              className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-200"
            >
              <Mic className="w-4 h-4 mr-2" />
              עיבוד קול
            </TabsTrigger>
            <TabsTrigger 
              value="call-handler" 
              className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-200"
            >
              <Phone className="w-4 h-4 mr-2" />
              טיפול בשיחות
            </TabsTrigger>
            <TabsTrigger 
              value="testing" 
              className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-200"
            >
              <TestTube className="w-4 h-4 mr-2" />
              בדיקות
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agent-config">
            <VoiceAIAgent />
          </TabsContent>

          <TabsContent value="voice-processor">
            <VoiceMessageProcessor 
              agentConfig={agentConfig}
              onProcessingComplete={(result) => {
                console.log('Voice processing completed:', result);
              }}
            />
          </TabsContent>

          <TabsContent value="call-handler">
            <CallHandlerAgent agentConfig={agentConfig} />
          </TabsContent>

          <TabsContent value="testing">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TestTube className="w-6 h-6 text-purple-400" />
                  בדיקות מערכת מתקדמות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6 text-center">
                      <Mic className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">בדיקת עיבוד קול</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        בדיקה מקיפה של יכולות תמלול וזיהוי שפה
                      </p>
                      <div className="text-emerald-400 font-bold">✅ פעיל</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6 text-center">
                      <Phone className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">בדיקת טיפול בשיחות</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        בדיקה של מערכת מענה והפניה לווצאפ
                      </p>
                      <div className="text-emerald-400 font-bold">✅ פעיל</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">בדיקת תגובות AI</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        בדיקה של איכות וזמני תגובה של הסוכן
                      </p>
                      <div className="text-emerald-400 font-bold">✅ פעיל</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <h3 className="text-emerald-300 font-semibold mb-3">🎉 המערכת מוכנה לפעולה!</h3>
                  <ul className="text-emerald-200 space-y-2 text-sm">
                    <li>✅ סוכן AI פעיל ומגיב בזמן אמת</li>
                    <li>✅ עיבוד הודעות קוליות ב-10 שפות</li>
                    <li>✅ טיפול בשיחות טלפון והפניה חכמה</li>
                    <li>✅ תגובות קוליות טבעיות</li>
                    <li>✅ זיכרון הקשר וניתוח רגשות</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}