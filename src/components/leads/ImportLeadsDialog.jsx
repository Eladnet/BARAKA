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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  Users,
  Brain,
  Sparkles,
  Database,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { Lead } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

const IMPORT_STEPS = {
  UPLOAD: 'upload',
  ANALYZING: 'analyzing',
  ENRICHING: 'enriching',
  PROCESSING: 'processing',
  COMPLETE: 'complete'
};

export default function ImportLeadsDialog({ open, onOpenChange, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(IMPORT_STEPS.UPLOAD);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState({
    total: 0,
    success: 0,
    updated: 0,
    failed: 0,
    duplicates: 0,
    enriched: 0,
    errors: []
  });
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const fileInputRef = useRef(null);

  const resetDialog = () => {
    setCurrentStep(IMPORT_STEPS.UPLOAD);
    setFile(null);
    setImportResults({ total: 0, success: 0, updated: 0, failed: 0, duplicates: 0, enriched: 0, errors: [] });
    setProgress(0);
    setProgressMessage('');
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
    const supportedTypes = ['.csv'];
    const fileExtension = uploadedFile.name.toLowerCase().substr(uploadedFile.name.lastIndexOf('.'));
    if (!supportedTypes.includes(fileExtension)) {
      alert('Unsupported file type. Please upload a CSV file.');
      return;
    }
    setFile(uploadedFile);
  };

  const readCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e.target.error);
      reader.readAsText(file, 'UTF-8');
    });
  };

  const processCSVWithAI = async (csvContent) => {
    const parsePrompt = `
      You are an expert data analyst specializing in comprehensive customer intelligence extraction from CSV files.

      CSV Content Snippet:
      ${csvContent.substring(0, 3000)}${csvContent.length > 3000 ? '...(truncated)' : ''}

      Your mission:
      1. **Parse ALL columns:** Extract every piece of data available. Do not miss any columns.
      2. **Map intelligently to lead fields:**
         - REQUIRED: first_name, last_name, phone_number.
         - IDENTITY: id_number, birthday, age.
         - CONTACT: email, location, full_address.
         - PERSONAL: gender, profession, company, education.
         - SOCIAL: Any social media hints, usernames, or profiles.
         - OTHER DATA: Any other columns like ticket_type, order_date, etc., should be compiled into the 'notes' field.
      3. **Data Cleaning & Formatting:**
         - Clean phone numbers to a standard format.
         - Parse dates correctly (especially for birthdays).
         - Extract age from birthday if possible.
         - Clean and format ID numbers.
         - Every lead MUST have a 'first_name' and a 'phone_number' to be considered valid.
      4. **Preparation for AI Investigation:** Extract full names for subsequent social media research.
      
      IMPORTANT: Prioritize accuracy. Do not invent data. If a field is not present, leave it null.
    `;
    const responseSchema = {
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
              id_number: { type: "string" },
              birthday: { type: "string" },
              age: { type: "number" },
              location: { type: "string" },
              gender: { type: "string" },
              profession: { type: "string" },
              company: { type: "string" },
              notes: { type: "string" }
            },
            required: ["first_name", "phone_number"]
          }
        },
        rejected_count: { type: "number" },
        processing_notes: { type: "string" }
      },
      required: ["leads"]
    };
    return await InvokeLLM({ prompt: parsePrompt, response_json_schema: responseSchema });
  };

  const performComprehensiveInvestigation = async (leadData) => {
    // This is now an optional enrichment step
    if (!leadData.first_name || !leadData.phone_number) return leadData;
    try {
      const investigationPrompt = `
        Conduct a focused digital investigation for this nightlife marketing target:
        - Name: ${leadData.first_name} ${leadData.last_name || ''}
        - Phone: ${leadData.phone_number}
        - Known Info: ID: ${leadData.id_number || 'N/A'}, Birthday: ${leadData.birthday || 'N/A'}
        
        Find primary social media presence:
        1. **Instagram:** Handle and followers.
        2. **Facebook:** Profile URL.
        3. **LinkedIn:** Professional profile URL.
        4. **Analyze potential:** Based on public info, estimate spending category (budget, moderate, premium, luxury) and VIP potential (low, medium, high).
        
        Return a concise profile.
      `;
      const investigationSchema = {
        type: "object",
        properties: {
          instagram_handle: { type: "string" },
          instagram_followers: { type: "number" },
          facebook_profile: { type: "string" },
          linkedin_profile: { type: "string" },
          spending_category: { type: "string", enum: ["budget", "moderate", "premium", "luxury"] },
          vip_potential: { type: "string", enum: ["low", "medium", "high"] },
          score: { type: "number", minimum: 0, maximum: 100 }
        }
      };
      const investigationResults = await InvokeLLM({ prompt: investigationPrompt, add_context_from_internet: true, response_json_schema: investigationSchema });
      return { ...leadData, ...investigationResults };
    } catch (error) {
      console.log('Investigation failed for lead, using basic data');
      return leadData;
    }
  };

  const processImport = async () => {
    setCurrentStep(IMPORT_STEPS.ANALYZING);
    setIsProcessing(true);
    setProgress(0);

    const results = { total: 0, success: 0, updated: 0, failed: 0, errors: [] };

    try {
      // Step 1: Read and Parse CSV
      setProgressMessage('Reading and processing file...');
      const csvContent = await readCSVFile(file);
      const parseResult = await processCSVWithAI(csvContent);
      if (!parseResult?.leads?.length) throw new Error('No valid leads found in the file');
      const extractedLeads = parseResult.leads;
      results.total = extractedLeads.length + (parseResult.rejected_count || 0);
      setProgress(25);

      // Step 2: Enrich Leads
      setCurrentStep(IMPORT_STEPS.ENRICHING);
      setProgressMessage('Performing comprehensive investigation...');
      const investigatedLeads = [];
      for (let i = 0; i < extractedLeads.length; i++) {
        const lead = extractedLeads[i];
        const investigatedLead = await performComprehensiveInvestigation(lead);
        investigatedLeads.push(investigatedLead);
        if (JSON.stringify(investigatedLead) !== JSON.stringify(lead)) {
          results.enriched = (results.enriched || 0) + 1;
        }
        setProgress(25 + ((i + 1) / extractedLeads.length) * 40);
        setProgressMessage(`Investigating lead ${i + 1} of ${extractedLeads.length}...`);
      }
      setProgress(65);

      // Step 3: Save to Database (Create or Update)
      setCurrentStep(IMPORT_STEPS.PROCESSING);
      setProgressMessage('Saving data to database...');
      const existingLeads = await Lead.list('-created_date', 10000);
      const existingLeadsMap = new Map(existingLeads.map(l => [l.phone_number?.replace(/\D/g, ''), l]));

      for (let i = 0; i < investigatedLeads.length; i++) {
        const leadFromFile = investigatedLeads[i];
        const cleanPhone = leadFromFile.phone_number?.replace(/\D/g, '');

        if (!cleanPhone) {
          results.failed++;
          results.errors.push(`Record rejected: No phone number - ${leadFromFile.first_name || 'N/A'}`);
          continue;
        }

        const existingLead = existingLeadsMap.get(cleanPhone);
        const finalLeadData = { ...existingLead, ...leadFromFile };
        Object.keys(finalLeadData).forEach(key => finalLeadData[key] === undefined && delete finalLeadData[key]);

        try {
          if (existingLead) {
            await Lead.update(existingLead.id, finalLeadData);
            results.updated++;
          } else {
            await Lead.create({ status: 'cold', ...finalLeadData });
            results.success++;
          }
        } catch (error) {
          console.error('Error creating/updating lead:', error, finalLeadData);
          results.failed++;
          results.errors.push(`Error saving lead: ${leadFromFile.first_name} - ${error.message}`);
        }
        setProgress(65 + ((i + 1) / investigatedLeads.length) * 35);
        setProgressMessage(`Saving lead ${i + 1} of ${investigatedLeads.length}...`);
      }

      setProgress(100);
      setImportResults(results);
      setCurrentStep(IMPORT_STEPS.COMPLETE);
    } catch (error) {
      console.error('Import error:', error);
      setImportResults(prev => ({ ...prev, failed: prev.total || 1, errors: [...prev.errors, error.message] }));
      setCurrentStep(IMPORT_STEPS.COMPLETE);
    }
    setIsProcessing(false);
  };

  const downloadSampleFile = () => {
    const sampleData = [
      'first_name,last_name,phone_number,email,city,age,profession,company,birthday,id_number',
      'John,Doe,0501234567,john.doe@example.com,Tel Aviv,28,Developer,Google,1995-03-15,123456789',
      'Jane,Smith,0509876543,jane.smith@example.com,Haifa,25,Designer,Facebook,1998-07-20,987654321',
    ].join('\n');
    const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_leads.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case IMPORT_STEPS.UPLOAD:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Button onClick={downloadSampleFile} variant="outline" className="mb-4">
                <Download className="w-4 h-4 mr-2" />
                Download Sample File
              </Button>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors"
            >
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              {file ? (
                <div className="space-y-2"><File className="w-12 h-12 mx-auto text-emerald-400" /><p className="text-white font-medium">{file.name}</p></div>
              ) : (
                <div className="space-y-2"><Upload className="w-12 h-12 mx-auto text-slate-500" /><p className="text-white">Drag & drop file or click to upload</p><p className="text-slate-400 text-sm">Supports CSV files only</p></div>
              )}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3"><Brain className="w-5 h-5 text-blue-400 mt-0.5" /><div><h4 className="text-blue-300 font-medium mb-1">Intelligent Processing with AI</h4><p className="text-blue-200 text-sm">The system will analyze your file, extract data, enrich each profile, and update existing leads automatically.</p></div></div>
            </div>
          </div>
        );
      case IMPORT_STEPS.ANALYZING:
      case IMPORT_STEPS.ENRICHING:
      case IMPORT_STEPS.PROCESSING:
        const icons = { analyzing: Database, enriching: Sparkles, processing: Users };
        const titles = { analyzing: 'Analyzing Data', enriching: 'Performing Investigation', processing: 'Saving Data' };
        return (
          <div className="space-y-6 text-center">
            <div className={`w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center`}>
              {React.createElement(icons[currentStep], { className: "w-8 h-8 text-blue-400 animate-pulse" })}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{titles[currentStep]}</h3>
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-slate-400 text-xs">{progressMessage}</p>
            </div>
          </div>
        );
      case IMPORT_STEPS.COMPLETE:
        return (
          <div className="space-y-6">
            <div className="text-center">
              {importResults.failed > 0 && importResults.success === 0 && importResults.updated === 0 ? <AlertTriangle className="w-16 h-16 mx-auto text-red-400 mb-4" /> : <CheckCircle className="w-16 h-16 mx-auto text-emerald-400 mb-4" />}
              <h3 className="text-lg font-semibold text-white mb-2">Processing Complete!</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{importResults.success}</p>
                <p className="text-emerald-300 text-sm">Leads Created</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{importResults.updated}</p>
                <p className="text-blue-300 text-sm">Leads Updated</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">{importResults.enriched || 0}</p>
                <p className="text-purple-300 text-sm">Profiles Enriched</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">{importResults.failed}</p>
                  <p className="text-red-300 text-sm">Failed</p>
                </div>
            </div>
            {importResults.errors.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4"><h4 className="text-white font-medium mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" />Notes:</h4><div className="max-h-32 overflow-y-auto space-y-1">{importResults.errors.map((error, index) => <p key={index} className="text-orange-300 text-sm">• {error}</p>)}</div></div>
            )}
          </div>
        );
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case IMPORT_STEPS.UPLOAD:
        return (
          <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={processImport} disabled={!file} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"><Brain className="w-4 h-4 mr-2" />Start Smart Import</Button></DialogFooter>
        );
      case IMPORT_STEPS.COMPLETE:
        return (
          <DialogFooter><Button variant="outline" onClick={resetDialog}>Process Another File</Button><Button onClick={() => { onSuccess(); onOpenChange(false); }}>Finish</Button></DialogFooter>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-purple-500/30"><DialogHeader><DialogTitle className="text-white flex items-center gap-2"><Brain className="w-5 h-5 text-purple-400" />Intelligent Import with AI</DialogTitle><DialogDescription className="text-slate-400">Upload a CSV file and the system will do all the work for you.</DialogDescription></DialogHeader>{renderStepContent()}{renderFooter()}</DialogContent>
    </Dialog>
  );
}