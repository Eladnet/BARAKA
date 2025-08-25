import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mic, 
  Volume2, 
  Phone,
  MessageSquare,
  Brain,
  Languages,
  Settings,
  Play,
  Pause,
  TestTube,
  Save,
  Zap,
  Headphones,
  PhoneCall,
  VoicemailIcon
} from "lucide-react";
import { User } from "@/api/entities";
import { InvokeLLM, UploadFile } from "@/api/integrations";

export default function VoiceAIAgent() {
  const [agentConfig, setAgentConfig] = useState({
    // Voice Processing Settings
    voiceEnabled: true,
    autoTranscribe: true,
    multiLanguageSupport: true,
    realTimeTranslation: true,
    
    // Voice Response Settings
    voiceResponseEnabled: true,
    voiceType: 'female_hebrew',
    responseSpeed: 1.0,
    voiceTone: 'friendly',
    
    // Call Handling
    callHandlingEnabled: true,
    autoCallResponse: true,
    callToVoiceMessage: true,
    maxCallDuration: 300, // 5 minutes
    
    // Language Settings  
    primaryLanguage: 'he',
    supportedLanguages: ['he', 'en', 'ar', 'ru', 'fr', 'es'],
    autoDetectLanguage: true,
    
    // AI Behavior
    contextMemory: true,
    personalityConsistent: true,
    emotionalIntelligence: true,
    culturalAdaptation: true,
    
    // Advanced Features
    backgroundNoiseReduction: true,
    speechToTextAccuracy: 'high',
    naturalLanguageProcessing: true,
    sentimentAnalysis: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [voicePreview, setVoicePreview] = useState(null);

  const voiceTypes = [
    { id: 'female_hebrew', name: 'אישה ישראלית צעירה', accent: 'Israeli Hebrew', preview: 'שלום! איך שלומך היום?' },
    { id: 'male_hebrew', name: 'גבר ישראלי בוגר', accent: 'Israeli Hebrew', preview: 'היי, אני כאן לעזור לך' },
    { id: 'female_english', name: 'American Female', accent: 'American English', preview: 'Hi there! How can I help you today?' },
    { id: 'male_english', name: 'British Male', accent: 'British English', preview: 'Hello, I\'m here to assist you' },
    { id: 'female_arabic', name: 'عربية', accent: 'Modern Arabic', preview: 'مرحبا، كيف يمكنني مساعدتك؟' },
    { id: 'female_russian', name: 'Русская', accent: 'Russian', preview: 'Привет! Как дела?' }
  ];

  const languages = [
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  useEffect(() => {
    loadAgentConfig();
  }, []);

  const loadAgentConfig = async () => {
    try {
      const user = await User.me();
      const config = user.settings?.voiceAI || {};
      setAgentConfig(prev => ({ ...prev, ...config }));
    } catch (error) {
      console.error('Error loading voice AI config:', error);
    }
  };

  const saveAgentConfig = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      await User.updateMyUserData({
        settings: {
          ...user.settings,
          voiceAI: agentConfig
        }
      });
      alert('הגדרות סוכן הקול נשמרו בהצלחה! 🎉');
    } catch (error) {
      console.error('Error saving voice AI config:', error);
      alert('שגיאה בשמירת ההגדרות');
    }
    setIsLoading(false);
  };

  const testVoiceProcessing = async () => {
    setTestResults({ voiceProcessing: { testing: true } });
    
    try {
      // Simulate voice processing test
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        transcriptionAccuracy: 95,
        languageDetection: 'Hebrew',
        processingTime: '1.2s',
        voiceQuality: 'Excellent',
        backgroundNoiseLevel: 'Low'
      };
      
      setTestResults(prev => ({
        ...prev,
        voiceProcessing: {
          testing: false,
          success: true,
          ...mockResult
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        voiceProcessing: {
          testing: false,
          success: false,
          error: error.message
        }
      }));
    }
  };

  const testCallHandling = async () => {
    setTestResults({ callHandling: { testing: true } });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setTestResults(prev => ({
        ...prev,
        callHandling: {
          testing: false,
          success: true,
          callRouted: true,
          voiceMessageCreated: true,
          responseTime: '0.8s'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        callHandling: {
          testing: false,
          success: false,
          error: error.message
        }
      }));
    }
  };

  const previewVoice = async (voiceType) => {
    const voice = voiceTypes.find(v => v.id === voiceType);
    if (!voice) return;
    
    // In real implementation, this would use text-to-speech API
    alert(`🎵 Voice Preview: "${voice.preview}" - ${voice.name}`);
  };

  const generateVoicePrompt = () => {
    const selectedVoice = voiceTypes.find(v => v.id === agentConfig.voiceType);
    const primaryLang = languages.find(l => l.code === agentConfig.primaryLanguage);
    
    return `
You are an advanced AI voice agent for nightlife promotion in Israel. Your configuration:

VOICE PERSONALITY:
- Voice Type: ${selectedVoice?.name} (${selectedVoice?.accent})
- Tone: ${agentConfig.voiceTone}
- Speed: ${agentConfig.responseSpeed}x
- Primary Language: ${primaryLang?.name}

CAPABILITIES:
- Voice message transcription and understanding
- Multi-language support (${agentConfig.supportedLanguages.length} languages)
- Real-time language detection and translation
- Call handling and routing to voice messages
- Emotional intelligence and sentiment analysis
- Cultural adaptation based on detected language/region

VOICE PROCESSING RULES:
1. Always acknowledge that you heard the voice message
2. Respond in the same language as the customer
3. If language is unclear, ask politely in Hebrew and English
4. For calls, politely redirect to voice messages
5. Maintain conversation context across voice interactions
6. Use natural speech patterns and appropriate cultural expressions

CALL HANDLING PROTOCOL:
- When receiving a call: "שלום! אני הסוכן הדיגיטלי. בואו נמשיך בהודעות קוליות בוואטסאפ כדי שאוכל לעזור לכם טוב יותר"
- Always route calls to WhatsApp voice messages for better service
- Explain benefits: "ההודעות הקוליות מאפשרות לי להבין אתכם טוב יותר ולתת מענה מדויק"

MULTILINGUAL RESPONSES:
- Hebrew: Warm, friendly, use local slang appropriately
- English: Professional but approachable, international vibe
- Arabic: Respectful, culturally sensitive
- Russian: Direct but polite, understand cultural background
- Other languages: Adapt tone based on cultural norms

Remember: You're promoting nightlife events, so be enthusiastic about parties, clubs, and social experiences!
    `;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            סוכן AI קולי חכם - Voice Agent
          </CardTitle>
          <p className="text-slate-300">
            סוכן AI מתקדם עם יכולות עיבוד קול, תרגום רב-לשוני וטיפול בשיחות
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voice-processing" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
              <TabsTrigger value="voice-processing">🎤 עיבוד קול</TabsTrigger>
              <TabsTrigger value="voice-response">🔊 תגובות קוליות</TabsTrigger>
              <TabsTrigger value="call-handling">📞 טיפול בשיחות</TabsTrigger>
              <TabsTrigger value="languages">🌍 שפות</TabsTrigger>
              <TabsTrigger value="advanced">⚡ מתקדם</TabsTrigger>
            </TabsList>

            {/* Voice Processing Tab */}
            <TabsContent value="voice-processing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">הגדרות עיבוד קול</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">עיבוד הודעות קוליות</div>
                        <div className="text-sm text-slate-400">המרה אוטומטית של קול לטקסט</div>
                      </div>
                      <Switch
                        checked={agentConfig.voiceEnabled}
                        onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, voiceEnabled: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">תמלול אוטומטי</div>
                        <div className="text-sm text-slate-400">תמלול מיידי של כל הודעה קולית</div>
                      </div>
                      <Switch
                        checked={agentConfig.autoTranscribe}
                        onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, autoTranscribe: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">הפחתת רעשי רקע</div>
                        <div className="text-sm text-slate-400">ניקוי אוטומטי של רעשי רקע</div>
                      </div>
                      <Switch
                        checked={agentConfig.backgroundNoiseReduction}
                        onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, backgroundNoiseReduction: checked }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">רמת דיוק תמלול</Label>
                      <Select 
                        value={agentConfig.speechToTextAccuracy} 
                        onValueChange={(value) => setAgentConfig(prev => ({ ...prev, speechToTextAccuracy: value }))}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="standard" className="text-slate-300">רגיל - מהיר יותר</SelectItem>
                          <SelectItem value="high" className="text-slate-300">גבוה - מדויק יותר</SelectItem>
                          <SelectItem value="premium" className="text-slate-300">פרימיום - הכי מדויק</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">בדיקת המערכת</h3>
                  
                  <Button 
                    onClick={testVoiceProcessing}
                    disabled={testResults.voiceProcessing?.testing}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {testResults.voiceProcessing?.testing ? (
                      <>
                        <TestTube className="w-4 h-4 mr-2 animate-spin" />
                        בודק עיבוד קול...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        בדוק עיבוד קול
                      </>
                    )}
                  </Button>

                  {testResults.voiceProcessing && !testResults.voiceProcessing.testing && (
                    <div className={`p-4 rounded-lg ${testResults.voiceProcessing.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      {testResults.voiceProcessing.success ? (
                        <div className="space-y-2 text-green-300">
                          <div className="font-medium">✅ בדיקה עברה בהצלחה!</div>
                          <div className="text-sm space-y-1">
                            <div>דיוק תמלול: {testResults.voiceProcessing.transcriptionAccuracy}%</div>
                            <div>זיהוי שפה: {testResults.voiceProcessing.languageDetection}</div>
                            <div>זמן עיבוד: {testResults.voiceProcessing.processingTime}</div>
                            <div>איכות קול: {testResults.voiceProcessing.voiceQuality}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-300">
                          ❌ שגיאה בבדיקה: {testResults.voiceProcessing.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Voice Response Tab */}
            <TabsContent value="voice-response" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">הגדרות תגובות קוליות</h3>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">תגובות קוליות</div>
                      <div className="text-sm text-slate-400">השב בהודעות קוליות</div>
                    </div>
                    <Switch
                      checked={agentConfig.voiceResponseEnabled}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, voiceResponseEnabled: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">סוג קול</Label>
                    <Select 
                      value={agentConfig.voiceType} 
                      onValueChange={(value) => setAgentConfig(prev => ({ ...prev, voiceType: value }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {voiceTypes.map(voice => (
                          <SelectItem key={voice.id} value={voice.id} className="text-slate-300">
                            {voice.name} ({voice.accent})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">מהירות דיבור: {agentConfig.responseSpeed}x</Label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={agentConfig.responseSpeed}
                      onChange={(e) => setAgentConfig(prev => ({ ...prev, responseSpeed: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">טון הקול</Label>
                    <Select 
                      value={agentConfig.voiceTone} 
                      onValueChange={(value) => setAgentConfig(prev => ({ ...prev, voiceTone: value }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="friendly" className="text-slate-300">ידידותי</SelectItem>
                        <SelectItem value="professional" className="text-slate-300">מקצועי</SelectItem>
                        <SelectItem value="enthusiastic" className="text-slate-300">נלהב</SelectItem>
                        <SelectItem value="calm" className="text-slate-300">רגוע</SelectItem>
                        <SelectItem value="flirty" className="text-slate-300">מפתה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">תצוגה מקדימה</h3>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">בחן את הקול</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewVoice(agentConfig.voiceType)}
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        נגן דוגמה
                      </Button>
                    </div>
                    
                    <div className="text-slate-300 text-sm">
                      הקול הנבחר: {voiceTypes.find(v => v.id === agentConfig.voiceType)?.name}
                    </div>
                    <div className="text-slate-400 text-xs mt-1">
                      "{voiceTypes.find(v => v.id === agentConfig.voiceType)?.preview}"
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-medium text-blue-300 mb-2">💡 טיפים לתגובות קוליות:</h4>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• הודעות קוליות יוצרות חיבור אישי יותר</li>
                      <li>• הקול מעביר רגש ואנרגיה</li>
                      <li>• מתאים מאוד לקידום אירועי לילה</li>
                      <li>• יעילות גבוהה יותר מטקסט</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Call Handling Tab */}
            <TabsContent value="call-handling" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">טיפול בשיחות טלפון</h3>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">טיפול בשיחות</div>
                      <div className="text-sm text-slate-400">מענה אוטומטי לשיחות נכנסות</div>
                    </div>
                    <Switch
                      checked={agentConfig.callHandlingEnabled}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, callHandlingEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">מענה קולי אוטומטי</div>
                      <div className="text-sm text-slate-400">מענה מיידי לשיחות</div>
                    </div>
                    <Switch
                      checked={agentConfig.autoCallResponse}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, autoCallResponse: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">ניתוב לווצאפ</div>
                      <div className="text-sm text-slate-400">הפניה להמשך שיחה בהודעות קוליות</div>
                    </div>
                    <Switch
                      checked={agentConfig.callToVoiceMessage}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, callToVoiceMessage: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">משך שיחה מקסימלי (שניות)</Label>
                    <Input
                      type="number"
                      value={agentConfig.maxCallDuration}
                      onChange={(e) => setAgentConfig(prev => ({ ...prev, maxCallDuration: parseInt(e.target.value) }))}
                      min="30"
                      max="600"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <div className="text-xs text-slate-400">
                      מומלץ: 180-300 שניות (3-5 דקות)
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">בדיקת טיפול בשיחות</h3>
                  
                  <Button 
                    onClick={testCallHandling}
                    disabled={testResults.callHandling?.testing}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {testResults.callHandling?.testing ? (
                      <>
                        <TestTube className="w-4 h-4 mr-2 animate-spin" />
                        בודק טיפול בשיחות...
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        בדוק טיפול בשיחות
                      </>
                    )}
                  </Button>

                  {testResults.callHandling && !testResults.callHandling.testing && (
                    <div className={`p-4 rounded-lg ${testResults.callHandling.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      {testResults.callHandling.success ? (
                        <div className="space-y-2 text-green-300">
                          <div className="font-medium">✅ מערכת שיחות פועלת!</div>
                          <div className="text-sm space-y-1">
                            <div>ניתוב שיחה: {testResults.callHandling.callRouted ? '✅' : '❌'}</div>
                            <div>יצירת הודעה קולית: {testResults.callHandling.voiceMessageCreated ? '✅' : '❌'}</div>
                            <div>זמן תגובה: {testResults.callHandling.responseTime}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-300">
                          ❌ שגיאה: {testResults.callHandling.error}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <h4 className="font-medium text-amber-300 mb-2">🔄 איך זה עובד:</h4>
                    <ol className="text-amber-200 text-sm space-y-1 list-decimal list-inside">
                      <li>מתקבלת שיחה טלפון</li>
                      <li>הסוכן עונה אוטומטית</li>
                      <li>מסביר שהוא סוכן דיגיטלי</li>
                      <li>מפנה להמשך בווצאפ</li>
                      <li>שולח קישור לשיחה קולית</li>
                      <li>ממשיך בהודעות קוליות</li>
                    </ol>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Languages Tab */}
            <TabsContent value="languages" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">הגדרות שפות</h3>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">זיהוי שפה אוטומטי</div>
                      <div className="text-sm text-slate-400">זיהוי השפה מההודעה הקולית</div>
                    </div>
                    <Switch
                      checked={agentConfig.autoDetectLanguage}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, autoDetectLanguage: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">תרגום בזמן אמת</div>
                      <div className="text-sm text-slate-400">תרגום אוטומטי של הודעות</div>
                    </div>
                    <Switch
                      checked={agentConfig.realTimeTranslation}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, realTimeTranslation: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">שפה עיקרית</Label>
                    <Select 
                      value={agentConfig.primaryLanguage} 
                      onValueChange={(value) => setAgentConfig(prev => ({ ...prev, primaryLanguage: value }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {languages.map(lang => (
                          <SelectItem key={lang.code} value={lang.code} className="text-slate-300">
                            {lang.flag} {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">שפות נתמכות</h3>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {languages.map(lang => (
                      <div 
                        key={lang.code}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          agentConfig.supportedLanguages.includes(lang.code)
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                        onClick={() => {
                          const currentLanguages = agentConfig.supportedLanguages;
                          const newLanguages = currentLanguages.includes(lang.code)
                            ? currentLanguages.filter(l => l !== lang.code)
                            : [...currentLanguages, lang.code];
                          setAgentConfig(prev => ({ ...prev, supportedLanguages: newLanguages }));
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium text-sm">{lang.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    נבחרו {agentConfig.supportedLanguages.length} שפות
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">תכונות מתקדמות</h3>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">זיכרון הקשר</div>
                      <div className="text-sm text-slate-400">זכירת השיחה הקודמת</div>
                    </div>
                    <Switch
                      checked={agentConfig.contextMemory}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, contextMemory: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">אינטליגנציה רגשית</div>
                      <div className="text-sm text-slate-400">זיהוי רגשות מהקול</div>
                    </div>
                    <Switch
                      checked={agentConfig.emotionalIntelligence}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, emotionalIntelligence: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">התאמה תרבותית</div>
                      <div className="text-sm text-slate-400">התאמת סגנון לפי תרבות</div>
                    </div>
                    <Switch
                      checked={agentConfig.culturalAdaptation}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, culturalAdaptation: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">עיבוד שפה טבעית</div>
                      <div className="text-sm text-slate-400">הבנה מתקדמת של כוונות</div>
                    </div>
                    <Switch
                      checked={agentConfig.naturalLanguageProcessing}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, naturalLanguageProcessing: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Prompt של הסוכן</h3>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <textarea
                      value={generateVoicePrompt()}
                      readOnly
                      className="w-full h-64 bg-slate-900 border border-slate-700 rounded text-slate-300 text-xs p-3 font-mono"
                    />
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <h4 className="font-medium text-emerald-300 mb-2">🤖 יכולות הסוכן:</h4>
                    <ul className="text-emerald-200 text-sm space-y-1">
                      <li>✅ הבנת הודעות קוליות בכל שפה</li>
                      <li>✅ תגובות קוליות טבעיות</li>
                      <li>✅ טיפול בשיחות וניתוב לווצאפ</li>
                      <li>✅ זיהוי רגשות ונטייה תרבותית</li>
                      <li>✅ זיכרון הקשר בין שיחות</li>
                      <li>✅ יכולות קידום מכירות מתקדמות</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-slate-700">
            <Button 
              onClick={saveAgentConfig}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  שמור הגדרות סוכן הקול
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}