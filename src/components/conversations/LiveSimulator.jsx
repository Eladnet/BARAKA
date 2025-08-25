import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw,
  MessageCircle,
  Bot,
  Users,
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";
import { Interaction, Lead } from "@/api/entities";
import { format } from "date-fns";

// מאגר הודעות לסימולציה
const SAMPLE_CONVERSATIONS = [
  {
    leadName: "דני כהן",
    phone: "+972501234567",
    platform: "whatsapp",
    messages: [
      { type: "ai", content: "היי דני! מה קורה? יש לי הצעה מטורפת בשבילך לערב הזה 🔥", delay: 1000 },
      { type: "customer", content: "מה יש?", delay: 3000 },
      { type: "ai", content: "אירוע VIP בקולוסיום הערב! כניסה חינם + 2 שתיות על החשבון 🍸", delay: 2000 },
      { type: "customer", content: "נשמע מעניין, איזה שעה?", delay: 4000 },
      { type: "ai", content: "מ-22:00! אני שולח לך קישור לרישום VIP עכשיו 📱", delay: 2000 }
    ]
  },
  {
    leadName: "Sarah Miller", 
    phone: "+1555987654",
    platform: "facebook",
    messages: [
      { type: "ai", content: "🌟 Sarah! The rooftop party tonight is going to be INSANE! Premium cocktails + amazing view", delay: 2000 },
      { type: "customer", content: "Sounds fun! What time?", delay: 3500 },
      { type: "ai", content: "Doors open at 9pm! I can get you on the VIP list - free entry + welcome drinks 🍹", delay: 2500 },
      { type: "customer", content: "Perfect! Count me in 🎉", delay: 2000 }
    ]
  },
  {
    leadName: "קרלוס רודריגז",
    phone: "+34612345678", 
    platform: "instagram",
    messages: [
      { type: "ai", content: "¡Hola Carlos! Tonight's event at Pacha is going to be legendary 🎭", delay: 1500 },
      { type: "customer", content: "Tell me more!", delay: 2500 },
      { type: "ai", content: "VIP table reserved for you + bottle service! The best DJs in town 🎵", delay: 3000 },
      { type: "customer", content: "Amazing! See you there 🔥", delay: 2000 }
    ]
  }
];

export default function LiveSimulator({ onNewInteraction }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStats, setCurrentStats] = useState({
    activeChats: 0,
    messagesPerHour: 0,
    responseRate: 87,
    conversions: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x speed

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        simulateNewMessage();
      }, 5000 / simulationSpeed); // Base interval adjusted by speed
    }
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);

  const simulateNewMessage = () => {
    const conversation = SAMPLE_CONVERSATIONS[Math.floor(Math.random() * SAMPLE_CONVERSATIONS.length)];
    const message = conversation.messages[Math.floor(Math.random() * conversation.messages.length)];
    
    const newMessage = {
      id: Date.now(),
      leadName: conversation.leadName,
      phone: conversation.phone,
      platform: conversation.platform,
      type: message.type,
      content: message.content,
      timestamp: new Date()
    };

    setRecentMessages(prev => [newMessage, ...prev.slice(0, 9)]); // Keep last 10 messages
    
    // Update stats
    setCurrentStats(prev => ({
      ...prev,
      activeChats: Math.min(prev.activeChats + (Math.random() > 0.7 ? 1 : 0), 50),
      messagesPerHour: prev.messagesPerHour + 1,
      conversions: prev.conversions + (Math.random() > 0.85 ? 1 : 0)
    }));

    // Call callback if provided
    if (onNewInteraction) {
      onNewInteraction(newMessage);
    }
  };

  const startSimulation = () => {
    setIsRunning(true);
    setCurrentStats({
      activeChats: 12,
      messagesPerHour: 147,
      responseRate: 87,
      conversions: 31
    });
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStats({
      activeChats: 0,
      messagesPerHour: 0, 
      responseRate: 87,
      conversions: 0
    });
    setRecentMessages([]);
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      whatsapp: '📱',
      facebook: '📘', 
      instagram: '📷'
    };
    return icons[platform] || '💬';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      whatsapp: 'text-green-400',
      facebook: 'text-blue-400',
      instagram: 'text-pink-400'
    };
    return colors[platform] || 'text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            מדמה שיחות בזמן אמת
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                onClick={isRunning ? stopSimulation : startSimulation}
                className={isRunning ? 
                  "bg-red-600 hover:bg-red-700" : 
                  "bg-emerald-600 hover:bg-emerald-700"
                }
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    עצור סימולציה
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    התחל סימולציה
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={resetSimulation}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                איפוס
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 text-sm">מהירות:</span>
                <select 
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={5}>5x</option>
                </select>
              </div>
              
              <Badge variant="outline" className={isRunning ? 
                "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                "bg-slate-500/20 text-slate-300 border-slate-500/30"
              }>
                {isRunning ? 'פעיל' : 'מופסק'}
              </Badge>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <MessageCircle className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-400">{currentStats.activeChats}</div>
              <div className="text-xs text-slate-400">שיחות פעילות</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-yellow-400">{currentStats.messagesPerHour}</div>
              <div className="text-xs text-slate-400">הודעות/שעה</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-400">{currentStats.responseRate}%</div>
              <div className="text-xs text-slate-400">אחוז מענה</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-400">{currentStats.conversions}</div>
              <div className="text-xs text-slate-400">המרות</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Messages Feed */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            פיד הודעות בזמן אמת
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentMessages.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>התחל סימולציה כדי לראות הודעות בזמן אמת</p>
              </div>
            ) : (
              recentMessages.map(message => (
                <div 
                  key={message.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-700/50 hover:border-purple-500/50 transition-all"
                >
                  <div className="text-2xl">{getPlatformIcon(message.platform)}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{message.leadName}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.platform}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {message.type === 'ai' ? (
                          <Bot className="w-3 h-3 text-purple-400" />
                        ) : (
                          <Users className="w-3 h-3 text-blue-400" />
                        )}
                        <span className={`text-xs ${getPlatformColor(message.platform)}`}>
                          {message.type === 'ai' ? 'AI' : 'לקוח'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-1">{message.content}</p>
                    
                    <div className="text-xs text-slate-400">
                      {format(message.timestamp, 'HH:mm:ss')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}