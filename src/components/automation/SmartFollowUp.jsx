
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea import
import {
  Clock,
  Calendar,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Users,
  Settings,
  Play,
  Pause,
  CheckCircle
} from "lucide-react";

export default function SmartFollowUp() {
  const [activeRules, setActiveRules] = useState([
    {
      id: 1,
      name: 'מעקב אחר לא עונים',
      trigger: 'no_response_24h',
      action: 'send_followup',
      message: 'היי! ראיתי שלא הספקת לענות אתמול. עדיין מעוניין בהצעה המיוחדת?',
      status: 'active',
      conversions: 23,
      sent_today: 12
    },
    {
      id: 2,
      name: 'לקוחות חמים - תזכורת אירוע',
      trigger: 'event_24h_before',
      action: 'send_reminder',
      message: 'מחר האירוע! אל תשכח להגיע מוקדם לשולחן VIP שלך 🎉',
      status: 'active',
      conversions: 45,
      sent_today: 8
    },
    {
      id: 3,
      name: 'לקוחות מעורבים - הצעה מיוחדת',
      trigger: 'high_engagement_no_conversion',
      action: 'send_special_offer',
      message: 'רק בשבילך! 50% הנחה על כניסה + משקה חינם. בתוקף עד חצות!',
      status: 'paused',
      conversions: 67,
      sent_today: 0
    }
  ]);

  const [newRule, setNewRule] = useState({
    name: '',
    trigger: '',
    action: '',
    message: '',
    delay_hours: 24
  });

  const triggerTypes = [
    { value: 'no_response_24h', label: 'לא עונה 24 שעות', icon: '⏰' },
    { value: 'no_response_48h', label: 'לא עונה 48 שעות', icon: '⏰' },
    { value: 'event_24h_before', label: '24 שעות לפני אירוע', icon: '📅' },
    { value: 'event_2h_before', label: '2 שעות לפני אירוע', icon: '🔔' },
    { value: 'high_engagement_no_conversion', label: 'מעורב בלי המרה', icon: '🎯' },
    { value: 'vip_birthday', label: 'יום הולדת VIP', icon: '🎂' },
    { value: 'inactive_30_days', label: 'לא פעיל 30 יום', icon: '😴' }
  ];

  const actionTypes = [
    { value: 'send_followup', label: 'שלח הודעת מעקב', icon: '💬' },
    { value: 'send_reminder', label: 'שלח תזכורת', icon: '🔔' },
    { value: 'send_special_offer', label: 'שלח הצעה מיוחדת', icon: '🎁' },
    { value: 'assign_to_human', label: 'העבר ליחצן אנושי', icon: '👤' },
    { value: 'add_to_vip_list', label: 'הוסף לרשימת VIP', icon: '👑' }
  ];

  const toggleRule = (ruleId) => {
    setActiveRules(prev => prev.map(rule =>
      rule.id === ruleId
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ));
  };

  const addNewRule = () => {
    if (!newRule.name || !newRule.trigger || !newRule.action || !newRule.message) {
      alert('אנא מלא את כל השדות');
      return;
    }

    const rule = {
      id: Date.now(),
      ...newRule,
      status: 'active',
      conversions: 0,
      sent_today: 0
    };

    setActiveRules(prev => [...prev, rule]);
    setNewRule({
      name: '',
      trigger: '',
      action: '',
      message: '',
      delay_hours: 24
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{activeRules.filter(r => r.status === 'active').length}</div>
            <div className="text-sm text-emerald-300">כללים פעילים</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {activeRules.reduce((sum, rule) => sum + rule.sent_today, 0)}
            </div>
            <div className="text-sm text-blue-300">הודעות היום</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {activeRules.reduce((sum, rule) => sum + rule.conversions, 0)}
            </div>
            <div className="text-sm text-purple-300">המרות חודשיות</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">73%</div>
            <div className="text-sm text-yellow-300">שיעור פתיחה</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active-rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="active-rules">כללים פעילים</TabsTrigger>
          <TabsTrigger value="create-rule">צור כלל חדש</TabsTrigger>
          <TabsTrigger value="analytics">נתונים</TabsTrigger>
        </TabsList>

        <TabsContent value="active-rules" className="space-y-4">
          {activeRules.map(rule => (
            <Card key={rule.id} className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{rule.name}</h4>
                      <Badge className={rule.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}>
                        {rule.status === 'active' ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                        {rule.status === 'active' ? 'פעיל' : 'מושהה'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-slate-400 text-sm">טריגר:</span>
                        <div className="text-white">
                          {triggerTypes.find(t => t.value === rule.trigger)?.label || rule.trigger}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">פעולה:</span>
                        <div className="text-white">
                          {actionTypes.find(a => a.value === rule.action)?.label || rule.action}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">נשלחו היום:</span>
                        <div className="text-emerald-400 font-bold">{rule.sent_today}</div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => toggleRule(rule.id)}
                    variant={rule.status === 'active' ? 'destructive' : 'default'}
                    size="sm"
                  >
                    {rule.status === 'active' ? 'השהה' : 'הפעל'}
                  </Button>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg mb-4">
                  <span className="text-slate-400 text-sm mb-1 block">הודעה:</span>
                  <p className="text-white text-sm italic">"{rule.message}"</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">המרות החודש:</span>
                    <span className="text-purple-400 font-bold">{rule.conversions}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      עריכה
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="create-rule" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                צור כלל מעקב חדש
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-2 block">שם הכלל</label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="לדוגמה: מעקב אחר לקוחות פוטנציאליים"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">טריגר</label>
                  <select
                    value={newRule.trigger}
                    onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                  >
                    <option value="">בחר טריגר...</option>
                    {triggerTypes.map(trigger => (
                      <option key={trigger.value} value={trigger.value}>
                        {trigger.icon} {trigger.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 text-sm mb-2 block">פעולה</label>
                  <select
                    value={newRule.action}
                    onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                  >
                    <option value="">בחר פעולה...</option>
                    {actionTypes.map(action => (
                      <option key={action.value} value={action.value}>
                        {action.icon} {action.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block">הודעה</label>
                <Textarea // This Textarea component was causing the error
                  value={newRule.message}
                  onChange={(e) => setNewRule({...newRule, message: e.target.value})}
                  placeholder="כתוב את ההודעה שתישלח אוטומטית..."
                  className="bg-slate-800 border-slate-700 text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block">עיכוב (שעות)</label>
                <Input
                  type="number"
                  value={newRule.delay_hours}
                  onChange={(e) => setNewRule({...newRule, delay_hours: parseInt(e.target.value)})}
                  className="bg-slate-800 border-slate-700 text-white"
                  min="1"
                  max="168"
                />
              </div>

              <Button onClick={addNewRule} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                צור כלל
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">ביצועים לפי כלל</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeRules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{rule.name}</div>
                        <div className="text-slate-400 text-sm">{rule.conversions} המרות</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">{rule.sent_today}</div>
                        <div className="text-slate-400 text-sm">נשלחו היום</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">סטטיסטיקות כלליות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">שיעור פתיחה ממוצע</span>
                    <span className="text-emerald-400 font-bold">73%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">שיעור המרה ממוצע</span>
                    <span className="text-purple-400 font-bold">31%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">זמן תגובה ממוצע</span>
                    <span className="text-blue-400 font-bold">2.3 שעות</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">חיסכון זמן יומי</span>
                    <span className="text-yellow-400 font-bold">4.2 שעות</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Cost Information */}
      <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-yellow-300 font-medium">עלות מעקב אוטומטי</h4>
            <p className="text-yellow-200 text-sm">$0.02 לכל הודעת מעקב + עלות שליחה רגילה</p>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-300">
            חיסכון של 80% בעלות עבודה
          </Badge>
        </div>
      </div>
    </div>
  );
}
