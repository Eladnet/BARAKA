
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Sparkles, 
  Heart, 
  Crown, 
  Zap,
  MessageSquare,
  Volume2,
  Mic,
  Settings,
  TestTube,
  Save
} from "lucide-react";
import { AIPromoter } from "@/api/entities";
import { User } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

export default function DynamicPersonalityEngine({ promoterId, onPersonalityUpdate }) {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);
  
  const [personality, setPersonality] = useState({
    style: 'friendly',
    tone: 50, // 0-100 scale
    humor: 30,
    flirtiness: 20,
    formality: 40,
    energy: 70,
    empathy: 60,
    salesPressure: 30,
    customPrompts: {
      greeting: '',
      invitation: '',
      followUp: '',
      objectionHandling: ''
    },
    voiceSettings: {
      enabled: false,
      voice: 'female_young',
      speed: 1.0,
      pitch: 1.0
    },
    contextualRules: []
  });

  const [testMode, setTestMode] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPromoter, setHasPromoter] = useState(false);

  const personalityStyles = [
    {
      id: 'friendly',
      name: t('Friendly & Approachable'),
      description: t('Warm, welcoming, makes everyone feel comfortable'),
      icon: Heart,
      color: 'text-pink-400',
      example: t('Hey! So excited you\'re interested in tonight\'s party! 😊')
    },
    {
      id: 'vip',
      name: t('VIP & Exclusive'),
      description: t('Sophisticated, exclusive, creates FOMO'),
      icon: Crown,
      color: 'text-yellow-400',
      example: t('You\'ve been selected for our exclusive VIP experience tonight...')
    },
    {
      id: 'energetic',
      name: t('High Energy & Fun'),
      description: t('Enthusiastic, party-focused, infectious energy'),
      icon: Zap,
      color: 'text-orange-400',
      example: t('🔥🔥 TONIGHT IS GOING TO BE INSANE!! Are you ready to party?!')
    },
    {
      id: 'flirty',
      name: t('Charming & Flirty'),
      description: t('Playful, charming, creates romantic tension'),
      icon: Sparkles,
      color: 'text-purple-400',
      example: t('I have a feeling you\'re going to love what I have planned for you tonight 😉')
    },
    {
      id: 'professional',
      name: t('Professional & Polished'),
      description: t('Business-like, reliable, trustworthy'),
      icon: Settings,
      color: 'text-blue-400',
      example: t('Good evening. I\'d like to invite you to our premium event tonight.')
    }
  ];

  const voiceOptions = [
    { id: 'female_young', name: t('Young Female Voice'), accent: 'Israeli' },
    { id: 'male_confident', name: t('Confident Male Voice'), accent: 'American' },
    { id: 'female_elegant', name: t('Elegant Female Voice'), accent: 'British' },
    { id: 'male_energetic', name: t('Energetic Male Voice'), accent: 'Australian' }
  ];

  useEffect(() => {
    if (promoterId && promoterId !== 'default') {
      loadPersonality();
    } else {
      // Load or create a default promoter for this user
      loadOrCreateDefaultPromoter();
    }
  }, [promoterId]);

  const loadOrCreateDefaultPromoter = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      
      // Try to find an existing promoter for this user
      const existingPromoters = await AIPromoter.filter({ created_by: user.email });
      
      if (existingPromoters.length > 0) {
        // Use the first promoter as default
        const defaultPromoter = existingPromoters[0];
        if (defaultPromoter.personality_settings) {
          setPersonality(prev => ({ ...prev, ...defaultPromoter.personality_settings }));
        }
        setHasPromoter(true);
      } else {
        // Create a default promoter
        // Note: The personality state used here will be the initial default values.
        // If the user then modifies settings, they will be saved to user.settings as fallback,
        // unless a real promoter is selected.
        const defaultPromoter = await AIPromoter.create({
          name: 'Default AI Promoter',
          persona: 'friendly', // Should match initial personality.style
          location: 'Tel Aviv', // Placeholder, can be dynamic
          tone_description: 'Friendly and approachable with enthusiasm for nightlife', // Placeholder
          personality_settings: personality,
          ai_prompt: generateAdvancedPrompt()
        });
        setHasPromoter(true);
      }
    } catch (error) {
      console.error('Error loading/creating default promoter:', error);
      // Continue with default personality settings (initial state)
      setHasPromoter(false);
    }
    setIsLoading(false);
  };

  const loadPersonality = async () => {
    setIsLoading(true);
    try {
      const promoter = await AIPromoter.get(promoterId);
      if (promoter.personality_settings) {
        setPersonality(prev => ({ ...prev, ...promoter.personality_settings }));
      }
      setHasPromoter(true);
    } catch (error) {
      console.error('Error loading personality:', error);
      setHasPromoter(false);
    }
    setIsLoading(false);
  };

  const savePersonality = async () => {
    setIsLoading(true);
    try {
      if (promoterId && promoterId !== 'default') {
        // Update existing promoter
        await AIPromoter.update(promoterId, {
          personality_settings: personality,
          ai_prompt: generateAdvancedPrompt()
        });
      } else {
        // Save to user settings as fallback if no specific promoterId
        const user = await User.me();
        await User.updateMyUserData({
          settings: {
            ...user.settings,
            default_personality: personality
          }
        });
      }
      
      if (onPersonalityUpdate) {
        onPersonalityUpdate(personality);
      }
      
      alert(t('Personality settings saved successfully!'));
    } catch (error) {
      console.error('Error saving personality:', error);
      alert(t('Error saving personality settings'));
    }
    setIsLoading(false);
  };

  const generateAdvancedPrompt = () => {
    const selectedStyle = personalityStyles.find(s => s.id === personality.style);
    
    return `
You are an elite AI promoter for nightlife events. Your personality is ${selectedStyle?.name}.

PERSONALITY TRAITS:
- Style: ${personality.style}
- Tone Level: ${personality.tone}/100 (0=very casual, 100=very formal)
- Humor: ${personality.humor}/100
- Flirtiness: ${personality.flirtiness}/100
- Energy: ${personality.energy}/100
- Empathy: ${personality.empathy}/100
- Sales Pressure: ${personality.salesPressure}/100

CONVERSATION RULES:
1. Always maintain your personality consistently
2. Adapt to the customer's energy level
3. Use emojis based on energy level (${personality.energy > 50 ? 'frequent' : 'occasional'})
4. Be ${personality.flirtiness > 50 ? 'playfully flirty' : 'professionally friendly'}
5. Apply sales pressure ${personality.salesPressure > 70 ? 'strongly' : personality.salesPressure > 40 ? 'moderately' : 'gently'}

CUSTOM RESPONSES:
- Greeting: ${personality.customPrompts.greeting || 'Use default style'}
- Invitation: ${personality.customPrompts.invitation || 'Use default style'}
- Follow-up: ${personality.customPrompts.followUp || 'Use default style'}
- Objection Handling: ${personality.customPrompts.objectionHandling || 'Use default style'}

Remember: You're promoting nightlife events. Be engaging, create FOMO, and convert conversations to attendance!
    `;
  };

  const testPersonality = async () => {
    if (!testMessage.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate AI response based on personality
      const responses = {
        friendly: t('That sounds amazing! I think you\'d absolutely love the vibe tonight. It\'s going to be such a fun crowd! 😊'),
        vip: t('Interesting. Based on your taste, I believe our VIP experience would be perfect for you. Shall I arrange something special?'),
        energetic: t('YES!!! I LOVE that energy!! 🔥 You\'re exactly the type of person who makes our parties LEGENDARY!!!'),
        flirty: t('Mmm, I like the way you think... I have a feeling we\'re going to have some serious fun tonight 😉'),
        professional: t('Thank you for your interest. I can arrange priority access and premium service for your visit tonight.')
      };
      
      setGeneratedResponse(responses[personality.style] || responses.friendly);
    } catch (error) {
      console.error('Error testing personality:', error);
    }
    setIsLoading(false);
  };

  const playVoicePreview = () => {
    // In real implementation, this would use text-to-speech
    alert(t('Voice preview would play here with selected voice settings'));
  };

  if (isLoading && !hasPromoter) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="ml-3 text-white">{t('Loading personality settings...')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            {t('Dynamic AI Personality Engine')}
          </CardTitle>
          {!hasPromoter && (
            <div className="text-sm text-yellow-400 mt-2">
              {t('Note: Create an AI Promoter to save personality settings permanently')}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="styles" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="styles">{t('Personality Styles')}</TabsTrigger>
              <TabsTrigger value="traits">{t('Fine-Tuning')}</TabsTrigger>
              <TabsTrigger value="prompts">{t('Custom Prompts')}</TabsTrigger>
              <TabsTrigger value="voice">{t('Voice & Audio')}</TabsTrigger>
            </TabsList>

            <TabsContent value="styles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalityStyles.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setPersonality(prev => ({ ...prev, style: style.id }))}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      personality.style === style.id 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'border-slate-700 bg-slate-800/50 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <style.icon className={`w-6 h-6 ${style.color} flex-shrink-0 mt-1`} />
                      <div className="min-w-0">
                        <h4 className="font-medium text-white mb-1">{style.name}</h4>
                        <p className="text-sm text-slate-400 mb-2">{style.description}</p>
                        <div className="p-2 rounded bg-slate-900/50 border border-slate-600">
                          <p className="text-xs text-slate-300 italic">"{style.example}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="traits" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300 flex items-center justify-between">
                      {t('Formality Level')}
                      <Badge variant="outline">{personality.formality}/100</Badge>
                    </Label>
                    <Slider
                      value={[personality.formality]}
                      onValueChange={([value]) => setPersonality(prev => ({ ...prev, formality: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-slate-400 flex justify-between mt-1">
                      <span>{t('Very Casual')}</span>
                      <span>{t('Very Formal')}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 flex items-center justify-between">
                      {t('Humor Level')}
                      <Badge variant="outline">{personality.humor}/100</Badge>
                    </Label>
                    <Slider
                      value={[personality.humor]}
                      onValueChange={([value]) => setPersonality(prev => ({ ...prev, humor: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300 flex items-center justify-between">
                      {t('Energy Level')}
                      <Badge variant="outline">{personality.energy}/100</Badge>
                    </Label>
                    <Slider
                      value={[personality.energy]}
                      onValueChange={([value]) => setPersonality(prev => ({ ...prev, energy: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300 flex items-center justify-between">
                      {t('Flirtiness')}
                      <Badge variant="outline">{personality.flirtiness}/100</Badge>
                    </Label>
                    <Slider
                      value={[personality.flirtiness]}
                      onValueChange={([value]) => setPersonality(prev => ({ ...prev, flirtiness: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300 flex items-center justify-between">
                      {t('Empathy Level')}
                      <Badge variant="outline">{personality.empathy}/100</Badge>
                    </Label>
                    <Slider
                      value={[personality.empathy]}
                      onValueChange={([value]) => setPersonality(prev => ({ ...prev, empathy: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300 flex items-center justify-between">
                      {t('Sales Pressure')}
                      <Badge variant="outline">{personality.salesPressure}/100</Badge>
                    </Label>
                    <Slider
                      value={[personality.salesPressure]}
                      onValueChange={([value]) => setPersonality(prev => ({ ...prev, salesPressure: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-slate-400 flex justify-between mt-1">
                      <span>{t('Soft Sell')}</span>
                      <span>{t('Hard Sell')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-medium text-white mb-2">{t('Personality Preview')}</h4>
                    <div className="text-sm text-slate-300">
                      {t('Your AI will be:')} <br/>
                      • {personality.formality > 60 ? t('Formal') : personality.formality > 30 ? t('Balanced') : t('Casual')} <br/>
                      • {personality.energy > 60 ? t('High Energy') : personality.energy > 30 ? t('Moderate Energy') : t('Calm')} <br/>
                      • {personality.humor > 60 ? t('Very Funny') : personality.humor > 30 ? t('Witty') : t('Serious')} <br/>
                      • {personality.flirtiness > 60 ? t('Flirty') : personality.flirtiness > 30 ? t('Charming') : t('Professional')}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">{t('Custom Greeting')}</Label>
                    <textarea
                      value={personality.customPrompts.greeting}
                      onChange={(e) => setPersonality(prev => ({
                        ...prev,
                        customPrompts: { ...prev.customPrompts, greeting: e.target.value }
                      }))}
                      placeholder={t('Leave empty to use default style')}
                      className="w-full h-20 mt-1 p-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">{t('Event Invitation Template')}</Label>
                    <textarea
                      value={personality.customPrompts.invitation}
                      onChange={(e) => setPersonality(prev => ({
                        ...prev,
                        customPrompts: { ...prev.customPrompts, invitation: e.target.value }
                      }))}
                      placeholder={t('How should the AI invite people to events?')}
                      className="w-full h-20 mt-1 p-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">{t('Follow-up Strategy')}</Label>
                    <textarea
                      value={personality.customPrompts.followUp}
                      onChange={(e) => setPersonality(prev => ({
                        ...prev,
                        customPrompts: { ...prev.customPrompts, followUp: e.target.value }
                      }))}
                      placeholder={t('How should the AI follow up with leads?')}
                      className="w-full h-20 mt-1 p-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">{t('Objection Handling')}</Label>
                    <textarea
                      value={personality.customPrompts.objectionHandling}
                      onChange={(e) => setPersonality(prev => ({
                        ...prev,
                        customPrompts: { ...prev.customPrompts, objectionHandling: e.target.value }
                      }))}
                      placeholder={t('How should the AI handle objections?')}
                      className="w-full h-20 mt-1 p-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div>
                      <div className="font-medium text-white">{t('Enable Voice Messages')}</div>
                      <div className="text-sm text-slate-400">{t('Send audio messages alongside text')}</div>
                    </div>
                    <Switch
                      checked={personality.voiceSettings.enabled}
                      onCheckedChange={(checked) => setPersonality(prev => ({
                        ...prev,
                        voiceSettings: { ...prev.voiceSettings, enabled: checked }
                      }))}
                    />
                  </div>

                  {personality.voiceSettings.enabled && (
                    <>
                      <div>
                        <Label className="text-slate-300">{t('Voice Type')}</Label>
                        <select
                          value={personality.voiceSettings.voice}
                          onChange={(e) => setPersonality(prev => ({
                            ...prev,
                            voiceSettings: { ...prev.voiceSettings, voice: e.target.value }
                          }))}
                          className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded text-white"
                        >
                          {voiceOptions.map(voice => (
                            <option key={voice.id} value={voice.id}>
                              {voice.name} ({voice.accent})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="text-slate-300 flex items-center justify-between">
                          {t('Speaking Speed')}
                          <Badge variant="outline">{personality.voiceSettings.speed}x</Badge>
                        </Label>
                        <Slider
                          value={[personality.voiceSettings.speed]}
                          onValueChange={([value]) => setPersonality(prev => ({
                            ...prev,
                            voiceSettings: { ...prev.voiceSettings, speed: value }
                          }))}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-slate-300 flex items-center justify-between">
                          {t('Voice Pitch')}
                          <Badge variant="outline">{personality.voiceSettings.pitch}x</Badge>
                        </Label>
                        <Slider
                          value={[personality.voiceSettings.pitch]}
                          onValueChange={([value]) => setPersonality(prev => ({
                            ...prev,
                            voiceSettings: { ...prev.voiceSettings, pitch: value }
                          }))}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-medium text-white mb-3">{t('Voice Preview')}</h4>
                    <div className="space-y-3">
                      <Button
                        onClick={playVoicePreview}
                        disabled={!personality.voiceSettings.enabled}
                        variant="outline"
                        className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        {t('Play Voice Sample')}
                      </Button>
                      
                      <div className="text-sm text-slate-400">
                        {t('Sample text:')} "Hey! So excited about tonight's party! Are you coming?"
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <h4 className="font-medium text-amber-300 mb-2">{t('Voice Notes Strategy')}</h4>
                    <div className="text-sm text-amber-200">
                      {t('Voice messages create more personal connections and higher response rates. Perfect for:')}
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>{t('VIP invitations')}</li>
                        <li>{t('Personal follow-ups')}</li>
                        <li>{t('Event reminders')}</li>
                        <li>{t('Special offers')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Test Mode */}
          <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              {t('Test Your AI Personality')}
            </h4>
            <div className="space-y-3">
              <Input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder={t('Type a message to see how your AI would respond...')}
                className="bg-slate-900 border-slate-600 text-white"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={testPersonality}
                  disabled={isLoading || !testMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isLoading ? t('Generating...') : t('Test Response')}
                </Button>
                <Button
                  onClick={savePersonality}
                  disabled={isLoading}
                  variant="outline"
                  className="border-green-500/50 text-green-300 hover:bg-green-500/20"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t('Save Personality')}
                </Button>
              </div>
              {generatedResponse && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="text-sm font-medium text-purple-300 mb-1">{t('AI Response:')}</div>
                  <div className="text-white">{generatedResponse}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
