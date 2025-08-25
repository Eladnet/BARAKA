
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Phone, // Added Phone icon
  Settings,
  Users,
  BarChart3,
  Zap,
  AlertTriangle,
  Info,
  TestTube,
  Webhook,
  Loader2, // Added for loading spinner in QR component
  QrCode // Added for QR code icon
} from "lucide-react";
import { User } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

// --- WhatsAppQRIntegration Component ---
const WhatsAppQRIntegration = ({ onConnectionSuccess }) => {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [qrCodeImg, setQrCodeImg] = useState('');
  const [qrStatus, setQrStatus] = useState('loading'); // loading, ready, scanning, connected, error
  const [error, setError] = useState('');
  const [pollingIntervalId, setPollingIntervalId] = useState(null);

  const fetchQrCode = async () => {
    setQrStatus('loading');
    setError('');
    setQrCodeImg('');
    try {
      // Simulate API call to get QR code
      const response = await new Promise(resolve => setTimeout(() => {
        // In a real app, this would be an API call returning a QR image base64 or URL
        // and a session ID for polling.
        resolve({
          qr_code_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAklEQVR4Aemazc3wtaYJ+yM/qE8A' // Placeholder base64 for a 1x1 transparent image
        });
      }, 2000));

      setQrCodeImg(response.qr_code_base64);
      setQrStatus('ready');
      startPollingForConnection();
    } catch (err) {
      console.error("Error fetching QR code:", err);
      setError(t('Failed to load QR code. Please try again.'));
      setQrStatus('error');
    }
  };

  const startPollingForConnection = () => {
    // Clear any existing polling
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }

    const interval = setInterval(async () => {
      // Simulate polling API for connection status
      // In a real scenario, this would send a session ID to the backend
      // and the backend would check if the WhatsApp session is connected.
      console.log('Polling for WhatsApp connection status...');
      try {
        const response = await new Promise(resolve => setTimeout(() => {
          const randomNumber = Math.random();
          if (randomNumber < 0.2) { // Simulate successful connection
            resolve({
              status: 'connected',
              data: {
                session_token: 'mock_session_token_123',
                phone_number: '+1234567890',
                webhook_url: 'https://mock.webhook.com/whatsapp'
              }
            });
          } else if (randomNumber < 0.6) { // Simulate QR scanned but not connected yet (higher chance)
            resolve({ status: 'scanning' });
          } else { // Simulate still ready or disconnected
            resolve({ status: 'ready' });
          }
        }, 3000));

        if (response.status === 'connected') {
          clearInterval(interval);
          setPollingIntervalId(null);
          setQrStatus('connected');
          onConnectionSuccess(response.data);
        } else if (response.status === 'scanning') {
          setQrStatus('scanning');
        } else if (response.status === 'error') {
            clearInterval(interval);
            setPollingIntervalId(null);
            setQrStatus('error');
            setError(t('Connection failed or timed out. Please refresh.'));
        }
        // If status is 'ready', continue polling
      } catch (err) {
        console.error("Error polling connection status:", err);
        clearInterval(interval);
        setPollingIntervalId(null);
        setQrStatus('error');
        setError(t('Error checking connection status.'));
      }
    }, 5000); // Poll every 5 seconds
    setPollingIntervalId(interval);
  };

  useEffect(() => {
    fetchQrCode();
    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, []); // Run once on component mount

  const getStatusText = () => {
    switch (qrStatus) {
      case 'loading': return t('Loading QR code...');
      case 'ready': return t('Scan the QR code with your WhatsApp Business app.');
      case 'scanning': return t('QR code scanned. Waiting for connection...');
      case 'connected': return t('Successfully connected to WhatsApp Business!');
      case 'error': return t('An error occurred. ') + error;
      default: return '';
    }
  };

  const getStatusIcon = () => {
    switch (qrStatus) {
      case 'loading': return <Loader2 className="h-5 w-5 animate-spin text-blue-400" />;
      case 'ready': return <QrCode className="h-5 w-5 text-green-400" />;
      case 'scanning': return <Info className="h-5 w-5 text-yellow-400" />;
      case 'connected': return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-green-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-green-400" />
          {t('WhatsApp QR Connection')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <Alert className="border-blue-500/30 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            {t('To connect your WhatsApp Business account, open the WhatsApp Business app on your phone, go to Linked Devices, and scan the QR code below.')}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-slate-800/50 border border-slate-700 h-96">
          {qrStatus === 'loading' && (
            <div className="flex flex-col items-center gap-4 text-slate-300">
              <Loader2 className="h-16 w-16 animate-spin text-blue-400" />
              <p className="text-lg">{getStatusText()}</p>
            </div>
          )}
          {qrStatus === 'ready' && qrCodeImg && (
            <div className="flex flex-col items-center gap-4">
              <img src={qrCodeImg} alt="WhatsApp QR Code" className="w-64 h-64 border border-slate-600 rounded-md p-2 bg-white" />
              <p className="text-lg text-white font-medium">{getStatusText()}</p>
              <Button onClick={fetchQrCode} variant="outline" className="border-slate-600 text-slate-300">
                {t('Refresh QR Code')}
              </Button>
            </div>
          )}
          {qrStatus === 'scanning' && (
            <div className="flex flex-col items-center gap-4 text-slate-300">
              <Loader2 className="h-16 w-16 animate-spin text-yellow-400" />
              <p className="text-lg">{getStatusText()}</p>
            </div>
          )}
          {qrStatus === 'connected' && (
            <div className="flex flex-col items-center gap-4 text-emerald-400">
              <CheckCircle className="h-16 w-16" />
              <p className="text-lg font-bold">{getStatusText()}</p>
            </div>
          )}
          {qrStatus === 'error' && (
            <div className="flex flex-col items-center gap-4 text-red-400">
              <AlertTriangle className="h-16 w-16" />
              <p className="text-lg">{getStatusText()}</p>
              <Button onClick={fetchQrCode} variant="outline" className="border-red-600 text-red-300">
                {t('Try Again')}
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
// --- End WhatsAppQRIntegration Component ---

export default function WhatsAppManager() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);
  
  const [settings, setSettings] = useState({
    provider: 'twilio', // twilio, meta, whatsapp-cloud, whatsapp-web (for QR)
    accountSid: '', // For QR, this might be a session token
    authToken: '',
    phoneNumber: '',
    webhookUrl: '',
    isActive: false,
    messageTemplate: '',
    autoReply: true,
    businessHours: {
      start: '10:00',
      end: '04:00',
      timezone: 'Asia/Jerusalem'
    },
    // New settings for AI control center
    managerPhone: '',
    managerName: '',
    whatsappGroupLink: '',
    vipSupportPhone: '',
    autoTransferVIP: false,
  });

  const [webhookStatus, setWebhookStatus] = useState({ whatsapp: 'inactive' }); // Added for webhook status

  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    messagesSent: 0,
    messagesReceived: 0,
    activeChats: 0,
    responseRate: 0
  });

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      const user = await User.me();
      if (user.settings?.whatsapp) {
        setSettings(prev => ({ ...prev, ...user.settings.whatsapp }));
        // Only test connection if it's not a QR based connection that's active.
        // For QR connections, the QR component itself handles the connection lifecycle.
        // We can optimistically set status to connected if previously configured via QR and active.
        if (user.settings.whatsapp.isActive && user.settings.whatsapp.provider !== 'whatsapp-web') {
          testConnection();
        } else if (user.settings.whatsapp.isActive && user.settings.whatsapp.provider === 'whatsapp-web') {
          setConnectionStatus('connected'); // Assume connected if QR based and active from last session
          setWebhookStatus(prev => ({ ...prev, whatsapp: 'active' })); // Set webhook status as active if QR connected
        }
      }
    } catch (error) {
      console.error('Error loading WhatsApp settings:', error);
    }
  };

  const loadStats = async () => {
    // In real implementation, load from UsageTracking entity
    setStats({
      messagesSent: 1247,
      messagesReceived: 892,
      activeChats: 23,
      responseRate: 89.2
    });
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (settings.accountSid && settings.authToken && settings.phoneNumber) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    }
    setIsLoading(false);
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      await User.updateMyUserData({
        settings: {
          ...user.settings,
          whatsapp: settings
        }
      });
      
      // Only test connection if settings.isActive and it's not a QR-based provider,
      // as QR connection is managed by the QR component itself.
      if (settings.isActive && settings.provider !== 'whatsapp-web') {
        await testConnection();
        // If non-QR connection, webhook status depends on successful connection/configuration
        setWebhookStatus(prev => ({ ...prev, whatsapp: 'active' })); 
      } else if (settings.isActive && settings.provider === 'whatsapp-web') {
        // If it's a QR-based connection and active, assume connection is stable.
        setConnectionStatus('connected'); 
        setWebhookStatus(prev => ({ ...prev, whatsapp: 'active' }));
      } else {
        setConnectionStatus('disconnected');
        setWebhookStatus(prev => ({ ...prev, whatsapp: 'inactive' }));
      }
      
      alert(t('Settings saved successfully!'));
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(t('Error saving settings'));
    }
    setIsLoading(false);
  };

  const sendTestMessage = async () => {
    setIsLoading(true);
    try {
      // Simulate sending test message
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(t('Test message sent successfully!'));
    } catch (error) {
      alert(t('Failed to send test message'));
    }
    setIsLoading(false);
  };

  const getStatusBadge = () => {
    const configs = {
      connected: { 
        icon: CheckCircle, 
        color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", 
        text: t("Connected") 
      },
      disconnected: { 
        icon: XCircle, 
        color: "bg-slate-500/20 text-slate-300 border-slate-500/30", 
        text: t("Disconnected") 
      },
      error: { 
        icon: AlertTriangle, 
        color: "bg-red-500/20 text-red-300 border-red-500/30", 
        text: t("Error") 
      }
    };
    
    const config = configs[connectionStatus];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 backdrop-blur-xl border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-400" />
              {t('WhatsApp Business API')}
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          {/* Updated Tabs defaultValue and grid-cols */}
          <Tabs defaultValue="qr-setup" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
              <TabsTrigger value="qr-setup" className="flex items-center gap-2">
                <QrCode className="w-3 h-3" />
                {t('QR Connection')}
              </TabsTrigger>
              <TabsTrigger value="setup">{t('Manual Setup')}</TabsTrigger>
              <TabsTrigger value="templates">{t('Templates')}</TabsTrigger>
              <TabsTrigger value="automation">{t('Automation')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('Analytics')}</TabsTrigger>
            </TabsList>

            {/* QR Connection Tab */}
            <TabsContent value="qr-setup">
              <WhatsAppQRIntegration 
                onConnectionSuccess={(connectionData) => {
                  console.log('WhatsApp connection successful:', connectionData);
                  
                  // עדכון הגדרות מהחיבור המוצלח
                  setSettings(prev => ({
                    ...prev,
                    provider: 'whatsapp-web',
                    accountSid: connectionData.session_token,
                    phoneNumber: connectionData.phone_number,
                    webhookUrl: connectionData.webhook_url,
                    isActive: true
                  }));
                  
                  // עדכון סטטוס החיבור
                  setConnectionStatus('connected'); // Explicitly set connection status to connected
                  setWebhookStatus(prev => ({ ...prev, whatsapp: 'active' }));
                  
                  alert(t('WhatsApp connected successfully! 🎉'));
                }}
              />
            </TabsContent>

            {/* Manual Setup Tab - keep existing manual setup code */}
            <TabsContent value="setup" className="space-y-4">
              <Alert className="border-blue-500/30 bg-blue-500/10">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  {t('Connect your WhatsApp Business account to start automated conversations with customers.')}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">{t('Provider')}</Label>
                    <select 
                      value={settings.provider}
                      onChange={(e) => setSettings(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded text-white"
                    >
                      <option value="twilio">Twilio (Recommended)</option>
                      <option value="meta">Meta Business API</option>
                      <option value="whatsapp-cloud">WhatsApp Cloud API</option>
                      <option value="whatsapp-web">WhatsApp Web (QR)</option> {/* Updated text for QR-based connections */}
                    </select>
                  </div>

                  <div>
                    <Label className="text-slate-300">{t('Account SID')}</Label>
                    <Input
                      value={settings.accountSid}
                      onChange={(e) => setSettings(prev => ({ ...prev, accountSid: e.target.value }))}
                      placeholder="AC..."
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">{t('Auth Token')}</Label>
                    <Input
                      type="password"
                      value={settings.authToken}
                      onChange={(e) => setSettings(prev => ({ ...prev, authToken: e.target.value }))}
                      placeholder="••••••••"
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">{t('WhatsApp Number')}</Label>
                    <Input
                      value={settings.phoneNumber}
                      onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+972501234567"
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-medium text-white mb-2">{t('Connection Status')}</h4>
                    <div className="space-y-2">
                      {getStatusBadge()}
                      <div className="text-sm text-slate-400">
                        {connectionStatus === 'connected' ? 
                          t('✅ Ready to send and receive messages') :
                          t('❌ Please configure your credentials')
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div>
                      <div className="font-medium text-white">{t('Enable WhatsApp API')}</div>
                      <div className="text-sm text-slate-400">{t('Activate automated messaging')}</div>
                    </div>
                    <Switch
                      checked={settings.isActive}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={testConnection}
                      disabled={isLoading || settings.provider === 'whatsapp-web'} // Disable 'Test Connection' button if provider is QR-based
                      variant="outline"
                      className="w-full border-green-500/50 text-green-300 hover:bg-green-500/20"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      {isLoading ? t('Testing...') : t('Test Connection')}
                    </Button>
                    
                    <Button 
                      onClick={sendTestMessage}
                      disabled={isLoading || connectionStatus !== 'connected'}
                      variant="outline"
                      className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {t('Send Test Message')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Button 
                  onClick={saveSettings}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isLoading ? t('Saving...') : t('Save Settings')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">{t('Message Templates')}</h4>
                  <div className="space-y-3">
                    {[
                      { name: t('Welcome Message'), template: t('Hey {{name}}! Welcome to our VIP list 🎉'), approved: true },
                      { name: t('Event Invitation'), template: t('🔥 {{name}}, amazing party tonight at {{venue}}! Free entry until midnight'), approved: true },
                      { name: t('VIP Offer'), template: t('Exclusive for you {{name}} - VIP table booking with 20% off 🍾'), approved: false }
                    ].map((template, index) => (
                      <div key={index} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{template.name}</span>
                          <Badge className={template.approved ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
                            {template.approved ? t('Approved') : t('Pending')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">{template.template}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">{t('Create New Template')}</h4>
                  <div className="space-y-3">
                    <Input
                      placeholder={t('Template name')}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <textarea
                      placeholder={t('Template message (use {{name}}, {{venue}}, etc. for personalization)')}
                      className="w-full h-24 p-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400"
                    />
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      {t('Submit for Approval')}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">{t('Auto Reply Settings')}</h4>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div>
                      <div className="font-medium text-white">{t('Auto Reply')}</div>
                      <div className="text-sm text-slate-400">{t('Respond automatically to incoming messages')}</div>
                    </div>
                    <Switch
                      checked={settings.autoReply}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoReply: checked }))}
                    />
                  </div>

                  {/* הוספת מספר העברה */}
                  <div className="space-y-3 p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                    <h5 className="font-medium text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-400" />
                      {t('Transfer Numbers & Contacts')}
                    </h5>
                    
                    <div>
                      <Label className="text-slate-300">{t('Club Manager Phone (for transfer)')}</Label>
                      <Input
                        value={settings.managerPhone || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, managerPhone: e.target.value }))}
                        placeholder="+972501234567"
                        className="bg-slate-800 border-slate-700 text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300">{t('Manager Name')}</Label>
                      <Input
                        value={settings.managerName || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, managerName: e.target.value }))}
                        placeholder={t('Danny - Club Manager')}
                        className="bg-slate-800 border-slate-700 text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300">{t('WhatsApp Group Link')}</Label>
                      <Input
                        value={settings.whatsappGroupLink || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, whatsappGroupLink: e.target.value }))}
                        placeholder="https://chat.whatsapp.com/..."
                        className="bg-slate-800 border-slate-700 text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300">{t('VIP/Customer Service Number')}</Label>
                      <Input
                        value={settings.vipSupportPhone || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, vipSupportPhone: e.target.value }))}
                        placeholder="+972521234567"
                        className="bg-slate-800 border-slate-700 text-white mt-1"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <div className="font-medium text-white">{t('Automatic Transfer')}</div>
                        <div className="text-sm text-slate-400">{t('Automatically transfer VIP customers to manager')}</div>
                      </div>
                      <Switch
                        checked={settings.autoTransferVIP || false}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoTransferVIP: checked }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">{t('Business Hours')}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Input
                        type="time"
                        value={settings.businessHours.start}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          businessHours: { ...prev.businessHours, start: e.target.value }
                        }))}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                      <Input
                        type="time"
                        value={settings.businessHours.end}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          businessHours: { ...prev.businessHours, end: e.target.value }
                        }))}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">{t('Webhook URL')}</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={settings.webhookUrl}
                        onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        placeholder="https://your-domain.com/webhook"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                      <Button variant="outline" className="border-slate-600">
                        <Webhook className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">{t('AI Response Rules')}</h4>
                  <div className="space-y-3">
                    {[
                      { trigger: t('greeting'), response: t('Auto welcome new contacts'), enabled: true },
                      { trigger: t('price'), response: t('Send pricing information'), enabled: true },
                      { trigger: t('location'), response: t('Share venue address'), enabled: false },
                      { trigger: t('booking'), response: t('Transfer to human agent'), enabled: true }
                    ].map((rule, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                        <div>
                          <div className="font-medium text-white capitalize">{rule.trigger}</div>
                          <div className="text-sm text-slate-400">{rule.response}</div>
                        </div>
                        <Switch checked={rule.enabled} onCheckedChange={() => {}} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.messagesSent}</div>
                  <div className="text-sm text-slate-400">{t('Messages Sent')}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.messagesReceived}</div>
                  <div className="text-sm text-slate-400">{t('Messages Received')}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.activeChats}</div>
                  <div className="text-sm text-slate-400">{t('Active Chats')}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.responseRate}%</div>
                  <div className="text-sm text-slate-400">{t('Response Rate')}</div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6">
                <h4 className="font-medium text-white mb-4">{t('Recent Activity')}</h4>
                <div className="space-y-3">
                  {[
                    { time: '2 min ago', event: t('New message from +972501234567'), status: 'success' },
                    { time: '5 min ago', event: t('Auto-reply sent to Sarah Miller'), status: 'info' },
                    { time: '12 min ago', event: t('Campaign message delivered to 15 contacts'), status: 'success' },
                    { time: '1 hour ago', event: t('Webhook failed - retrying'), status: 'error' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-400' :
                        activity.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm text-white">{activity.event}</div>
                        <div className="text-xs text-slate-400">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
