import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Music,
  Heart,
  Save,
  Bell,
  Shield,
  Eye
} from "lucide-react";

export default function CustomerProfile({ currentUser, onUpdate }) {
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    birthday: currentUser?.birthday || '',
    gender: currentUser?.gender || '',
    interests: currentUser?.interests?.join(', ') || '',
    music_preferences: currentUser?.music_preferences?.join(', ') || '',
    marketing_consent: currentUser?.settings?.marketing_consent || false,
    notifications_enabled: currentUser?.settings?.notifications_enabled || true,
    profile_visibility: currentUser?.settings?.profile_visibility || 'public'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // כאן נוסיף לוגיקת עדכון הפרופיל
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const updatedUser = {
        ...currentUser,
        ...formData,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        music_preferences: formData.music_preferences.split(',').map(m => m.trim()).filter(m => m),
        settings: {
          ...currentUser?.settings,
          marketing_consent: formData.marketing_consent,
          notifications_enabled: formData.notifications_enabled,
          profile_visibility: formData.profile_visibility
        }
      };
      
      onUpdate(updatedUser);
      setIsEditing(false);
      alert('פרופיל עודכן בהצלחה!');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('שגיאה בעדכון הפרופיל');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              פרופיל אישי
            </CardTitle>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving}
              className={isEditing ? "bg-gradient-to-r from-green-600 to-emerald-600" : "bg-gradient-to-r from-purple-600 to-pink-600"}
            >
              {isSaving ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              ) : isEditing ? (
                <Save className="w-4 h-4 mr-2" />
              ) : (
                <User className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'שומר...' : isEditing ? 'שמירה' : 'עריכה'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {currentUser?.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{currentUser?.full_name}</h3>
              <p className="text-slate-400">{currentUser?.email}</p>
              <p className="text-purple-300 text-sm">חבר מאז {new Date().getFullYear()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">מידע אישי</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">שם מלא</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                disabled={!isEditing}
                className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">אימייל</Label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">טלפון</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="05X-XXXXXXX"
                className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">עיר מגורים</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                placeholder="תל אביב, ירושלים..."
                className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">תאריך לידה</Label>
              <Input
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                disabled={!isEditing}
                className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">מגדר</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => handleInputChange('gender', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white disabled:opacity-50">
                  <SelectValue placeholder="בחרו מגדר" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="male">זכר</SelectItem>
                  <SelectItem value="female">נקבה</SelectItem>
                  <SelectItem value="other">אחר</SelectItem>
                  <SelectItem value="prefer_not_to_say">מעדיף/ה לא לומר</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            העדפות ותחומי עניין
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">תחומי עניין</Label>
            <Textarea
              value={formData.interests}
              onChange={(e) => handleInputChange('interests', e.target.value)}
              disabled={!isEditing}
              placeholder="מוזיקה, אמנות, ספורט, טכנולוגיה... (הפרידו בפסיקים)"
              className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">סגנונות מוזיקה מועדפים</Label>
            <Textarea
              value={formData.music_preferences}
              onChange={(e) => handleInputChange('music_preferences', e.target.value)}
              disabled={!isEditing}
              placeholder="אלקטרוניקה, היפ הופ, רוק, פופ... (הפרידו בפסיקים)"
              className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            הגדרות פרטיות והתראות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">התראות מהמערכת</p>
                <p className="text-slate-400 text-sm">קבלת הודעות על אירועים והצעות</p>
              </div>
            </div>
            <Switch
              checked={formData.notifications_enabled}
              onCheckedChange={(checked) => handleInputChange('notifications_enabled', checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">הודעות שיווק</p>
                <p className="text-slate-400 text-sm">קבלת הצעות והנחות מיוחדות</p>
              </div>
            </div>
            <Switch
              checked={formData.marketing_consent}
              onCheckedChange={(checked) => handleInputChange('marketing_consent', checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">רמת פרטיות פרופיל</Label>
            <Select 
              value={formData.profile_visibility} 
              onValueChange={(value) => handleInputChange('profile_visibility', value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white disabled:opacity-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="public">פומבי - כולם יכולים לראות</SelectItem>
                <SelectItem value="friends">חברים בלבד</SelectItem>
                <SelectItem value="private">פרטי - רק אני</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}