
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  MessageSquare,
  Users,
  Send,
  Clock,
  Target,
  Filter,
  Eye,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Settings,
  LayoutTemplate, // Replaced Template with LayoutTemplate
  Sparkles,
  Calendar,
  Globe,
  Zap,
  Database,
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  TrendingUp,
  UserCheck,
  Bell,
  Megaphone,
  Shield,
  Crown,
  Star,
  Heart,
  Smile,
  Gift,
  Flame,
  Coffee,
  Music,
  Camera,
  Mic,
  Video
} from "lucide-react";
import { User } from "@/api/entities";
import { Lead } from "@/api/entities";
import { Campaign } from "@/api/entities";
import { SendEmail } from "@/api/integrations";
import { InvokeLLM } from "@/api/integrations";

export default function MassCommunications() {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    content: '',
    template_id: '',
    audience: 'all',
    filters: {},
    scheduled_time: '',
    send_immediately: true,
    personalization: true,
    track_opens: true,
    track_clicks: true
  });

  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'marketing',
    variables: [],
    is_ai_generated: false
  });

  const [audienceFilters, setAudienceFilters] = useState({
    user_type: 'all', // all, users, leads
    status: 'all',
    location: '',
    spending_category: 'all',
    last_interaction: 'all',
    vip_only: false,
    new_users_only: false,
    inactive_users_only: false
  });

  const [stats, setStats] = useState({
    total_sent: 0,
    total_opened: 0,
    total_clicked: 0,
    bounce_rate: 0,
    unsubscribe_rate: 0,
    conversion_rate: 0
  });

  const [activeTab, setActiveTab] = useState('campaigns');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAudience();
  }, [audienceFilters, recipients]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // טעינת נתונים
      const [users, leads] = await Promise.all([
        User.list(),
        Lead.list()
      ]);

      const allRecipients = [
        ...users.map(user => ({
          id: user.id,
          type: 'user',
          name: user.full_name,
          email: user.email,
          status: user.role || 'user',
          last_interaction: user.updated_date
        })),
        ...leads.map(lead => ({
          id: lead.id,
          type: 'lead',
          name: `${lead.first_name} ${lead.last_name}`,
          email: lead.email,
          status: lead.status,
          location: lead.location,
          spending_category: lead.spending_category,
          last_interaction: lead.last_interaction,
          vip: lead.status === 'vip'
        })).filter(lead => lead.email) // רק לידים עם אימייל
      ];

      setRecipients(allRecipients);
      loadTemplates();
      loadCampaignStats();

    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const loadTemplates = () => {
    // תבניות מוכנות מראש
    const defaultTemplates = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'ברוכים הבאים ל-NocturneAI! 🌙',
        category: 'onboarding',
        content: `
שלום {{name}},

ברוכים הבאים למשפחת NocturneAI! 🎉

אנחנו מתרגשים שהצטרפת אלינו ומחכים לעזור לך להוביל את עסק הלילה שלך לרמה הבאה.

מה אתה יכול לעשות עכשיו:
🤖 ליצור את היחצ"ן הדיגיטלי הראשון שלך
📱 לחבר את WhatsApp Business
🎯 להתחיל קמפיין ראשון

בהצלחה!
צוות NocturneAI
        `,
        variables: ['name']
      },
      {
        id: 'event_promotion',
        name: 'Event Promotion',
        subject: '🔥 האירוע החם של השבוע - {{event_name}}',
        category: 'marketing',
        content: `
היי {{name}}!

מוכנים לערב בלתי נשכח? 🌟

📅 תאריך: {{event_date}}
📍 מקום: {{venue_name}}
🎵 DJ: {{dj_name}}
💸 כניסה: {{ticket_price}}

הזמן עכשיו ותקבל הנחה של 20%!
{{booking_link}}

נתראה ברחבת הריקודים! 💃🕺
        `,
        variables: ['name', 'event_name', 'event_date', 'venue_name', 'dj_name', 'ticket_price', 'booking_link']
      },
      {
        id: 'vip_exclusive',
        name: 'VIP Exclusive Offer',
        subject: '👑 הצעה אקסקלוסיבית ללקוחות VIP',
        category: 'vip',
        content: `
{{name}} היקר/ה,

כלקוח VIP מיוחד, יש לנו הצעה בלעדית בשבילך! 🌟

🥂 שולחן VIP פרטי
🍾 בקבוק שמפניה מתנה
🎵 בחירת מוזיקה אישית
👨‍💼 שירות אישי מהמלצר הפרטי

הכל בהנחה של 30% - רק השבוע!

להזמנה: {{vip_booking_link}}

אנחנו מחכים לך! 👑
        `,
        variables: ['name', 'vip_booking_link']
      },
      {
        id: 'feedback_request',
        name: 'Feedback Request',
        subject: 'איך היה האירוע? נשמח לשמוע! ⭐',
        category: 'feedback',
        content: `
היי {{name}},

תודה שהיית איתנו באירוע אמש! 🎉

נשמח לשמוע מה דעתך:
⭐ איך היה האירוע?
🎵 איך הייתה המוזיקה?
🍸 איך היה השירות?

{{feedback_link}}

המשוב שלך חשוב לנו מאוד!
תודה! ❤️
        `,
        variables: ['name', 'feedback_link']
      }
    ];

    setTemplates(defaultTemplates);
  };

  const loadCampaignStats = () => {
    // סטטיסטיקות דמה
    setStats({
      total_sent: 1247,
      total_opened: 856,
      total_clicked: 234,
      bounce_rate: 2.3,
      unsubscribe_rate: 0.8,
      conversion_rate: 18.7
    });
  };

  const filterAudience = () => {
    let filtered = [...recipients];

    // סינון לפי סוג משתמש
    if (audienceFilters.user_type !== 'all') {
      filtered = filtered.filter(r => r.type === audienceFilters.user_type);
    }

    // סינון לפי סטטוס
    if (audienceFilters.status !== 'all') {
      filtered = filtered.filter(r => r.status === audienceFilters.status);
    }

    // סינון לפי מיקום
    if (audienceFilters.location) {
      filtered = filtered.filter(r =>
        r.location?.toLowerCase().includes(audienceFilters.location.toLowerCase())
      );
    }

    // סינון לפי קטגוריית הוצאה
    if (audienceFilters.spending_category !== 'all') {
      filtered = filtered.filter(r => r.spending_category === audienceFilters.spending_category);
    }

    // סינון VIP בלבד
    if (audienceFilters.vip_only) {
      filtered = filtered.filter(r => r.vip === true);
    }

    // סינון משתמשים חדשים
    if (audienceFilters.new_users_only) {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r =>
        new Date(r.last_interaction) > weekAgo
      );
    }

    // סינון משתמשים לא פעילים
    if (audienceFilters.inactive_users_only) {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r =>
        new Date(r.last_interaction) < monthAgo
      );
    }

    setFilteredRecipients(filtered);
  };

  const generateAITemplate = async () => {
    setIsLoading(true);
    try {
      const aiTemplate = await InvokeLLM({
        prompt: `
        צור תבנית אימייל מקצועית ויצירתית לעסק לילה/מסעדה/מועדון.

        הקטגוריה: ${templateData.category}
        השם: ${templateData.name}

        הכלל משתנים כמו {{name}}, {{venue_name}}, {{event_date}} וכו'.

        צור תוכן באיכות גבוהה, מקצועי אבל גם חם ומזמין.
        כלול אמוג'י רלוונטיים.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            content: { type: "string" },
            variables: {
              type: "array",
              items: { type: "string" }
            },
            suggestions: { type: "string" }
          }
        }
      });

      setTemplateData(prev => ({
        ...prev,
        subject: aiTemplate.subject,
        content: aiTemplate.content,
        variables: aiTemplate.variables,
        is_ai_generated: true
      }));

    } catch (error) {
      console.error('Error generating AI template:', error);
      alert('שגיאה ביצירת תבנית AI');
    }
    setIsLoading(false);
  };

  const saveTemplate = () => {
    const newTemplate = {
      ...templateData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateEditor(false);
    setTemplateData({
      name: '',
      subject: '',
      content: '',
      category: 'marketing',
      variables: [],
      is_ai_generated: false
    });

    alert('✅ תבנית נשמרה בהצלחה!');
  };

  const sendMassCampaign = async () => {
    if (!campaignData.subject || !campaignData.content) {
      alert('נא למלא נושא ותוכן');
      return;
    }

    if (filteredRecipients.length === 0) {
      alert('לא נמצאו נמענים לשליחה');
      return;
    }

    const confirm = window.confirm(
      `האם לשלוח קמפיין "${campaignData.name}" ל-${filteredRecipients.length} נמענים?`
    );

    if (!confirm) return;

    setIsSending(true);
    setSendProgress(0);

    try {
      const totalRecipients = filteredRecipients.length;
      let sentCount = 0;

      for (let i = 0; i < filteredRecipients.length; i++) {
        const recipient = filteredRecipients[i];

        try {
          // פרסונליזציה של התוכן
          let personalizedSubject = campaignData.subject.replace(/{{name}}/g, recipient.name);
          let personalizedContent = campaignData.content.replace(/{{name}}/g, recipient.name);

          // שליחת אימייל
          await SendEmail({
            to: recipient.email,
            subject: personalizedSubject,
            body: personalizedContent,
            from_name: 'NocturneAI Marketing'
          });

          sentCount++;
          setSendProgress((sentCount / totalRecipients) * 100);

          // השהיה קצרה למניעת spam
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          console.error(`Failed to send to ${recipient.email}:`, error);
        }
      }

      alert(`✅ קמפיין נשלח בהצלחה ל-${sentCount} מתוך ${totalRecipients} נמענים!`);

      // עדכון סטטיסטיקות
      setStats(prev => ({
        ...prev,
        total_sent: prev.total_sent + sentCount
      }));

    } catch (error) {
      console.error('Campaign sending error:', error);
      alert('❌ שגיאה בשליחת הקמפיין');
    }

    setIsSending(false);
    setSendProgress(0);
  };

  const getCategoryColor = (category) => {
    const colors = {
      marketing: 'bg-blue-500/20 text-blue-300',
      onboarding: 'bg-green-500/20 text-green-300',
      vip: 'bg-purple-500/20 text-purple-300',
      feedback: 'bg-yellow-500/20 text-yellow-300',
      announcement: 'bg-red-500/20 text-red-300'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* כותרת וסטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Send className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total_sent.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Emails Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{((stats.total_opened / stats.total_sent) * 100 || 0).toFixed(1)}%</p>
                <p className="text-sm text-slate-400">Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{((stats.total_clicked / stats.total_sent) * 100 || 0).toFixed(1)}%</p>
                <p className="text-sm text-slate-400">Click Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.conversion_rate}%</p>
                <p className="text-sm text-slate-400">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* טאבים ראשיים */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="campaigns">📧 Campaigns</TabsTrigger>
          <TabsTrigger value="templates">📝 Templates</TabsTrigger>
          <TabsTrigger value="audience">👥 Audience</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        {/* טאב קמפיינים */}
        <TabsContent value="campaigns">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Create New Campaign</CardTitle>
                  <Button
                    onClick={() => setShowCampaignBuilder(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Campaign Builder
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Campaign Name</Label>
                    <Input
                      value={campaignData.name}
                      onChange={(e) => setCampaignData(prev => ({...prev, name: e.target.value}))}
                      placeholder="שם הקמפיין..."
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Email Subject</Label>
                    <Input
                      value={campaignData.subject}
                      onChange={(e) => setCampaignData(prev => ({...prev, subject: e.target.value}))}
                      placeholder="נושא האימייל..."
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Template</Label>
                    <Select
                      value={campaignData.template_id}
                      onValueChange={(value) => {
                        const template = templates.find(t => t.id === value);
                        if (template) {
                          setCampaignData(prev => ({
                            ...prev,
                            template_id: value,
                            subject: template.subject,
                            content: template.content
                          }));
                        }
                      }}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="בחר תבנית..." />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Email Content</Label>
                    <Textarea
                      value={campaignData.content}
                      onChange={(e) => setCampaignData(prev => ({...prev, content: e.target.value}))}
                      placeholder="כתוב את תוכן האימייל כאן..."
                      className="bg-slate-900 border-slate-700 text-white min-h-[200px]"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={campaignData.personalization}
                        onCheckedChange={(checked) => setCampaignData(prev => ({...prev, personalization: checked}))}
                      />
                      <Label className="text-slate-300">Personalization</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={campaignData.track_opens}
                        onCheckedChange={(checked) => setCampaignData(prev => ({...prev, track_opens: checked}))}
                      />
                      <Label className="text-slate-300">Track Opens</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={campaignData.send_immediately}
                        onCheckedChange={(checked) => setCampaignData(prev => ({...prev, send_immediately: checked}))}
                      />
                      <Label className="text-slate-300">Send Immediately</Label>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isSending && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Sending Progress</span>
                        <span className="text-slate-300">{sendProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={sendProgress} className="w-full" />
                    </div>
                  )}

                  <Button
                    onClick={sendMassCampaign}
                    disabled={isSending || !campaignData.subject || !campaignData.content}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending... ({sendProgress.toFixed(0)}%)
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send to {filteredRecipients.length} Recipients
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* פאנל צד - בחירת קהל */}
            <div>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Target Audience ({filteredRecipients.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">User Type</Label>
                    <Select
                      value={audienceFilters.user_type}
                      onValueChange={(value) => setAudienceFilters(prev => ({...prev, user_type: value}))}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="user">System Users</SelectItem>
                        <SelectItem value="lead">Leads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Status</Label>
                    <Select
                      value={audienceFilters.status}
                      onValueChange={(value) => setAudienceFilters(prev => ({...prev, status: value}))}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="cold">Cold</SelectItem>
                        <SelectItem value="warm">Warm</SelectItem>
                        <SelectItem value="engaged">Engaged</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Location Filter</Label>
                    <Input
                      value={audienceFilters.location}
                      onChange={(e) => setAudienceFilters(prev => ({...prev, location: e.target.value}))}
                      placeholder="תל אביב, חיפה..."
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={audienceFilters.vip_only}
                        onCheckedChange={(checked) => setAudienceFilters(prev => ({...prev, vip_only: checked}))}
                      />
                      <Label className="text-slate-300">VIP Only</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={audienceFilters.new_users_only}
                        onCheckedChange={(checked) => setAudienceFilters(prev => ({...prev, new_users_only: checked}))}
                      />
                      <Label className="text-slate-300">New Users (7 days)</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={audienceFilters.inactive_users_only}
                        onCheckedChange={(checked) => setAudienceFilters(prev => ({...prev, inactive_users_only: checked}))}
                      />
                      <Label className="text-slate-300">Inactive Users (30+ days)</Label>
                    </div>
                  </div>

                  {/* תצוגת נמענים מסוננים */}
                  <div className="mt-4 max-h-40 overflow-y-auto space-y-1 bg-slate-900/50 rounded-lg p-3">
                    {filteredRecipients.slice(0, 10).map(recipient => (
                      <div key={recipient.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{recipient.name}</span>
                        <Badge className={`text-xs ${recipient.vip ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-600/50 text-slate-400'}`}>
                          {recipient.type}
                        </Badge>
                      </div>
                    ))}
                    {filteredRecipients.length > 10 && (
                      <div className="text-xs text-slate-500 text-center">
                        +{filteredRecipients.length - 10} more recipients
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* טאב תבניות */}
        <TabsContent value="templates">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Email Templates</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowTemplateEditor(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
                <Button
                  onClick={generateAITemplate}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  AI Generate
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <Card key={template.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                        <Badge className={`mt-2 ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </Badge>
                      </div>
                      {template.is_ai_generated && (
                        <Badge className="bg-purple-500/20 text-purple-300">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Subject:</p>
                      <p className="text-white text-sm font-medium">{template.subject}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 mb-2">Content Preview:</p>
                      <p className="text-slate-300 text-xs line-clamp-3">
                        {template.content.substring(0, 120)}...
                      </p>
                    </div>

                    {template.variables && template.variables.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map(variable => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {`{{${variable}}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setCampaignData(prev => ({
                            ...prev,
                            template_id: template.id,
                            subject: template.subject,
                            content: template.content
                          }));
                          setActiveTab('campaigns');
                        }}
                        className="flex-1"
                      >
                        <LayoutTemplate className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* טאב קהל יעד */}
        <TabsContent value="audience">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Audience Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Total Recipients</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">System Users</span>
                      <span className="text-white font-bold">
                        {recipients.filter(r => r.type === 'user').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Leads</span>
                      <span className="text-white font-bold">
                        {recipients.filter(r => r.type === 'lead').length}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-600 pt-2">
                      <span className="text-slate-300 font-medium">Total</span>
                      <span className="text-white font-bold">{recipients.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
                  <div className="space-y-2">
                    {['cold', 'warm', 'engaged', 'converted', 'vip'].map(status => {
                      const count = recipients.filter(r => r.status === status).length;
                      return (
                        <div key={status} className="flex justify-between">
                          <span className="text-slate-400 capitalize">{status}</span>
                          <span className="text-white font-bold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">VIP Customers</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">VIP Members</span>
                      <span className="text-yellow-400 font-bold">
                        {recipients.filter(r => r.vip).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Premium Spenders</span>
                      <span className="text-purple-400 font-bold">
                        {recipients.filter(r => r.spending_category === 'premium').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Luxury Clients</span>
                      <span className="text-pink-400 font-bold">
                        {recipients.filter(r => r.spending_category === 'luxury').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* טאב אנליטיקס */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Open Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(stats.total_opened / stats.total_sent) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold">
                        {((stats.total_opened / stats.total_sent) * 100 || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Click Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(stats.total_clicked / stats.total_sent) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold">
                        {((stats.total_clicked / stats.total_sent) * 100 || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Bounce Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${stats.bounce_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold">{stats.bounce_rate}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Conversion Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${stats.conversion_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold">{stats.conversion_rate}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Best Performing Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.slice(0, 5).map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-500 text-black' :
                          'bg-slate-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{template.name}</p>
                          <p className="text-xs text-slate-400">{template.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{(Math.random() * 40 + 20).toFixed(1)}%</p>
                        <p className="text-xs text-slate-400">Open Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* דיאלוג עורך תבניות */}
      <Dialog open={showTemplateEditor} onOpenChange={setShowTemplateEditor}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Email Template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Template Name</Label>
                <Input
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({...prev, name: e.target.value}))}
                  placeholder="שם התבנית..."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300">Category</Label>
                <Select
                  value={templateData.category}
                  onValueChange={(value) => setTemplateData(prev => ({...prev, category: value}))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Subject Line</Label>
                <Input
                  value={templateData.subject}
                  onChange={(e) => setTemplateData(prev => ({...prev, subject: e.target.value}))}
                  placeholder="נושא האימייל..."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <Button
                onClick={generateAITemplate}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate with AI
              </Button>
            </div>

            <div>
              <Label className="text-slate-300">Email Content</Label>
              <Textarea
                value={templateData.content}
                onChange={(e) => setTemplateData(prev => ({...prev, content: e.target.value}))}
                placeholder="תוכן האימייל..."
                className="bg-slate-800 border-slate-700 text-white min-h-[300px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateEditor(false)}>
              Cancel
            </Button>
            <Button onClick={saveTemplate} className="bg-green-600 hover:bg-green-700">
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
