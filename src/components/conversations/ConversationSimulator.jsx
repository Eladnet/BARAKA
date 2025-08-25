import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  Square, 
  Send, 
  Bot, 
  User as UserIcon,
  Phone,
  MessageSquare,
  Settings,
  Zap,
  Clock,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  RefreshCw,
  Volume2,
  Mic
} from "lucide-react";
import { InvokeLLM } from "@/api/integrations";

export default function ConversationSimulator({ promoters = [], onSimulationComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedPromoter, setSelectedPromoter] = useState(null);
  const [simulationMode, setSimulationMode] = useState('manual'); // manual, auto, realistic
  const [customerProfile, setCustomerProfile] = useState({
    name: 'לקוח סימולציה',
    age: 25,
    interests: ['מוזיקה', 'מסיבות', 'חיי לילה'],
    personality: 'friendly',
    spendingLevel: 'medium'
  });
  const [autoSpeed, setAutoSpeed] = useState(3000); // milliseconds
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startSimulation = () => {
    setIsActive(true);
    setMessages([{
      id: Date.now(),
      type: 'system',
      content: `🎬 תחילת סימולציה עם ${selectedPromoter?.name || 'AI Promoter'}`,
      timestamp: new Date(),
      metadata: { simulation: true }
    }]);

    // Send initial greeting from AI
    setTimeout(() => {
      sendAIMessage("היי! איך הולך? יש לי הצעה מדהימה בשבילך לאירוע השבוע 🔥");
    }, 1000);
  };

  const stopSimulation = () => {
    setIsActive(false);
    if (onSimulationComplete) {
      onSimulationComplete({
        messages,
        promoter: selectedPromoter,
        duration: messages.length > 0 ? new Date() - new Date(messages[0].timestamp) : 0,
        interactions: messages.length
      });
    }
  };

  const pauseSimulation = () => {
    setIsActive(!isActive);
  };

  const resetSimulation = () => {
    setMessages([]);
    setIsActive(false);
    setIsTyping(false);
  };

  const sendCustomerMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'customer',
      sender: customerProfile.name,
      content: currentMessage,
      timestamp: new Date(),
      sentiment: analyzeSentiment(currentMessage)
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Auto-generate AI response after delay
    if (isActive && selectedPromoter) {
      setIsTyping(true);
      setTimeout(() => {
        generateAIResponse(currentMessage);
      }, Math.random() * 2000 + 1000); // 1-3 seconds delay
    }
  };

  const sendAIMessage = (content, metadata = {}) => {
    const aiMessage = {
      id: Date.now(),
      type: 'ai',
      sender: selectedPromoter?.name || 'AI Promoter',
      content,
      timestamp: new Date(),
      metadata: {
        promoter_id: selectedPromoter?.id,
        persona: selectedPromoter?.persona,
        ...metadata
      }
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const generateAIResponse = async (customerMessage) => {
    try {
      const prompt = `
        אתה ${selectedPromoter?.name || 'יחצן AI'} עם אישיות ${selectedPromoter?.persona || 'ידידותית'}.
        
        פרופיל הלקוח:
        - שם: ${customerProfile.name}
        - גיל: ${customerProfile.age}
        - תחומי עניין: ${customerProfile.interests.join(', ')}
        - אישיות: ${customerProfile.personality}
        - רמת הוצאה: ${customerProfile.spendingLevel}
        
        הלקוח אמר: "${customerMessage}"
        
        היסטוריית השיחה:
        ${messages.slice(-5).map(m => `${m.type === 'customer' ? 'לקוח' : 'AI'}: ${m.content}`).join('\n')}
        
        תן תגובה טבעית, מעניינת ומותאמת אישית שתעודד את הלקוח להגיע לאירוע.
        השתמש באמוג'י בצורה טבעית ושמור על טון ${selectedPromoter?.persona || 'ידידותי'}.
        התגובה צריכה להיות קצרה (1-2 משפטים).
      `;

      const response = await InvokeLLM({ prompt });
      sendAIMessage(response, {
        generated: true,
        customer_message: customerMessage,
        response_time: Math.random() * 3 + 1 // 1-4 seconds
      });

    } catch (error) {
      console.error('Error generating AI response:', error);
      sendAIMessage("סורי, יש לי בעיה טכנית קטנה 😅 אבל בואו נמשיך - יש לי הצעות מעולות בשבילך!");
    }
  };

  const analyzeSentiment = (message) => {
    const positiveWords = ['כן', 'מעולה', 'נשמע טוב', 'בטח', 'אהבתי', 'מגניב', 'וואו'];
    const negativeWords = ['לא', 'לא מעוניין', 'יקר', 'לא יכול', 'אין לי', 'לא רוצה'];
    
    const lowerMessage = message.toLowerCase();
    
    if (positiveWords.some(word => lowerMessage.includes(word))) return 'positive';
    if (negativeWords.some(word => lowerMessage.includes(word))) return 'negative';
    return 'neutral';
  };

  const generateRealisticScenario = () => {
    const scenarios = [
      {
        description: "לקוח מעוניין אבל מהסס בגלל המחיר",
        messages: [
          "נשמע מעניין, אבל כמה זה עולה?",
          "זה יקר לי קצת...",
          "יש הנחה?"
        ]
      },
      {
        description: "לקוח מתלהב ורוצה לבוא עם חברים",
        messages: [
          "וואו נשמע מדהים! 🔥",
          "אני יכול לבוא עם חברים?",
          "כמה כרטיסים אפשר לקנות?"
        ]
      },
      {
        description: "לקוח לא בטוח ושואל שאלות",
        messages: [
          "מה בדיוק יהיה באירוע?",
          "איך מגיעים לשם?",
          "עד איזה שעה זה נמשך?"
        ]
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Auto-send scenario messages
    scenario.messages.forEach((msg, index) => {
      setTimeout(() => {
        const message = {
          id: Date.now() + index,
          type: 'customer',
          sender: customerProfile.name,
          content: msg,
          timestamp: new Date(),
          sentiment: analyzeSentiment(msg),
          scenario: scenario.description
        };
        
        setMessages(prev => [...prev, message]);
        
        // Generate AI response after each customer message
        setTimeout(() => {
          generateAIResponse(msg);
        }, 1500);
        
      }, index * 4000); // 4 seconds between messages
    });
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-3 h-3" />;
      case 'negative': return <ThumbsDown className="w-3 h-3" />;
      default: return <MessageSquare className="w-3 h-3" />;
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Control Panel */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            סימולטור שיחות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Promoter Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">בחר יחצן AI:</label>
            <Select value={selectedPromoter?.id} onValueChange={(value) => 
              setSelectedPromoter(promoters.find(p => p.id === value))
            }>
              <SelectTrigger>
                <SelectValue placeholder="בחר יחצן..." />
              </SelectTrigger>
              <SelectContent>
                {promoters.map(promoter => (
                  <SelectItem key={promoter.id} value={promoter.id}>
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      {promoter.name} ({promoter.persona})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Profile */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">פרופיל לקוח:</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="שם"
                value={customerProfile.name}
                onChange={(e) => setCustomerProfile({...customerProfile, name: e.target.value})}
              />
              <Input
                type="number"
                placeholder="גיל"
                value={customerProfile.age}
                onChange={(e) => setCustomerProfile({...customerProfile, age: parseInt(e.target.value)})}
              />
            </div>
            <Input
              placeholder="תחומי עניין (מופרדים בפסיק)"
              value={customerProfile.interests.join(', ')}
              onChange={(e) => setCustomerProfile({
                ...customerProfile, 
                interests: e.target.value.split(',').map(s => s.trim())
              })}
            />
          </div>

          {/* Simulation Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">מצב סימולציה:</label>
            <Select value={simulationMode} onValueChange={setSimulationMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">ידני - אני כותב הודעות</SelectItem>
                <SelectItem value="realistic">ריאליסטי - תרחישים אוטומטיים</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            {!isActive ? (
              <Button 
                onClick={startSimulation} 
                disabled={!selectedPromoter}
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                התחל
              </Button>
            ) : (
              <Button onClick={pauseSimulation} className="bg-yellow-600 hover:bg-yellow-700 flex-1">
                <Pause className="w-4 h-4 mr-2" />
                {isActive ? 'השהה' : 'המשך'}
              </Button>
            )}
            
            <Button onClick={stopSimulation} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              עצור
            </Button>
            
            <Button onClick={resetSimulation} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              איפוס
            </Button>
          </div>

          {/* Realistic Scenario Button */}
          {simulationMode === 'realistic' && (
            <Button 
              onClick={generateRealisticScenario}
              disabled={!isActive}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              צור תרחיש ריאליסטי
            </Button>
          )}

          {/* Stats */}
          {messages.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>סה״כ הודעות:</span>
                  <span className="font-bold">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>הודעות לקוח:</span>
                  <span className="font-bold">{messages.filter(m => m.type === 'customer').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>הודעות AI:</span>
                  <span className="font-bold">{messages.filter(m => m.type === 'ai').length}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="bg-white border-0 shadow-lg flex-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                שיחה עם {selectedPromoter?.name || 'יחצן AI'}
              </CardTitle>
              <div className="flex items-center gap-2">
                {isActive && (
                  <Badge className="bg-green-100 text-green-700 animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    פעיל
                  </Badge>
                )}
                {selectedPromoter && (
                  <Badge variant="outline">
                    {selectedPromoter.persona}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">בחר יחצן והתחל סימולציה כדי לראות שיחה</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`flex ${
                      message.type === 'customer' ? 'justify-end' : 
                      message.type === 'system' ? 'justify-center' : 'justify-start'
                    }`}>
                      {message.type === 'system' ? (
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
                          {message.content}
                        </div>
                      ) : (
                        <div className={`max-w-[70%] ${
                          message.type === 'customer' ? 'order-2' : 'order-1'
                        }`}>
                          <div className="flex items-end gap-2 mb-1">
                            {message.type === 'ai' && (
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-purple-600" />
                              </div>
                            )}
                            
                            <div className={`px-4 py-2 rounded-lg ${
                              message.type === 'customer'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                            
                            {message.type === 'customer' && (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center gap-2 text-xs text-gray-500 ${
                            message.type === 'customer' ? 'justify-end pr-10' : 'justify-start pl-10'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
                            
                            {message.sentiment && (
                              <div className={`flex items-center gap-1 ${getSentimentColor(message.sentiment)}`}>
                                {getSentimentIcon(message.sentiment)}
                              </div>
                            )}
                            
                            {message.scenario && (
                              <Badge variant="outline" className="text-xs">
                                {message.scenario}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            {simulationMode === 'manual' && isActive && (
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder={`כתוב הודעה בתור ${customerProfile.name}...`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendCustomerMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendCustomerMessage}
                    disabled={!currentMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}