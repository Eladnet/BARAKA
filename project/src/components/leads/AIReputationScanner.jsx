
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  Users,
  MessageSquare,
  Image,
  Flag,
  TrendingUp,
  Instagram,
  Facebook,
  Twitter,
  Search,
  Star,
  X,
  Brain,
  Zap,
  DollarSign,
  CreditCard,
  Wallet
} from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";

export default function AIReputationScanner({ leadData, onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const SCAN_COST = 0.25; // $0.25 per scan

  React.useEffect(() => {
    // Check user balance when component loads
    checkUserBalance();
  }, []);

  const checkUserBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const user = await User.me();
      const balance = user.account_balance || 0;
      console.log('User balance:', balance); // Debug log
      setUserBalance(balance);
    } catch (error) {
      console.error('Error checking user balance:', error);
      setUserBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const deductPayment = async () => {
    try {
      const user = await User.me();
      const currentBalance = user.account_balance || 0;
      
      if (currentBalance < SCAN_COST) {
        throw new Error('אין מספיק כסף בחשבון לביצוע הסריקה');
      }

      const newBalance = currentBalance - SCAN_COST;
      await User.updateMyUserData({ 
        account_balance: newBalance,
        last_reputation_scan_cost: SCAN_COST,
        last_reputation_scan_date: new Date().toISOString(),
        reputation_scans_count: (user.reputation_scans_count || 0) + 1,
        total_spent: (user.total_spent || 0) + SCAN_COST
      });

      setUserBalance(newBalance);
      return true;
    } catch (error) {
      console.error('Payment deduction failed:', error);
      throw error;
    }
  };

  const reputationScanner = async () => {
    // בדיקה בסיסית של נתונים
    if (!leadData) {
      alert('לא נמצא מידע על הלקוח');
      return;
    }

    // בדיקה אם יש לפחות פרופיל אחד ברשתות חברתיות או מספר טלפון
    const hasInstagram = leadData.instagram_handle && leadData.instagram_handle.trim() !== '';
    const hasFacebook = leadData.facebook_profile && leadData.facebook_profile.trim() !== '';
    const hasTiktok = leadData.tiktok_handle && leadData.tiktok_handle.trim() !== '';
    const hasPhone = leadData.phone_number && leadData.phone_number.trim() !== '';

    if (!hasInstagram && !hasFacebook && !hasTiktok && !hasPhone) {
      alert('לא נמצאו פרופילי רשתות חברתיות או מספר טלפון לסריקה. נא להוסיף לפחות אחד מהפרטים הבאים: Instagram, Facebook, TikTok או מספר טלפון');
      return;
    }

    // בדיקת יתרה
    await checkUserBalance(); // Ensure current balance is fetched
    if (userBalance < SCAN_COST) {
      setShowPaymentWarning(true);
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResults(null);
    setShowPaymentWarning(false);

    try {
      // ניכוי תשלום תחילה
      setCurrentPhase(`מעבד תשלום $${SCAN_COST}...`);
      setScanProgress(5);
      await deductPayment();

      // שלב 1: ניתוח פרופיל
      setCurrentPhase('מנתח פרופילי רשתות חברתיות...');
      setScanProgress(20);

      const availableProfiles = [];
      if (hasInstagram) availableProfiles.push(`אינסטגרם: ${leadData.instagram_handle}`);
      if (hasFacebook) availableProfiles.push(`פייסבוק: ${leadData.facebook_profile}`);
      if (hasTiktok) availableProfiles.push(`טיקטוק: ${leadData.tiktok_handle}`);

      const profileAnalysisPrompt = `
        אתה מומחה בביטחון דיגיטלי ואימות זהות. עליך לבצע סריקת אמינות מקיפה עבור:

        שם: ${leadData.first_name || 'לא ידוע'} ${leadData.last_name || ''}
        טלפון: ${leadData.phone_number || 'לא זמין'}
        ${availableProfiles.length > 0 ? availableProfiles.join('\n') : 'אין פרופילי רשתות חברתיות'}
        מיקום: ${leadData.location || 'לא ידוע'}
        מקצוע: ${leadData.profession || 'לא ידוע'}

        בצע חקירה מעמיקה ובדוק:
        1. אמינות הפרופיל (פרופיל אמיתי/מזויף)
        2. כמות ואיכות החברים/עוקבים
        3. תוכן הפוסטים - זיהוי התנהגות בעייתית
        4. שפה אלימה או פוגענית
        5. סימנים לפעילות חשודה
        6. התאמה לקהל יעד של מועדון לילה יוקרתי
        7. ניתוח דפוסי התנהגות חשודים
        8. בדיקת עקביות בין פלטפורמות שונות
        9. אם אין רשתות חברתיות - נתח לפי השם והטלפון בלבד

        אם אין מספיק מידע - תן ציון בהתבסס על המידע הזמין.
      `;

      const profileAnalysis = await InvokeLLM({
        prompt: profileAnalysisPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            overall_reputation_score: { type: "number", minimum: 0, maximum: 100 },
            authenticity_score: { type: "number", minimum: 0, maximum: 100 },
            risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
            social_media_analysis: {
              type: "object",
              properties: {
                follower_quality: { type: "string", enum: ["authentic", "suspicious", "fake"] },
                content_appropriateness: { type: "string", enum: ["appropriate", "questionable", "inappropriate"] },
                engagement_patterns: { type: "string" },
                red_flags: { type: "array", items: { type: "string" } }
              }
            },
            behavioral_analysis: {
              type: "object",
              properties: {
                language_toxicity: { type: "string", enum: ["clean", "mild", "toxic"] },
                violence_indicators: { type: "boolean" },
                fake_indicators: { type: "array", items: { type: "string" } },
                credibility_factors: { type: "array", items: { type: "string" } }
              }
            },
            target_audience_fit: {
              type: "object",
              properties: {
                nightlife_compatibility: { type: "number", minimum: 0, maximum: 100 },
                luxury_market_fit: { type: "number", minimum: 0, maximum: 100 },
                spending_potential: { type: "string", enum: ["low", "medium", "high", "premium"] }
              }
            },
            recommendations: {
              type: "object",
              properties: {
                should_engage: { type: "boolean" },
                engagement_approach: { type: "string" },
                precautions: { type: "array", items: { type: "string" } },
                follow_up_actions: { type: "array", items: { type: "string" } }
              }
            },
            detailed_report: { type: "string" },
            scan_cost: { type: "number", default: 0.25 }
          },
          required: ["overall_reputation_score", "risk_level", "recommendations", "detailed_report"]
        }
      });

      setScanProgress(100);
      setCurrentPhase('סריקה הושלמה בהצלחה!');

      // הוספת מידע תשלום לתוצאות
      profileAnalysis.scan_cost = SCAN_COST;
      profileAnalysis.scan_timestamp = new Date().toISOString();
      profileAnalysis.remaining_balance = userBalance - SCAN_COST;

      setScanResults(profileAnalysis);

      if (onScanComplete) {
        onScanComplete(profileAnalysis);
      }

    } catch (error) {
      console.error('Reputation scan failed:', error);
      alert(`שגיאה בסריקה: ${error.message}`);

      // החזרת כסף במקרה של שגיאה אחרי ניכוי תשלום
      try {
        const user = await User.me(); // Fetch latest balance before refund
        const currentBalance = user.account_balance || 0;
        await User.updateMyUserData({
          account_balance: currentBalance + SCAN_COST
        });
        setUserBalance(currentBalance + SCAN_COST);
      } catch (refundError) {
        console.error('Failed to refund payment:', refundError);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handlePaymentTopUp = () => {
    // Redirect to pricing page or payment system
    window.open(createPageUrl('Pricing'), '_blank');
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="w-5 h-5 text-red-400" />
          AI Reputation Scanner
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            חדש!
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/30 rounded-lg">
          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            חדשנות: סריקת אמינות AI
          </h4>
          <p className="text-sm text-slate-300 mb-3">
            מערכת בינה מלאכותית שסורקת את פרופיל הלקוח ברשתות חברתיות כדי להעריך אם מדובר בלקוח איכותי או "פייק".
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-emerald-300">
              <CheckCircle className="w-3 h-3" />
              ניתוח חברים אמיתיים
            </div>
            <div className="flex items-center gap-1 text-emerald-300">
              <CheckCircle className="w-3 h-3" />
              זיהוי התנהגות בעייתית
            </div>
            <div className="flex items-center gap-1 text-emerald-300">
              <CheckCircle className="w-3 h-3" />
              בדיקת אותנטיקה
            </div>
            <div className="flex items-center gap-1 text-emerald-300">
              <CheckCircle className="w-3 h-3" />
              הערכת איכות לקוח
            </div>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-green-400" />
            <span className="text-slate-300">יתרה בחשבון:</span>
          </div>
          <div className="flex items-center gap-2">
            {isLoadingBalance ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <>
                <span className="text-green-400 font-bold">
                  ${userBalance?.toFixed(2) || '0.00'}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={checkUserBalance}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  רענן
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="space-y-2">
            <Progress value={scanProgress} className="w-full" />
            <p className="text-sm text-center text-slate-400">{currentPhase}</p>
          </div>
        )}

        {/* Payment Warning */}
        {showPaymentWarning && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <CreditCard className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              <div className="flex flex-col items-start gap-2">
                <strong>אין מספיק כסף בחשבון!</strong>
                נדרש $0.25 לביצוע סריקת אמינות. יתרה נוכחית: ${userBalance?.toFixed(2) || '0.00'}
                <Button 
                  size="sm" 
                  className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700" 
                  onClick={handlePaymentTopUp}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  טען כסף
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Scan Button */}
        <Button
          onClick={reputationScanner}
          disabled={isScanning || isLoadingBalance || (userBalance !== null && userBalance < SCAN_COST)}
          className={`w-full ${
            isScanning || isLoadingBalance || (userBalance !== null && userBalance < SCAN_COST)
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700'
          }`}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {currentPhase || 'סורק...'}
            </>
          ) : isLoadingBalance ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              טוען יתרה...
            </>
          ) : userBalance !== null && userBalance < SCAN_COST ? (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              אין מספיק כסף - נדרש $0.25
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              התחל סריקת אמינות ($0.25)
            </>
          )}
        </Button>

        {/* Scan results would go here */}
        {scanResults && (
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-emerald-500/30">
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              תוצאות הסריקה
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">ציון אמינות כללי:</span>
                <Badge className={`${
                  scanResults.overall_reputation_score >= 80 ? 'bg-emerald-500/20 text-emerald-300' :
                  scanResults.overall_reputation_score >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {scanResults.overall_reputation_score}/100
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">רמת סיכון:</span>
                <Badge className={`${
                  scanResults.risk_level === 'low' ? 'bg-emerald-500/20 text-emerald-300' :
                  scanResults.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  scanResults.risk_level === 'high' ? 'bg-orange-500/20 text-orange-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {scanResults.risk_level === 'low' ? 'נמוך' :
                   scanResults.risk_level === 'medium' ? 'בינוני' : 
                   scanResults.risk_level === 'high' ? 'גבוה' : 
                   'קריטי'}
                </Badge>
              </div>
              {scanResults.recommendations?.should_engage !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">המלצה:</span>
                  <Badge className={scanResults.recommendations.should_engage ? 
                    'bg-emerald-500/20 text-emerald-300' : 
                    'bg-red-500/20 text-red-300'
                  }>
                    {scanResults.recommendations.should_engage ? 'מומלץ לפנות' : 'לא מומלץ לפנות'}
                  </Badge>
                </div>
              )}
              {scanResults.detailed_report && (
                <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-700">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {scanResults.detailed_report}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="mt-4 p-3 bg-slate-900/30 rounded-lg border border-emerald-500/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">עלות סריקה:</span>
                <span className="text-emerald-400 font-bold">${SCAN_COST.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">יתרה נותרת:</span>
                <span className="text-white font-bold">${scanResults.remaining_balance?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
