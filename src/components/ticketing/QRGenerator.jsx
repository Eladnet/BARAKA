
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  QrCode, 
  Download, 
  Send, 
  User,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react";
import { EventQR } from "@/api/entities";

export default function QRGenerator({ open, onOpenChange, venues, leads, onSuccess }) {
  const [formData, setFormData] = useState({
    event_name: '',
    venue_id: '',
    lead_id: '',
    entry_type: 'free',
    ticket_price: 0,
    event_date: '',
    special_instructions: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);

  // סגירת הדיאלוג ורענון נתונים
  const handleClose = () => {
    setGeneratedQR(null);
    setFormData({
      event_name: '',
      venue_id: '',
      lead_id: '',
      entry_type: 'free',
      ticket_price: 0,
      event_date: '',
      special_instructions: ''
    });
    if (onOpenChange) onOpenChange(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Generate unique QR code
      const qrCode = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const qrData = {
        ...formData,
        qr_code: qrCode,
        ticket_price: parseFloat(formData.ticket_price) || 0,
        payment_status: formData.entry_type === 'free' ? 'completed' : 'pending'
      };

      const newQR = await EventQR.create(qrData);
      setGeneratedQR(newQR);
      
      // הודעת הצלחה
      alert('🎫 QR Code נוצר בהצלחה!');
      
      // רענון הנתונים בעמוד הראשי
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setFormData({
        event_name: '',
        venue_id: '',
        lead_id: '',
        entry_type: 'free',
        ticket_price: 0,
        event_date: '',
        special_instructions: ''
      });
    } catch (error) {
      console.error('Error generating QR:', error);
      alert(`❌ שגיאה ביצירת QR: ${error.message}`);
    }
    
    setIsGenerating(false);
  };

  const downloadQR = () => {
    if (!generatedQR) return;
    
    // יצירת QR Code אמיתי כ-SVG (Note: This is a comment, actual SVG generation is not implemented here)
    const qrText = `EVENT:${generatedQR.event_name}\nQR:${generatedQR.qr_code}\nTYPE:${generatedQR.entry_type}\nPRICE:${generatedQR.ticket_price}`;
    
    // יצירת קובץ טקסט עם פרטי הכרטיס
    const ticketData = `
🎫 כרטיס כניסה דיגיטלי 🎫
═══════════════════════════
📅 אירוע: ${generatedQR.event_name}
🏢 מקום: ${venues.find(v => v.id === generatedQR.venue_id)?.name || 'לא זמין'}
🎯 סוג כניסה: ${generatedQR.entry_type}
💰 מחיר: ₪${generatedQR.ticket_price}
📱 קוד QR: ${generatedQR.qr_code}
📆 תאריך: ${new Date(generatedQR.event_date).toLocaleDateString('he-IL')}

${generatedQR.special_instructions ? `📝 הוראות: ${generatedQR.special_instructions}` : ''}

═══════════════════════════
נוצר: ${new Date().toLocaleString('he-IL')}
    `.trim();
    
    const blob = new Blob([ticketData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ticket_${generatedQR.event_name}_${generatedQR.qr_code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('📥 כרטיס הורד בהצלחה!');
  };

  const sendToCustomer = () => {
    if (!generatedQR) return;
    
    const customer = leads.find(l => l.id === generatedQR.lead_id);
    const venue = venues.find(v => v.id === generatedQR.venue_id);
    
    const message = `🎉 הכרטיס שלך מוכן!
    
🎫 אירוע: ${generatedQR.event_name}
🏢 מקום: ${venue?.name || 'לא זמין'}
📅 תאריך: ${new Date(generatedQR.event_date).toLocaleDateString('he-IL')}
🎯 סוג כניסה: ${generatedQR.entry_type}
💰 מחיר: ₪${generatedQR.ticket_price}

📱 קוד QR שלך: ${generatedQR.qr_code}

${generatedQR.special_instructions ? `📝 ${generatedQR.special_instructions}` : ''}

בברכה,
צוות NocturneAI 🌙`;

    // העתקה ללוח
    navigator.clipboard.writeText(message).then(() => {
      alert(`📋 הודעה הועתקה ללוח!\nשלח ל-${customer?.first_name || 'לקוח'} דרך WhatsApp`);
    });
  };

  // אם לא פתוח - לא להציג כלום
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-purple-500/30 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">יצירת QR Code חדש</h2>
            <Button variant="ghost" onClick={handleClose} className="text-slate-400 hover:text-white">
              ✕
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Generation Form */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-purple-400" />
                  יצירת QR חדש
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event_name" className="text-slate-300">שם האירוע</Label>
                      <Input
                        id="event_name"
                        value={formData.event_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
                        placeholder="מסיבת טכנו"
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="venue_id" className="text-slate-300">מקום</Label>
                      <Select 
                        value={formData.venue_id} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, venue_id: value }))}
                        required
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="בחר מקום" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {venues.map(venue => (
                            <SelectItem key={venue.id} value={venue.id} className="text-slate-300">
                              {venue.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead_id" className="text-slate-300">לקוח</Label>
                      <Select 
                        value={formData.lead_id} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, lead_id: value }))}
                        required
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="בחר לקוח" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {leads.map(lead => (
                            <SelectItem key={lead.id} value={lead.id} className="text-slate-300">
                              {lead.first_name} {lead.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="entry_type" className="text-slate-300">סוג כניסה</Label>
                      <Select 
                        value={formData.entry_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, entry_type: value }))}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="free" className="text-slate-300">כניסה חינם</SelectItem>
                          <SelectItem value="vip" className="text-slate-300">VIP</SelectItem>
                          <SelectItem value="table" className="text-slate-300">שולחן</SelectItem>
                          <SelectItem value="discount" className="text-slate-300">הנחה</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticket_price" className="text-slate-300">מחיר כרטיס (₪)</Label>
                      <Input
                        id="ticket_price"
                        type="number"
                        value={formData.ticket_price}
                        onChange={(e) => setFormData(prev => ({ ...prev, ticket_price: e.target.value }))}
                        placeholder="0"
                        className="bg-slate-800 border-slate-700 text-white"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event_date" className="text-slate-300">תאריך האירוע</Label>
                      <Input
                        id="event_date"
                        type="datetime-local"
                        value={formData.event_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special_instructions" className="text-slate-300">הוראות מיוחדות</Label>
                    <Textarea
                      id="special_instructions"
                      value={formData.special_instructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
                      placeholder="הוראות מיוחדות לכניסה..."
                      className="bg-slate-800 border-slate-700 text-white h-20"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        יוצר QR...
                      </>
                    ) : (
                      'צור QR Code'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Generated QR Display */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">QR שנוצר</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedQR ? (
                  <div className="space-y-4">
                    {/* QR Code Visual (placeholder) */}
                    <div className="bg-white p-8 rounded-lg text-center">
                      <div className="w-48 h-48 mx-auto bg-black flex items-center justify-center rounded-lg">
                        <QrCode className="w-32 h-32 text-white" />
                      </div>
                      <p className="mt-4 text-black font-mono text-sm">{generatedQR.qr_code}</p>
                    </div>

                    {/* QR Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">אירוע:</span>
                        <span className="text-white font-medium">{generatedQR.event_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">סוג כניסה:</span>
                        <span className="text-purple-300">{generatedQR.entry_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">מחיר:</span>
                        <span className="text-emerald-400">₪{generatedQR.ticket_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">תאריך:</span>
                        <span className="text-slate-300">
                          {new Date(generatedQR.event_date).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button onClick={downloadQR} variant="outline" className="flex-1 border-slate-600">
                        <Download className="w-4 h-4 mr-2" />
                        הורד QR
                      </Button>
                      <Button onClick={sendToCustomer} variant="outline" className="flex-1 border-slate-600">
                        <Send className="w-4 h-4 mr-2" />
                        שלח ללקוח
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">מלא את הפרטים ויצור QR Code</p>
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
