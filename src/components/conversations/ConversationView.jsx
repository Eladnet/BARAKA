import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Bot, 
  User as UserIcon,
  Phone,
  Facebook,
  Instagram,
  MessageSquare,
  Clock,
  CheckCircle2,
  Crown,
  Settings
} from "lucide-react";
import { format } from "date-fns";

const getPlatformIcon = (platform) => {
  const icons = {
    whatsapp: Phone,
    facebook: Facebook,
    instagram: Instagram
  };
  return icons[platform] || MessageSquare;
};

const getPlatformColor = (platform) => {
  const colors = {
    whatsapp: "text-green-600 bg-green-50 border-green-200",
    facebook: "text-blue-600 bg-blue-50 border-blue-200",
    instagram: "text-pink-600 bg-pink-50 border-pink-200"
  };
  return colors[platform] || "text-gray-600 bg-gray-50 border-gray-200";
};

export default function ConversationView({ conversation, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation) return;
    
    if (onSendMessage) {
      onSendMessage({
        content: newMessage,
        leadId: conversation.id,
        isManual: true
      });
    }
    
    setNewMessage('');
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-6">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-500">Choose a conversation from the list to start viewing and managing</p>
        </div>
      </div>
    );
  }

  const PlatformIcon = getPlatformIcon(conversation.platform);
  const platformColor = getPlatformColor(conversation.platform);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {conversation.lead.first_name?.[0]?.toUpperCase() || 'L'}
                </span>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white ${platformColor}`}>
                <PlatformIcon className="w-3 h-3" />
              </div>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {conversation.lead.first_name} {conversation.lead.last_name}
                </h3>
                {conversation.lead.status === 'vip' && (
                  <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                <span className="truncate">{conversation.lead.phone_number}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Bot className="w-3 h-3 text-indigo-500" />
                  <span className="truncate">{conversation.promoter?.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className={`${platformColor} border-current text-xs`}>
              {conversation.platform.toUpperCase()}
            </Badge>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {conversation.messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages in this conversation</p>
              </div>
            ) : (
              conversation.messages
                .sort((a, b) => new Date(a.interaction_timestamp) - new Date(b.interaction_timestamp))
                .map((message, index) => {
                  const isAIMessage = message.interaction_type === 'message_sent';
                  const isCustomerMessage = message.interaction_type === 'message_received';
                  
                  if (!isAIMessage && !isCustomerMessage) return null;

                  return (
                    <div key={index} className={`flex ${isAIMessage ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] ${isAIMessage ? 'order-1' : 'order-2'}`}>
                        <div className="flex items-end gap-2 mb-1">
                          {isAIMessage && (
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-3 h-3 text-indigo-600" />
                            </div>
                          )}
                          <div className={`px-4 py-2 rounded-lg ${
                            isAIMessage 
                              ? 'bg-gray-100 text-gray-900' 
                              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          }`}>
                            <p className="text-sm leading-relaxed break-words">
                              {isAIMessage ? message.message_content : message.response_content}
                            </p>
                          </div>
                          {isCustomerMessage && (
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <UserIcon className="w-3 h-3 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 text-xs text-gray-500 ${
                          isAIMessage ? 'justify-start pl-8' : 'justify-end pr-8'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(message.interaction_timestamp), 'HH:mm')}</span>
                          {message.sentiment && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {message.sentiment}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Write a message to ${conversation.lead.first_name}...`}
              className="border-none bg-transparent text-gray-900 placeholder-gray-500 focus:ring-0"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Manual message - will be sent directly to customer</span>
          <div className="flex items-center gap-2">
            <span>AI Auto:</span>
            <div className={`w-2 h-2 rounded-full ${isAIEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{isAIEnabled ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}