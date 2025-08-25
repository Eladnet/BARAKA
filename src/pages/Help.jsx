import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Video, 
  Mail,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Bot,
  Users,
  Settings,
  CreditCard
} from "lucide-react";
import AIHelpBot from '../components/help/AIHelpBot';
import { User } from "@/api/entities";

export default function HelpPage() {
  const [showAIBot, setShowAIBot] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general'
  });
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleContactSupport = () => {
    const supportEmail = 'support@ticketpulse.live';
    const subject = supportForm.subject || 'TICKET PULSE Support Request';
    const body = `${supportForm.message || 'אני זקוק לעזרה עם:'}%0D%0A%0D%0Aקטגוריה: ${supportForm.category}%0D%0A%0D%0Aפרטי המשתמש:%0D%0A- אימייל: ${currentUser?.email || 'לא ידוע'}%0D%0A- שם: ${currentUser?.full_name || 'לא ידוע'}%0D%0A- זמן: ${new Date().toLocaleString('he-IL')}%0D%0A%0D%0Aתודה!`;
    
    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.open(mailtoLink, '_self');
  };

  const quickActions = [
    {
      title: "💬 צ'אט עם AI",
      description: "קבל עזרה מיידית מהבוט החכם שלנו",
      icon: Bot,
      action: () => setShowAIBot(true),
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "📧 פנה לתמיכה",
      description: "שלח הודעה ישירות לצוות התמיכה",
      icon: Mail,
      action: handleContactSupport,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "📞 שיחת חירום",
      description: "לבעיות דחופות - התקשר אלינו",
      icon: Phone,
      action: () => window.open('tel:+972-50-123-4567'),
      color: "from-red-500 to-orange-500"
    },
    {
      title: "📚 מדריך למשתמש", 
      description: "הכרת המערכת וכל התכונות",
      icon: Book,
      action: () => window.open('/docs', '_blank'),
      color: "from-emerald-500 to-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🆘 Help & Support
          </h1>
          <p className="text-gray-600 text-lg">
            אנחנו כאן לעזור לך להצליח עם TICKET PULSE
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={action.action}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} bg-opacity-20 flex items-center justify-center mx-auto mb-4`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              פנה לתמיכה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  נושא הפנייה
                </label>
                <Input
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                  placeholder="תאר בקצרה את הבעיה..."
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  קטגוריה
                </label>
                <select
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({...supportForm, category: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="general">כללי</option>
                  <option value="technical">בעיה טכנית</option>
                  <option value="billing">חיוב ותשלומים</option>
                  <option value="feature">בקשת תכונה</option>
                  <option value="account">ניהול חשבון</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                תיאור הבעיה
              </label>
              <Textarea
                value={supportForm.message}
                onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                placeholder="אנא תאר את הבעיה או השאלה בפירוט..."
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 h-32"
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleContactSupport}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="w-4 h-4 mr-2" />
                שלח במייל
              </Button>
              <Button
                onClick={() => setShowAIBot(true)}
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Bot className="w-4 h-4 mr-2" />
                צ'אט עם AI
              </Button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <Mail className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">אימייל</p>
                <p className="text-indigo-600">support@ticketpulse.live</p>
              </div>
              <div className="text-center">
                <Phone className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">טלפון חירום</p>
                <p className="text-indigo-600">050-123-4567</p>
              </div>
              <div className="text-center">
                <MessageSquare className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">זמני מענה</p>
                <p className="text-indigo-600">א'-ה' 9:00-18:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Help Bot */}
        <AIHelpBot 
          open={showAIBot}
          onOpenChange={setShowAIBot}
        />
      </div>
    </div>
  );
}