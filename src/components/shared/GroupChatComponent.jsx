
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  Info,
  MoreHorizontal,
  Heart,
  ThumbsUp,
  Search,
  X,
  Settings,
  Users,
  Image,
  Mic,
  Camera
} from "lucide-react";
import { SharedChat } from "@/api/entities";
import { User } from "@/api/entities";

export default function GroupChatComponent({ eventId, participants = [] }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
    
    // Auto-scroll to bottom
    scrollToBottom();
  }, [eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const chatMessages = await SharedChat.filter(
        { event_id: eventId },
        'created_date',
        100
      );
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Load demo messages for preview
      loadDemoMessages();
    }
  };

  const loadDemoMessages = () => {
    const demoMessages = [
      {
        id: '1',
        sender_id: 'demo-1',
        sender_name: 'Maya Cohen',
        sender_avatar: null,
        message_content: 'היי חברה! נרגשת מהאירוע הזה 🎉',
        message_type: 'text',
        created_date: new Date(Date.now() - 3600000).toISOString(),
        reactions: { '❤️': ['demo-2'], '👍': ['demo-3'] }
      },
      {
        id: '2',
        sender_id: 'demo-2',
        sender_name: 'Danny Levi',
        sender_avatar: null,
        message_content: 'גם אני! איזה שעה כולנו מתכננים להגיע?',
        message_type: 'text',
        created_date: new Date(Date.now() - 3000000).toISOString(),
        reactions: { '👍': ['demo-1', 'demo-3'] }
      },
      {
        id: '3',
        sender_id: 'demo-3',
        sender_name: 'Alon Sharon',
        sender_avatar: null,
        message_content: 'אני מציע 21:00, מה אתם אומרים?',
        message_type: 'text',
        created_date: new Date(Date.now() - 2400000).toISOString(),
        reactions: { '🔥': ['demo-1', 'demo-2'] }
      },
      {
        id: '4',
        sender_id: 'system',
        sender_name: 'System',
        sender_avatar: null,
        message_content: 'Sarah הצטרפה לקבוצה',
        message_type: 'system',
        is_system_message: true,
        created_date: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '5',
        sender_id: 'demo-4',
        sender_name: 'Sarah Kim',
        sender_avatar: null,
        message_content: 'שלום לכולם! נשמע מעולה 🥂',
        message_type: 'text',
        created_date: new Date(Date.now() - 1200000).toISOString(),
        reactions: { '🥂': ['demo-1'], '👋': ['demo-2', 'demo-3'] }
      }
    ];
    setMessages(demoMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const messageData = {
      event_id: eventId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar_url,
      message_content: newMessage,
      message_type: 'text',
      reactions: {}
    };

    try {
      // Add to local state immediately for better UX
      const tempMessage = {
        ...messageData,
        id: Date.now().toString(),
        created_date: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // Save to database
      await SharedChat.create(messageData);
      
      // Reload messages to get the real one with proper ID
      setTimeout(() => {
        loadMessages();
      }, 500);

    } catch (error) {
      console.error('Error sending message:', error);
      // For demo purposes, keep the message in local state
    }
  };

  const handleReaction = async (messageId, emoji) => {
    if (!currentUser) return;

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        if (reactions[emoji]) {
          if (reactions[emoji].includes(currentUser.id)) {
            reactions[emoji] = reactions[emoji].filter(id => id !== currentUser.id);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          } else {
            reactions[emoji].push(currentUser.id);
          }
        } else {
          reactions[emoji] = [currentUser.id];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));

    // Update in database
    try {
      const message = messages.find(m => m.id === messageId);
      if (message && !message.is_system_message) {
        await SharedChat.update(messageId, { reactions: message.reactions });
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'היום';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'אתמול';
    } else {
      return date.toLocaleDateString('he-IL');
    }
  };

  const quickReactions = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

  const getParticipantInfo = (senderId) => {
    const participant = participants.find(p => p.participant_id === senderId);
    return participant || { participant_name: 'משתתף לא ידוע' };
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Chat Header - Meta Style */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">צ'אט קבוצתי</h3>
            <p className="text-gray-500 text-xs">{participants.length} משתתפים • פעיל</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-full p-2">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-full p-2">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-50 rounded-full p-2">
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Participants Bar */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-gray-600 text-xs font-medium whitespace-nowrap">משתתפים:</span>
          <div className="flex gap-1">
            {participants.slice(0, 8).map((participant, index) => (
              <div key={index} className="relative">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {participant.participant_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
              </div>
            ))}
            {participants.length > 8 && (
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">+{participants.length - 8}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-3">
          {messages.map((message, index) => {
            const showDate = index === 0 || 
              formatDate(message.created_date) !== formatDate(messages[index - 1]?.created_date);
            const isCurrentUser = message.sender_id === currentUser?.id;
            const isSystem = message.is_system_message;

            return (
              <div key={message.id}>
                {/* Date Separator */}
                {showDate && (
                  <div className="flex justify-center my-4">
                    <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.created_date)}
                    </div>
                  </div>
                )}

                {/* System Message */}
                {isSystem ? (
                  <div className="flex justify-center">
                    <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {message.message_content}
                    </div>
                  </div>
                ) : (
                  /* Regular Message */
                  <div className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    {!isCurrentUser && (
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {message.sender_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}

                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      {/* Sender Name */}
                      {!isCurrentUser && (
                        <span className="text-gray-600 text-xs font-medium mb-1 px-1">
                          {message.sender_name}
                        </span>
                      )}

                      {/* Message Bubble */}
                      <div 
                        className={`relative px-3 py-2 rounded-2xl max-w-full break-words ${
                          isCurrentUser 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}
                        onDoubleClick={() => setSelectedMessage(message.id)}
                      >
                        <p className="text-sm leading-relaxed">{message.message_content}</p>
                        
                        {/* Time */}
                        <div className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.created_date)}
                        </div>

                        {/* Message Reactions */}
                        {message.reactions && Object.keys(message.reactions).length > 0 && (
                          <div className={`flex gap-1 mt-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {Object.entries(message.reactions).map(([emoji, users]) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(message.id, emoji)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all hover:scale-105 ${
                                  users.includes(currentUser?.id) 
                                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span className="font-medium">{users.length}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Reactions (on hover/select) */}
                      {selectedMessage === message.id && (
                        <div className="flex gap-1 mt-1 p-2 bg-white rounded-full shadow-lg border animate-in fade-in duration-200">
                          {quickReactions.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => {
                                handleReaction(message.id, emoji);
                                setSelectedMessage(null);
                              }}
                              className="hover:scale-125 transition-transform p-1 rounded-full hover:bg-gray-100"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-gray-500 text-xs mr-2">מישהו כותב...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input - Meta Style */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:bg-blue-50 rounded-full p-2 flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Message Input Container */}
          <div className="relative flex-1 bg-gray-100 rounded-2xl border border-gray-200">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="כתוב הודעה..."
              className="border-0 bg-transparent resize-none focus:ring-0 rounded-2xl px-4 py-3 pr-12"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            {/* Emoji Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {/* Media Buttons */}
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:bg-blue-50 rounded-full p-2 flex-shrink-0"
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:bg-blue-50 rounded-full p-2 flex-shrink-0"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>

          {/* Send Button */}
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
            <div className="grid grid-cols-8 gap-2">
              {quickReactions.concat(['😊', '😍', '🤔', '👏', '🎉', '💪', '🙌', '✨']).map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                    inputRef.current?.focus();
                  }}
                  className="hover:bg-gray-100 p-2 rounded text-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
