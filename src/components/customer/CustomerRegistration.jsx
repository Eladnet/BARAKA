
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, User, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react";
import { User as UserEntity, Lead } from "@/api/entities";

export default function CustomerRegistration({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    birthday: '',
    location: '',
    gender: '',
    interests: '',
    music_preferences: '',
    marketing_consent: false,
    terms_accepted: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) return 'שם מלא הוא שדה חובה';
    if (!formData.email.trim()) return 'אימייל הוא שדה חובה';
    if (!formData.phone.trim()) return 'טלפון הוא שדה חובה';
    if (!formData.terms_accepted) return 'יש לאשר את תנאי השימוש';
    
    // בדיקת פורמט אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'פורמט אימייל לא תקין';
    
    // בדיקת פורמט טלפון
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (!phoneRegex.test(formData.phone)) return 'פורמט טלפון לא תקין';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // יצירת לקוח חדש במערכת הלידים
      const leadData = {
        first_name: formData.full_name.split(' ')[0],
        last_name: formData.full_name.split(' ').slice(1).join(' '),
        email: formData.email,
        phone_number: formData.phone,
        birthday: formData.birthday || null,
        location: formData.location || null,
        gender: formData.gender || 'unknown',
        interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : [],
        music_preferences: formData.music_preferences ? formData.music_preferences.split(',').map(m => m.trim()) : [],
        status: 'warm',
        source: 'customer_registration',
        marketing_consent: formData.marketing_consent,
        customer_portal_access: true,
        registration_date: new Date().toISOString()
      };

      const newLead = await Lead.create(leadData);

      // יצירת משתמש במערכת עם הרשאות לקוח (סימולציה)
      const userData = {
        id: newLead.id,
        full_name: formData.full_name,
        email: formData.email,
        role: 'customer',
        customer_id: newLead.id,
        phone: formData.phone,
        location: formData.location,
        birthday: formData.birthday,
        gender: formData.gender,
        interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : [],
        music_preferences: formData.music_preferences ? formData.music_preferences.split(',').map(m => m.trim()) : [],
        settings: {
          marketing_consent: formData.marketing_consent,
          notifications_enabled: true,
          preferred_language: 'he'
        },
        created_date: new Date().toISOString()
      };

      // שמירה ב-localStorage לסימולציה
      localStorage.setItem('nocturne_customer', JSON.stringify(userData));

      onSuccess(userData);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        birthday: '',
        location: '',
        gender: '',
        interests: '',
        music_preferences: '',
        marketing_consent: false,
        terms_accepted: false
      });

    } catch (error) {
      console.error('Registration failed:', error);
      setError('שגיאה ברישום. אנא נסו שוב מאוחר יותר.');
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-purple-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-purple-400" />
            הצטרפות למועדון NocturneAI
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            מלאו את הפרטים שלכם וקבלו גישה לאירועים בלעדיים והטבות VIP
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* פרטים אישיים */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">פרטים אישיים</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-slate-300">שם מלא *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="שם פרטי ומשפחה"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">אימייל *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">טלפון *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="05X-XXXXXXX"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-slate-300">תאריך לידה</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-300">עיר מגורים</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="תל אביב, ירושלים, חיפה..."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-slate-300">מגדר</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
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
          </div>

          {/* העדפות */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">העדפות ותחומי עניין</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interests" className="text-slate-300">תחומי עניין</Label>
                <Input
                  id="interests"
                  value={formData.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                  placeholder="מוזיקה, אמנות, ספורט, טכנולוגיה... (הפרידו בפסיקים)"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="music_preferences" className="text-slate-300">סגנונות מוזיקה מועדפים</Label>
                <Input
                  id="music_preferences"
                  value={formData.music_preferences}
                  onChange={(e) => handleInputChange('music_preferences', e.target.value)}
                  placeholder="אלקטרוניקה, היפ הופ, רוק, פופ... (הפרידו בפסיקים)"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* הסכמות */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">הסכמות והרשאות</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing_consent"
                  checked={formData.marketing_consent}
                  onCheckedChange={(checked) => handleInputChange('marketing_consent', checked)}
                />
                <Label htmlFor="marketing_consent" className="text-slate-300 text-sm">
                  אני מסכים/ה לקבל הודעות שיווק והתראות על אירועים
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms_accepted"
                  checked={formData.terms_accepted}
                  onCheckedChange={(checked) => handleInputChange('terms_accepted', checked)}
                  required
                />
                <Label htmlFor="terms_accepted" className="text-slate-300 text-sm">
                  אני מסכים/ה לתנאי השימוש ומדיניות הפרטיות *
                </Label>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-600 text-slate-300"
              disabled={isLoading}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  נרשם...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  הצטרפות למועדון
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
