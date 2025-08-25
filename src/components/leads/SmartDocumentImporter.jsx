
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  File,
  FileText,
  Image,
  Table,
  CheckCircle,
  AlertTriangle,
  Download,
  Users,
  Brain,
  Sparkles,
  Database,
  UserCheck,
  RefreshCw,
  FileSpreadsheet,
  FileImage,
  Camera,
  Scan,
  Eye,
  Settings,
  Zap
} from 'lucide-react';
import { Lead } from "@/api/entities";
import { InvokeLLM, UploadFile } from "@/api/integrations";

const IMPORT_STEPS = {
  UPLOAD: 'upload',
  ANALYZING: 'analyzing',
  EXTRACTING: 'extracting',
  PROCESSING: 'processing',
  MATCHING: 'matching',
  UPDATING: 'updating',
  COMPLETE: 'complete'
};

const SUPPORTED_FILE_TYPES = [
  { type: 'pdf', name: 'PDF', icon: FileText, description: 'מסמכי PDF - רשימות לקוחות, דוחות' },
  { type: 'excel', name: 'Excel/CSV', icon: FileSpreadsheet, description: 'קבצי אקסל - נתוני לקוחות, רשימות' },
  { type: 'word', name: 'Word', icon: File, description: 'מסמכי Word - דוחות, רשימות' },
  { type: 'image', name: 'תמונות', icon: FileImage, description: 'תמונות - כרטיסי ביקור, צילומי מסך' },
  { type: 'text', name: 'טקסט', icon: FileText, description: 'קבצי טקסט רגילים' }
];

export default function SmartDocumentImporter({ open, onOpenChange, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(IMPORT_STEPS.UPLOAD);
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [matchingResults, setMatchingResults] = useState(null);
  const [importResults, setImportResults] = useState({
    total: 0,
    new_leads: 0,
    updated_leads: 0,
    matched_existing: 0,
    failed: 0,
    errors: []
  });
  const fileInputRef = useRef(null);

  const resetDialog = () => {
    setCurrentStep(IMPORT_STEPS.UPLOAD);
    setFiles([]);
    setExtractedData(null);
    setMatchingResults(null);
    setImportResults({ total: 0, new_leads: 0, updated_leads: 0, matched_existing: 0, failed: 0, errors: [] });
    setProgress(0);
    setProgressMessage('');
    setIsProcessing(false);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (!uploadedFiles.length) return;

    const supportedExtensions = ['.pdf', '.xlsx', '.xls', '.csv', '.docx', '.doc', '.txt', '.jpg', '.jpeg', '.png', '.webp'];
    const validFiles = uploadedFiles.filter(file => {
      const fileExtension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'));
      return supportedExtensions.includes(fileExtension);
    });

    if (validFiles.length !== uploadedFiles.length) {
      alert('חלק מהקבצים לא נתמכים. הקבצים הנתמכים: PDF, Excel, Word, CSV, תמונות');
    }

    setFiles(validFiles);
  };

  const processSmartImport = async () => {
    if (!files.length) return;

    setCurrentStep(IMPORT_STEPS.ANALYZING);
    setIsProcessing(true);
    setProgress(0);

    let allExtractedData = [];

    try {
      // שלב 1: העלאת קבצים
      setProgressMessage('מעלה קבצים לענן...');
      setProgress(5);

      const uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgressMessage(`מעלה קובץ ${i + 1} מתוך ${files.length}: ${file.name}`);
        const uploadResult = await UploadFile({ file });
        uploadedFiles.push({
          name: file.name,
          type: file.type,
          url: uploadResult.file_url,
          size: file.size,
          extension: file.name.toLowerCase().substr(file.name.lastIndexOf('.'))
        });
        setProgress(5 + (i + 1) * 10 / files.length);
      }

      // שלב 2: עיבוד חכם לפי סוג קובץ
      setCurrentStep(IMPORT_STEPS.EXTRACTING);
      setProgressMessage('מנתח קבצים באמצעות AI מתקדם...');
      setProgress(20);

      for (let i = 0; i < uploadedFiles.length; i++) {
        const fileData = uploadedFiles[i];
        setProgressMessage(`מנתח קובץ ${i + 1}: ${fileData.name} - חילוץ נתוני לקוחות...`);

        try {
          let enhancedData;

          // בדיקה אם זה קובץ CSV או טקסט שצריך קריאה ישירה
          if (['.csv', '.txt'].includes(fileData.extension)) {
            enhancedData = await processTextFileWithDirectRead(fileData);
          } else {
            // לקבצים אחרים (PDF, Word, תמונות) נשתמש בשיטה הרגילה
            enhancedData = await processFileWithAI(fileData);
          }

          if (enhancedData && enhancedData.length > 0) {
            allExtractedData.push(...enhancedData);
          } else if (enhancedData && enhancedData.length === 0) {
            setImportResults(prev => ({
              ...prev,
              errors: [...prev.errors, `לא נמצאו לקוחות תקינים בקובץ ${fileData.name}`]
            }));
          }
        } catch (error) {
          console.error(`Error processing file ${fileData.name}:`, error);
          setImportResults(prev => ({
            ...prev,
            errors: [...prev.errors, `שגיאה בעיבוד ${fileData.name}: ${error.message}`]
          }));
        }

        setProgress(20 + (i + 1) * 30 / uploadedFiles.length);
      }

      setExtractedData(allExtractedData);

      // שלב 3: התאמה ללקוחות קיימים
      setCurrentStep(IMPORT_STEPS.MATCHING);
      setProgressMessage('מתאים נתונים ללקוחות קיימים...');
      setProgress(55);

      const matchingResults = await matchWithExistingLeads(allExtractedData);
      setMatchingResults(matchingResults);
      setProgress(70);

      // שלב 4: עדכון בסיס הנתונים
      setCurrentStep(IMPORT_STEPS.UPDATING);
      setProgressMessage('מעדכן בסיס נתונים...');

      const updateResults = await updateDatabase(matchingResults);
      setImportResults(updateResults);
      setProgress(100);

      setCurrentStep(IMPORT_STEPS.COMPLETE);

    } catch (error) {
      console.error('Import error:', error);
      setImportResults(prev => ({
        ...prev,
        failed: allExtractedData.length || 1,
        errors: [...(prev.errors || []), error.message]
      }));
      setCurrentStep(IMPORT_STEPS.COMPLETE);
    }

    setIsProcessing(false);
  };

  // פונקציה חדשה לקריאת קבצי טקסט/CSV ישירות עם AI מתקדם
  const processTextFileWithDirectRead = async (fileData) => {
    try {
      // קריאת תוכן הקובץ ישירות
      const response = await fetch(fileData.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      let fileContent = await response.text();

      // ניקוי תוכן בסיסי
      fileContent = fileContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      // חלוקת התוכן לחלקים אם הוא גדול מדי
      const maxChunkSize = 40000;
      const chunks = [];

      if (fileContent.length > maxChunkSize) {
        const lines = fileContent.split('\n');
        let currentChunk = '';

        for (const line of lines) {
          if (currentChunk.length + line.length + 1 > maxChunkSize && currentChunk.length > 0) { // +1 for the newline
            chunks.push(currentChunk);
            currentChunk = line + '\n';
          } else {
            currentChunk += line + '\n';
          }
        }
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }
      } else {
        chunks.push(fileContent);
      }

      const allLeads = [];

      // עיבוד כל חלק בנפרד
      for (let i = 0; i < chunks.length; i++) {
        const chunkContent = chunks[i];

        const prompt = `
אתה מומחה מתקדם בחילוץ נתוני לקוחות. עליך לנתח ולחלץ כל מידע אפשרי.

קובץ: ${fileData.name} (חלק ${i + 1}/${chunks.length})

תוכן לניתוח:
${chunkContent}

חלץ לכל לקוח:
- שם פרטי ומשפחה
- טלפון (נקה וסדר)
- מייל
- תאריך לידה/גיל
- תז (8-9 ספרות)
- כתובת
- מקצוע/חברה
- רשתות חברתיות (@username, קישורים)
- כל מידע נוסף רלוונטי

זהה דפוסים גם בנתונים לא מסודרים. החזר רק עם שם וטלפון/מייל תקינים.
        `;

        const result = await InvokeLLM({
          prompt: prompt,
          response_json_schema: {
            type: "object",
            properties: {
              leads: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    first_name: { type: "string" },
                    last_name: { type: "string" },
                    phone_number: { type: "string" },
                    email: { type: "string" },
                    age: { type: "number" },
                    birthday: { type: "string" },
                    id_number: { type: "string" },
                    location: { type: "string" },
                    profession: { type: "string" },
                    company: { type: "string" },
                    instagram_handle: { type: "string" },
                    facebook_profile: { type: "string" },
                    notes: { type: "string" },
                    data_quality: { type: "string" }
                  }
                }
              }
            },
            required: ["leads"]
          }
        });

        if (result && result.leads) {
          const cleanedLeads = result.leads.map(lead => ({
            first_name: lead.first_name || '',
            last_name: lead.last_name || '',
            phone_number: cleanPhoneNumber(lead.phone_number),
            email: lead.email || null,
            age: (lead.age !== null && lead.age !== undefined && !isNaN(lead.age)) ? parseInt(lead.age) : null,
            birthday: lead.birthday || null,
            id_number: lead.id_number || null,
            location: lead.location || null,
            profession: lead.profession || null,
            company: lead.company || null,
            instagram_handle: lead.instagram_handle || null,
            facebook_profile: lead.facebook_profile || null,
            notes: lead.notes || null,
            data_quality: lead.data_quality || 'medium',
            source_document: fileData.name,
            import_date: new Date().toISOString(),
            status: 'cold'
          })).filter(lead =>
            lead.first_name && (lead.phone_number || lead.email)
          );

          allLeads.push(...cleanedLeads);
        }
      }

      return allLeads;
    } catch (error) {
      console.error('Direct file processing failed:', error);
      throw error;
    }
  };

  // פונקציה לעיבוד קבצים אחרים (PDF, Word, תמונות)
  const processFileWithAI = async (fileData) => {
    const prompt = `
      אתה מומחה בחילוץ נתוני לקוחות מקבצים. עליך לנתח את הקובץ הבא ולחלץ מידע על לקוחות.

      שם הקובץ: ${fileData.name}

      הקובץ מכיל נתוני אירוע/לקוחות. אנא חלץ את המידע הבא לכל לקוח:
      - שם מלא (או שם פרטי + משפחה)
      - טלפון
      - אימייל
      - גיל או תאריך לידה אם קיים
      - תז (8-9 ספרות)
      - כתובת
      - מקצוע/חברה
      - רשתות חברתיות (@username, קישורים)
      - כל מידע נוסף רלוונטי

      חשוב:
      1. התעלם משורות שבורות או לא קריאות
      2. נקה נתונים לא תקינים
      3. זהה דפוסים גם אם הקובץ לא מעוצב היטב
      4. המר תאריכים לפורמט תקני
      5. נקה מספרי טלפון (הסר רווחים ותווים מיוחדים)
      6. אם אין גיל - השאר את השדה ריק (null)

      החזר רק לקוחות עם שם וטלפון תקינים.
    `;

    try {
      const result = await InvokeLLM({
        prompt: prompt,
        file_urls: [fileData.url],
        response_json_schema: {
          type: "object",
          properties: {
            leads: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  first_name: { type: "string" },
                  last_name: { type: "string" },
                  phone_number: { type: "string" },
                  email: { type: "string" },
                  birthday: { type: "string" },
                  age: { type: "number" },
                  id_number: { type: "string" },
                  location: { type: "string" },
                  profession: { type: "string" },
                  company: { type: "string" },
                  instagram_handle: { type: "string" },
                  facebook_profile: { type: "string" },
                  notes: { type: "string" },
                  data_quality: { type: "string" }
                },
                required: ["first_name"]
              }
            },
            processing_notes: { type: "string" },
            data_quality_score: { type: "number" }
          },
          required: ["leads"]
        }
      });

      if (result && result.leads) {
        return result.leads.map(lead => {
          // ניקוי ונורמליזציה של הנתונים
          const cleanedLead = {
            first_name: lead.first_name || '',
            last_name: lead.last_name || '',
            phone_number: cleanPhoneNumber(lead.phone_number),
            email: lead.email || null,
            birthday: lead.birthday || null,
            age: (lead.age !== null && lead.age !== undefined && !isNaN(lead.age)) ? parseInt(lead.age) : null,
            id_number: lead.id_number || null,
            location: lead.location || null,
            profession: lead.profession || null,
            company: lead.company || null,
            instagram_handle: lead.instagram_handle || null,
            facebook_profile: lead.facebook_profile || null,
            notes: lead.notes || null,
            data_quality: lead.data_quality || 'medium',
            source_document: fileData.name,
            import_date: new Date().toISOString(),
            status: 'cold'
          };

          // הסרת שדות ריקים שגורמים לבעיות
          Object.keys(cleanedLead).forEach(key => {
            if (cleanedLead[key] === '' || cleanedLead[key] === undefined) {
              cleanedLead[key] = null;
            }
          });

          // וידוא שיש שם פרטי וטלפון/אימייל
          if (!cleanedLead.first_name || (!cleanedLead.phone_number && !cleanedLead.email)) {
            return null; // סמן ליד זה כלא תקין
          }

          return cleanedLead;
        }).filter(lead => lead !== null); // הסרת לידים לא תקינים
      }

      return [];
    } catch (error) {
      console.error('AI processing failed:', error);
      throw error;
    }
  };

  // פונקציות עזר לניקוי נתונים
  const cleanPhoneNumber = (phone) => {
    if (!phone) return null;

    // Ensure phone is a string and remove non-digit characters except for '+'
    let cleaned = phone.toString().replace(/[^\d+]/g, '');

    // Handle common Israeli phone number formats
    // If it starts with '05' and is 10 digits (e.g., 05X-XXXXXXX), convert to +9725XXXXXXXX
    if (cleaned.startsWith('05') && cleaned.length === 10) {
        cleaned = '+972' + cleaned.substring(1);
    }
    // If it starts with '0' and is 9 digits (e.g., 0X-XXXXXXX for landlines), convert to +972XXXXXXXX
    else if (cleaned.startsWith('0') && cleaned.length === 9) {
        cleaned = '+972' + cleaned.substring(1);
    }
    // If it's 9 digits and doesn't start with '0' or '+', assume it's an Israeli number missing '0' and '+972'
    else if (!cleaned.startsWith('+') && cleaned.length === 9) { // e.g., 5X-XXXXXXX
        cleaned = '+972' + cleaned;
    }
    // If it starts with '972' and is 12 digits, prepend '+'
    else if (cleaned.startsWith('972') && cleaned.length === 12) { // e.g., 9725XXXXXXXX
        cleaned = '+' + cleaned;
    }
    // If it doesn't start with '+' but is 10 digits (e.g., 5012345678, missing 0 or +972)
    else if (!cleaned.startsWith('+') && cleaned.length === 10) {
      cleaned = '+972' + cleaned.substring(1); // Assume it was 05x or similar
    }


    // Final validation for international format: starts with '+' and has a reasonable length
    if (cleaned.startsWith('+') && cleaned.length >= 10 && cleaned.length <= 15) {
        return cleaned;
    }

    return null; // Invalid phone number
  };


  const matchWithExistingLeads = async (newLeads) => {
    if (!newLeads || newLeads.length === 0) {
      return {
        new_leads: [],
        update_matches: [],
        exact_matches: [],
        potential_duplicates: []
      };
    }

    const existingLeads = await Lead.list('-created_date', 5000);
    const results = {
      new_leads: [],
      update_matches: [],
      exact_matches: [],
      potential_duplicates: []
    };

    for (const newLead of newLeads) {
      let bestMatch = null;
      let matchScore = 0;

      // חיפוש התאמות
      for (const existingLead of existingLeads) {
        let currentScore = 0;

        // התאמה לפי טלפון (ציון גבוה)
        if (newLead.phone_number && existingLead.phone_number) {
          const newPhone = newLead.phone_number.replace(/\D/g, '');
          const existingPhone = existingLead.phone_number.replace(/\D/g, '');
          if (newPhone === existingPhone && newPhone.length >= 9) {
            currentScore += 70;
          }
        }

        // התאמה לפי אימייל
        if (newLead.email && existingLead.email &&
            newLead.email.toLowerCase() === existingLead.email.toLowerCase()) {
          currentScore += 50;
        }

        // התאמה לפי שם מלא
        if (newLead.first_name && newLead.last_name &&
            existingLead.first_name && existingLead.last_name) {
          const newName = `${newLead.first_name} ${newLead.last_name}`.toLowerCase();
          const existingName = `${existingLead.first_name} ${existingLead.last_name}`.toLowerCase();
          if (newName === existingName) {
            currentScore += 30;
          }
        }

        // התאמה לפי תעודת זהות (ציון גבוה מאוד)
        if (newLead.id_number && existingLead.id_number &&
            newLead.id_number === existingLead.id_number) {
          currentScore += 80;
        }


        if (currentScore > matchScore) {
          matchScore = currentScore;
          bestMatch = existingLead;
        }
      }

      // סיווג לפי ציון ההתאמה
      if (matchScore >= 70) {
        results.exact_matches.push({
          newLead,
          existingLead: bestMatch,
          matchScore,
          action: 'update_existing'
        });
      } else if (matchScore >= 30) {
        results.potential_duplicates.push({
          newLead,
          existingLead: bestMatch,
          matchScore,
          action: 'manual_review'
        });
      } else {
        results.new_leads.push({
          newLead,
          action: 'create_new'
        });
      }
    }

    return results;
  };

  const updateDatabase = async (matchingResults) => {
    const results = {
      total: 0,
      new_leads: 0,
      updated_leads: 0,
      matched_existing: 0,
      failed: 0,
      errors: []
    };

    try {
      // יצירת לידים חדשים
      for (const item of matchingResults.new_leads) {
        try {
          // וידוא שיש לפחות שם וטלפון/אימייל
          if (!item.newLead.first_name || (!item.newLead.phone_number && !item.newLead.email)) {
            results.failed++;
            results.errors.push(`לקוח נדחה: חסר שם או פרטי יצירת קשר (טלפון/אימייל)`);
            continue;
          }

          await Lead.create(item.newLead);
          results.new_leads++;
        }
         catch (error) {
          results.failed++;
          results.errors.push(`שגיאה ביצירת לקוח חדש: ${item.newLead.first_name || 'לא ידוע'} - ${error.message}`);
        }
      }

      // עדכון לידים קיימים
      for (const item of matchingResults.exact_matches) {
        try {
          const mergedData = {
            ...item.existingLead,
            ...item.newLead,
            // שמירה על מידע חשוב מהלקוח הקיים
            id: item.existingLead.id,
            created_date: item.existingLead.created_date,
            // עדכון הערות
            notes: (item.existingLead.notes || '') +
                   (item.newLead.notes ? `\n\n[הערה מיבוא: ${item.newLead.notes}]` : '') +
                   `\n\nעודכן מ: ${item.newLead.source_document || 'מקור לא ידוע'} ב-${new Date().toLocaleDateString('he-IL')}`
          };
          await Lead.update(item.existingLead.id, mergedData);
          results.updated_leads++;
        } catch (error) {
          results.failed++;
          results.errors.push(`שגיאה בעדכון לקוח: ${item.newLead.first_name || 'לא ידוע'} - ${error.message}`);
        }
      }

      results.matched_existing = matchingResults.potential_duplicates.length;
      results.total = results.new_leads + results.updated_leads + results.matched_existing + results.failed;

    } catch (error) {
      console.error('Database update error:', error);
      results.errors.push(`שגיאה כללית בעדכון בסיס הנתונים: ${error.message}`);
    }

    return results;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case IMPORT_STEPS.UPLOAD:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">סוגי קבצים נתמכים</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {SUPPORTED_FILE_TYPES.map(type => (
                  <div key={type.type} className="bg-slate-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <type.icon className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">{type.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.csv,.docx,.doc,.txt,.jpg,.jpeg,.png,.webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              {files.length > 0 ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-emerald-400" />
                  <p className="text-white font-medium">{files.length} קבצים נבחרו</p>
                  <div className="text-sm text-slate-400">
                    {files.map(file => file.name).join(', ')}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-slate-500" />
                  <p className="text-white">גרור קבצים או לחץ להעלאה</p>
                  <p className="text-slate-400 text-sm">תומך בכל סוגי המסמכים הרלוונטיים</p>
                </div>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-300 font-medium mb-1">עיבוד חכם עם AI</h4>
                  <p className="text-blue-200 text-sm">
                    המערכת תנתח את הקבצים, תחלץ מידע על לקוחות, תתאים ללקוחות קיימים ותעדכן אוטומטית.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case IMPORT_STEPS.ANALYZING:
      case IMPORT_STEPS.EXTRACTING:
      case IMPORT_STEPS.MATCHING:
      case IMPORT_STEPS.UPDATING:
        const stepIcons = {
          analyzing: Database,
          extracting: Sparkles,
          matching: UserCheck,
          updating: RefreshCw
        };
        const stepTitles = {
          analyzing: 'מנתח מסמכים',
          extracting: 'מחלץ נתונים',
          matching: 'מתאים ללקוחות קיימים',
          updating: 'מעדכן בסיס נתונים'
        };
        const StepIcon = stepIcons[currentStep];

        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center">
              <StepIcon className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{stepTitles[currentStep]}</h3>
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-slate-400 text-sm">{progressMessage}</p>
            </div>
          </div>
        );

      case IMPORT_STEPS.COMPLETE:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">ייבוא הושלם בהצלחה!</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{importResults.new_leads}</p>
                <p className="text-emerald-300 text-sm">לקוחות חדשים</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{importResults.updated_leads}</p>
                <p className="text-blue-300 text-sm">לקוחות עודכנו</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">{importResults.matched_existing}</p>
                <p className="text-yellow-300 text-sm">התאמות אפשריות</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{importResults.failed}</p>
                <p className="text-red-300 text-sm">נכשלו</p>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  הערות ושגיאות:
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {importResults.errors.map((error, index) => (
                    <p key={index} className="text-orange-300 text-sm">• {error}</p>
                  ))}
                </div>
              </div>
            )}

            {extractedData && (
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">דוגמה מהנתונים שחולצו:</h4>
                <div className="bg-slate-900 rounded p-3 text-xs text-slate-300 max-h-32 overflow-y-auto">
                  <pre>{JSON.stringify(extractedData.slice(0, 2), null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case IMPORT_STEPS.UPLOAD:
        return (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600 text-slate-300">
              ביטול
            </Button>
            <Button onClick={processSmartImport} disabled={files.length === 0 || isProcessing} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Brain className="w-4 h-4 mr-2" />
              התחל עיבוד חכם
            </Button>
          </DialogFooter>
        );

      case IMPORT_STEPS.COMPLETE:
        return (
          <DialogFooter>
            <Button variant="outline" onClick={resetDialog} className="border-slate-600 text-slate-300">
              עבד קבצים נוספים
            </Button>
            <Button onClick={() => { onSuccess(); onOpenChange(false); }} className="bg-gradient-to-r from-purple-600 to-pink-600">
              סיום
            </Button>
          </DialogFooter>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-slate-900 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            ייבוא חכם של מסמכים ונתוני לקוחות
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            העלה כל סוג של מסמך והמערכת תחלץ מידע על לקוחות באופן אוטומטי ותעדכן את בסיס הנתונים
          </DialogDescription>
        </DialogHeader>
        {renderStepContent()}
        {renderFooter()}
      </DialogContent>
    </Dialog>
  );
}
