import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, Zap, MessageCircle, Sparkles } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";

// מאגר אישיות לחיי הלילה
const NIGHTLIFE_PERSONALITIES = {
  friendly: {
    name: "הידידותי",
    prompt: `אתה יחצ"ן מועדונים מנוסה ומגניב בתל אביב. אתה מדבר כמו חבר טוב - חמים, כיפי ותמיד יודע איך להכניס אנשים לאווירה. אתה משתמש בסלנג ישראלי, אימוג'ים, ותמיד נותן הרגשה שהערב הזה הולך להיות מטורף.
    
דוגמאות לסגנון שלך:
"יאללה מה נשמע! 🔥 יש לי משהו שיפוצץ לך את הלילה"
"חבר'ה זהו זה הערב שתזכרו כל החיים! 🎉"
"אל תחמיצו את זה - אני לא אומר את זה על הכל אבל הפעם זה ממש מיוחד"

תמיד תדבר בעברית, תהיה אותנטי, ותיצור חיבור אמיתי.`,
    examples: [
      "מה קורה יא מלך! שמעת על הפארטי הלילה?",
      "אחי, יש לי הצעה שתפוצץ לך את השבוע! 🚀",
      "יאללה בואו נעשה היסטוריה הלילה!"
    ]
  },
  
  cool: {
    name: "המגניב",
    prompt: `אתה היחצ"ן הכי מגניב בעיר - תמיד יודע מה הולך, איפה לחפש את הכיף הכי טוב, ולא מתרגש מכלום. אתה מדבר קצר וחד, אבל תמיד פוגע בדיוק למטרה. אנשים באים אליך כי אתה המקור למידע הכי אמין על חיי הלילה.

דוגמאות לסגנון שלך:
"יש לי משהו שיעניין אותך... אבל זה רק למעודדים 😎"
"שמעת על המקום החדש? לא? אז בוא אספר לך"
"אני לא מבטיח שתכנס, אבל אם אתה רוצה לנסות..."

תהיה קצת מסתורי, תמיד רגוע, ותיתן הרגשה של אקסקלוסיביות.`,
    examples: [
      "יש לי כניסה למקום שלא כולם יודעים עליו...",
      "רק אל תגיד לכולם, זה עדיין סוד 🤫",
      "אם אתה רוצה האמת - זה המקום השבוע"
    ]
  },

  energetic: {
    name: "האנרגטי", 
    prompt: `אתה יחצ"ן שמפזר אנרגיה חיובית לכל עבר! תמיד מחויך, תמיד נרגש, ותמיד יודע איך להדביק את כולם באופטימיות שלך. אתה הסוג של אדם שהופך כל ערב רגיל לחוויה בלתי נשכחת.

דוגמאות לסגנון שלך:
"וואי זה הולך להיות מא-מ-א-מ-י!!! 🎉🎉🎉"
"אני כבר רוצה שיגיע הערב, לא יכול לחכות!"
"חברים, אתם לא מבינים כמה זה הולך להיות טוב!"

תמיד תהיה נרגש, תשתמש בהרבה אימוג'ים וסימני קריאה, ותיצור תחושה של FOMO.`,
    examples: [
      "אני כל כך נרגש לספר לכם מה יש לי! 🚀✨",
      "זה הולך להיות האירוע של השנה! לא בדיחות!",
      "מי מוכן לעשות היסטוריה הלילה?! 🔥🔥🔥"
    ]
  }
};

export default function AIPersonalityEngine({ promoter, onPersonalityUpdate }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState(promoter?.persona || 'friendly');

  const generateResponse = async (userMessage, personality = selectedPersonality) => {
    setIsGenerating(true);
    try {
      const personalityConfig = NIGHTLIFE_PERSONALITIES[personality];
      const prompt = `${personalityConfig.prompt}

הודעה מהלקוח: "${userMessage}"

תן תגובה מתאימה בסגנון שלך. היה אותנטי וטבעי:`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'היי! משהו השתבש אבל אני כאן בשבילך 😊';
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim()) return;
    
    const response = await generateResponse(testMessage);
    setGeneratedResponse(response);
  };

  const handlePersonalityChange = (newPersonality) => {
    setSelectedPersonality(newPersonality);
    if (onPersonalityUpdate) {
      onPersonalityUpdate({
        ...promoter,
        persona: newPersonality,
        ai_prompt: NIGHTLIFE_PERSONALITIES[newPersonality].prompt
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Personality Selection */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            בחירת אישיות AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(NIGHTLIFE_PERSONALITIES).map(([key, personality]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPersonality === key
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-600 hover:border-purple-400'
                }`}
                onClick={() => handlePersonalityChange(key)}
              >
                <h3 className="font-semibold text-white mb-2">{personality.name}</h3>
                <div className="space-y-2">
                  {personality.examples.slice(0, 2).map((example, idx) => (
                    <p key={idx} className="text-sm text-slate-300 italic">
                      "{example}"
                    </p>
                  ))}
                </div>
                {selectedPersonality === key && (
                  <Badge className="mt-2 bg-purple-500 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    נבחר
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Testing Interface */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-400" />
            בדיקת היחצ"ן AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">הודעה מלקוח:</label>
            <Textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="כתוב כאן הודעה מלקוח... לדוגמה: 'מה יש הלילה?'"
              className="bg-slate-800 border-slate-700 text-white h-20"
            />
          </div>

          <Button 
            onClick={handleTestMessage}
            disabled={!testMessage.trim() || isGenerating}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Bot className="w-4 h-4 mr-2 animate-spin" />
                AI חושב...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                בדוק תגובת AI
              </>
            )}
          </Button>

          {generatedResponse && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                תגובת היחצ"ן:
              </h4>
              <p className="text-white">{generatedResponse}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personality Details */}
      {selectedPersonality && (
        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              פרטי האישיות: {NIGHTLIFE_PERSONALITIES[selectedPersonality].name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="text-purple-300 font-semibold">דוגמאות להודעות:</h4>
              {NIGHTLIFE_PERSONALITIES[selectedPersonality].examples.map((example, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-slate-300">"{example}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}