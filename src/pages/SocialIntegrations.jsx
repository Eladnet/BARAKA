import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, MessageSquare } from "lucide-react";

import FacebookMessengerIntegration from "../components/integrations/FacebookMessengerIntegration";
import InstagramDMIntegration from "../components/integrations/InstagramDMIntegration";
import WhatsAppQRIntegration from "../components/integrations/WhatsAppQRIntegration";

export default function SocialIntegrations() {
  const [activeTab, setActiveTab] = useState('facebook');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* כותרת ראשית */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Social Media Integrations
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            חבר את כל הרשתות החברתיות שלך למערכת אחת מרכזית לניהול לקוחות ושיווק אוטומטי
          </p>
        </div>

        {/* סטטיסטיקות מהירות */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Facebook className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Facebook Messenger</h3>
              <Badge className="bg-blue-500/20 text-blue-300">מיליארדי משתמשים</Badge>
              <p className="text-gray-400 text-sm mt-2">
                הגע לקהל הרחב ביותר בעולם
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-pink-500/30">
            <CardContent className="p-6 text-center">
              <Instagram className="w-12 h-12 text-pink-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Instagram DM</h3>
              <Badge className="bg-pink-500/20 text-pink-300">צעירים ואקטיביים</Badge>
              <p className="text-gray-400 text-sm mt-2">
                חבר עם הדור הצעיר והיזמי
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-green-500/30">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">WhatsApp Business</h3>
              <Badge className="bg-green-500/20 text-green-300">הכي פופולרי בישראל</Badge>
              <p className="text-gray-400 text-sm mt-2">
                התקשרות ישירה ואישית
              </p>
            </CardContent>
          </Card>
        </div>

        {/* טאבים לאינטגרציות */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/80 backdrop-blur-xl">
            <TabsTrigger 
              value="facebook" 
              className="data-[state=active]:bg-blue-600 text-white"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </TabsTrigger>
            <TabsTrigger 
              value="instagram"
              className="data-[state=active]:bg-pink-600 text-white"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </TabsTrigger>
            <TabsTrigger 
              value="whatsapp"
              className="data-[state=active]:bg-green-600 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="facebook" className="mt-8">
            <FacebookMessengerIntegration />
          </TabsContent>

          <TabsContent value="instagram" className="mt-8">
            <InstagramDMIntegration />
          </TabsContent>

          <TabsContent value="whatsapp" className="mt-8">
            <WhatsAppQRIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}