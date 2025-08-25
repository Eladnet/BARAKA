
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  XCircle, 
  User,
  MapPin,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { EventQR } from "@/api/entities";

export default function TicketScanner({ open, onOpenChange, onSuccess }) {
  const [scanMode, setScanMode] = useState('manual'); // 'manual' or 'camera'
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleClose = () => {
    setScanResult(null);
    setQrInput('');
    if (onOpenChange) onOpenChange(false);
  };

  const handleManualScan = async (e) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    setIsScanning(true);
    try {
      // Find QR code in database
      const qrCodes = await EventQR.filter({ qr_code: qrInput.trim() });
      
      if (qrCodes.length === 0) {
        setScanResult({
          success: false,
          message: 'QR Code לא נמצא במערכת',
          qr: null
        });
      } else {
        const qr = qrCodes[0];
        
        if (qr.is_used) {
          setScanResult({
            success: false,
            message: 'הכרטיס כבר נוצל',
            qr: qr,
            usedAt: qr.used_at
          });
        } else {
          // Mark as used
          const updatedQR = await EventQR.update(qr.id, {
            is_used: true,
            used_at: new Date().toISOString()
          });
          
          setScanResult({
            success: true,
            message: 'כניסה אושרה בהצלחה!',
            qr: updatedQR
          });
          
          // הודעת הצלחה
          alert('✅ כניסה אושרה! הכרטיס נוצל בהצלחה.');
          
          // רענון נתונים
          if (onSuccess) {
            onSuccess();
          }
        }
      }
    } catch (error) {
      console.error('Error scanning QR:', error);
      setScanResult({
        success: false,
        message: 'שגיאה בסריקת הקוד',
        qr: null
      });
      alert(`❌ שגיאה בסריקה: ${error.message}`);
    }
    
    setIsScanning(false);
    setQrInput('');
  };

  const resetScan = () => {
    setScanResult(null);
    setQrInput('');
  };

  // אם לא פתוח - לא להציג כלום
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-purple-500/30 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">סריקת כרטיסים</h2>
            <Button variant="ghost" onClick={handleClose} className="text-slate-400 hover:text-white">
              ✕
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scanner Interface */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-purple-400" />
                  סריקת כניסה
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Scan Mode Toggle */}
                <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setScanMode('manual')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      scanMode === 'manual' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    הקלדה ידנית
                  </button>
                  <button
                    onClick={() => setScanMode('camera')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      scanMode === 'camera' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    סריקה במצלמה
                  </button>
                </div>

                {scanMode === 'manual' ? (
                  <form onSubmit={handleManualScan} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-slate-300 text-sm">הכנס קוד QR</label>
                      <Input
                        value={qrInput}
                        onChange={(e) => setQrInput(e.target.value)}
                        placeholder="QR_1234567890_abc..."
                        className="bg-slate-800 border-slate-700 text-white font-mono"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isScanning || !qrInput.trim()}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    >
                      {isScanning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          בודק...
                        </>
                      ) : (
                        'בדק כניסה'
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                      <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">הצב את המצלמה מול הQR Code</p>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => alert('📷 מצלמה תהיה זמינה בקרוב!')}
                      >
                        הפעל מצלמה
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      דרוש אישור גישה למצלמה בדפדפן
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scan Result */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">תוצאת סריקה</CardTitle>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    {/* Result Status */}
                    <div className={`p-4 rounded-lg border-2 ${
                      scanResult.success 
                        ? 'bg-emerald-900/50 border-emerald-500/50' 
                        : 'bg-red-900/50 border-red-500/50'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        {scanResult.success ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
                        )}
                        <span className={`font-medium ${
                          scanResult.success ? 'text-emerald-300' : 'text-red-300'
                        }`}>
                          {scanResult.message}
                        </span>
                      </div>
                      
                      {scanResult.qr && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">אירוע:</span>
                            <span className="text-white font-medium">{scanResult.qr.event_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">סוג כניסה:</span>
                            <Badge className="bg-purple-500/20 text-purple-300">
                              {scanResult.qr.entry_type}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">מחיר:</span>
                            <span className="text-emerald-400">₪{scanResult.qr.ticket_price || 0}</span>
                          </div>
                          {scanResult.usedAt && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">נוצל ב:</span>
                              <span className="text-red-400">
                                {new Date(scanResult.usedAt).toLocaleString('he-IL')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Special Instructions */}
                    {scanResult.qr?.special_instructions && (
                      <div className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-yellow-300 mb-1">הוראות מיוחדות:</p>
                            <p className="text-sm text-yellow-200">{scanResult.qr.special_instructions}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button onClick={resetScan} variant="outline" className="w-full border-slate-600">
                      סרוק כרטיס נוסף
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-2">ממתין לסריקה</p>
                    <p className="text-sm text-slate-500">הכנס קוד QR או השתמש במצלמה</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
