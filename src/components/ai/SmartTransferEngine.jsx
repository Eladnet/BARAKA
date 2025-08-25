import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Users, 
  Crown, 
  MessageCircle,
  ArrowRight,
  UserCheck,
  Clock
} from "lucide-react";

export default function SmartTransferEngine({ lead, conversation, onTransfer }) {
  const [transferring, setTransferring] = useState(false);

  const transferOptions = [
    {
      type: 'manager',
      title: 'העבר למנהל המועדון',
      description: 'לטיפול אישי ומעקב צמוד',
      icon: UserCheck,
      color: 'text-yellow-400',
      phone: '+972501234567',
      name: 'דני - מנהל'
    },
    {
      type: 'vip',
      title: 'העבר לשירות VIP',
      description: 'לקוחות עם פוטנציאל גבוה',
      icon: Crown,
      color: 'text-purple-400',
      phone: '+972521234567',
      name: 'מירי - VIP'
    },
    {
      type: 'group',
      title: 'הוסף לקבוצת המועדון',
      description: 'עדכונים ואירועים יומיים',
      icon: Users,
      color: 'text-blue-400',
      link: 'https://chat.whatsapp.com/club-group',
      name: 'קבוצת המועדון'
    }
  ];

  const handleTransfer = async (option) => {
    setTransferring(true);
    
    try {
      // הודעת העברה ללקוח
      const transferMessage = `
היי ${lead.first_name}! 👋

${option.type === 'manager' 
  ? `אני מעביר אותך למנהל המועדון ${option.name} לטיפול אישי וישיר 🎯`
  : option.type === 'vip' 
  ? `בשל הסטטוס המיוחד שלך, אני מעביר אותך לשירות ה-VIP שלנו 👑`
  : `אני מוסיף אותך לקבוצת המועדון שלנו לעדכונים ואירועים בלעדיים! 🎉`
}

${option.phone 
  ? `📱 מספר ישיר: ${option.phone}`
  : option.link 
  ? `🔗 קישור לקבוצה: ${option.link}`
  : ''
}

תודה שאתה חלק מהמשפחה שלנו! 🔥
      `;

      // שליחת ההודעה ללקוח
      await sendWhatsAppMessage(lead.phone_number, transferMessage);
      
      // עדכון סטטוס הליד
      await updateLeadStatus(lead.id, {
        control_status: 'human_control',
        assigned_to: option.name,
        transfer_type: option.type,
        transfer_timestamp: new Date().toISOString()
      });

      onTransfer?.(option);
      alert(`✅ הלקוח הועבר בהצלחה ل${option.name}!`);
      
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('❌ שגיאה בהעברה, נסה שוב');
    }
    
    setTransferring(false);
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-orange-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-orange-400" />
          העברה חכמה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transferOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div 
              key={option.type}
              className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${option.color}`} />
                  <div>
                    <h4 className="text-white font-medium">{option.title}</h4>
                    <p className="text-slate-400 text-sm">{option.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleTransfer(option)}
                  disabled={transferring}
                  className="bg-orange-600 hover:bg-orange-700"
                  size="sm"
                >
                  {transferring ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    'העבר'
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  // פונקציות עזר
  async function sendWhatsAppMessage(phone, message) {
    // אינטגרציה עם WhatsApp API
    console.log(`Sending to ${phone}:`, message);
  }

  async function updateLeadStatus(leadId, updates) {
    // עדכון בבסיס הנתונים
    console.log(`Updating lead ${leadId}:`, updates);
  }
}