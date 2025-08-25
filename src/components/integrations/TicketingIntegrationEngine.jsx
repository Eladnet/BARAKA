
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Ticket,
  Users,
  BarChart3,
  Globe,
  Webhook,
  Key,
  Link,
  Database,
  Bot,
  TrendingUp,
  Shield,
  RefreshCw,
  Plus,
  DollarSign,
  Target,
  Brain,
  Handshake,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";

export default function TicketingIntegrationEngine() {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState({});
  const [activeTab, setActiveTab] = useState('platforms');

  // Integration configuration state
  const [integrationConfig, setIntegrationConfig] = useState({
    platform: '',
    api_endpoint: '',
    api_key: '',
    secret_key: '',
    webhook_url: '',
    commission_rate: 15,
    ai_features: {
      smart_promotions: true,
      audience_targeting: true,
      price_optimization: true,
      automated_campaigns: true,
      conversion_tracking: true
    },
    affiliate_settings: {
      custom_domain: '',
      referral_code: '',
      landing_page_template: 'modern',
      conversion_tracking: true
    }
  });

  // Popular ticketing platforms with integration capabilities
  const popularPlatforms = [
    {
      id: 'eventbrite',
      name: 'Eventbrite',
      logo: '🎫',
      description: 'Global event ticketing platform with 300M+ users',
      features: ['Sales Tracking', 'Event Management', 'Customer Analytics', 'Payment Processing'],
      api_available: true,
      webhook_support: true,
      difficulty: 'Easy',
      commission_potential: '5-15%',
      integration_benefits: [
        'Auto-import customer data to AI system',
        'Generate personalized promotion links',
        'Track conversions and optimize campaigns',
        'Access to event attendee insights'
      ],
      required_credentials: ['API Token', 'Organization ID', 'Webhook URL']
    },
    {
      id: 'ticketmaster',
      name: 'Ticketmaster',
      logo: '🎪',
      description: 'World\'s largest ticketing platform - Premium partnership',
      features: ['Venue Integration', 'Artist Promotions', 'VIP Packages', 'Resale Market'],
      api_available: true,
      webhook_support: true,
      difficulty: 'Advanced',
      commission_potential: '8-25%',
      integration_benefits: [
        'Access to major venue events',
        'Premium commission rates',
        'Advanced audience analytics',
        'Exclusive pre-sale opportunities'
      ],
      required_credentials: ['Partner API Key', 'Consumer Key', 'Consumer Secret', 'Venue IDs']
    },
    {
      id: 'eventer',
      name: 'Eventer.co.il',
      logo: '🎭',
      description: 'Leading Israeli events and nightlife platform',
      features: ['Israeli Nightlife Focus', 'Club Events', 'Party Listings', 'Local Promoters'],
      api_available: true,
      webhook_support: true,
      difficulty: 'Medium',
      commission_potential: '12-22%',
      integration_benefits: [
        'Direct access to Israeli club scene',
        'Partnership with top Tel Aviv venues',
        'Hebrew AI promotions for local audience',
        'Integration with Israeli nightlife culture'
      ],
      required_credentials: ['API Key', 'Partner ID', 'Event Feed Access']
    },
    {
      id: 'getin',
      name: 'Get-In.com',
      logo: '🚪',
      description: 'Premium Israeli ticketing and guest list platform',
      features: ['Guest List Management', 'VIP Access', 'Premium Events', 'Venue Partnerships'],
      api_available: true,
      webhook_support: true,
      difficulty: 'Medium',
      commission_potential: '15-25%',
      integration_benefits: [
        'Access to exclusive Israeli events',
        'VIP and premium ticket categories',
        'Guest list integration capabilities',
        'High-end venue partnerships'
      ],
      required_credentials: ['API Token', 'Venue Partner Code', 'Event Access Key']
    },
    {
      id: 'goout',
      name: 'Go-Out.co.il',
      logo: '🌟',
      description: 'Israel\'s comprehensive events and entertainment guide',
      features: ['Event Discovery', 'Entertainment Guide', 'Social Features', 'Reviews & Ratings'],
      api_available: true,
      webhook_support: false,
      difficulty: 'Easy',
      commission_potential: '10-18%',
      integration_benefits: [
        'Wide event discovery network',
        'Social engagement features',
        'User reviews and ratings integration',
        'Comprehensive Israeli entertainment coverage'
      ],
      required_credentials: ['API Access Token', 'Publisher ID', 'Event Categories Access']
    },
    {
      id: 'tixwise',
      name: 'TixWise',
      logo: '🎟️',
      description: 'Israeli ticketing platform with local payment methods',
      features: ['Local Sales', 'Bit Payments', 'Hebrew Interface', 'Israeli Market Focus'],
      api_available: true,
      webhook_support: true,
      difficulty: 'Easy',
      commission_potential: '10-20%',
      integration_benefits: [
        'Local payment methods (Bit, Israeli cards)',
        'Hebrew language support',
        'Israeli market expertise',
        'Cultural event targeting'
      ],
      required_credentials: ['API Key', 'Merchant ID', 'Webhook Secret']
    },
    {
      id: 'leaan',
      name: 'Leaan',
      logo: '🎵',
      description: 'Israeli music events and community platform',
      features: ['Music Events', 'Artist Promotions', 'Community Features', 'Social Sharing'],
      api_available: true,
      webhook_support: true,
      difficulty: 'Medium',
      commission_potential: '12-20%',
      integration_benefits: [
        'Music-focused event promotion',
        'Artist and venue partnerships',
        'Community-driven marketing',
        'Social media integration'
      ],
      required_credentials: ['Developer API Key', 'Event Publisher Access', 'Community Integration Token']
    },
    {
      id: 'custom_platform',
      name: 'Custom Integration',
      logo: '⚙️',
      description: 'Build custom integration for any ticketing system',
      features: ['Custom API', 'Flexible Setup', 'White-label Solution', 'Full Control'],
      api_available: true,
      webhook_support: true,
      difficulty: 'Expert',
      commission_potential: '15-30%',
      integration_benefits: [
        'Fully customized integration',
        'White-label AI promoter solution',
        'Maximum commission rates',
        'Complete data control'
      ],
      required_credentials: ['Custom API Endpoint', 'Authentication Method', 'Data Format Specs']
    }
  ];

  const handlePlatformConnect = async (platform) => {
    setIsLoading(true);
    try {
      // Simulate API connection setup
      const newIntegration = {
        id: Date.now().toString(),
        platform_id: platform.id,
        platform_name: platform.name,
        status: 'configuring',
        created_at: new Date().toISOString(),
        api_connected: false,
        total_events_synced: 0,
        total_revenue_generated: 0,
        commission_earned: 0,
        active_campaigns: 0,
        config: { ...integrationConfig }
      };

      setIntegrations(prev => [...prev, newIntegration]);
      setActiveTab('setup');
      
    } catch (error) {
      console.error('Error connecting platform:', error);
      alert('❌ Connection failed. Please check your credentials.');
    }
    setIsLoading(false);
  };

  const testAPIConnection = async (integration) => {
    setIsLoading(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update integration status
      setIntegrations(prev =>
        prev.map(int =>
          int.id === integration.id
            ? {
                ...int,
                status: 'connected',
                api_connected: true,
                last_sync: new Date().toISOString(),
                total_events_synced: Math.floor(Math.random() * 50) + 10
              }
            : int
        )
      );
      
      alert(`✅ Successfully connected to ${integration.platform_name}! Events are now being synced.`);
    } catch (error) {
      alert('❌ API connection test failed. Please verify your credentials.');
    }
    setIsLoading(false);
  };

  const generateAffiliateLink = (integration, eventId) => {
    const baseUrl = window.location.origin;
    const affiliateCode = `TP_${integration.platform_id}_${integration.id}`;
    return `${baseUrl}/affiliate/${affiliateCode}/event/${eventId}?ai_promoter=true`;
  };

  const toggleApiKeyVisibility = (integrationId) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 neon-text">
          🤝 Smart Ticketing Partnerships
        </h1>
        <p className="text-purple-300 text-lg">
          Connect, Promote, and Earn with AI-Powered Ticket Sales
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/80 backdrop-blur-xl border-emerald-500/30 glow-effect">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              ${integrations.reduce((sum, int) => sum + int.commission_earned, 0).toLocaleString()}
            </div>
            <div className="text-slate-300">Commission Earned</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30 glow-effect">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {integrations.reduce((sum, int) => sum + int.total_events_synced, 0)}
            </div>
            <div className="text-slate-300">Events Connected</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 glow-effect">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {integrations.reduce((sum, int) => sum + int.active_campaigns, 0)}
            </div>
            <div className="text-slate-300">AI Campaigns Running</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-yellow-500/30 glow-effect">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {integrations.filter(int => int.status === 'connected').length}
            </div>
            <div className="text-slate-300">Active Partnerships</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/30">
          <TabsTrigger value="platforms">Available Platforms</TabsTrigger>
          <TabsTrigger value="setup">Integration Setup</TabsTrigger>
          <TabsTrigger value="active">Active Partnerships</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Available Platforms */}
        <TabsContent value="platforms">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {popularPlatforms.map(platform => (
              <Card key={platform.id} className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 glow-effect">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{platform.logo}</div>
                      <div>
                        <CardTitle className="text-white text-xl">{platform.name}</CardTitle>
                        <Badge className="mt-1 bg-green-500/20 text-green-300">
                          {platform.commission_potential} Commission
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`${
                      platform.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                      platform.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      platform.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {platform.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{platform.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-400 text-sm font-semibold">Integration Benefits:</Label>
                      <ul className="mt-2 space-y-1">
                        {platform.integration_benefits.map((benefit, index) => (
                          <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-slate-400 text-sm font-semibold">Required Credentials:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {platform.required_credentials.map(cred => (
                          <Badge key={cred} variant="outline" className="text-xs">
                            {cred}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePlatformConnect(platform)}
                    disabled={isLoading || integrations.some(int => int.platform_id === platform.id)}
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : integrations.some(int => int.platform_id === platform.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Connected
                      </>
                    ) : (
                      <>
                        <Handshake className="w-4 h-4 mr-2" />
                        Start Partnership
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integration Setup */}
        <TabsContent value="setup">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-yellow-400" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Platform</Label>
                  <Select value={integrationConfig.platform} onValueChange={(value) => 
                    setIntegrationConfig(prev => ({ ...prev, platform: value }))
                  }>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {popularPlatforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id} className="text-slate-300">
                          {platform.logo} {platform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">API Endpoint</Label>
                  <Input
                    type="url"
                    placeholder="https://api.platform.com/v1"
                    value={integrationConfig.api_endpoint}
                    onChange={(e) => setIntegrationConfig(prev => ({ ...prev, api_endpoint: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">API Key</Label>
                  <div className="relative">
                    <Input
                      type={showApiKeys.setup ? "text" : "password"}
                      placeholder="Enter your API key"
                      value={integrationConfig.api_key}
                      onChange={(e) => setIntegrationConfig(prev => ({ ...prev, api_key: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleApiKeyVisibility('setup')}
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    >
                      {showApiKeys.setup ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Secret Key (Optional)</Label>
                  <Input
                    type="password"
                    placeholder="Enter secret key if required"
                    value={integrationConfig.secret_key}
                    onChange={(e) => setIntegrationConfig(prev => ({ ...prev, secret_key: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Commission Rate (%)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={integrationConfig.commission_rate}
                    onChange={(e) => setIntegrationConfig(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI Features Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(integrationConfig.ai_features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300 capitalize">
                        {feature.replace('_', ' ')}
                      </Label>
                      <p className="text-xs text-slate-400">
                        {feature === 'smart_promotions' && 'Auto-generate personalized promotions'}
                        {feature === 'audience_targeting' && 'AI-powered audience segmentation'}
                        {feature === 'price_optimization' && 'Dynamic pricing recommendations'}
                        {feature === 'automated_campaigns' && 'Launch campaigns automatically'}
                        {feature === 'conversion_tracking' && 'Track and optimize conversions'}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) =>
                        setIntegrationConfig(prev => ({
                          ...prev,
                          ai_features: { ...prev.ai_features, [feature]: checked }
                        }))
                      }
                    />
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-700">
                  <Label className="text-slate-300">Custom Domain (Optional)</Label>
                  <Input
                    placeholder="tickets.yourdomain.com"
                    value={integrationConfig.affiliate_settings.custom_domain}
                    onChange={(e) => setIntegrationConfig(prev => ({
                      ...prev,
                      affiliate_settings: { ...prev.affiliate_settings, custom_domain: e.target.value }
                    }))}
                    className="bg-slate-800 border-slate-700 text-white mt-2"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Partnerships */}
        <TabsContent value="active">
          <div className="space-y-6">
            {integrations.length === 0 ? (
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-12 text-center">
                  <Handshake className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Active Partnerships</h3>
                  <p className="text-slate-400 mb-6">Start by connecting to a ticketing platform</p>
                  <Button 
                    onClick={() => setActiveTab('platforms')} 
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Platforms
                  </Button>
                </CardContent>
              </Card>
            ) : (
              integrations.map(integration => (
                <Card key={integration.id} className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{integration.platform_name}</h3>
                          <Badge className={integration.status === 'connected' ? 
                            'bg-green-500/20 text-green-300' : 
                            'bg-yellow-500/20 text-yellow-300'
                          }>
                            {integration.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => testAPIConnection(integration)}
                          disabled={isLoading}
                          size="sm"
                          variant="outline"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Test API
                        </Button>
                        <Button size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-lg font-bold text-emerald-400">
                          ${integration.commission_earned.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">Commission Earned</div>
                      </div>
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">
                          {integration.total_events_synced}
                        </div>
                        <div className="text-xs text-slate-400">Events Synced</div>
                      </div>
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">
                          {integration.active_campaigns}
                        </div>
                        <div className="text-xs text-slate-400">Active Campaigns</div>
                      </div>
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-400">
                          {integration.config?.commission_rate || 15}%
                        </div>
                        <div className="text-xs text-slate-400">Commission Rate</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div>
                        <Label className="text-slate-300 text-sm">Sample Affiliate Link:</Label>
                        <code className="text-xs text-purple-300 block mt-1">
                          {generateAffiliateLink(integration, 'EVENT_ID')}
                        </code>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(generateAffiliateLink(integration, 'EVENT_ID'));
                          alert('Link copied to clipboard!');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Performance Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Revenue Generated:</span>
                    <span className="text-emerald-400 font-bold">
                      ${integrations.reduce((sum, int) => sum + int.total_revenue_generated, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Commission:</span>
                    <span className="text-green-400 font-bold">
                      ${integrations.reduce((sum, int) => sum + int.commission_earned, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Commission Rate:</span>
                    <span className="text-purple-400 font-bold">
                      {integrations.length > 0 ? 
                        (integrations.reduce((sum, int) => sum + (int.config?.commission_rate || 15), 0) / integrations.length).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Partnerships:</span>
                    <span className="text-blue-400 font-bold">
                      {integrations.filter(int => int.status === 'connected').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total AI Campaigns:</span>
                    <span className="text-purple-400 font-bold">
                      {integrations.reduce((sum, int) => sum + int.active_campaigns, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Events Connected:</span>
                    <span className="text-yellow-400 font-bold">
                      {integrations.reduce((sum, int) => sum + int.total_events_synced, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
