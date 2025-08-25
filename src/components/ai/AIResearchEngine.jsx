import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  User, 
  Globe, 
  Instagram, 
  Facebook, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Brain
} from "lucide-react";
import { LeadProfile, Lead } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

export default function AIResearchEngine({ leadId, onResearchComplete }) {
  const [researchData, setResearchData] = useState(null);
  const [isResearching, setIsResearching] = useState(false);
  const [researchProgress, setResearchProgress] = useState(0);
  const [socialInputs, setSocialInputs] = useState({
    instagram: '',
    facebook: '',
    phone: '',
    fullName: ''
  });

  const startDeepResearch = async () => {
    setIsResearching(true);
    setResearchProgress(0);
    
    try {
      // Step 1: Get basic lead info
      setResearchProgress(10);
      const lead = await Lead.list().then(leads => leads.find(l => l.id === leadId));
      
      // Step 2: Social Media Analysis
      setResearchProgress(25);
      const socialAnalysis = await analyzeSocialMedia(socialInputs);
      
      // Step 3: Google Search & Public Records
      setResearchProgress(50);
      const googleResearch = await performGoogleResearch(socialInputs.fullName || `${lead.first_name} ${lead.last_name}`);
      
      // Step 4: Behavioral Analysis
      setResearchProgress(75);
      const behavioralProfile = await generateBehavioralProfile(lead, socialAnalysis, googleResearch);
      
      // Step 5: Risk Assessment
      setResearchProgress(90);
      const riskAssessment = await assessRiskFactors(socialAnalysis, googleResearch);
      
      // Step 6: Create/Update Profile
      setResearchProgress(100);
      const profileData = {
        lead_id: leadId,
        social_profiles: {
          instagram_handle: socialInputs.instagram,
          facebook_profile: socialInputs.facebook,
          instagram_url: socialInputs.instagram ? `https://instagram.com/${socialInputs.instagram}` : '',
          facebook_url: socialInputs.facebook ? `https://facebook.com/${socialInputs.facebook}` : ''
        },
        identity_verification: {
          full_name_verified: socialInputs.fullName,
          verification_status: riskAssessment.trustLevel > 70 ? 'verified' : 'pending',
          verification_method: 'social_media',
          is_age_verified: socialAnalysis.estimatedAge >= 18,
          min_age_met: socialAnalysis.estimatedAge >= 18
        },
        behavioral_analysis: behavioralProfile,
        interests_and_lifestyle: socialAnalysis.interests,
        ai_research_data: googleResearch,
        security_flags: riskAssessment.flags,
        last_research_update: new Date().toISOString(),
        ai_confidence_score: Math.min(95, socialAnalysis.confidence + googleResearch.confidence)
      };

      // Save profile
      const existingProfiles = await LeadProfile.filter({ lead_id: leadId });
      let savedProfile;
      
      if (existingProfiles.length > 0) {
        savedProfile = await LeadProfile.update(existingProfiles[0].id, profileData);
      } else {
        savedProfile = await LeadProfile.create(profileData);
      }

      setResearchData(savedProfile);
      onResearchComplete?.(savedProfile);
      
    } catch (error) {
      console.error('Research failed:', error);
      alert('מחקר נכשל - בדוק את הקישורים שהזנת');
    }
    
    setIsResearching(false);
  };

  const analyzeSocialMedia = async (inputs) => {
    const prompt = `
נתח את הפרופיל הבא של לקוח פוטנציאלי למועדון לילה:
אינסטגרם: ${inputs.instagram}
פייסבוק: ${inputs.facebook}
שם מלא: ${inputs.fullName}

בצע ניתוח מעמיק וחזור עם המידע הבא:
1. גיל משוער (18-65)
2. תחומי עניין מוזיקליים
3. אורח חיים (מסיבות, ברים, מועדונים)
4. רמת הוצאה משוערת (budget/moderate/premium/luxury)
5. גודל החוג החברתי (introvert/small_group/social/party_leader)
6. מותגים מועדפים
7. מילות מפתח של אורח חיים
8. רמת אמינות הפרופיל (1-100)

תחזור בפורמט JSON עם כל הנתונים.
    `;

    try {
      const analysis = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            estimatedAge: { type: "number" },
            musicGenres: { type: "array", items: { type: "string" } },
            nightlifePreferences: { type: "array", items: { type: "string" } },
            spendingHabits: { type: "string", enum: ["budget", "moderate", "premium", "luxury"] },
            socialCircleSize: { type: "string", enum: ["introvert", "small_group", "social", "party_leader"] },
            brandPreferences: { type: "array", items: { type: "string" } },
            lifestyleKeywords: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            interests: { type: "object" }
          }
        }
      });
      
      return analysis;
    } catch (error) {
      console.error('Social media analysis failed:', error);
      return {
        estimatedAge: 25,
        confidence: 20,
        interests: {},
        spendingHabits: 'moderate',
        socialCircleSize: 'social'
      };
    }
  };

  const performGoogleResearch = async (fullName) => {
    const prompt = `
חקור את האדם הבא באינטרנט: "${fullName}"

בצע חיפוש מעמיק ומקיף וחזור עם:
1. סיכום מה מצאת עליו בגוגל
2. רקע מקצועי
3. מצב משפחתי משוער
4. פעילויות אחרונות
5. חיבורים חברתיים
6. הערכת אישיות
7. מיקום גיאוגרפי
8. השפות שהוא מדבר
9. האם נמצאו רשומות ציבוריות
10. רמת אמינות המידע (1-100)

תחזור בפורמט JSON מסודר.
    `;

    try {
      const research = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            google_search_summary: { type: "string" },
            professional_background: { type: "string" },
            relationship_status: { type: "string" },
            recent_activities: { type: "array", items: { type: "string" } },
            social_connections: { type: "array", items: { type: "string" } },
            personality_assessment: { type: "string" },
            location_data: { 
              type: "object", 
              properties: {
                city: { type: "string" },
                country: { type: "string" }
              }
            },
            language_preferences: { type: "array", items: { type: "string" } },
            public_records_found: { type: "boolean" },
            confidence: { type: "number" }
          }
        }
      });
      
      return research;
    } catch (error) {
      console.error('Google research failed:', error);
      return {
        google_search_summary: 'לא נמצא מידע',
        confidence: 10,
        public_records_found: false
      };
    }
  };

  const generateBehavioralProfile = async (lead, socialAnalysis, googleResearch) => {
    const prompt = `
בהתבסס על הנתונים הבאים על הלקוח:
- נתוני רשתות חברתיות: ${JSON.stringify(socialAnalysis)}
- מחקר גוגל: ${JSON.stringify(googleResearch)}
- נתוני הלקוח הבסיסיים: ${JSON.stringify(lead)}

צור פרופיל התנהגותי מפורט:
1. סגנון תקשורת (formal/casual/friendly/business)
2. דפוס זמני מענה
3. שעות קשר מועדפות
4. רמת מעורבות (low/medium/high/very_high)
5. הסתברות להמרה (0-100)
6. ציון סיכון (0-100, כאשר 0=בטוח, 100=מסוכן)
7. אינדיקטורים לרמאות

תחזור בפורמט JSON מסודר.
    `;

    try {
      const behavioral = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            communication_style: { type: "string", enum: ["formal", "casual", "friendly", "business"] },
            response_time_pattern: { type: "string" },
            preferred_contact_hours: { type: "array", items: { type: "string" } },
            engagement_level: { type: "string", enum: ["low", "medium", "high", "very_high"] },
            conversion_probability: { type: "number", minimum: 0, maximum: 100 },
            risk_score: { type: "number", minimum: 0, maximum: 100 },
            fraud_indicators: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      return behavioral;
    } catch (error) {
      console.error('Behavioral analysis failed:', error);
      return {
        communication_style: 'casual',
        engagement_level: 'medium',
        conversion_probability: 50,
        risk_score: 25
      };
    }
  };

  const assessRiskFactors = async (socialAnalysis, googleResearch) => {
    const riskFactors = [];
    let trustLevel = 100;

    // Age verification
    if (socialAnalysis.estimatedAge < 18) {
      riskFactors.push('מתחת לגיל 18');
      trustLevel -= 50;
    }

    // Profile authenticity
    if (socialAnalysis.confidence < 30) {
      riskFactors.push('פרופיל חשוד');
      trustLevel -= 30;
    }

    // Public records
    if (!googleResearch.public_records_found && googleResearch.confidence < 20) {
      riskFactors.push('אין מידע ציבורי');
      trustLevel -= 20;
    }

    return {
      trustLevel: Math.max(0, trustLevel),
      flags: {
        is_blacklisted: false,
        requires_manual_approval: trustLevel < 50,
        suspicious_activity: riskFactors,
        purchase_restrictions: trustLevel < 30 ? ['high_value_purchases'] : []
      }
    };
  };

  const getRiskColor = (score) => {
    if (score <= 25) return 'text-emerald-400';
    if (score <= 50) return 'text-yellow-400';
    if (score <= 75) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Research Input */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            מנוע חקירת לקוחות AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                שם משתמש אינסטגרם
              </label>
              <Input
                value={socialInputs.instagram}
                onChange={(e) => setSocialInputs(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="@username"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300 text-sm flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                פרופיל פייסבוק
              </label>
              <Input
                value={socialInputs.facebook}
                onChange={(e) => setSocialInputs(prev => ({ ...prev, facebook: e.target.value }))}
                placeholder="facebook.com/profile"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300 text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                שם מלא
              </label>
              <Input
                value={socialInputs.fullName}
                onChange={(e) => setSocialInputs(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="שם פרטי ומשפחה"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">מספר טלפון</label>
              <Input
                value={socialInputs.phone}
                onChange={(e) => setSocialInputs(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+972-50-123-4567"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <Button 
            onClick={startDeepResearch}
            disabled={isResearching || !socialInputs.instagram}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isResearching ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                חוקר... {researchProgress}%
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                התחל חקירה מעמיקה
              </>
            )}
          </Button>

          {isResearching && (
            <div className="space-y-2">
              <Progress value={researchProgress} className="bg-slate-800" />
              <div className="text-center text-sm text-slate-400">
                {researchProgress < 25 && "מנתח רשתות חברתיות..."}
                {researchProgress >= 25 && researchProgress < 50 && "מחפש בגוגל ומאגרים ציבוריים..."}
                {researchProgress >= 50 && researchProgress < 75 && "בונה פרופיל התנהגותי..."}
                {researchProgress >= 75 && researchProgress < 100 && "מעריך סיכונים..."}
                {researchProgress === 100 && "שומר נתונים..."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Research Results */}
      {researchData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity & Security */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                זהות ואבטחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">סטטוס אימות:</span>
                <Badge className={
                  researchData.identity_verification.verification_status === 'verified' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }>
                  {researchData.identity_verification.verification_status === 'verified' ? 'מאומת' : 'ממתין'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">אימות גיל:</span>
                <div className="flex items-center gap-2">
                  {researchData.identity_verification.is_age_verified ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={researchData.identity_verification.is_age_verified ? 'text-emerald-400' : 'text-red-400'}>
                    {researchData.identity_verification.is_age_verified ? 'מעל 18' : 'לא אומת'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">ציון סיכון:</span>
                <span className={getRiskColor(researchData.behavioral_analysis.risk_score)}>
                  {researchData.behavioral_analysis.risk_score}/100
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">רמת ביטחון AI:</span>
                <span className={getConfidenceColor(researchData.ai_confidence_score)}>
                  {researchData.ai_confidence_score}%
                </span>
              </div>

              {researchData.security_flags.suspicious_activity?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-red-400 text-sm">דגלי אזהרה:</span>
                  <div className="space-y-1">
                    {researchData.security_flags.suspicious_activity.map((flag, index) => (
                      <Badge key={index} className="bg-red-500/20 text-red-300 text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Behavioral Profile */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                פרופיל התנהגותי
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">סגנון תקשורת:</span>
                <Badge className="bg-blue-500/20 text-blue-300">
                  {researchData.behavioral_analysis.communication_style}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">רמת מעורבות:</span>
                <Badge className={
                  researchData.behavioral_analysis.engagement_level === 'very_high' ? 'bg-emerald-500/20 text-emerald-300' :
                  researchData.behavioral_analysis.engagement_level === 'high' ? 'bg-blue-500/20 text-blue-300' :
                  researchData.behavioral_analysis.engagement_level === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }>
                  {researchData.behavioral_analysis.engagement_level}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">הסתברות המרה:</span>
                <span className={getConfidenceColor(researchData.behavioral_analysis.conversion_probability)}>
                  {researchData.behavioral_analysis.conversion_probability}%
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 text-sm">אורח חיים:</span>
                <div className="flex flex-wrap gap-1">
                  {researchData.interests_and_lifestyle.lifestyle_keywords?.slice(0, 6).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-slate-800 text-slate-300">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 text-sm">העדפות מוזיקליות:</span>
                <div className="flex flex-wrap gap-1">
                  {researchData.interests_and_lifestyle.music_genres?.slice(0, 4).map((genre, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-purple-800/30 text-purple-300">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Research Summary */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                סיכום מחקר AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-slate-400 text-sm">רקע מקצועי:</span>
                  <p className="text-white text-sm bg-slate-800/50 p-3 rounded">
                    {researchData.ai_research_data.professional_background || 'לא נמצא מידע'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-slate-400 text-sm">הערכת אישיות:</span>
                  <p className="text-white text-sm bg-slate-800/50 p-3 rounded">
                    {researchData.ai_research_data.personality_assessment || 'בניתוח...'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 text-sm">סיכום חיפוש גוגל:</span>
                <p className="text-white text-sm bg-slate-800/50 p-3 rounded">
                  {researchData.ai_research_data.google_search_summary || 'לא נמצא מידע רלוונטי'}
                </p>
              </div>

              {researchData.ai_research_data.recent_activities?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-slate-400 text-sm">פעילויות אחרונות:</span>
                  <div className="space-y-1">
                    {researchData.ai_research_data.recent_activities.slice(0, 3).map((activity, index) => (
                      <div key={index} className="text-sm text-slate-300 bg-slate-800/30 p-2 rounded">
                        • {activity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}