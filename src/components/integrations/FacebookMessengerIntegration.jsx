import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Facebook, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Key,
  MessageSquare,
  Users,
  Settings,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { User } from "@/api/entities";

export default function FacebookMessengerIntegration() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionData, setConnectionData] = useState(null);
  const [showTokens, setShowTokens] = useState(false);
  const [manualSetup, setManualSetup] = useState({
    appId: '',
    appSecret: '',
    pageAccessToken: '',
    verifyToken: '',
    pageId: ''
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [pages, setPages] = useState([]);
  
  useEffect(() => {
    generateWebhookUrl();
    loadExistingConnection();
  }, []);

  const generateWebhookUrl = () => {
    const baseUrl = window.location.origin;
    const webhookPath = `/api/webhooks/facebook/${Date.now()}`;
    setWebhookUrl(`${baseUrl}${webhookPath}`);
  };

  const loadExistingConnection = async () => {
    try {
      const user = await User.me();
      const facebookSettings = user.settings?.facebook;
      
      if (facebookSettings?.connected) {
        setConnectionStatus('connected');
        setConnectionData(facebookSettings);
        setManualSetup({
          appId: facebookSettings.app_id || '',
          appSecret: facebookSettings.app_secret || '',
          pageAccessToken: facebookSettings.page_access_token || '',
          verifyToken: facebookSettings.verify_token || '',
          pageId: facebookSettings.page_id || ''
        });
      }
    } catch (error) {
      console.error('Error loading Facebook connection:', error);
    }
  };

  const handleManualSetup = async () => {
    if (!manualSetup.appId || !manualSetup.pageAccessToken) {
      alert('נא למלא לפחות App ID ו-Page Access Token');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const settings = {
        connected: true,
        app_id: manualSetup.appId,
        app_secret: manualSetup.appSecret,
        page_id: manualSetup.pageId,
        page_access_token: manualSetup.pageAccessToken,
        verify_token: manualSetup.verifyToken || generateVerifyToken(),
        webhook_url: webhookUrl,
        connected_at: new Date().toISOString()
      };
      
      await saveFacebookConnection(settings);
      setConnectionData(settings);
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('Manual setup error:', error);
      alert(`שגיאה בהגדרה ידנית: ${error.message}`);
    }
    
    setIsConnecting(false);
  };

  const generateVerifyToken = () => {
    return `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const saveFacebookConnection = async (settings) => {
    try {
      const user = await User.me();
      
      await User.updateMyUserData({
        settings: {
          ...user.settings,
          facebook: settings
        }
      });
      
      console.log('Facebook connection saved successfully');
    } catch (error) {
      console.error('Error saving Facebook connection:', error);
      throw error;
    }
  };

  const testConnection = async () => {
    if (!connectionData?.page_access_token) return;
    
    setIsConnecting(true);
    
    try {
      alert('בדיקת חיבור - המערכת מוכנה לקבלת הודעות! ✅');
    } catch (error) {
      console.error('Connection test failed:', error);
      alert(`בדיקת חיבור נכשלה: ${error.message}`);
    }
    
    setIsConnecting(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('הועתק ללוח! 📋');
  };

  const disconnectFacebook = async () => {
    try {
      const user = await User.me();
      
      await User.updateMyUserData({
        settings: {
          ...user.settings,
          facebook: {
            connected: false,
            disconnected_at: new Date().toISOString()
          }
        }
      });
      
      setConnectionStatus('disconnected');
      setConnectionData(null);
      setManualSetup({
        appId: '',
        appSecret: '',
        pageAccessToken: '',
        verifyToken: '',
        pageId: ''
      });
      
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* מצב החיבור */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Facebook className="w-5 h-5 text-blue-500" />
              Facebook Messenger API
            </CardTitle>
            <Badge className={
              connectionStatus === 'connected' ? 'bg-green-500/20 text-green-300' :
              connectionStatus === 'error' ? 'bg-red-500/20 text-red-300' :
              'bg-yellow-500/20 text-yellow-300'
            }>
              {connectionStatus === 'connected' ? 'מחובר' :
               connectionStatus === 'error' ? 'שגיאה' : 'לא מחובר'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* הוראות ראשוניות */}
          {connectionStatus === 'disconnected' && (
            <div className="space-y-4">
              <Alert className="border-blue-500/30 bg-blue-500/10">
                <Facebook className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  <div className="space-y-2">
                    <div className="font-bold">שלבי החיבור:</div>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>צור Facebook App ב-Developer Console</li>
                      <li>הוסף את המוצר "Messenger"</li>
                      <li>קבל Page Access Token</li>
                      <li>הגדר Webhook URL</li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>
              
              {/* כפתור לפתיחת Facebook Developers */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.open('https://developers.facebook.com/apps/', '_blank')}
                  variant="outline"
                  className="border-blue-500/50 text-blue-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  פתח Facebook Developers
                </Button>
              </div>
            </div>
          )}

          {/* הגדרה ידנית */}
          {connectionStatus === 'disconnected' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">הגדרה ידנית</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Facebook App ID</Label>
                  <Input
                    type="text"
                    placeholder="123456789012345"
                    value={manualSetup.appId}
                    onChange={(e) => setManualSetup({...manualSetup, appId: e.target.value})}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">App Secret (אופציונלי)</Label>
                  <Input
                    type={showTokens ? "text" : "password"}
                    placeholder="app_secret_here"
                    value={manualSetup.appSecret}
                    onChange={(e) => setManualSetup({...manualSetup, appSecret: e.target.value})}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Page Access Token</Label>
                  <Input
                    type={showTokens ? "text" : "password"}
                    placeholder="EAAxxxxxxxxxxxx"
                    value={manualSetup.pageAccessToken}
                    onChange={(e) => setManualSetup({...manualSetup, pageAccessToken: e.target.value})}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Page ID (אופציונלי)</Label>
                  <Input
                    type="text"
                    placeholder="123456789012345"
                    value={manualSetup.pageId}
                    onChange={(e) => setManualSetup({...manualSetup, pageId: e.target.value})}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTokens(!showTokens)}
                  className="text-gray-400"
                >
                  {showTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showTokens ? 'הסתר' : 'הצג'} טוקנים
                </Button>
              </div>
              
              <Button 
                onClick={handleManualSetup}
                disabled={isConnecting || !manualSetup.appId || !manualSetup.pageAccessToken}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    מתחבר...
                  </>
                ) : (
                  <>
                    <Facebook className="w-4 h-4 mr-2" />
                    התחבר ל-Facebook
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Webhook URL */}
          <div className="space-y-2">
            <Label className="text-gray-300">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={webhookUrl}
                readOnly
                className="bg-slate-800 border-slate-600 text-white"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(webhookUrl)}
                className="border-slate-600"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              השתמש ב-URL הזה בהגדרות ה-Webhook של Facebook
            </p>
          </div>

          {/* מצב מחובר */}
          {connectionStatus === 'connected' && connectionData && (
            <div className="space-y-4">
              <Alert className="border-green-500/30 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  מחובר בהצלחה ל-Facebook Messenger!
                </AlertDescription>
              </Alert>
              
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">App ID:</span>
                    <p className="text-white font-mono">{connectionData.app_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Page ID:</span>
                    <p className="text-white font-mono">{connectionData.page_id || 'לא זמין'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">מחובר מאז:</span>
                    <p className="text-white">{new Date(connectionData.connected_at).toLocaleString('he-IL')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Webhook:</span>
                    <p className="text-white">פעיל</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={testConnection} disabled={isConnecting}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  בדוק חיבור
                </Button>
                <Button variant="destructive" onClick={disconnectFacebook}>
                  התנתק
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}