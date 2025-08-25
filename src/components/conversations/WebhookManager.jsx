import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Webhook, 
  CheckCircle, 
  XCircle, 
  Copy,
  RefreshCw,
  MessageSquare,
  Facebook,
  Instagram,
  AlertTriangle,
  Info
} from "lucide-react";
import { User } from "@/api/entities";

export default function WebhookManager() {
  const [webhookUrls, setWebhookUrls] = useState({
    whatsapp: '',
    facebook: '',
    instagram: ''
  });
  const [webhookStatus, setWebhookStatus] = useState({
    whatsapp: 'inactive',
    facebook: 'inactive', 
    instagram: 'inactive'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateWebhookUrls();
  }, []);

  const generateWebhookUrls = async () => {
    setIsGenerating(true);
    try {
      const user = await User.me();
      const baseUrl = window.location.origin;
      const userId = user.id;
      
      // Generate unique webhook URLs for each platform
      setWebhookUrls({
        whatsapp: `${baseUrl}/api/webhooks/whatsapp/${userId}`,
        facebook: `${baseUrl}/api/webhooks/facebook/${userId}`,
        instagram: `${baseUrl}/api/webhooks/instagram/${userId}`
      });
    } catch (error) {
      console.error('Error generating webhook URLs:', error);
    }
    setIsGenerating(false);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    // In a real app, you'd show a toast notification here
  };

  const testWebhook = async (platform) => {
    setWebhookStatus(prev => ({ ...prev, [platform]: 'testing' }));
    
    // Simulate webhook test
    setTimeout(() => {
      setWebhookStatus(prev => ({ 
        ...prev, 
        [platform]: Math.random() > 0.3 ? 'active' : 'error' 
      }));
    }, 2000);
  };

  const getStatusBadge = (status) => {
    const configs = {
      active: { icon: CheckCircle, color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", text: "פעיל" },
      inactive: { icon: XCircle, color: "bg-slate-500/20 text-slate-300 border-slate-500/30", text: "לא פעיל" },
      testing: { icon: RefreshCw, color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", text: "בודק..." },
      error: { icon: AlertTriangle, color: "bg-red-500/20 text-red-300 border-red-500/30", text: "שגיאה" }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: MessageSquare,
      color: 'text-green-500',
      description: 'קבלת הודעות WhatsApp דרך Business API'
    },
    {
      id: 'facebook', 
      name: 'Facebook Messenger',
      icon: Facebook,
      color: 'text-blue-500',
      description: 'קבלת הודעות מ-Facebook Messenger'
    },
    {
      id: 'instagram',
      name: 'Instagram DM', 
      icon: Instagram,
      color: 'text-pink-500',
      description: 'קבלת הודעות מ-Instagram Direct'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Webhook className="w-5 h-5 text-purple-400" />
            ניהול Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-500/30 bg-blue-500/10">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              השתמש ב-URLs האלה כדי להגדיר webhooks בפלטפורמות השונות. 
              הם יאפשרו למערכת לקבל הודעות בזמן אמת.
            </AlertDescription>
          </Alert>

          {platforms.map(platform => {
            const Icon = platform.icon;
            return (
              <div key={platform.id} className="p-4 rounded-lg border border-slate-700/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${platform.color}`} />
                    <div>
                      <h3 className="font-medium text-white">{platform.name}</h3>
                      <p className="text-sm text-slate-400">{platform.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(webhookStatus[platform.id])}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={webhookUrls[platform.id]}
                      readOnly
                      className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(webhookUrls[platform.id])}
                      className="border-slate-600 hover:bg-slate-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => testWebhook(platform.id)}
                      disabled={webhookStatus[platform.id] === 'testing'}
                      className="border-slate-600 hover:bg-slate-700"
                    >
                      {webhookStatus[platform.id] === 'testing' ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'בדוק'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-slate-700/50">
            <Button
              onClick={generateWebhookUrls}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              רענן URLs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}