import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Volume2, 
  Languages,
  Brain,
  MessageSquare,
  Clock,
  CheckCircle,
  Play,
  Pause
} from "lucide-react";
import { InvokeLLM } from "@/api/integrations";

export default function VoiceMessageProcessor({ 
  voiceMessage, 
  onProcessingComplete, 
  agentConfig 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [transcription, setTranscription] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [translation, setTranslation] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [voiceResponseUrl, setVoiceResponseUrl] = useState('');

  const processVoiceMessage = async () => {
    setIsProcessing(true);
    
    try {
      // Stage 1: Transcription
      setProcessingStage('תמלול ההודעה הקולית...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate transcription result
      const mockTranscriptions = {
        he: 'היי, אני רוצה לדעת על האירוע הערב. יש מקום פנוי?',
        en: 'Hey, I want to know about tonight\'s event. Is there space available?',
        ar: 'مرحبا، أريد أن أعرف عن الحدث الليلة. هل يوجد مكان متاح؟',
        ru: 'Привет, я хочу узнать о сегодняшнем мероприятии. Есть ли свободные места?'
      };
      
      const languages = ['he', 'en', 'ar', 'ru'];
      const randomLang = languages[Math.floor(Math.random() * languages.length)];
      
      setTranscription(mockTranscriptions[randomLang]);
      setDetectedLanguage(randomLang);
      
      // Stage 2: Language Detection & Translation
      if (agentConfig.realTimeTranslation && randomLang !== agentConfig.primaryLanguage) {
        setProcessingStage('מתרגם הודעה...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTranslation(mockTranscriptions[agentConfig.primaryLanguage]);
      }
      
      // Stage 3: Sentiment Analysis
      if (agentConfig.emotionalIntelligence) {
        setProcessingStage('מנתח רגשות...');
        await new Promise(resolve => setTimeout(resolve, 800));
        setSentiment('positive'); // excited, curious
      }
      
      // Stage 4: AI Response Generation
      setProcessingStage('יוצר תגובה חכמה...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponsePrompt = `
        Customer said: "${transcription}"
        Language: ${detectedLanguage}
        Sentiment: ${sentiment}
        
        Respond as a nightlife promoter AI agent:
        - Be enthusiastic about tonight's event
        - Mention VIP options if customer seems interested
        - Use the same language as the customer
        - Be personal and engaging
        - Create FOMO (fear of missing out)
      `;
      
      // Simulate AI response
      const responses = {
        he: 'וואו! יש לנו אירוע מטורף הלילה! 🔥 יש עוד כמה מקומות VIP פנויים אבל הם נגמרים מהר. רוצה שאשריין לך מקום מיוחד עם שולחן ושירות בר פרימיום? זה הולך להיות לילה בלתי נשכח! 🍾✨',
        en: 'OMG yes! We have an AMAZING event tonight! 🔥 There are still a few VIP spots left but they\'re going fast. Want me to reserve you a special table with premium bar service? It\'s going to be an unforgettable night! 🍾✨',
        ar: 'نعم! لدينا حدث رائع الليلة! 🔥 لا يزال هناك بعض الأماكن المميزة متاحة لكنها تنفد بسرعة. هل تريد مني أن أحجز لك طاولة خاصة مع خدمة بار متميزة؟ ستكون ليلة لا تُنسى! 🍾✨',
        ru: 'Да! У нас потрясающее мероприятие сегодня! 🔥 Еще есть несколько VIP мест, но они быстро заканчиваются. Хочешь, чтобы я зарезервировал тебе специальный стол с премиум баром? Это будет незабываемая ночь! 🍾✨'
      };
      
      setAiResponse(responses[detectedLanguage] || responses.he);
      
      // Stage 5: Voice Response Generation (if enabled)
      if (agentConfig.voiceResponseEnabled) {
        setProcessingStage('מכין תגובה קולית...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setVoiceResponseUrl('mock-voice-response-url');
      }
      
      setProcessingStage('הושלם!');
      
      // Call completion callback
      if (onProcessingComplete) {
        onProcessingComplete({
          transcription,
          detectedLanguage,
          translation,
          sentiment,
          aiResponse,
          voiceResponseUrl
        });
      }
      
    } catch (error) {
      console.error('Error processing voice message:', error);
      setProcessingStage('שגיאה בעיבוד');
    }
    
    setIsProcessing(false);
  };

  const getLanguageFlag = (langCode) => {
    const flags = {
      he: '🇮🇱',
      en: '🇺🇸', 
      ar: '🇸🇦',
      ru: '🇷🇺',
      fr: '🇫🇷',
      es: '🇪🇸'
    };
    return flags[langCode] || '🌍';
  };

  const getLanguageName = (langCode) => {
    const names = {
      he: 'עברית',
      en: 'English',
      ar: 'العربية', 
      ru: 'Русский',
      fr: 'Français',
      es: 'Español'
    };
    return names[langCode] || langCode;
  };

  const getSentimentEmoji = (sentiment) => {
    const emojis = {
      positive: '😊',
      negative: '😕',
      neutral: '😐',
      excited: '🤩',
      curious: '🤔'
    };
    return emojis[sentiment] || '😐';
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          מעבד הודעות קוליות חכם
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isProcessing && !transcription && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-slate-300 mb-4">מוכן לעבד הודעה קולית</p>
            <Button 
              onClick={processVoiceMessage}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Mic className="w-4 h-4 mr-2" />
              עבד הודעה קולית (דמו)
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <p className="text-blue-300 font-medium">{processingStage}</p>
            <div className="mt-4 bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        {transcription && (
          <div className="space-y-4">
            {/* Transcription */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-white">תמלול:</span>
                {detectedLanguage && (
                  <Badge className="bg-blue-500/20 text-blue-300">
                    {getLanguageFlag(detectedLanguage)} {getLanguageName(detectedLanguage)}
                  </Badge>
                )}
              </div>
              <p className="text-slate-300 bg-slate-900/50 p-3 rounded border-r-4 border-blue-400">
                "{transcription}"
              </p>
            </div>

            {/* Translation */}
            {translation && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-white">תרגום:</span>
                </div>
                <p className="text-slate-300 bg-slate-900/50 p-3 rounded border-r-4 border-green-400">
                  "{translation}"
                </p>
              </div>
            )}

            {/* Sentiment */}
            {sentiment && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getSentimentEmoji(sentiment)}</span>
                  <span className="font-medium text-white">ניתוח רגשי:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">
                    {sentiment}
                  </Badge>
                </div>
              </div>
            )}

            {/* AI Response */}
            {aiResponse && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-white">תגובת AI:</span>
                </div>
                <p className="text-slate-300 bg-slate-900/50 p-3 rounded border-r-4 border-purple-400">
                  {aiResponse}
                </p>
              </div>
            )}

            {/* Voice Response */}
            {voiceResponseUrl && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-pink-400" />
                    <span className="font-medium text-white">תגובה קולית:</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert('נגן תגובה קולית - יבוא בקרוב!')}
                    className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    נגן
                  </Button>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border-r-4 border-pink-400">
                  <div className="flex items-center gap-2 text-pink-300">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">הודעה קולית מוכנה לשליחה</span>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Complete */}
            <div className="flex items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-300 font-medium">עיבוד הושלם בהצלחה!</span>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setTranscription('');
                  setDetectedLanguage('');
                  setTranslation('');
                  setSentiment('');
                  setAiResponse('');
                  setVoiceResponseUrl('');
                  setProcessingStage('');
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                עבד הודעה נוספת
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}