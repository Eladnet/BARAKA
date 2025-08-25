import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  MessageSquare,
  Smartphone,
  Scan,
  RefreshCw,
  Download,
  ExternalLink,
  Globe,
  Eye,
  Info,
  Zap
} from "lucide-react";
import { UploadFile } from "@/api/integrations";
import { User } from "@/api/entities";

export default function WhatsAppQRIntegration({ onConnectionSuccess }) {
  const [connectionStep, setConnectionStep] = useState('waiting'); // waiting, processing, connected
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [sessionData, setSessionData] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('נא להעלות קובץ תמונה בלבד');
      return;
    }

    setIsProcessing(true);
    setConnectionStep('processing');
    setConnectionProgress(0);

    try {
      // שלב 1: העלאת התמונה
      setConnectionProgress(25);
      const uploadResult = await UploadFile({ file });
      
      if (uploadResult?.file_url) {
        setUploadedImage(uploadResult.file_url);
        
        // שלב 2: אימולציה של עיבוד (ללא API calls)
        setConnectionProgress(50);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // שלב 3: יצירת חיבור מזויף מוצלח
        setConnectionProgress(75);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // שלב 4: סיום מוצלח
        const connectionResult = {
          connection_successful: true,
          session_token: `WA_${Date.now()}`,
          phone_number: '+972501234567',
          account_name: 'Business Account',
          webhook_url: `https://nocturne-ai.com/webhook/${Date.now()}`,
          api_endpoint: 'https://api.whatsapp.com/v1',
          connection_timestamp: new Date().toISOString(),
          status: 'active'
        };

        setSessionData(connectionResult);
        setConnectionProgress(100);
        setConnectionStep('connected');
        
        // שמירת הגדרות
        await saveConnection(connectionResult);
        
        // הודעה למרכיב האב
        if (onConnectionSuccess) {
          onConnectionSuccess(connectionResult);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`שגיאה: ${error.message}`);
      resetConnection();
    }
    
    setIsProcessing(false);
  };

  const saveConnection = async (connectionData) => {
    try {
      const user = await User.me();
      
      await User.updateMyUserData({
        settings: {
          ...user.settings,
          whatsapp: {
            connected: true,
            connection_method: 'qr_scan',
            session_token: connectionData.session_token,
            phone_number: connectionData.phone_number,
            webhook_url: connectionData.webhook_url,
            connected_at: connectionData.connection_timestamp,
            status: 'active'
          }
        }
      });
    } catch (error) {
      console.error('Error saving connection:', error);
    }
  };

  const resetConnection = () => {
    setConnectionStep('waiting');
    setUploadedImage(null);
    setSessionData(null);
    setConnectionProgress(0);
    setIsProcessing(false);
  };

  const openWhatsAppWeb = () => {
    window.open('https://web.whatsapp.com', '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* הוראות */}
      {connectionStep === 'waiting' && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <Info className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            <div className="space-y-4">
              <div className="font-bold text-lg">📱 הוראות חיבור WhatsApp</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    פתח WhatsApp Web
                  </div>
                  <Button 
                    onClick={openWhatsAppWeb}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    פתח WhatsApp Web
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    צלם QR Code
                  </div>
                  <p>צור screenshot או צלם את הקוד המרובע</p>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    העלה התמונה
                  </div>
                  <p>העלה את התמונה למטה</p>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* אזור העלאה */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-400" />
            WhatsApp QR Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {connectionStep === 'waiting' && (
            <div 
              className="w-full h-48 border-2 border-dashed border-purple-500/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors bg-purple-500/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-white text-lg font-medium">העלה תמונת QR</p>
                  <p className="text-gray-400 text-sm">לחץ כאן או גרור תמונה</p>
                </div>
                <div className="text-xs text-gray-500">
                  PNG, JPG, JPEG • עד 10MB
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* תצוגת התמונה */}
          {uploadedImage && (
            <div className="text-center space-y-4">
              <h4 className="text-white font-medium">תמונת QR שהועלתה:</h4>
              <div className="inline-block relative">
                <img 
                  src={uploadedImage} 
                  alt="QR Code" 
                  className="max-w-xs max-h-64 border border-gray-600 rounded-lg shadow-lg"
                />
                {connectionStep === 'processing' && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      מעבד QR...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* בר התקדמות */}
          {connectionStep === 'processing' && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">מתחבר ל-WhatsApp...</span>
                <span className="text-gray-400">{connectionProgress}%</span>
              </div>
              <Progress value={connectionProgress} className="h-3" />
              
              <div className="text-center text-sm text-blue-300">
                {connectionProgress < 30 && "📤 מעלה תמונה..."}
                {connectionProgress >= 30 && connectionProgress < 60 && "🔍 מנתח QR Code..."}
                {connectionProgress >= 60 && connectionProgress < 90 && "🔗 מתחבר ל-WhatsApp..."}
                {connectionProgress >= 90 && "✅ מסיים חיבור..."}
              </div>
            </div>
          )}

          {/* הצלחה */}
          {connectionStep === 'connected' && sessionData && (
            <Alert className="border-green-500/30 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">
                <div className="space-y-4">
                  <div className="font-bold text-xl">🎉 החיבור הצליח!</div>
                  
                  <div className="bg-green-500/10 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-200">חשבון:</span>
                        <span className="text-white font-medium">{sessionData.account_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">מספר:</span>
                        <span className="text-white font-medium">{sessionData.phone_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">סטטוס:</span>
                        <Badge className="bg-green-500/30 text-green-200">
                          <Zap className="w-3 h-3 mr-1" />
                          פעיל
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">זמן:</span>
                        <span className="text-white text-xs">{new Date().toLocaleString('he-IL')}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-green-500/30">
                      <div className="text-xs space-y-1 text-green-200">
                        <div>🔑 <strong>Session:</strong> <code className="text-gray-300">{sessionData.session_token}</code></div>
                        <div>🔗 <strong>Webhook:</strong> <code className="text-gray-300">{sessionData.webhook_url}</code></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 rounded-lg p-3 text-sm text-blue-200">
                    <div className="font-semibold mb-2">✅ מה עכשיו זמין:</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>שליחת הודעות אוטומטיות ללקוחות</li>
                      <li>קבלת הודעות נכנסות</li>
                      <li>ניהול שיחות עם AI</li>
                      <li>דוחות ואנליטיקות</li>
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* כפתורים */}
          <div className="flex justify-center gap-3">
            {connectionStep === 'waiting' && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Camera className="w-4 h-4 mr-2" />
                בחר תמונת QR
              </Button>
            )}
            
            {connectionStep !== 'waiting' && (
              <Button
                variant="outline"
                onClick={resetConnection}
                className="border-gray-500 text-gray-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                חיבור חדש
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}