
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Search, 
  Plus,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Bot,
  User as UserIcon,
  Settings,
  Filter,
  Zap // Added Zap icon for automatic simulator
} from "lucide-react";
import { User } from "@/api/entities";
import { Interaction } from "@/api/entities";
import { Lead } from "@/api/entities";
import { AIPromoter } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

import ConversationsList from "../components/conversations/ConversationsList";
import ConversationView from "../components/conversations/ConversationView";
import ConversationFilters from "../components/conversations/ConversationFilters";
import AutomaticConversationSimulator from "../components/conversations/AutomaticConversationSimulator"; // Added AutomaticConversationSimulator import

export default function ConversationsPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: 'all',
    status: 'all',
    assignee: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    avgResponseTime: 0,
    conversionRate: 0
  });

  const [showAutoSimulator, setShowAutoSimulator] = useState(false); // Only automatic simulator

  useEffect(() => {
    loadConversations();
  }, [filters]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const [interactions, leads, promoters] = await Promise.all([
        Interaction.filter({ created_by: user.email }, '-interaction_timestamp', 500),
        Lead.filter({ created_by: user.email }, '-created_date', 200),
        AIPromoter.filter({ created_by: user.email })
      ]);

      // Group interactions into conversations
      const conversationMap = new Map();
      
      interactions.forEach(interaction => {
        const leadId = interaction.lead_id;
        if (!conversationMap.has(leadId)) {
          const lead = leads.find(l => l.id === leadId);
          const promoter = promoters.find(p => p.id === interaction.promoter_id);
          
          if (lead) {
            conversationMap.set(leadId, {
              id: leadId,
              lead: lead,
              promoter: promoter,
              messages: [],
              lastMessage: null,
              status: determineStatus(interaction),
              platform: 'whatsapp'
            });
          }
        }

        if (conversationMap.has(leadId)) {
          conversationMap.get(leadId).messages.push(interaction);
        }
      });

      // Convert to array and sort
      const conversationList = Array.from(conversationMap.values())
        .map(conv => ({
          ...conv,
          lastMessage: conv.messages[conv.messages.length - 1]
        }))
        .sort((a, b) => {
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return new Date(b.lastMessage.interaction_timestamp) - new Date(a.lastMessage.interaction_timestamp);
        });

      setConversations(conversationList);
      
      // Calculate stats
      const activeConversations = conversationList.filter(c => 
        c.lastMessage && 
        new Date() - new Date(c.lastMessage.interaction_timestamp) < 24 * 60 * 60 * 1000
      );
      
      setStats({
        total: conversationList.length,
        active: activeConversations.length,
        avgResponseTime: 15, // minutes
        conversionRate: 12.5 // percent
      });

      if (conversationList.length > 0 && !selectedConversation) {
        setSelectedConversation(conversationList[0]);
      }

    } catch (error) {
      console.error('Error loading conversations:', error);
    }
    setIsLoading(false);
  };

  const determineStatus = (interaction) => {
    if (interaction.sentiment === 'positive') return 'engaged';
    if (interaction.sentiment === 'negative') return 'troubled';
    return 'active';
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' || 
      (conv.lead.first_name && conv.lead.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (conv.lead.last_name && conv.lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPlatform = filters.platform === 'all' || conv.platform === filters.platform;
    const matchesStatus = filters.status === 'all' || conv.status === filters.status;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Conversations Center
              </h1>
              <p className="text-gray-600 text-lg">
                {t("Manage conversations from all platforms in one place")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAutoSimulator(!showAutoSimulator)}
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                {showAutoSimulator ? 'הסתר סימולטור' : 'סימולטור שיחות'}
              </Button>
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        </div>

        {/* Automatic Simulator Section */}
        {showAutoSimulator && (
          <div className="mb-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  סימולטור שיחות אוטומטי עם התערבות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AutomaticConversationSimulator 
                  promoters={[
                    { id: '1', name: 'Maya AI', persona: 'friendly' },
                    { id: '2', name: 'Alex AI', persona: 'professional' },
                    { id: '3', name: 'Sarah AI', persona: 'energetic' }
                  ]}
                  onSimulationComplete={(data) => {
                    console.log('Automatic simulation completed:', data);
                  }}
                  isVisible={showAutoSimulator}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  {t("Total Conversations")}
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  {t("Active Conversations")}
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  {t("Avg Response Time")}
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.avgResponseTime}m</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  {t("Conversion Rate")}
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left sidebar - Conversations list */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-0 shadow-lg h-[calc(100vh-400px)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900">Conversations</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t("Filter conversations...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ConversationsList
                  conversations={filteredConversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={setSelectedConversation}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right main area - Conversation view */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-0 shadow-lg h-[calc(100vh-400px)]">
              <ConversationView
                conversation={selectedConversation}
                onUpdateConversation={loadConversations}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
