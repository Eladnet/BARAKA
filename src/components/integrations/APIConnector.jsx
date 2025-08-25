import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Key, 
  Webhook, 
  Database, 
  Zap,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { InvokeLLM } from "@/api/integrations";

export default function APIConnector({ platform, onConnectionEstablished }) {
  const [credentials, setCredentials] = useState({
    api_key: '',
    api_secret: '',
    endpoint_url: '',
    webhook_url: ''
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle');

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      // שימוש ב-AI לניתוח ובדיקת ה-API
      const analysisResult = await InvokeLLM({
        prompt: `
        Analyze the API connection for ${platform.name} ticketing platform.
        
        API Details:
        - Endpoint: ${credentials.endpoint_url}
        - Has API Key: ${credentials.api_key ? 'Yes' : 'No'}
        - Has Secret: ${credentials.api_secret ? 'Yes' : 'No'}
        - Webhook URL: ${credentials.webhook_url}
        
        Please provide:
        1. Connection validation status
        2. Required API endpoints for ticketing integration
        3. Data mapping recommendations
        4. Security best practices
        5. Sync frequency recommendations
        `,
        response_json_schema: {
          type: "object",
          properties: {
            connection_valid: { type: "boolean" },
            required_endpoints: { 
              type: "array", 
              items: { type: "string" } 
            },
            data_mapping: {
              type: "object",
              properties: {
                events: { type: "string" },
                tickets: { type: "string" },
                customers: { type: "string" },
                sales: { type: "string" }
              }
            },
            security_recommendations: {
              type: "array",
              items: { type: "string" }
            },
            sync_frequency: { type: "string" },
            estimated_setup_time: { type: "string" }
          }
        }
      });

      if (analysisResult.connection_valid) {
        setConnectionStatus('connected');
        
        // הגדרת האינטגרציה
        const integrationConfig = {
          platform: platform.id,
          credentials: credentials,
          endpoints: analysisResult.required_endpoints,
          data_mapping: analysisResult.data_mapping,
          sync_frequency: analysisResult.sync_frequency,
          security_settings: analysisResult.security_recommendations
        };

        if (onConnectionEstablished) {
          onConnectionEstablished(integrationConfig);
        }

        alert(`🎉 התחברות ל-${platform.name} הושלמה בהצלחה!`);
      } else {
        setConnectionStatus('error');
        alert('❌ שגיאה בהתחברות - בדוק את פרטי ה-API');
      }

    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('error');
      alert('❌ שגיאה בהתחברות למערכת');
    }

    setIsConnecting(false);
  };

  const generateWebhookURL = () => {
    const webhookId = Math.random().toString(36).substring(7);
    const webhookURL = `https://api.ticketpulse.live/webhooks/${platform.id}/${webhookId}`;
    setCredentials(prev => ({ ...prev, webhook_url: webhookURL }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('📋 הועתק ללוח!');
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-400" />
          חיבור API ל-{platform.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Credentials */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">פרטי API</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-slate-300">API Key</Label>
              <div className="relative">
                <Input
                  type={showSecrets ? "text" : "password"}
                  value={credentials.api_key}
                  onChange={(e) => setCredentials(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="הכנס את ה-API Key"
                  className="bg-slate-800 border-slate-700 text-white pr-10"
                />
                <button
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">API Secret (אופציונלי)</Label>
              <Input
                type={showSecrets ? "text" : "password"}
                value={credentials.api_secret}
                onChange={(e) => setCredentials(prev => ({ ...prev, api_secret: e.target.value }))}
                placeholder="הכנס את ה-API Secret"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300">API Endpoint URL</Label>
              <Input
                value={credentials.endpoint_url}
                onChange={(e) => setCredentials(prev => ({ ...prev, endpoint_url: e.target.value }))}
                placeholder="https://api.platform.com/v1"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Webhook className="w-5 h-5 text-blue-400" />
            הגדרת Webhooks
          </h3>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                value={credentials.webhook_url}
                onChange={(e) => setCredentials(prev => ({ ...prev, webhook_url: e.target.value }))}
                placeholder="URL לקבלת התראות"
                className="bg-slate-800 border-slate-700 text-white flex-1"
              />
              <Button 
                onClick={generateWebhookURL}
                variant="outline"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-1" />
                צור
              </Button>
              <Button 
                onClick={() => copyToClipboard(credentials.webhook_url)}
                variant="outline"
                size="sm"
                disabled={!credentials.webhook_url}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-slate-400 text-sm">
              השתמש ב-URL הזה בהגדרות הפלטפורמה לקבלת התראות בזמן אמת
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400">מחובר בהצלחה</span>
              </>
            ) : connectionStatus === 'error' ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">שגיאה בחיבור</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-blue-400">מתחבר...</span>
              </>
            ) : (
              <>
                <Database className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400">לא מחובר</span>
              </>
            )}
          </div>
          
          <Button
            onClick={handleConnect}
            disabled={isConnecting || !credentials.api_key || !credentials.endpoint_url}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                מתחבר...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                התחבר
              </>
            )}
          </Button>
        </div>

        {/* Integration Benefits */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
          <h4 className="text-white font-medium mb-2">מה תקבל מהאינטגרציה:</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• סנכרון אוטומטי של מכירות כרטיסים</li>
            <li>• ייבוא לקוחות חדשים למערכת הלידים</li>
            <li>• קמפיינים אוטומטיים לאירועים חדשים</li>
            <li>• אנליטיקס משולב ודוחות מתקדמים</li>
            <li>• אופטימיזציית מחירים מבוססת AI</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}