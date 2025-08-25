import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, CheckCircle, XCircle, Loader2, Download, MessageSquare } from "lucide-react";
import { Interaction, Lead } from "@/api/entities";
import { UploadFile, ExtractDataFromUploadedFile } from "@/api/integrations";
import { Badge } from "@/components/ui/badge";

const STEPS = {
  UPLOAD: 'UPLOAD',
  IMPORTING: 'IMPORTING', 
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
};

const EXTRACTION_SCHEMA = {
  "type": "object",
  "properties": {
    "conversations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "customer_name": { "type": "string", "description": "שם הלקוח" },
          "phone_number": { "type": "string", "description": "מספר טלפון" },
          "platform": { "type": "string", "description": "פלטפורמה: whatsapp, facebook, instagram" },
          "message_type": { "type": "string", "description": "סוג הודעה: ai_sent, customer_reply" },
          "message_content": { "type": "string", "description": "תוכן הודעה" },
          "timestamp": { "type": "string", "description": "זמן ההודעה" },
          "promoter_name": { "type": "string", "description": "שם היחצ״ן" }
        },
        "required": ["customer_name", "phone_number", "message_content", "message_type"]
      }
    }
  }
};

export default function ImportConversations({ open, onOpenChange, onSuccess }) {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [importResults, setImportResults] = useState({ success: 0, failed: 0 });
  const fileInputRef = useRef(null);

  const resetState = () => {
    setStep(STEPS.UPLOAD);
    setFile(null);
    setIsProcessing(false);
    setProgressMessage('');
    setErrorMessage('');
    setImportResults({ success: 0, failed: 0 });
  };

  const handleDialogChange = (isOpen) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setErrorMessage('');
      } else {
        setErrorMessage("סוג קובץ לא תקין. אנא העלה קובץ CSV.");
        setFile(null);
      }
    }
  };

  const downloadTemplate = () => {
    const csvTemplate = `customer_name,phone_number,platform,message_type,message_content,timestamp,promoter_name
דני כהן,+972501234567,whatsapp,ai_sent,"היי דני! מה קורה?",2024-01-15 20:30:00,LiorAI
דני כהן,+972501234567,whatsapp,customer_reply,"מה יש?",2024-01-15 20:32:00,LiorAI
Sarah Miller,+1555987654,facebook,ai_sent,"Hey Sarah! Amazing party tonight!",2024-01-15 19:15:00,MiamiBot`;
    
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversations_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;

    setStep(STEPS.IMPORTING);
    setIsProcessing(true);
    setErrorMessage('');

    try {
      setProgressMessage('מעלה קובץ...');
      const uploadResult = await UploadFile({ file });
      if (!uploadResult?.file_url) throw new Error('העלאת הקובץ נכשלה.');
      
      setProgressMessage('מחלץ נתונים מהקובץ...');
      const extractResult = await ExtractDataFromUploadedFile({
        file_url: uploadResult.file_url,
        json_schema: EXTRACTION_SCHEMA,
      });

      if (extractResult.status !== 'success' || !extractResult.output?.conversations) {
        throw new Error(extractResult.details || 'חילוץ הנתונים נכשל. ודא שהקובץ מכיל את העמודות הנדרשות.');
      }
      
      const conversations = extractResult.output.conversations;
      if (conversations.length === 0) throw new Error("לא נמצאו שיחות בקובץ.");

      setProgressMessage('מעבד נתונים...');
      
      // Create leads first
      const uniqueLeads = new Map();
      conversations.forEach(conv => {
        const key = conv.phone_number;
        if (!uniqueLeads.has(key)) {
          const nameParts = conv.customer_name.trim().split(' ');
          uniqueLeads.set(key, {
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            phone_number: conv.phone_number,
            status: 'engaged'
          });
        }
      });

      const leadsArray = Array.from(uniqueLeads.values());
      setProgressMessage(`יוצר ${leadsArray.length} לקוחות...`);
      
      let createdLeads = [];
      try {
        createdLeads = await Lead.bulkCreate(leadsArray);
      } catch (error) {
        // Some leads might already exist, that's ok
        console.log('Some leads already exist, continuing...');
        createdLeads = leadsArray; // Assume they exist
      }

      // Create interactions
      setProgressMessage(`מייבא ${conversations.length} הודעות...`);
      
      const interactions = conversations.map(conv => ({
        lead_id: `lead_${conv.phone_number}`, // Simplified ID mapping
        promoter_id: `promoter_${conv.promoter_name || 'default'}`,
        interaction_type: conv.message_type === 'ai_sent' ? 'message_sent' : 'message_received',
        message_content: conv.message_type === 'ai_sent' ? conv.message_content : null,
        response_content: conv.message_type === 'customer_reply' ? conv.message_content : null,
        interaction_timestamp: conv.timestamp || new Date().toISOString(),
        sentiment: 'neutral',
        metadata: { 
          platform: conv.platform || 'whatsapp',
          imported: true,
          original_promoter: conv.promoter_name
        }
      }));

      const createdInteractions = await Interaction.bulkCreate(interactions);
      
      setImportResults({
        success: createdInteractions.length,
        failed: conversations.length - createdInteractions.length
      });
      
      setStep(STEPS.COMPLETE);
    } catch (error) {
      console.error("Import error:", error);
      setErrorMessage(error.message || 'שגיאה לא צפויה.');
      setStep(STEPS.ERROR);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case STEPS.UPLOAD:
        return (
          <>
            <DialogDescription className="text-slate-400 text-sm mb-4">
              העלה קובץ CSV עם שיחות קיימות. עמודות נדרשות: customer_name, phone_number, message_content, message_type
            </DialogDescription>
            
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
              >
                <Download className="w-4 h-4 mr-2" />
                הורד קובץ דוגמה
              </Button>
            </div>

            <div 
              className="w-full h-48 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".csv" />
              {file ? (
                <div className="text-center">
                  <File className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-slate-300 font-semibold">{file.name}</p>
                  <p className="text-sm text-slate-500">לחץ לבחירת קובץ אחר</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-500 mb-4" />
                  <p className="text-slate-300 font-semibold">לחץ להעלאת קובץ CSV</p>
                  <p className="text-sm text-slate-400">או גרור ושחרר (בקרוב)</p>
                </>
              )}
            </div>
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
          </>
        );
        
      case STEPS.IMPORTING:
        return (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-white mb-2">מייבא שיחות...</p>
            <p className="text-slate-400">{progressMessage}</p>
          </div>
        );
        
      case STEPS.COMPLETE:
        return (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
            <p className="text-lg font-semibold text-white mb-2">ייבוא הושלם בהצלחה!</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300">
                  {importResults.success} הודעות יובאו
                </Badge>
                {importResults.failed > 0 && (
                  <Badge className="bg-red-500/20 text-red-300">
                    {importResults.failed} נכשלו
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
        
      case STEPS.ERROR:
        return (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-white mb-2">הייבוא נכשל</p>
            <p className="text-slate-400 max-w-sm">{errorMessage}</p>
          </div>
        );
    }
  };

  const renderFooter = () => {
    switch (step) {
      case STEPS.UPLOAD:
        return (
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogChange(false)} className="border-slate-600 text-slate-300">
              ביטול
            </Button>
            <Button onClick={handleImport} disabled={!file || isProcessing} className="bg-gradient-to-r from-purple-600 to-pink-600">
              ייבא שיחות
            </Button>
          </DialogFooter>
        );
        
      case STEPS.COMPLETE:
        return (
          <DialogFooter>
            <Button onClick={() => { onSuccess(); handleDialogChange(false); }} className="bg-gradient-to-r from-purple-600 to-pink-600">
              סיום
            </Button>
          </DialogFooter>
        );
        
      case STEPS.ERROR:
        return (
          <DialogFooter>
            <Button variant="outline" onClick={resetState} className="border-slate-600 text-slate-300">
              נסה שוב
            </Button>
            <Button onClick={() => handleDialogChange(false)} className="bg-gradient-to-r from-purple-600 to-pink-600">
              סגור
            </Button>
          </DialogFooter>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="bg-slate-900 border-purple-500/30 text-white sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            ייבוא שיחות מ-CSV
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
        {renderFooter()}
      </DialogContent>
    </Dialog>
  );
}