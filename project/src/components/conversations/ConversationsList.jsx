import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  Bot,
  Facebook,
  Instagram,
  Phone,
  Clock,
  CheckCircle2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

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
    whatsapp: "text-green-600",
    facebook: "text-blue-600", 
    instagram: "text-pink-600"
  };
  return colors[platform] || "text-gray-600";
};

const getStatusColor = (status) => {
  const colors = {
    cold: "bg-gray-100 text-gray-700 border-gray-200",
    warm: "bg-yellow-100 text-yellow-700 border-yellow-200",
    engaged: "bg-blue-100 text-blue-700 border-blue-200",
    converted: "bg-green-100 text-green-700 border-green-200",
    vip: "bg-purple-100 text-purple-700 border-purple-200"
  };
  return colors[status] || colors.cold;
};

export default function ConversationsList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  isLoading 
}) {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ScrollArea className="h-[calc(100vh-500px)]">
        <div className="p-4 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400">Start a conversation to see it here</p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const PlatformIcon = getPlatformIcon(conversation.platform);
              const isSelected = selectedConversation?.id === conversation.id;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    isSelected ? 'bg-indigo-50 border border-indigo-200' : 'border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar & Platform */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {conversation.lead.first_name?.[0]?.toUpperCase() || 'L'}
                        </span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-200`}>
                        <PlatformIcon className={`w-3 h-3 ${getPlatformColor(conversation.platform)}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {conversation.lead.first_name} {conversation.lead.last_name}
                        </h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {conversation.lastMessage && formatDistanceToNow(new Date(conversation.lastMessage.interaction_timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className={`${getStatusColor(conversation.status)} text-xs`}>
                          {conversation.status}
                        </Badge>
                        {conversation.promoter && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Bot className="w-3 h-3" />
                            <span className="truncate">{conversation.promoter.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Last Message Preview */}
                      {conversation.lastMessage && (
                        <div className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.interaction_type === 'message_sent' ? (
                            <span className="flex items-center gap-1">
                              <Bot className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                              <span className="truncate">{conversation.lastMessage.message_content || 'Message sent'}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-blue-500 flex-shrink-0" />
                              <span className="truncate">{conversation.lastMessage.response_content || 'Customer response'}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Unread Badge */}
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs flex-shrink-0">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}