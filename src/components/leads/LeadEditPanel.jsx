
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Save, 
  User, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Tag,
  DollarSign,
  Star,
  Brain,
  Eye,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  UserCheck
} from "lucide-react";
import { Lead } from "@/api/entities";
import ProfileIntelligenceEngine from "./ProfileIntelligenceEngine";
import ProfileImageExtractor from "./ProfileImageExtractor"; // הוספת הייבוא החדש
import AIReputationScanner from "./AIReputationScanner"; // הוספת הייבוא החדש

export default function LeadEditPanel({ lead, onClose, onUpdate }) {
  const [editedLead, setEditedLead] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (lead) {
      setEditedLead({ ...lead });
      setActiveTab("basic");
    } else {
      setEditedLead(null);
    }
  }, [lead]);

  const handleSave = async () => {
    if (!editedLead || !lead) return;
    
    setIsSaving(true);
    try {
      const updatedLead = await Lead.update(lead.id, editedLead);
      onUpdate(updatedLead);
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Error saving lead. Please try again.');
    }
    setIsSaving(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedLead(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIntelligenceComplete = (intelligenceData) => {
    setEditedLead(prev => ({
      ...prev,
      score: intelligenceData.wealth_analysis?.score || prev.score,
      spending_category: intelligenceData.wealth_analysis?.spending_category || prev.spending_category,
      notes: `${prev.notes || ''}\n\nAI Investigation (${new Date().toLocaleDateString()}): Confidence ${intelligenceData.confidence_level}%`
    }));
  };

  const handleImageExtracted = (extractedImages) => {
    // עדכון הלקוח עם תמונות הפרופיל
    if (extractedImages && extractedImages.length > 0) {
      const bestImage = extractedImages.find(img => img.recommended_for_id) || extractedImages[0];
      setEditedLead(prev => ({
        ...prev,
        profile_image_url: bestImage?.image_url || prev.profile_image_url, // Use optional chaining for bestImage
        profile_images: extractedImages,
        notes: `${prev.notes || ''}\n\nתמונות פרופיל נמצאו וחולצו ב-${new Date().toLocaleDateString('he-IL')}`
      }));
    }
  };

  const handleReputationScanComplete = (scanResults) => {
    // עדכון הליד עם תוצאות הסריקה
    setEditedLead(prev => ({
      ...prev,
      reputation_scan: scanResults,
      reputation_score: scanResults.overall_reputation_score,
      risk_level: scanResults.risk_level,
      last_reputation_scan: new Date().toISOString(),
      notes: `${prev.notes || ''}\n\nAI Reputation Scan (${new Date().toLocaleDateString()}): Score ${scanResults.overall_reputation_score}/100, Risk: ${scanResults.risk_level}`
    }));
  };

  if (!lead || !editedLead) {
    return (
      <div className="h-full w-full bg-slate-900/80 backdrop-blur-xl border-l border-purple-500/30 flex items-center justify-center">
        <div className="text-center p-6">
          <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Select a lead to edit</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">
              {(editedLead.first_name?.[0] || 'L')?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">
              {editedLead.first_name} {editedLead.last_name}
            </h3>
            <Badge className={`${getStatusColor(editedLead.status)} text-xs capitalize`}>
              {editedLead.status}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4 text-slate-400" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 flex-shrink-0">
            <TabsTrigger value="basic" className="text-xs">Details</TabsTrigger>
            <TabsTrigger value="intelligence" className="text-xs">Investigation</TabsTrigger>
            <TabsTrigger value="reputation" className="text-xs">Reputation</TabsTrigger>
            <TabsTrigger value="images" className="text-xs">Photos</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="basic" className="p-4 space-y-4 m-0">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Basic Information
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-300 text-xs">First Name</Label>
                    <Input
                      value={editedLead.first_name || ''}
                      onChange={(e) => handleFieldChange('first_name', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Last Name</Label>
                    <Input
                      value={editedLead.last_name || ''}
                      onChange={(e) => handleFieldChange('last_name', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300 text-xs">Phone</Label>
                  <Input
                    value={editedLead.phone_number || ''}
                    onChange={(e) => handleFieldChange('phone_number', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white h-8"
                    placeholder="+972-50-123-4567"
                  />
                </div>

                <div>
                  <Label className="text-slate-300 text-xs">Email</Label>
                  <Input
                    type="email"
                    value={editedLead.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white h-8"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <Label className="text-slate-300 text-xs">Location/City</Label>
                  <Input
                    value={editedLead.location || ''}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white h-8"
                    placeholder="Tel Aviv, Jerusalem, Haifa..."
                  />
                </div>

                <Separator className="bg-slate-700" />

                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Social Media
                </h4>

                <div>
                  <Label className="text-slate-300 text-xs flex items-center gap-2">
                    <Instagram className="w-3 h-3 text-pink-400" />
                    Instagram
                  </Label>
                  <Input
                    value={editedLead.instagram_handle || ''}
                    onChange={(e) => handleFieldChange('instagram_handle', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white h-8"
                    placeholder="@username or full link"
                  />
                </div>

                <div>
                  <Label className="text-slate-300 text-xs flex items-center gap-2">
                    <Facebook className="w-3 h-3 text-blue-400" />
                    Facebook
                  </Label>
                  <Input
                    value={editedLead.facebook_profile || ''}
                    onChange={(e) => handleFieldChange('facebook_profile', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white h-8"
                    placeholder="Username or full link"
                  />
                </div>

                <div>
                  <Label className="text-slate-300 text-xs flex items-center gap-2">
                    <Linkedin className="w-3 h-3 text-indigo-400" />
                    LinkedIn
                  </Label>
                  <Input
                    value={editedLead.linkedin_profile || ''}
                    onChange={(e) => handleFieldChange('linkedin_profile', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white h-8"
                    placeholder="Username or full link"
                  />
                </div>

                <Separator className="bg-slate-700" />

                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Lead Classification
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-300 text-xs">Status</Label>
                    <Select value={editedLead.status} onValueChange={(value) => handleFieldChange('status', value)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="cold" className="capitalize">Cold</SelectItem>
                        <SelectItem value="warm" className="capitalize">Warm</SelectItem>
                        <SelectItem value="engaged" className="capitalize">Engaged</SelectItem>
                        <SelectItem value="converted" className="capitalize">Converted</SelectItem>
                        <SelectItem value="vip" className="capitalize">VIP</SelectItem>
                        <SelectItem value="inactive" className="capitalize">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300 text-xs">Score</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedLead.score || 0}
                      onChange={(e) => handleFieldChange('score', parseInt(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700 text-white h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300 text-xs">Spending Category</Label>
                  <Select 
                    value={editedLead.spending_category} 
                    onValueChange={(value) => handleFieldChange('spending_category', value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="budget" className="capitalize">Budget</SelectItem>
                      <SelectItem value="moderate" className="capitalize">Moderate</SelectItem>
                      <SelectItem value="premium" className="capitalize">Premium</SelectItem>
                      <SelectItem value="luxury" className="capitalize">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300 text-xs">Notes</Label>
                  <Textarea
                    value={editedLead.notes || ''}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white h-16 resize-none"
                    placeholder="Notes about the customer..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="intelligence" className="p-0 m-0">
              <div className="p-4">
                <ProfileIntelligenceEngine 
                  leadData={editedLead}
                  onIntelligenceComplete={handleIntelligenceComplete}
                />
              </div>
            </TabsContent>

            <TabsContent value="reputation" className="p-0 m-0">
              <div className="p-4">
                <AIReputationScanner 
                  leadData={editedLead}
                  onScanComplete={handleReputationScanComplete}
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="p-0 m-0">
              <div className="p-4">
                <ProfileImageExtractor 
                  leadData={editedLead}
                  onImageExtracted={handleImageExtracted}
                />
              </div>
            </TabsContent>

            <TabsContent value="activity" className="p-4 m-0">
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Activity History</h3>
                <p className="text-slate-400">Coming soon...</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

const getStatusColor = (status) => {
  const colors = {
    cold: "bg-slate-500/20 text-slate-300",
    warm: "bg-yellow-500/20 text-yellow-300",
    engaged: "bg-blue-500/20 text-blue-300",
    converted: "bg-emerald-500/20 text-emerald-300",
    vip: "bg-purple-500/20 text-purple-300",
    inactive: "bg-red-500/20 text-red-300"
  };
  return colors[status] || colors.cold;
};
