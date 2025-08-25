import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone,
  PhoneCall,
  MessageSquare,
  Volume2,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function CallHandlerAgent({ agentConfig }) {
  const [callSimulation, setCallSimulation] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateIncomingCall = async () => {
    setIsSimulating(true);
    const stages = [
      { stage: 'incoming', text: 'מתקבלת שיחה נכנסת...', duration: 1000 },
      { stage: 'answering', text: 'הסוכן עונה אוטומטית', duration: 1500 },
      { stage: 'greeting', text: 'מברך את המתקשר', duration: 2000 },
      { stage: 'explaining', text: 'מסביר שהוא סוכן דיגיטלי', duration: 2500 },
      { stage: 'redirecting', text: 'מפנה לווצאפ לשירות טוב יותר', duration: 2000 },
      { stage: 'ending', text: 'סיום השיחה ושליחת קישור', duration: 1500 },
      { stage: 'complete', text: 'ההפניה הושלמה בהצלחה!', duration: 0 }
    ];

    for (const stageInfo of stages) {
      setCallSimulation(stageInfo);
      if (stageInfo.duration > 0) {
        await new Promise(resolve => setTimeout(resolve, stageInfo.duration));
      }
    }

    setIsSimulating(false);
  };

  const callHandlingScript = {
    he: `
שלום! אני הסוכן הדיגיטלי של NocturneAI. 
אני כאן כדי לעזור לך עם כל מה שקשור לאירועי הלילה שלנו.

כדי שאוכל לתת לך את השירות הכי טוב, אני מעדיף שנמשיך את השיחה בהודעות קוליות בווצאפ. 
ההודעות הקוליות מאפשרות לי להבין אותך טוב יותר ולתת לך מענה מדויק ומותאם אישית.

אני שולח לך עכשיו קישור לווצאפ - רק תלחץ עליו ונמשיך שם!
תודה ונתראה בווצאפ! 🎉
    `,
    en: `
Hello! I'm the NocturneAI digital agent.
I'm here to help you with everything related to our nightlife events.

To give you the best service possible, I prefer we continue our conversation with voice messages on WhatsApp.
Voice messages allow me to understand you better and give you accurate, personalized responses.

I'm sending you a WhatsApp link now - just click on it and we'll continue there!
Thanks and see you on WhatsApp! 🎉
    `,
    ar: `
مرحبا! أنا الوكيل الرقمي لـ NocturneAI.
أنا هنا لمساعدتك في كل ما يتعلق بفعاليات الحياة الليلية لدينا.

لأتمكن من تقديم أفضل خدمة لك، أفضل أن نكمل محادثتنا برسائل صوتية على واتساب.
الرسائل الصوتية تتيح لي فهمك بشكل أفضل وتقديم إجابات دقيقة ومخصصة لك.

سأرسل لك الآن رابط واتساب - فقط اضغط عليه وسنكمل هناك!
شكرا ونراك على واتساب! 🎉
    `
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'incoming': return <PhoneCall className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'answering': return <Phone className="w-5 h-5 text-green-400" />;
      case 'greeting': case 'explaining': return <Volume2 className="w-5 h-5 text-purple-400" />;
      case 'redirecting': return <ArrowRight className="w-5 h-5 text-yellow-400" />;
      case 'ending': return <MessageSquare className="w-5 h-5 text-pink-400" />;
      case 'complete': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default: return <Phone className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'incoming': return 'border-blue-500/50 bg-blue-500/10';
      case 'answering': return 'border-green-500/50 bg-green-500/10';
      case 'greeting': case 'explaining': return 'border-purple-500/50 bg-purple-500/10';
      case 'redirecting': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'ending': return 'border-pink-500/50 bg-pink-500/10';
      case 'complete': return 'border-emerald-500/50 bg-emerald-500/10';
      default: return 'border-slate-500/50 bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Phone className="w-6 h-6 text-purple-400" />
            סוכן טיפול בשיחות חכם
          </CardTitle>
          <p className="text-slate-300">
            מערכת מתקדמת לטיפול בשיחות טלפון והפנייה חכמה לווצאפ
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Call Simulation */}
          <div className="text-center">
            <Button
              onClick={simulateIncomingCall}
              disabled={isSimulating}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 mb-6"
              size="lg"
            >
              {isSimulating ? (
                <>
                  <Phone className="w-5 h-5 mr-2 animate-pulse" />
                  מדמה שיחה...
                </>
              ) : (
                <>
                  <PhoneCall className="w-5 h-5 mr-2" />
                  דמיית שיחה נכנסת
                </>
              )}
            </Button>

            {callSimulation && (
              <div className={`p-6 rounded-lg border-2 ${getStageColor(callSimulation.stage)} transition-all duration-500`}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {getStageIcon(callSimulation.stage)}
                  <span className="text-lg font-medium text-white">
                    {callSimulation.text}
                  </span>
                </div>
                
                {callSimulation.stage === 'complete' && (
                  <div className="mt-4 p-4 bg-emerald-500/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-emerald-300 font-medium">השיחה הופנתה בהצלחה לווצאפ!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Call Script Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(callHandlingScript).map(([lang, script]) => (
              <Card key={lang} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    {lang === 'he' ? 'עברית' : lang === 'en' ? 'English' : 'العربية'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                    {script}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">98%</div>
              <div className="text-slate-400 text-sm">שיחות שהופנו בהצלחה</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">15s</div>
              <div className="text-slate-400 text-sm">משך ממוצע של שיחה</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">87%</div>
              <div className="text-slate-400 text-sm">המשיכו בווצאפ</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">156</div>
              <div className="text-slate-400 text-sm">שיחות השבוע</div>
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">🎯 תכונות המערכת:</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  מענה אוטומטי תוך 2 שניות
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  זיהוי שפת המתקשר אוטומטית
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  הפניה חכמה לווצאפ
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  שליחת קישור אוטומטית
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  מעקב ודיווח מלא
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">⚡ יתרונות המערכת:</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  חוסך זמן יקר לצוות
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  שירות 24/7 ללא הפסקה
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  הפניה לערוץ עדיף לשירות
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  התרת האנושי להתמקד במכירות
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  שיפור חוויית הלקוח
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}