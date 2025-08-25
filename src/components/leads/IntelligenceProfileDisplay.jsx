import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Target, 
  Shield, 
  DollarSign, 
  Brain, 
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  ThumbsUp,
  Briefcase,
  Users
} from "lucide-react";

const InfoBlock = ({ icon, title, value, colorClass }) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{title}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => {
  const Icon = icon;
  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-purple-400" />
        {title}
      </h4>
      {children}
    </div>
  );
};

export default function IntelligenceProfileDisplay({ intelligence }) {
  if (!intelligence) return null;

  const {
    confidence_score,
    wealth_analysis,
    risk_assessment,
    action_plan,
    personality_profile,
    professional_background
  } = intelligence;

  return (
    <div className="space-y-4 mt-6">
      {/* Executive Summary */}
      <Section title="סיכום מנהלים" icon={Briefcase}>
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock 
            icon={CheckCircle}
            title="רמת אמינות"
            value={`${confidence_score || 0}%`}
            colorClass="bg-emerald-500/50"
          />
          <InfoBlock 
            icon={DollarSign}
            title="ציון עושר"
            value={`${wealth_analysis?.wealth_score || 0}/100`}
            colorClass="bg-yellow-500/50"
          />
          <InfoBlock 
            icon={Shield}
            title="רמת סיכון"
            value={`${risk_assessment?.overall_risk_score || 0}/100`}
            colorClass="bg-red-500/50"
          />
          <InfoBlock 
            icon={Target}
            title="הסתברות המרה"
            value={`${action_plan?.success_probability || 0}%`}
            colorClass="bg-blue-500/50"
          />
        </div>
      </Section>

      {/* Action Plan */}
      {action_plan?.approach_strategy?.opening_message && (
        <Section title="תוכנית פעולה" icon={MessageSquare}>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 space-y-2">
            <h5 className="text-purple-300 font-medium">הודעת פתיחה מומלצת:</h5>
            <p className="text-white text-sm">
              "{action_plan.approach_strategy.opening_message}"
            </p>
            {action_plan?.recommended_offers?.[0] && (
              <div className="pt-2 border-t border-purple-500/20">
                <h5 className="text-purple-300 font-medium">הצעה מומלצת:</h5>
                <p className="text-white text-sm">
                  {action_plan.recommended_offers[0].offer_type} (טווח מחיר: {action_plan.recommended_offers[0].price_range})
                </p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Personality Profile */}
      {personality_profile?.personality_type && (
        <Section title="פרופיל אישיות" icon={Brain}>
          <div className="space-y-3">
            <InfoBlock 
              icon={Users}
              title="סוג אישיות"
              value={personality_profile.personality_type}
              colorClass="bg-indigo-500/50"
            />
            <div className="bg-slate-700/50 rounded p-3">
              <h5 className="text-sm text-slate-300 mb-1">נושאים מומלצים לשיחה:</h5>
              <div className="flex flex-wrap gap-1">
                {personality_profile.topics_to_discuss?.slice(0, 3).map((topic, i) => (
                  <Badge key={i} variant="outline" className="text-emerald-300 border-emerald-500/50">{topic}</Badge>
                ))}
              </div>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <h5 className="text-sm text-slate-300 mb-1">נושאים להימנע מהם:</h5>
              <div className="flex flex-wrap gap-1">
                {personality_profile.topics_to_avoid?.slice(0, 3).map((topic, i) => (
                  <Badge key={i} variant="outline" className="text-red-300 border-red-500/50">{topic}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}
      
      {/* Risks & Opportunities */}
      {risk_assessment?.red_flags?.length > 0 && (
        <Section title="סיכונים והזדמנויות" icon={TrendingUp}>
            <div className="bg-red-500/10 rounded-lg p-3 mb-3">
              <h5 className="text-red-300 font-medium mb-1 flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> דגלים אדומים:</h5>
              <ul className="list-disc list-inside text-sm text-white">
                {risk_assessment.red_flags.slice(0,3).map((flag, i) => <li key={i}>{flag}</li>)}
              </ul>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-3">
              <h5 className="text-emerald-300 font-medium mb-1 flex items-center gap-1"><ThumbsUp className="w-4 h-4"/> דגלים ירוקים:</h5>
               <ul className="list-disc list-inside text-sm text-white">
                {risk_assessment.green_flags.slice(0,3).map((flag, i) => <li key={i}>{flag}</li>)}
              </ul>
            </div>
        </Section>
      )}

    </div>
  );
}