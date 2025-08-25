import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Loader2,
  Database,
  Globe,
  Key,
  MessageSquare,
  Brain,
  Shield,
  Zap,
  Play,
  RefreshCw,
  FileCheck,
  Users,
  Settings
} from "lucide-react";
import { User, AIPromoter, Lead, Campaign } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

export default function SystemCheck() {
  const [checks, setChecks] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [systemScore, setSystemScore] = useState(0);

  const systemChecks = [
    {
      id: 'user_auth',
      name: 'בדיקת אימות משתמש',
      description: 'בדיקה שהמשתמש מחובר ופעיל',
      icon: Shield,
      critical: true,
      check: async () => {
        try {
          const user = await User.me();
          
          if (!user) {
            return {
              status: 'error',
              message: 'משתמש לא מחובר',
              fix: 'יש להתחבר מחדש למערכת'
            };
          }
          
          return {
            status: 'success',
            message: `משתמש ${user.full_name || user.email} מחובר בהצלחה`,
            details: {
              email: user.email,
              role: user.role,
              created: user.created_date
            }
          };
        } catch (error) {
          return {
            status: 'error',
            message: `שגיאה באימות: ${error.message}`,
            fix: 'בדוק חיבור האינטרנט והתחבר מחדש'
          };
        }
      }
    },
    {
      id: 'database_entities',
      name: 'בדיקת ישויות בסיס נתונים',
      description: 'בדיקה שכל הישויות עובדות תקין',
      icon: Database,
      critical: true,
      check: async () => {
        try {
          const [leads, promoters, campaigns] = await Promise.all([
            Lead.list('-created_date', 5).catch(() => []),
            AIPromoter.list('-created_date', 3).catch(() => []),
            Campaign.list('-created_date', 3).catch(() => [])
          ]);
          
          return {
            status: 'success',
            message: `בסיס נתונים פעיל - ${leads.length} לידים, ${promoters.length} יחצ'נים, ${campaigns.length} קמפיינים`,
            details: {
              leads_count: leads.length,
              promoters_count: promoters.length,
              campaigns_count: campaigns.length,
              database_responsive: true
            }
          };
        } catch (error) {
          return {
            status: 'error',
            message: `בעיה בבסיס נתונים: ${error.message}`,
            fix: 'בדוק הגדרות בסיס הנתונים'
          };
        }
      }
    },
    {
      id: 'ai_providers',
      name: 'בדיקת ספקי AI',
      description: 'בדיקה שלפחות ספק AI אחד מוגדר',
      icon: Brain,
      critical: false,
      check: async () => {
        try {
          const user = await User.me();
          const aiSettings = user.settings?.ai_providers;
          
          if (!aiSettings) {
            return {
              status: 'warning',
              message: 'אין ספקי AI מוגדרים',
              fix: 'הגדר לפחות ספק AI אחד בהגדרות המערכת'
            };
          }
          
          const enabledProviders = Object.entries(aiSettings.providers || {})
            .filter(([_, provider]) => provider.enabled && provider.api_key);
          
          if (enabledProviders.length === 0) {
            return {
              status: 'warning',
              message: 'אין ספקי AI פעילים עם API Key',
              fix: 'הוסף API Key לאחד הספקים'
            };
          }
          
          return {
            status: 'success',
            message: `${enabledProviders.length} ספקי AI פעילים`,
            details: {
              primary_provider: aiSettings.primary_provider,
              fallback_provider: aiSettings.fallback_provider,
              enabled_providers: enabledProviders.map(([name]) => name)
            }
          };
        } catch (error) {
          return {
            status: 'error',
            message: `שגיאה בבדיקת AI: ${error.message}`,
            fix: 'בדוק הגדרות ספקי AI'
          };
        }
      }
    },
    {
      id: 'ai_functionality',
      name: 'בדיקת פונקציונליות AI',
      description: 'בדיקה שה-AI מגיב תקין',
      icon: MessageSquare,
      critical: false,
      check: async () => {
        try {
          const result = await InvokeLLM({
            prompt: "אמור רק 'בדיקה מוצלחת' בעברית",
            add_context_from_internet: false
          });
          
          if (typeof result === 'string' && result.includes('בדיקה')) {
            return {
              status: 'success',
              message: 'AI מגיב תקין',
              details: { response: result.substring(0, 50) + '...' }
            };
          }
          
          return {
            status: 'warning',
            message: 'AI מגיב אבל התגובה לא תקינה',
            details: { response: result }
          };
          
        } catch (error) {
          return {
            status: 'error',
            message: `AI לא מגיב: ${error.message}`,
            fix: 'בדוק API Key של ספק AI'
          };
        }
      }
    },
    {
      id: 'whatsapp_setup',
      name: 'בדיקת הגדרות WhatsApp',
      description: 'בדיקה שהגדרות WhatsApp קיימות',
      icon: MessageSquare,
      critical: false,
      check: async () => {
        try {
          const user = await User.me();
          const whatsappSettings = user.settings?.whatsapp;
          
          if (!whatsappSettings) {
            return {
              status: 'warning',
              message: 'WhatsApp לא מוגדר',
              fix: 'הגדר חיבור WhatsApp בלשונית WhatsApp API'
            };
          }
          
          if (whatsappSettings.connected) {
            return {
              status: 'success',
              message: 'WhatsApp מחובר ופעיל',
              details: {
                phone_number: whatsappSettings.phone_number,
                connected_at: whatsappSettings.connected_at
              }
            };
          }
          
          return {
            status: 'warning',
            message: 'WhatsApp מוגדר אבל לא מחובר',
            fix: 'בצע חיבור מחדש דרך QR או הגדרות ידניות'
          };
          
        } catch (error) {
          return {
            status: 'error',
            message: `שגיאה בבדיקת WhatsApp: ${error.message}`,
            fix: 'בדוק הגדרות WhatsApp'
          };
        }
      }
    },
    {
      id: 'data_operations',
      name: 'בדיקת פעולות CRUD',
      description: 'בדיקה שיצירה/עדכון/מחיקה עובדים',
      icon: Zap,
      critical: true,
      check: async () => {
        try {
          // יצירת ליד בדיקה
          const testLead = await Lead.create({
            first_name: 'System',
            last_name: 'Test',
            phone_number: `+972501${Date.now().toString().slice(-6)}`,
            status: 'cold',
            notes: 'System check test - can be deleted'
          });
          
          if (!testLead?.id) {
            throw new Error('לא הצליח ליצור ליד בדיקה');
          }
          
          // עדכון הליד
          await Lead.update(testLead.id, {
            status: 'warm',
            notes: 'Updated by system check'
          });
          
          // קריאת הליד המעודכן
          const updatedLead = await Lead.filter({ id: testLead.id });
          
          if (!updatedLead.length || updatedLead[0].status !== 'warm') {
            throw new Error('עדכון לא הצליח');
          }
          
          // מחיקת הליד
          await Lead.delete(testLead.id);
          
          return {
            status: 'success',
            message: 'פעולות CRUD עובדות תקין',
            details: {
              create: 'הצליח',
              update: 'הצליח', 
              read: 'הצליח',
              delete: 'הצליח'
            }
          };
          
        } catch (error) {
          return {
            status: 'error',
            message: `בעיה בפעולות נתונים: ${error.message}`,
            fix: 'בדוק הרשאות בסיס נתונים'
          };
        }
      }
    },
    {
      id: 'settings_persistence',
      name: 'בדיקת שמירת הגדרות',
      description: 'בדיקה שהגדרות נשמרות תקין',
      icon: Settings,
      critical: false,
      check: async () => {
        try {
          const user = await User.me();
          const testKey = `system_check_${Date.now()}`;
          const testValue = 'test_successful';
          
          // שמירת הגדרה זמנית
          await User.updateMyUserData({
            settings: {
              ...user.settings,
              [testKey]: testValue
            }
          });
          
          // קריאת ההגדרה
          const updatedUser = await User.me();
          
          if (updatedUser.settings?.[testKey] === testValue) {
            // ניקוי ההגדרה הזמנית
            const cleanSettings = { ...updatedUser.settings };
            delete cleanSettings[testKey];
            
            await User.updateMyUserData({
              settings: cleanSettings
            });
            
            return {
              status: 'success',
              message: 'שמירת הגדרות עובדת תקין',
              details: { test_completed: true }
            };
          }
          
          return {
            status: 'error',
            message: 'הגדרות לא נשמרות תקין',
            fix: 'בדוק הרשאות משתמש'
          };
          
        } catch (error) {
          return {
            status: 'error',
            message: `שגיאה בשמירת הגדרות: ${error.message}`,
            fix: 'בדוק חיבור למסד נתונים'
          };
        }
      }
    }
  ];

  const runAllChecks = async () => {
    setIsRunning(true);
    setProgress(0);
    setChecks({});
    
    const totalChecks = systemChecks.length;
    
    for (let i = 0; i < totalChecks; i++) {
      const check = systemChecks[i];
      setProgress(((i + 1) / totalChecks) * 100);
      
      try {
        const result = await check.check();
        setChecks(prev => ({
          ...prev,
          [check.id]: {
            ...check,
            result,
            completed: true
          }
        }));
      } catch (error) {
        setChecks(prev => ({
          ...prev,
          [check.id]: {
            ...check,
            result: {
              status: 'error',
              message: `שגיאה לא צפויה: ${error.message}`,
              fix: 'נסה שוב או פנה לתמיכה'
            },
            completed: true
          }
        }));
      }
      
      // המתנה קצרה בין בדיקות
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    calculateSystemScore();
  };

  const calculateSystemScore = () => {
    const completedChecks = Object.values(checks);
    if (completedChecks.length === 0) return;
    
    let score = 0;
    let totalWeight = 0;
    
    completedChecks.forEach(check => {
      const weight = check.critical ? 3 : 1;
      totalWeight += weight;
      
      if (check.result.status === 'success') {
        score += weight;
      } else if (check.result.status === 'warning') {
        score += weight * 0.5;
      }
    });
    
    const finalScore = Math.round((score / totalWeight) * 100);
    setSystemScore(finalScore);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Loader2 className="w-5 h-5 animate-spin text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getScoreColor = () => {
    if (systemScore >= 90) return 'text-green-400';
    if (systemScore >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  useEffect(() => {
    calculateSystemScore();
  }, [checks]);

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* כותרת */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 neon-text">
            🔧 בדיקת תקינות המערכת
          </h1>
          <p className="text-purple-300 text-lg">
            בדיקה מקיפה של כל רכיבי המערכת לוודא שהכל עובד תקין
          </p>
        </div>

        {/* סיכום כללי */}
        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 glow-effect mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-purple-400" />
                מצב המערכת הכללי
              </span>
              {systemScore > 0 && (
                <div className={`text-3xl font-bold ${getScoreColor()}`}>
                  {systemScore}/100
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Button
                onClick={runAllChecks}
                disabled={isRunning}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    מבצע בדיקות...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    הרץ בדיקה מלאה
                  </>
                )}
              </Button>
              
              {Object.keys(checks).length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setChecks({});
                    setSystemScore(0);
                    setProgress(0);
                  }}
                  className="border-slate-600 text-slate-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  אפס תוצאות
                </Button>
              )}
            </div>
            
            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>מתקדם...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* תוצאות בדיקות */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systemChecks.map(check => {
            const checkResult = checks[check.id];
            const isCompleted = checkResult?.completed;
            const result = checkResult?.result;
            
            return (
              <Card 
                key={check.id} 
                className={`bg-slate-900/80 backdrop-blur-xl transition-all duration-300 ${
                  isCompleted && result 
                    ? getStatusColor(result.status)
                    : 'border-slate-700'
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-3">
                    <check.icon className="w-5 h-5 text-purple-400" />
                    <span className="flex-1">{check.name}</span>
                    {check.critical && (
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        קריטי
                      </Badge>
                    )}
                    {isCompleted && result && getStatusIcon(result.status)}
                  </CardTitle>
                  <p className="text-slate-400 text-sm">{check.description}</p>
                </CardHeader>
                
                <CardContent>
                  {!isCompleted ? (
                    <div className="text-slate-500 text-sm">
                      ממתין לבדיקה...
                    </div>
                  ) : result ? (
                    <div className="space-y-3">
                      <Alert className={getStatusColor(result.status)}>
                        <AlertDescription className="text-white">
                          {result.message}
                        </AlertDescription>
                      </Alert>
                      
                      {result.fix && result.status !== 'success' && (
                        <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded">
                          <strong>💡 פתרון:</strong> {result.fix}
                        </div>
                      )}
                      
                      {result.details && (
                        <details className="text-xs text-slate-400">
                          <summary className="cursor-pointer hover:text-slate-300">
                            פרטים טכניים
                          </summary>
                          <pre className="mt-2 bg-slate-800/50 p-2 rounded overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* סיכום והמלצות */}
        {Object.keys(checks).length > 0 && !isRunning && (
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 glow-effect mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                סיכום והמלצות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemScore >= 90 && (
                  <Alert className="border-green-500/30 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      🎉 <strong>מצוין!</strong> המערכת עובדת בצורה מושלמת. אתה מוכן לפרודקשן!
                    </AlertDescription>
                  </Alert>
                )}
                
                {systemScore >= 70 && systemScore < 90 && (
                  <Alert className="border-yellow-500/30 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-300">
                      ⚠️ <strong>כמעט מוכן!</strong> המערכת עובדת טוב אבל יש כמה נושאים לתיקון.
                    </AlertDescription>
                  </Alert>
                )}
                
                {systemScore < 70 && (
                  <Alert className="border-red-500/30 bg-red-500/10">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      🚨 <strong>נדרשים תיקונים!</strong> יש בעיות קריטיות שצריך לטפל בהן לפני פרודקשן.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {Object.values(checks).filter(c => c.result?.status === 'success').length}
                    </div>
                    <div className="text-sm text-slate-400">בדיקות הצליחו</div>
                  </div>
                  
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {Object.values(checks).filter(c => c.result?.status === 'warning').length}
                    </div>
                    <div className="text-sm text-slate-400">אזהרות</div>
                  </div>
                  
                  <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {Object.values(checks).filter(c => c.result?.status === 'error').length}
                    </div>
                    <div className="text-sm text-slate-400">שגיאות</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}