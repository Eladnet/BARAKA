
import React, { useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Loader2, AlertTriangle, UserPlus, Brain } from 'lucide-react';
import { Lead } from "@/api/entities";
import { routeAIRequest } from "../ai/SmartAIRouter"; // Added new import

export default function IntelligentLeadCreationDialog({ open, onOpenChange, onSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressStep, setProgressStep] = useState('');

  const resetState = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setIsLoading(false);
    setError(null);
    setProgressStep('');
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async () => {
    if (!firstName || !phone) {
      setError('First name and phone number are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setProgressStep('Searching the web...');
      
      const prompt = `
        You are an elite intelligence analyst for luxury nightlife venues. 
        Your mission is to create a detailed, accurate profile for a potential high-value customer.

        PROVIDED INFORMATION:
        - First Name: "${firstName}"
        - Last Name: "${lastName}" 
        - Phone Number: "${phone}"

        COMPREHENSIVE RESEARCH OBJECTIVES:
        Conduct an exhaustive web search to build a complete digital profile. Find:
        1. **Social Media:** Instagram (handle, followers), Facebook, LinkedIn.
        2. **Professional:** Job, company.
        3. **Lifestyle:** Interests, wealth indicators.
        4. **Behavioral Profile:** Spending category (budget, moderate, premium, luxury), VIP potential (low, medium, high), and a personality summary.

        Return a comprehensive JSON with ALL discovered information. Be thorough.
      `;

      const comprehensiveSchema = {
        type: "object",
        properties: {
          email: { type: "string", description: "Primary email address" },
          location: { type: "string", description: "Current city/location" },
          age: { type: "number", description: "Estimated age" },
          gender: { type: "string", enum: ["male", "female", "other", "unknown"] },
          profession: { type: "string", description: "Job title" },
          company: { type: "string", description: "Company name" },
          instagram_handle: { type: "string" },
          instagram_followers: { type: "number" },
          facebook_profile: { type: "string" },
          linkedin_profile: { type: "string" },
          interests: { type: "array", items: { type: "string" } },
          spending_category: { type: "string", enum: ["budget", "moderate", "premium", "luxury"] },
          vip_potential: { type: "string", enum: ["low", "medium", "high"] },
          score: { type: "number", description: "Overall customer value score 1-100" },
          notes: { type: "string", description: "Comprehensive analysis summary" },
          ai_provider_used: { type: "string" } // Added this property
        }
      };

      setProgressStep('Analyzing information...');
      
      // Use smart AI routing for better cost efficiency
      const enrichedData = await routeAIRequest(prompt, { // Changed from InvokeLLM to routeAIRequest
        add_context_from_internet: true,
        response_json_schema: comprehensiveSchema,
      });

      setProgressStep('Creating profile...');

      const newLeadData = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        status: 'warm',
        ai_insights: {
          research_date: new Date().toISOString(),
          data_sources: ['web_search', 'social_media', 'professional_networks'],
          ai_provider_used: enrichedData.ai_provider_used || 'smart_routing' // Added ai_provider_used
        },
        ...enrichedData
      };
      
      const newLead = await Lead.create(newLeadData);
      
      onSuccess(newLead);
      resetState();
      
    } catch (err) {
      console.error("Intelligent lead creation failed:", err);
      setError("Failed to create lead. The AI engine might be busy or couldn't find enough information. Please try again.");
    } finally {
      setIsLoading(false);
      setProgressStep('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Advanced Lead Research (AI)
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter basic details and the system will perform comprehensive research to create a full profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-slate-300">First Name *</Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="bg-slate-800 border-slate-700 text-white"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name" className="text-slate-300">Last Name</Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="bg-slate-800 border-slate-700 text-white"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1-555-123-4567"
              className="bg-slate-800 border-slate-700 text-white"
              disabled={isLoading}
            />
          </div>

          {isLoading && progressStep && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-purple-300 text-sm">{progressStep}</span>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)} 
            disabled={isLoading}
            className="text-slate-300 border-slate-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !firstName || !phone}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Perform Comprehensive Research
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
