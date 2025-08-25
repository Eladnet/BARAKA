import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  DollarSign, 
  Zap, 
  Shield,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";
import { User } from "@/api/entities";

export default function AIProviderManager() {
  const [providers, setProviders] = useState({
    openai: {
      enabled: false,
      api_key: '',
      model: 'gpt-4',
      cost_per_1k: 0.03,
      speed: 'fast',
      quality: 'excellent'
    },
    gemini: {
      enabled: false,
      api_key: '',
      model: 'gemini-pro',
      cost_per_1k: 0.001,
      speed: 'very_fast',
      quality: 'very_good'
    },
    claude: {
      enabled: false,
      api_key: '',
      model: 'claude-3-sonnet',
      cost_per_1k: 0.015,
      speed: 'medium',
      quality: 'excellent'
    }
  });
  
  const [primaryProvider, setPrimaryProvider] = useState('gemini');
  const [fallbackProvider, setFallbackProvider] = useState('openai');
  const [smartRouting, setSmartRouting] = useState(true);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    loadAISettings();
  }, []);

  const loadAISettings = async () => {
    try {
      const user = await User.me();
      const aiSettings = user.settings?.ai_providers;
      
      if (aiSettings) {
        setProviders(prev => ({ ...prev, ...aiSettings.providers }));
        setPrimaryProvider(aiSettings.primary_provider || 'gemini');
        setFallbackProvider(aiSettings.fallback_provider || 'openai');
        setSmartRouting(aiSettings.smart_routing ?? true);
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const saveAISettings = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      
      await User.updateMyUserData({
        settings: {
          ...user.settings,
          ai_providers: {
            providers,
            primary_provider: primaryProvider,
            fallback_provider: fallbackProvider,
            smart_routing: smartRouting,
            updated_at: new Date().toISOString()
          }
        }
      });
      
      alert('הגדרות AI נשמרו בהצלחה! 🎉');
    } catch (error) {
      console.error('Error saving AI settings:', error);
      alert(`שגיאה בשמירה: ${error.message}`);
    }
    setIsLoading(false);
  };

  const updateProvider = (providerName, field, value) => {
    setProviders(prev => ({
      ...prev,
      [providerName]: {
        ...prev[providerName],
        [field]: value
      }
    }));
  };

  const testProvider = async (providerName) => {
    const provider = providers[providerName];
    if (!provider.api_key) {
      alert('נא להזין API Key תחילה');
      return;
    }

    setTestResults(prev => ({ ...prev, [providerName]: { testing: true } }));

    try {
      // סימולציה של בדיקת API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // בפרודקשן - כאן יהיה קריאה אמיתית ל-API
      const mockResult = {
        success: Math.random() > 0.2, // 80% סיכוי להצלחה
        latency: Math.floor(Math.random() * 2000) + 500,
        cost_estimate: provider.cost_per_1k,
        quality_score: Math.floor(Math.random() * 20) + 80
      };
      
      setTestResults(prev => ({
        ...prev,
        [providerName]: {
          testing: false,
          ...mockResult,
          message: mockResult.success ? 'חיבור תקין!' : 'שגיאה בחיבור'
        }
      }));
      
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [providerName]: {
          testing: false,
          success: false,
          message: `שגיאה: ${error.message}`
        }
      }));
    }
  };

  const getProviderIcon = (providerName) => {
    switch (providerName) {
      case 'openai': return '🤖';
      case 'gemini': return '💎';
      case 'claude': return '🧠';
      default: return '🔮';
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-emerald-400';
      case 'very_good': return 'text-blue-400';
      case 'good': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getSpeedColor = (speed) => {
    switch (speed) {
      case 'very_fast': return 'text-emerald-400';
      case 'fast': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'slow': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const enabledProviders = Object.entries(providers).filter(([_, provider]) => provider.enabled);
  const totalMonthlyCost = enabledProviders.reduce((sum, [_, provider]) => sum + (provider.cost_per_1k * 100), 0);

  return (
    <div className="space-y-6">
      
      {/* כותרת וסיכום */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            ניהול ספקי AI - חיסכון בעלויות
          </CardTitle>
          <p className="text-gray-300">
            נהל מספר ספקי AI, חסוך עלויות ובטח ביציבות עם מערכת גיבוי חכמה
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
              <TrendingDown className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-400">
                {Math.round(((0.03 - 0.001) / 0.03) * 100)}%
              </div>
              <div className="text-sm text-emerald-300">חיסכון עם Gemini</div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{enabledProviders.length}</div>
              <div className="text-sm text-blue-300">ספקים פעילים</div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">${totalMonthlyCost.toFixed(2)}</div>
              <div className="text-sm text-yellow-300">עלות חודשית משוערת</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* הגדרות כלליות */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            הגדרות ניתוב חכם
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">ספק ראשי</Label>
              <Select value={primaryProvider} onValueChange={setPrimaryProvider}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {Object.entries(providers).map(([key, provider]) => (
                    <SelectItem key={key} value={key} className="text-slate-300">
                      {getProviderIcon(key)} {key.toUpperCase()} - ${provider.cost_per_1k}/1K
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">ספק גיבוי</Label>
              <Select value={fallbackProvider} onValueChange={setFallbackProvider}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {Object.entries(providers).map(([key, provider]) => (
                    <SelectItem key={key} value={key} className="text-slate-300">
                      {getProviderIcon(key)} {key.toUpperCase()} - ${provider.cost_per_1k}/1K
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <div className="font-medium text-white">ניתוב חכם אוטומטי</div>
              <div className="text-sm text-slate-400">
                המערכת תבחר אוטומטית את הספק הטוב ביותר לכל משימה
              </div>
            </div>
            <Switch 
              checked={smartRouting}
              onCheckedChange={setSmartRouting}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              onClick={() => setShowApiKeys(!showApiKeys)}
              className="border-slate-600 text-slate-300"
            >
              {showApiKeys ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showApiKeys ? 'הסתר' : 'הצג'} API Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* הגדרות ספקים */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(providers).map(([providerName, provider]) => {
          const testResult = testResults[providerName];
          
          return (
            <Card key={providerName} className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">{getProviderIcon(providerName)}</span>
                    {providerName.toUpperCase()}
                  </CardTitle>
                  <Switch 
                    checked={provider.enabled}
                    onCheckedChange={(checked) => updateProvider(providerName, 'enabled', checked)}
                  />
                </div>
                <div className="flex gap-2">
                  <Badge className={`${getQualityColor(provider.quality)} bg-current/20`}>
                    {provider.quality}
                  </Badge>
                  <Badge className={`${getSpeedColor(provider.speed)} bg-current/20`}>
                    {provider.speed}
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300">
                    ${provider.cost_per_1k}/1K
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">API Key</Label>
                  <Input
                    type={showApiKeys ? "text" : "password"}
                    value={provider.api_key}
                    onChange={(e) => updateProvider(providerName, 'api_key', e.target.value)}
                    placeholder={`הזן ${providerName.toUpperCase()} API Key`}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">מודל</Label>
                  <Select 
                    value={provider.model} 
                    onValueChange={(value) => updateProvider(providerName, 'model', value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {providerName === 'openai' && (
                        <>
                          <SelectItem value="gpt-4" className="text-slate-300">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo" className="text-slate-300">GPT-3.5 Turbo</SelectItem>
                        </>
                      )}
                      {providerName === 'gemini' && (
                        <>
                          <SelectItem value="gemini-pro" className="text-slate-300">Gemini Pro</SelectItem>
                          <SelectItem value="gemini-pro-vision" className="text-slate-300">Gemini Pro Vision</SelectItem>
                        </>
                      )}
                      {providerName === 'claude' && (
                        <>
                          <SelectItem value="claude-3-sonnet" className="text-slate-300">Claude 3 Sonnet</SelectItem>
                          <SelectItem value="claude-3-haiku" className="text-slate-300">Claude 3 Haiku</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={() => testProvider(providerName)}
                  disabled={!provider.api_key || testResult?.testing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {testResult?.testing ? (
                    <>
                      <TestTube className="w-4 h-4 mr-2 animate-spin" />
                      בודק חיבור...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      בדוק חיבור
                    </>
                  )}
                </Button>
                
                {testResult && !testResult.testing && (
                  <Alert className={testResult.success ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}>
                    {testResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                    <AlertDescription className={testResult.success ? 'text-green-300' : 'text-red-300'}>
                      {testResult.message}
                      {testResult.success && testResult.latency && (
                        <div className="text-xs mt-1">
                          זמן תגובה: {testResult.latency}ms | איכות: {testResult.quality_score}/100
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* כפתור שמירה */}
      <div className="flex justify-end">
        <Button 
          onClick={saveAISettings}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              שומר...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              שמור הגדרות AI
            </>
          )}
        </Button>
      </div>
    </div>
  );
}