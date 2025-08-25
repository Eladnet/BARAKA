
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  Square,
  Send,
  Bot,
  User as UserIcon,
  Settings,
  Zap,
  Clock,
  MessageCircle,
  RefreshCw,
  Hand,
  ArrowRight,
  Target,
  Sparkles,
  Star,
  Crown,
  Heart,
  Link as LinkIcon,
  Maximize2,
  Minimize2,
  Brain
} from "lucide-react";
import { format } from "date-fns";
// Removed: import { InvokeLLM } from "@/api/integrations"; // Will be dynamically imported

import { useActivityTracker } from '../hooks/useActivityTracker';
import { useConversationState } from '../hooks/useConversationState';

export default function AutomaticConversationSimulator({
  promoters = [],
  onSimulationComplete = () => {},
  isVisible = false
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentStage, setCurrentStage] = useState('opening');
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [manualResponse, setManualResponse] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const [typingDelay, setTypingDelay] = useState(3000); // 3 שניות ברירת מחדל
  const [responseDelay, setResponseDelay] = useState(5000); // 5 שניות תגובת לקוח
  const [isTypingIndicator, setIsTypingIndicator] = useState(false);

  const [customerProfile, setCustomerProfile] = useState({
    name: 'דני כהן',
    age: 28,
    personality: 'מתלהב אבל זהיר עם כסף',
    mood: 'סקרן',
    interests: ['מוזיקה אלקטרונית', 'חיי לילה', 'אירועים חברתיים'],
    spending_power: 'בינוני',
    past_experience: 'היה באירועים דומים'
  });

  const [eventProfile, setEventProfile] = useState({
    name: 'מסיבת האלקטרו הגדולה',
    venue: 'בר מיטב תל אביב',
    date: 'השבת הקרובה, 23.11',
    time: '22:00',
    price: 120,
    discounted_price: 90,
    special_offer: 'מבצע מוגבל ל-30 הראשונים - 90₪ במקום 120₪',
    dj: 'DJ Ben Nicky מהולנד - מלך הטראנס העולמי',
    features: ['בר פתוח עד 02:00', 'VIP area עם שולחנות פרטיים', 'צילום מקצועי', 'מערכת קול מתקדמת'],
    atmosphere: 'אווירה מטורפת עם תאורה מקצועית וויזואלים',
    capacity: '300 איש',
    remaining_tickets: 23,
    ticketLink: 'https://ticketpulse.com/event/electro-party-2024',
    parking: 'חניה חינם בשטח',
    security: 'אבטחה מקצועית',
    dress_code: 'קז\'ואל אלגנט',
    unique_selling_points: [
      'DJ בינלאומי שמגיע רק פעם בשנה לישראל',
      'מערכת קול הכי מתקדמת בתל אביב',
      'בר פתוח עם משקאות פרמיום',
      'אזור VIP בלעדי עם שירות אישי'
    ]
  });

  const [stats, setStats] = useState({
    messagesExchanged: 0,
    aiResponses: 0,
    customerResponses: 0,
    linksClicked: 0,
    stage: 'opening'
  });

  const messagesEndRef = useRef(null);
  const reminderTimer = useRef(null);

  const { trackActivity, trackConversion } = useActivityTracker();
  const [conversationId] = React.useState(() => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // For demo purposes, assuming the first promoter is selected or a default ID.
  // In a real scenario, you might have a selectedPromoter state or derive it.
  const selectedPromoterId = promoters.length > 0 ? promoters[0].id : 'demo_promoter';

  const {
    conversationState,
    updateStage,
    updateAIInsights,
    recordConversion
  } = useConversationState(
    conversationId,
    'demo_lead_123', // במימוש אמיתי יהיה ID של ליד אמיתי
    selectedPromoterId,
    'demo_campaign_123'
  );

  // Helper function to get a random fallback response
  const getRandomFallbackResponse = (stage) => {
    const responses = fallbackResponses[stage] || fallbackResponses.opening;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getNextBestAction = (currentStage) => {
    const stageActions = {
      opening: 'build_rapport',
      needs_discovery: 'identify_pain_points',
      value_proposition: 'highlight_unique_value',
      objection_handling: 'address_concerns',
      closing: 'create_urgency',
      follow_up: 'confirm_details'
    };
    return stageActions[currentStage] || 'continue_conversation';
  };

  // הגדרת הקשר AI לכל שלב בשיחה
  const getAIPromptForStage = (stage, customerResponse = '', conversationHistory = []) => {
    const baseContext = `
אתה Alex, יחצן מקצועי ומכירות מנוסה של ${eventProfile.venue}.
אתה מוכר כרטיסים לאירוע "${eventProfile.name}" ב-${eventProfile.date} בשעה ${eventProfile.time}.

פרטי האירוע שאתה מוכר:
- מקום: ${eventProfile.venue}
- DJ: ${eventProfile.dj}
- תכונות: ${eventProfile.features.join(', ')}
- אווירה: ${eventProfile.atmosphere}
- מחיר רגיל: ${eventProfile.price}₪
- מחיר מבצע: ${eventProfile.discounted_price}₪
- מבצע מיוחד: ${eventProfile.special_offer}
- נותרו כרטיסים: ${eventProfile.remaining_tickets}
- נקודות מכירה ייחודיות: ${eventProfile.unique_selling_points.join(', ')}

פרופיל הלקוח שאתה מדבר איתו:
- שם: ${customerProfile.name}
- גיל: ${customerProfile.age}
- אישיות: ${customerProfile.personality}
- תחומי עניין: ${customerProfile.interests.join(', ')}
- כוח קנייה: ${customerProfile.spending_power}
- ניסיון קודם: ${customerProfile.past_experience}

היסטוריית השיחה עד כה:
${conversationHistory.map(msg => `${msg.type === 'ai' ? 'Alex' : customerProfile.name}: ${msg.content}`).join('\n')}

הנחיות התנהגות:
- דבר בעברית, בטון חברותי וקליל
- השתמש באימוג'ים בצורה טבעית
- היה משכנע אבל לא לחוץ
- הדגש את הייחודיות של האירוע
- התמודד עם התנגדויות בחכמה
- צור תחושת דחיפות אבל בצורה טבעית
- התאם את הטון לאישיות הלקוח
- כתב הודעה קצרה ומוקדת - מקסימום 4-5 שורות
`;

    let stageSpecificPrompt = '';

    switch (stage) {
      case 'opening':
        stageSpecificPrompt = `
שלב: פתיחה - צור קשר ראשוני
משימה: פתח שיחה חמה ומזמינה, הזכר את האירוע ובדוק עניין ראשוני.
אל תכנס לפרטים עמוקים, רק תעורר עניין וסקרנות.`;
        break;

      case 'needs_discovery':
        stageSpecificPrompt = `
שלב: בירור צרכים
תגובת הלקוח: "${customerResponse}"
משימה: למד מה מעניין את הלקוח באירוע.
שאל שאלות ממוקדות על העדפותיו - מוזיקה, אווירה, VIP, חברים וכו'.`;
        break;

      case 'value_proposition':
        stageSpecificPrompt = `
שלב: הצעת ערך
תגובת הלקוח: "${customerResponse}"
משימה: הצג את הערך הייחודי של האירוע.
הדגש את המחיר המיוחד, הDJ הבינלאומי, והחוויה הייחודית.
צור תחושת דחיפות עם מספר הכרטיסים הנותרים.`;
        break;

      case 'objection_handling':
        stageSpecificPrompt = `
שלב: טיפול בהתנגדויות
תגובת הלקוח: "${customerResponse}"
משימה: נתח את ההתנגדות או החשש של הלקוח וטפל בו באופן משכנע.
אם זה מחיר - הסבר את הערך, אם זה ספק - הרגיע, אם זה לוגיסטיקה - פתור.
השתמש בטכניקות מכירה מתקדמות כמו השוואה, הוכחה חברתית, או הטבות נוספות.`;
        break;

      case 'closing':
        stageSpecificPrompt = `
שלב: סגירת עסקה
תגובת הלקוח: "${customerResponse}"
משימה: הוביל את הלקוח לרכישה.
הצג קישור ברור לרכישה, הסבר את תהליך התשלום הפשוט.
צור תחושת ביטחון ונוחות לגבי הרכישה.`;
        break;

      case 'follow_up':
        stageSpecificPrompt = `
שלב: מעקב לאחר רכישה
תגובת הלקוח: "${customerResponse}"
משימה: אשר את הרכישה, תן פרטים חשובים לאירוע.
הסבר על SMS שיגיע, QR code, פרטי הגעה וחניה.
סיים בטון חיובי ומחכה לראות אותו באירוע.`;
        break;

      default:
        stageSpecificPrompt = `
שלב: כללי
תגובת הלקוח: "${customerResponse}"
משימה: תגיב באופן טבעי ומקצועי לתגובת הלקוח.`;
        break;
    }

    return baseContext + '\n' + stageSpecificPrompt + '\n\nכתב רק את התגובה שלך כ-Alex, בלי הסברים נוספים.';
  };

  // תגובות גיבוי במקרה של שגיאה ב-AI
  const fallbackResponses = {
    opening: [
      `היי ${customerProfile.name}! 👋 אני Alex מ${eventProfile.venue}. יש לנו אירוע מטורף השבוע - "${eventProfile.name}" עם ${eventProfile.dj}! מעניין אותך לשמוע פרטים?`,
      `שלום! 🎵 Alex פה מהצוות. ראיתי שאתה אוהב מוזיקה אלקטרונית - יש לנו משהו מיוחד בשבילך השבת!`,
      `היי! 🔥 Alex מ${eventProfile.venue} פה. אירוע ${eventProfile.name} הולך להיות בלאגן! ${eventProfile.dj} מגיע במיוחד מהולנד - בטח תרצה לשמוע על זה!`
    ],

    needs_discovery: [
      `מעולה שאתה מעוניין! 🎯 תגיד לי, מה הכי חשוב לך באירוע - המוזיקה המדהימה? האווירה המטורפת? או אולי ה-VIP area המיוחד שלנו?`,
      `יופי! 🎉 אז תספר לי - אתה בא לבד או עם חברים? כי יש לי הצעות שונות לפי זה, ואני רוצה לוודא שתקבל את החוויה הכי טובה!`,
      `אחלה! 🌟 רק כדי שאדע איך הכי טוב לעזור לך - אתה יותר טיפוס של ריקודים ובר, או שאתה מעדיף אזור יותר רגוע עם שולחן?`
    ],

    value_proposition: [
      `בוא אני אספר לך מה מיוחד כאן! 🔥\n\n🎵 ${eventProfile.dj} - פעם בשנה בישראל!\n🍺 ${eventProfile.features[0]} + ${eventProfile.features[1]}\n💰 ${eventProfile.special_offer}\n⏰ נשארו רק ${eventProfile.remaining_tickets} מקומות!\n\nזה הולך להיות משהו שלא חווית!`,
      `תקשיב טוב ${customerProfile.name}! 💎\n\nמה שיש לנו פה זה לא סתם אירוע:\n✨ ${eventProfile.atmosphere}\n🎧 ${eventProfile.unique_selling_points[0]}\n🥂 ${eventProfile.unique_selling_points[2]}\n\nובמחיר מבצע של ${eventProfile.discounted_price}₪ במקום ${eventProfile.price}₪!`,
      `אני אגיד לך למה זה כדאי! 🎯\n\n🔊 ${eventProfile.unique_selling_points[1]}\n🌟 ${eventProfile.unique_selling_points[3]}\n🎉 האווירה תהיה מטורפת!\n\nורק ל-${eventProfile.remaining_tickets} הראשונים - ${eventProfile.discounted_price}₪!`
    ],

    objection_handling: [
      `אני מבין את החשש שלך ${customerProfile.name}! 💭 בואו נחשב ביחד - ערב רגיל בבר עולה לך 150₪+, ופה אתה מקבל חוויה מלאה עם DJ בינלאומי ב-${eventProfile.discounted_price}₪ בלבד!`,
      `תקשיב, אני לא רוצה שתחמיץ את זה! 🎯 ${eventProfile.dj} מגיע רק פעם בשנה, והמקומות נגמרים מהר. יש לי עוד ${eventProfile.remaining_tickets} כרטיסים - בואו נשמור לך מקום!`,
      `אני מבין לגמרי את ההיסוס! 🤝 בואו ככה - אני אתן לך 10 דקות לחשוב, אבל המחיר המיוחד הזה זמין רק היום. אחרי זה זה חוזר ל-${eventProfile.price}₪.`
    ],

    closing: [
      `מושלם ${customerProfile.name}! 🎉 בואו נסגור את זה:\n\n🔗 לחץ כאן להזמנה: ${eventProfile.ticketLink}\n\nברגע שתלחץ תקבל אישור ב-SMS + QR לכניסה מהירה!\nמחכים לך השבת! 🔥`,
      `יופי! אני רואה שאתה מבין בחוויות איכות! 🌟\n\n📱 הקישור כאן: ${eventProfile.ticketLink}\n✅ תשלום מאובטח\n🎫 אישור מיידי\n🚗 ${eventProfile.parking}\n\nנתראה באירוע!`,
      `בוא נעשה את זה ${customerProfile.name}! 💪\n\n🎯 לחיצה אחת: ${eventProfile.ticketLink}\n⚡ תהליך של 30 שניות\n🎊 כניסה VIP באירוע\n\nהאירוע מתחיל ב-${eventProfile.time} - אל תאחר!`
    ],

    follow_up: [
      `מעולה ${customerProfile.name}! 🙏 קיבלתי את התשלום!\n\n📨 SMS עם פרטים נשלח אליך\n🎫 QR code מצורף\n📍 כתובת: ${eventProfile.venue}\n🕒 שעת התחלה: ${eventProfile.time}\n\nיהיה בלאגן! תודה שבחרת בנו! 🎉`,
      `תודה רבה על הרכישה ${customerProfile.name}! 🌟\n\nהכל מוכן:\n✅ כרטיס אושר\n📱 QR נשלח ב-SMS\n🚗 ${eventProfile.parking}\n👔 ${eventProfile.dress_code}\n\nנתראה השבת ב-${eventProfile.time}! 🔥`,
      `יש! אירוע נוסף בהצלחה! 🎊\n\n${customerProfile.name}, קיבלת הכל ב-SMS:\n🎫 QR לכניסה מהירה\n📍 נווט ל${eventProfile.venue}\n🎵 התחלה ב-${eventProfile.time}\n\nאם יש שאלות אני כאן! תהנה! 💫`
    ]
  };

  // פונקציה ליצירת תגובת לקוח (גם עם fallback)
  const generateCustomerResponse = async (aiMessage, stage) => {
    const customerFallbacks = {
      opening: [
        "היי Alex! כן, שמעתי על האירוע. ספר לי יותר פרטים!",
        "שלום! מעניין, מה המיוחד באירוע הזה?",
        "היי! בטח, אני אוהב מוזיקה אלקטרונית. מה יש?",
        "שלום Alex! נשמע מעניין, תספר לי עוד"
      ],
      needs_discovery: [
        "אני בעיקר מעוניין במוזיקה טובה ואווירה מדהימה!",
        "אני בא עם 2-3 חברים, מה יש בשבילנו?",
        "VIP area נשמע מעניין! מה זה כולל?",
        "אני מחפש משהו מיוחד, לא סתם אירוע רגיל"
      ],
      value_proposition: [
        "וואו, זה נשמע מדהים! כמה זה עולה?",
        "DJ Ben Nicky?! זה מטורף! איך אני מזמין?",
        "90 שקל זה הוגן, אבל אני צריך לחשוב על זה...",
        "נשמע מעולה! יש עוד פרטים שכדאי שאדע?"
      ],
      objection_handling: [
        "אתה צודק, זה באמת כדאי! בואו נעשה את זה",
        "אוקיי, שכנעת אותי. איך ממשיכים?",
        "טוב, אני מוכן לקחת את הסיכון. איפה הלינק?",
        "בסדר, אני סומך עליך. בואו נסגור"
      ],
      closing: [
        "מעולה! אני לוחץ על הלינק עכשיו",
        "יופי! שילמתי. מתי אקבל אישור?",
        "תודה Alex! מצפה לאירוע!",
        "בוצע! תודה על הסבלנות והעזרה"
      ],
      follow_up: [
        "תודה רבה Alex! נתראה באירוע! 🎉",
        "מעולה! מחכה לאירוע המטורף הזה!",
        "יש! תודה על השירות המעולה! 🙏",
        "אחלה! אני כבר מתרגש לשבת! 🔥"
      ]
    };

    // ניסיון להשתמש ב-AI
    try {
      const customerPrompt = `
אתה ${customerProfile.name}, ${customerProfile.personality} בן ${customerProfile.age}.
אתה ${customerProfile.mood} לגבי האירוע ויש לך ${customerProfile.spending_power} כוח קנייה.
תחומי העניין שלך: ${customerProfile.interests.join(', ')}.
${customerProfile.past_experience}.

Alex היחצן זה עתה שלח לך את ההודעה הזו:
"${aiMessage}"

השלב הנוכחי בשיחה: ${stage}

הנחיות התגובה:
- תגיב בעברית בטון טבעי וחברותי
- הביע עניין אמיתי אבל גם שאל שאלות הגיוניות
- אם זה נוגע למחיר - תהסס קצת או תשאל הבהרות
- אם מציגים לך ערך - תראה התלהבות מבוקרת
- אם זה לינק רכישה - תגיב בהתאם למידת השכנוע שלך
- תן תגובה קצרה של 1-2 שורות מקסימום
- אל תהיה נלהב מדי, תשמור על ריאליזם

כתב רק את התגובה עצמה, בלי הסברים נוספים.`;

      const { InvokeLLM } = await import('@/api/integrations');
      const response = await InvokeLLM({
        prompt: customerPrompt
      });
      return response.trim();
    } catch (error) {
      console.error('Error generating customer response:', error);
      // שימוש בתגובות גיבוי
      const responses = customerFallbacks[stage] || customerFallbacks.opening;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (reminderTimer.current) {
        clearTimeout(reminderTimer.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startLiveSimulation = async () => {
    setIsRunning(true);
    setMessages([{
      id: Date.now(),
      type: 'system',
      content: `🎬 סימולציה חיה עם AI דינמי החלה - ${customerProfile.name} מתחיל שיחה עם Alex AI`,
      timestamp: new Date()
    }]);
    setCurrentStage('opening');
    setConversationHistory([]);
    setStats({ messagesExchanged: 0, aiResponses: 0, customerResponses: 0, linksClicked: 0, stage: 'opening' });

    // Alex מתחיל שיחה אחרי 2-4 שניות (כמו במציאות)
    const initialDelay = Math.random() * 2000 + 2000;
    setTimeout(() => {
      generateAIMessage('opening', '');
    }, initialDelay);

    // Initial conversation state update
    if (conversationState) {
        await updateStage('opening', {
            engagement_level: 50, // Starting engagement
            initial_contact_time: new Date().toISOString()
        });
        await updateAIInsights({
            conversion_probability: 30, // Initial probability
            sentiment_trend: 'neutral',
            next_best_action: getNextBestAction('opening')
        });
    }

    await trackActivity({
        activity_type: 'simulation_started',
        component: 'conversations',
        data: {
            customer_name: customerProfile.name,
            event_name: eventProfile.name
        },
        related_entities: {
            conversation_id: conversationId,
            promoter_id: selectedPromoterId
        }
    });
  };

  const generateAIMessage = async (stage, customerResponse = '') => {
    const startTime = Date.now();
    
    // רישום תחילת פעולה
    await trackActivity({
      activity_type: 'message_sent',
      component: 'conversations',
      data: {
        stage: stage,
        customer_response_length: customerResponse.length,
        conversation_length: conversationHistory.length
      },
      related_entities: {
        conversation_id: conversationId,
        promoter_id: selectedPromoterId
      }
    });

    setIsGeneratingAI(true);
    setWaitingForResponse(false);

    // הצגת אינדיקטור הקלדה
    setIsTypingIndicator(true);

    try {
      // דיליי לפני יצירת התגובה
      await new Promise(resolve => setTimeout(resolve, 1500));

      let aiResponse = '';

      // ניסיון להשתמש ב-AI
      try {
        const aiPrompt = getAIPromptForStage(stage, customerResponse, conversationHistory);
        const { InvokeLLM } = await import('@/api/integrations'); // Dynamic import
        const response = await InvokeLLM({
          prompt: aiPrompt
        });
        aiResponse = response.trim();
      } catch (error) {
        console.error('AI API Error:', error);
        aiResponse = getRandomFallbackResponse(stage);

        // רישום שגיאה
        await trackActivity({
            activity_type: 'ai_message_generation_failed',
            component: 'conversations',
            result: 'error',
            error_message: error.message,
            response_time_ms: Date.now() - startTime,
            related_entities: {
                conversation_id: conversationId,
                promoter_id: selectedPromoterId
            }
        });
      }

      // דיליי הקלדה
      const typingTime = Math.min(aiResponse.length * 40, 3000);
      await new Promise(resolve => setTimeout(resolve, typingTime));

      setIsTypingIndicator(false);

      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        sender: 'Alex AI',
        content: aiResponse,
        timestamp: new Date(),
        hasLink: aiResponse.includes('http') || stage === 'closing',
        stage: stage
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(prev => [...prev, aiMessage]);
      setWaitingForResponse(true);
      setStats(prev => ({
        ...prev,
        aiResponses: prev.aiResponses + 1,
        messagesExchanged: prev.messagesExchanged + 1,
        stage: stage
      }));

      // עדכון מצב השיחה
      if (conversationState) {
        await updateStage(stage, {
          engagement_level: Math.min(100, (conversationState.conversation_context?.engagement_level || 50) + 10)
        });

        // עדכון תובנות AI
        await updateAIInsights({
          conversion_probability: Math.min(100, (conversationState.ai_insights?.conversion_probability || 30) + (stage === 'closing' ? 20 : 5)),
          sentiment_trend: 'positive',
          next_best_action: getNextBestAction(stage)
        });
      }

      // רישום הצלחה
      await trackActivity({
        activity_type: 'message_sent',
        component: 'conversations',
        result: 'success',
        response_time_ms: Date.now() - startTime,
        data: {
          message_length: aiResponse.length,
          stage: stage
        },
        related_entities: {
          conversation_id: conversationId,
          promoter_id: selectedPromoterId
        }
      });


      // תגובת לקוח אוטומטית
      if (autoMode && stage !== 'completed') {
        const customerWaitTime = Math.random() * 5000 + 6000; // 6-11 שניות

        setTimeout(() => {
          generateAndSendCustomerResponse(aiResponse, stage);
        }, customerWaitTime);
      }

    } catch (error) {
      console.error('Error in generateAIMessage:', error);
      setIsTypingIndicator(false);

      // הודעת חירום
      setTimeout(() => {
        const fallbackMessage = {
          id: Date.now(),
          type: 'ai',
          sender: 'Alex AI',
          content: getRandomFallbackResponse(stage),
          timestamp: new Date(),
          hasLink: false,
          stage: stage
        };
        setMessages(prev => [...prev, fallbackMessage]);
        setConversationHistory(prev => [...prev, fallbackMessage]);
        setWaitingForResponse(true);
      }, 1000);

      // רישום שגיאה כוללת
      await trackActivity({
        activity_type: 'ai_message_processing_failed',
        component: 'conversations',
        result: 'error',
        error_message: error.message,
        response_time_ms: Date.now() - startTime,
        related_entities: {
          conversation_id: conversationId,
          promoter_id: selectedPromoterId
        }
      });

    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateAndSendCustomerResponse = async (aiMessage, currentStage) => {
    try {
      // הצגת אינדיקטור שהלקוח מקליד
      const typingMessage = {
        id: `typing-${Date.now()}`,
        type: 'typing',
        sender: customerProfile.name,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, typingMessage]);

      // זמן חשיבה + הקלדה של הלקוח (3-8 שניות)
      const thinkingTime = Math.random() * 5000 + 3000;
      await new Promise(resolve => setTimeout(resolve, thinkingTime));

      // הסרת אינדיקטור ההקלדה
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));

      const customerResponse = await generateCustomerResponse(aiMessage, currentStage);

      const customerMessage = {
        id: Date.now(),
        type: 'customer',
        sender: customerProfile.name,
        content: customerResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, customerMessage]);
      setConversationHistory(prev => [...prev, customerMessage]);
      setWaitingForResponse(false);
      setStats(prev => ({
        ...prev,
        customerResponses: prev.customerResponses + 1,
        messagesExchanged: prev.messagesExchanged + 1
      }));

      await trackActivity({
        activity_type: 'customer_response_received',
        component: 'conversations',
        data: {
          stage: currentStage,
          response_length: customerResponse.length
        },
        related_entities: {
          conversation_id: conversationId,
          promoter_id: selectedPromoterId
        }
      });

      // Alex מגיב אחרי 3-6 שניות (זמן קריאה ותגובה)
      const alexResponseTime = Math.random() * 3000 + 3000;
      setTimeout(() => {
        proceedToNextStage(customerResponse, currentStage);
      }, alexResponseTime);

    } catch (error) {
      console.error('Error generating customer response:', error);
      await trackActivity({
        activity_type: 'customer_response_generation_failed',
        component: 'conversations',
        result: 'error',
        error_message: error.message,
        related_entities: {
          conversation_id: conversationId,
          promoter_id: selectedPromoterId
        }
      });
    }
  };

  const proceedToNextStage = async (customerResponse, currentStage) => {
    let nextStage = currentStage;

    // לוגיקת מעבר בין שלבים
    switch (currentStage) {
      case 'opening':
        nextStage = 'needs_discovery';
        break;
      case 'needs_discovery':
        nextStage = 'value_proposition';
        break;
      case 'value_proposition':
        // בדיקה אם יש התנגדות
        if (customerResponse.includes('יקר') || customerResponse.includes('כמה') ||
            customerResponse.includes('ספק') || customerResponse.includes('לא בטוח')) {
          nextStage = 'objection_handling';
        } else {
          nextStage = 'closing';
        }
        break;
      case 'objection_handling':
        nextStage = 'closing';
        break;
      case 'closing':
        if (customerResponse.includes('כן') || customerResponse.includes('בואו') ||
            customerResponse.includes('לחצתי') || customerResponse.includes('אוקיי')) {
          nextStage = 'follow_up';
        } else {
          nextStage = 'objection_handling'; // חזרה לטיפול בהתנגדויות
        }
        break;
      case 'follow_up':
        nextStage = 'completed';
        break;
    }

    setCurrentStage(nextStage);

    if (nextStage === 'completed') {
      setTimeout(() => {
        const completionMessage = {
          id: Date.now(),
          type: 'system',
          content: '🎊 הסימולציה הושלמה בהצלחה! הלקוח עבר את כל שלבי המכירה עם AI דינמי.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, completionMessage]);
        setWaitingForResponse(false);
      }, 2000);

      // Record completion in conversation state
      if (conversationState) {
          await updateStage('completed', {
              completion_time: new Date().toISOString()
          });
      }
    } else {
      generateAIMessage(nextStage, customerResponse);
    }
  };

  const handleManualResponse = async () => {
    if (!manualResponse.trim()) return;

    const customerMessage = {
      id: Date.now(),
      type: 'customer',
      sender: customerProfile.name + ' (ידני)',
      content: manualResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, customerMessage]);
    setConversationHistory(prev => [...prev, customerMessage]);
    setWaitingForResponse(false);
    setStats(prev => ({
      ...prev,
      customerResponses: prev.customerResponses + 1,
      messagesExchanged: prev.messagesExchanged + 1
    }));

    const response = manualResponse;
    setManualResponse('');
    setShowManualInput(false);

    await trackActivity({
      activity_type: 'manual_customer_response_sent',
      component: 'conversations',
      data: {
        stage: currentStage,
        response_length: response.length
      },
      related_entities: {
        conversation_id: conversationId,
        promoter_id: selectedPromoterId
      }
    });

    // Alex מגיב אחרי 2-5 שניות לתגובה ידנית
    const manualResponseTime = Math.random() * 3000 + 2000;
    setTimeout(() => {
      proceedToNextStage(response, currentStage);
    }, manualResponseTime);
  };

  const handleConversionComplete = async (conversionData) => {
    // רישום המרה במצב השיחה
    if (conversationState) {
      await recordConversion({
        value: conversionData.value || eventProfile.discounted_price,
        type: 'ticket_sale',
        details: conversionData
      });
      // Update stage to completed if conversion successful
      await updateStage('completed', {
          conversion_successful: true,
          conversion_time: new Date().toISOString()
      });
    }

    // רישום המרה בפעילות כללית
    await trackConversion({
      data: {
        ticket_price: conversionData.value || eventProfile.discounted_price,
        event_name: eventProfile.name,
        conversion_stage: 'closing'
      },
      related_entities: {
        conversation_id: conversationId,
        promoter_id: selectedPromoterId
      },
      revenue: conversionData.value || eventProfile.discounted_price,
      value: conversionData.value || eventProfile.discounted_price
    }, 'conversations');

    onSimulationComplete(conversionData);
  };


  const handleLinkClick = () => {
    setStats(prev => ({ ...prev, linksClicked: prev.linksClicked + 1 }));

    // Simulate successful purchase after a delay
    setTimeout(() => {
      const successMessage = {
        id: Date.now(),
        type: 'system',
        content: '✅ מעולה! הלקוח השלים רכישה בהצלחה - כרטיס נרכש!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
      handleConversionComplete({ value: eventProfile.discounted_price, event: eventProfile.name });
    }, 3000);

    trackActivity({
        activity_type: 'link_clicked',
        component: 'conversations',
        data: {
            link_type: 'ticket_purchase',
            stage: currentStage
        },
        related_entities: {
            conversation_id: conversationId,
            promoter_id: selectedPromoterId
        }
    });
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setMessages([]);
    setCurrentMessage('');
    setCurrentStage('opening');
    setWaitingForResponse(false);
    setShowManualInput(false);
    setManualResponse('');
    setConversationHistory([]);
    setIsGeneratingAI(false);
    setIsTypingIndicator(false); // Reset typing indicator
    setStats({ messagesExchanged: 0, aiResponses: 0, customerResponses: 0, linksClicked: 0, stage: 'opening' });

    if (reminderTimer.current) {
      clearTimeout(reminderTimer.current);
    }

    trackActivity({
        activity_type: 'simulation_reset',
        component: 'conversations',
        related_entities: {
            conversation_id: conversationId,
            promoter_id: selectedPromoterId
        }
    });
  };

  if (!isVisible) return null;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'}`}>
      <div className={`grid gap-6 h-full ${isFullscreen ? 'max-w-7xl mx-auto p-6' : 'lg:grid-cols-3'}`}>
        {/* Control Panel */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI דינמי - בקרת סימולציה
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* AI Status */}
            {isGeneratingAI && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span className="text-purple-700 font-medium">Alex חושב על תגובה...</span>
                </div>
              </div>
            )}

            {isTypingIndicator && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-blue-700 font-medium">Alex מקליד...</span>
                </div>
              </div>
            )}

            {/* Customer Profile */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">פרופיל הלקוח:</h4>
              <div className="text-sm space-y-1">
                <div><strong>שם:</strong> {customerProfile.name}</div>
                <div><strong>גיל:</strong> {customerProfile.age}</div>
                <div><strong>אישיות:</strong> {customerProfile.personality}</div>
                <div><strong>מצב רוח:</strong> {customerProfile.mood}</div>
                <div><strong>תחומי עניין:</strong> {customerProfile.interests.join(', ')}</div>
              </div>
            </div>

            {/* Event Profile */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">פרופיל האירוע (AI לומד מזה):</h4>
              <div className="text-sm space-y-1">
                <div><strong>שם:</strong> {eventProfile.name}</div>
                <div><strong>מקום:</strong> {eventProfile.venue}</div>
                <div><strong>תאריך:</strong> {eventProfile.date}</div>
                <div><strong>DJ:</strong> {eventProfile.dj}</div>
                <div><strong>מחיר:</strong> {eventProfile.price}₪ → {eventProfile.discounted_price}₪</div>
                <div><strong>נותרו:</strong> {eventProfile.remaining_tickets} כרטיסים</div>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">מצב סימולציה:</h4>
              <div className="flex gap-2">
                <Button
                  variant={autoMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoMode(true)}
                  className="flex-1"
                >
                  אוטומטי עם AI
                </Button>
                <Button
                  variant={!autoMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoMode(false)}
                  className="flex-1"
                >
                  ידני
                </Button>
              </div>
            </div>

            {/* Speed Controls */}
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">מהירות השיחה:</h4>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">זמן תגובת Alex (שניות):</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={typingDelay / 1000}
                  onChange={(e) => setTypingDelay(e.target.value * 1000)}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">{typingDelay / 1000} שניות</div>

                <label className="text-sm text-gray-600">זמן תגובת לקוח (שניות):</label>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={responseDelay / 1000}
                  onChange={(e) => setResponseDelay(e.target.value * 1000)}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">{responseDelay / 1000} שניות</div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-2">
              {!isRunning ? (
                <Button
                  onClick={startLiveSimulation}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  הרץ סימולציה עם AI דינמי
                </Button>
              ) : (
                <Button onClick={resetSimulation} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  איפוס סימולציה
                </Button>
              )}

              {isRunning && waitingForResponse && !autoMode && (
                <Button
                  onClick={() => setShowManualInput(true)}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Hand className="w-4 h-4 mr-2" />
                  השב בשם הלקוח
                </Button>
              )}
            </div>

            {/* Current Stage */}
            {isRunning && (
              <div className="bg-white p-4 rounded-xl border-2 border-emerald-200">
                <h4 className="font-semibold text-emerald-700 mb-2">שלב נוכחי:</h4>
                <Badge className="bg-emerald-100 text-emerald-800">
                  {currentStage === 'opening' ? 'פתיחה' :
                   currentStage === 'needs_discovery' ? 'בירור צרכים' :
                   currentStage === 'value_proposition' ? 'הצעת ערך' :
                   currentStage === 'objection_handling' ? 'טיפול בהתנגדויות' :
                   currentStage === 'closing' ? 'סגירת עסקה' :
                   currentStage === 'follow_up' ? 'מעקב' : currentStage}
                </Badge>
                {waitingForResponse && !isGeneratingAI && !isTypingIndicator && (
                  <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {autoMode ? 'ממתין לתגובת לקוח...' : 'ממתין לתגובה ידנית...'}
                  </p>
                )}
              </div>
            )}

            {/* Stats */}
            {isRunning && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  סטטיסטיקות AI:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>הודעות AI:</span>
                    <span className="font-bold">{stats.aiResponses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>תגובות לקוח:</span>
                    <span className="font-bold">{stats.customerResponses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>לחיצות לינק:</span>
                    <span className="font-bold">{stats.linksClicked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>סה"כ הודעות:</span>
                    <span className="font-bold">{stats.messagesExchanged}</span>
                  </div>
                </div>
              </div>
            )}

            {/* הוספת מידע על מצב השיחה */}
            {conversationState && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Conversation Insights</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current Stage:</span>
                    <Badge className="ml-2">{conversationState.current_stage}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Conversion Probability:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      {conversationState.ai_insights?.conversion_probability || 0}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Engagement Level:</span>
                    <span className="ml-2 font-semibold text-blue-600">
                      {conversationState.conversation_context?.engagement_level || 0}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="outline" className="ml-2">{conversationState.status}</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className={`${isFullscreen ? 'col-span-2' : 'lg:col-span-2'} flex flex-col`}>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  {customerProfile.name} ←→ Alex AI (דינמי)
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isRunning && (
                    <Badge className="bg-green-100 text-green-700 animate-pulse">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      שיחה חיה עם AI
                    </Badge>
                  )}
                  {isGeneratingAI && (
                    <Badge className="bg-purple-100 text-purple-700">
                      <Brain className="w-3 h-3 mr-1 animate-pulse" />
                      AI חושב...
                    </Badge>
                  )}
                  {waitingForResponse && !isGeneratingAI && (
                    <Badge className="bg-orange-100 text-orange-700">
                      <Clock className="w-3 h-3 mr-1" />
                      ממתין לתגובה
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className={`flex-1 px-6 ${isFullscreen ? 'h-[calc(100vh-300px)]' : 'h-[500px]'}`}>
                <div className="space-y-4 py-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium">מוכן לסימולציה חיה עם AI דינמי</p>
                      <p className="text-gray-400 text-sm">AI ילמד על האירוע ויצור שיחה ייחודית ומותאמת אישית</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      // אינדיקטור הקלדה
                      if (message.type === 'typing') {
                        return (
                          <div key={message.id} className="flex justify-end">
                            <div className="max-w-[75%] order-2">
                              <div className="flex items-end gap-3 mb-2">
                                <div className="px-4 py-3 rounded-2xl shadow-lg bg-gray-100 border border-gray-200">
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="text-xs text-gray-500">מקליד...</span>
                                  </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                                  <UserIcon className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={message.id} className={`flex ${
                          message.type === 'customer' ? 'justify-end' :
                          message.type === 'system' ? 'justify-center' : 'justify-start'
                        }`}>
                          {message.type === 'system' ? (
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-700 px-6 py-3 rounded-full text-sm font-medium border border-indigo-200">
                              {message.content}
                            </div>
                          ) : (
                            <div className={`max-w-[75%] ${message.type === 'customer' ? 'order-2' : 'order-1'}`}>
                              <div className="flex items-end gap-3 mb-2">
                                {message.type === 'ai' && (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <Brain className="w-5 h-5 text-white" />
                                  </div>
                                )}

                                <div className={`px-4 py-3 rounded-2xl shadow-lg ${
                                  message.type === 'customer'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}>
                                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

                                  {/* Interactive Link */}
                                  {message.hasLink && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                        onClick={handleLinkClick}
                                      >
                                        <LinkIcon className="w-4 h-4 mr-2" />
                                        🎟️ לחץ להזמנה
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {message.type === 'customer' && (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                                    <UserIcon className="w-5 h-5 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* Message Metadata */}
                              <div className={`flex items-center gap-2 text-xs text-gray-500 ${
                                message.type === 'customer' ? 'justify-end pr-13' : 'justify-start pl-13'
                              }`}>
                                <Clock className="w-3 h-3" />
                                <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
                                {message.sender && (
                                  <span className="font-medium">• {message.sender}</span>
                                )}
                                {message.type === 'ai' && (
                                  <span className="text-purple-500">• AI Generated</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Manual Response Input */}
              {showManualInput && (
                <div className="border-t bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={manualResponse}
                      onChange={(e) => setManualResponse(e.target.value)}
                      placeholder={`השב בתור ${customerProfile.name}...`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleManualResponse();
                        }
                      }}
                      className="flex-1 border-blue-200 focus:border-blue-400"
                    />
                    <Button
                      onClick={handleManualResponse}
                      disabled={!manualResponse.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowManualInput(false)}
                    >
                      ביטול
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    תגובה ידנית - AI ינתח ויגיב בהתאם לתשובה שלך
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
