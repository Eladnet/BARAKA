import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Bot, 
  Zap, 
  Clock, 
  Users, 
  Heart,
  Globe,
  Sparkles,
  Play,
  Pause
} from "lucide-react";
import { format } from "date-fns";

// Mock live conversation data
const mockConversations = [
  {
    id: 1,
    customerName: "דני כהן",
    phone: "+972501234567",
    promoterName: "LiorAI",
    status: "engaging",
    lastMessage: "היי דני! יש לי הצעה מיוחדת בשבילך לערב הזה 🎉",
    customerReply: "נשמע מעניין, איפה זה?",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    language: "he",
    mood: "interested"
  },
  {
    id: 2,
    customerName: "Sarah Miller",
    phone: "+1555987654",
    promoterName: "MiamiBot",
    status: "follow_up", 
    lastMessage: "🌴 Sarah, the rooftop party tonight is going to be INSANE! Free drinks until 11pm",
    customerReply: null,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    language: "en",
    mood: "pending"
  },
  {
    id: 3,
    customerName: "Carlos Rodriguez", 
    phone: "+34612345678",
    promoterName: "IbizaVibe",
    status: "converting",
    lastMessage: "Perfect! I saved you a VIP table. Click here to confirm: [LINK]",
    customerReply: "Amazing! Just clicked - see you tonight! 🔥",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    language: "en",
    mood: "excited"
  }
];

const getStatusColor = (status) => {
  const colors = {
    engaging: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    follow_up: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    converting: "bg-green-500/20 text-green-300 border-green-500/30",
    cold: "bg-slate-500/20 text-slate-300 border-slate-500/30"
  };
  return colors[status] || colors.cold;
};

const getMoodIcon = (mood) => {
  const icons = {
    interested: Heart,
    excited: Sparkles,
    pending: Clock
  };
  return icons[mood] || Clock;
};

export default function AIEngagementPanel() {
  const [conversations, setConversations] = useState(mockConversations);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setConversations(prev => {
        const updated = [...prev];
        // Randomly update a conversation
        const randomIndex = Math.floor(Math.random() * updated.length);
        updated[randomIndex] = {
          ...updated[randomIndex],
          timestamp: new Date()
        };
        return updated;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 glow-effect">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">AI WhatsApp Engine</CardTitle>
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={isLive ? "text-emerald-400" : "text-slate-400"}
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <MessageCircle className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-400">247</div>
            <div className="text-xs text-slate-400">Active Chats</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-yellow-400">87%</div>
            <div className="text-xs text-slate-400">Response Rate</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-emerald-400">31</div>
            <div className="text-xs text-slate-400">Converting Now</div>
          </div>
        </div>

        {/* Live Conversations */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
            Live Conversations
          </h4>
          
          {conversations.map((conv) => {
            const MoodIcon = getMoodIcon(conv.mood);
            
            return (
              <div 
                key={conv.id}
                className="p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200 hover:bg-slate-800/50 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {conv.customerName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{conv.customerName}</div>
                      <div className="text-xs text-slate-400">{conv.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(conv.status)}>
                      {conv.status.replace('_', ' ')}
                    </Badge>
                    <MoodIcon className="w-4 h-4 text-purple-400" />
                  </div>
                </div>

                {/* AI Message */}
                <div className="mb-2 p-2 rounded-lg bg-purple-500/10 border-l-2 border-purple-500">
                  <div className="flex items-center gap-1 mb-1">
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span className="text-xs font-medium text-purple-300">{conv.promoterName}</span>
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{conv.language.toUpperCase()}</span>
                  </div>
                  <p className="text-sm text-slate-300">{conv.lastMessage}</p>
                </div>

                {/* Customer Reply */}
                {conv.customerReply && (
                  <div className="mb-2 p-2 rounded-lg bg-slate-700/30">
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span className="text-xs font-medium text-blue-300">Customer</span>
                    </div>
                    <p className="text-sm text-slate-300">{conv.customerReply}</p>
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{format(conv.timestamp, 'HH:mm')}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(conv.timestamp, 'MMM d')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Engine Features */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Engine Features
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Multi-language Support
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Personality Matching
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Smart Follow-ups
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Intent Recognition
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}