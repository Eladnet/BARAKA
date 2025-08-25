import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Globe,
  Camera,
  Save,
  Edit3,
  Settings,
  Shield,
  Bell,
  Heart,
  Music,
  Star,
  Crown,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  ArrowRight,
  Check,
  X
} from "lucide-react";
import { User as UserEntity } from "@/api/entities";

export default function UserProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    youtube_url: '',
    twitter_url: '',
    spotify_url: '',
    company: '',
    job_title: '',
    birthday: '',
    interests: [],
    music_preferences: [],
    notification_settings: {
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      event_updates: true,
      weekly_digest: true
    },
    privacy_settings: {
      profile_visibility: 'public',
      show_email: false,
      show_phone: false,
      allow_messages: true
    }
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const user = await UserEntity.me();
      setCurrentUser(user);
      
      // מיזוג נתוני המשתמש עם נתוני הפרופיל
      setProfileData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        facebook_url: user.facebook_url || '',
        instagram_url: user.instagram_url || '',
        linkedin_url: user.linkedin_url || '',
        youtube_url: user.youtube_url || '',
        twitter_url: user.twitter_url || '',
        spotify_url: user.spotify_url || '',
        company: user.company || '',
        job_title: user.job_title || '',
        birthday: user.birthday || '',
        interests: user.interests || [],
        music_preferences: user.music_preferences || [],
        notification_settings: {
          ...prev.notification_settings,
          ...(user.notification_settings || {})
        },
        privacy_settings: {
          ...prev.privacy_settings,
          ...(user.privacy_settings || {})
        }
      }));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await UserEntity.updateMyUserData(profileData);
      setCurrentUser(prev => ({ ...prev, ...profileData }));
      setIsEditing(false);
      // הצגת הודעת הצלחה
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserData(); // טעינה מחדש של הנתונים המקוריים
  };

  const colorOptions = [
    { name: 'אפור', value: 'gray', class: 'bg-gray-500' },
    { name: 'כחול', value: 'blue', class: 'bg-blue-500' },
    { name: 'ירוק', value: 'green', class: 'bg-green-500' },
    { name: 'צהוב', value: 'yellow', class: 'bg-yellow-500' },
    { name: 'כתום', value: 'orange', class: 'bg-orange-500' },
    { name: 'אדום', value: 'red', class: 'bg-red-500' },
    { name: 'ורוד', value: 'pink', class: 'bg-pink-500' },
    { name: 'סגול', value: 'purple', class: 'bg-purple-500' },
    { name: 'אינדיגו', value: 'indigo', class: 'bg-indigo-500' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-white">טוען פרופיל...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={currentUser?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold">
                {currentUser?.full_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">עריכת פרופיל</h1>
              <p className="text-purple-300">{currentUser?.full_name}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-gray-500 text-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  ביטול
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? 'שומר...' : 'שמירה'}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                עריכת פרופיל
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="personal">פרטים אישיים</TabsTrigger>
            <TabsTrigger value="social">רשתות חברתיות</TabsTrigger>
            <TabsTrigger value="preferences">העדפות</TabsTrigger>
            <TabsTrigger value="privacy">פרטיות</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  מידע אישי
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">שם מלא</Label>
                    <Input
                      value={profileData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={!isEditing}
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      אימייל
                    </Label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      טלפון
                    </Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="052-123-4567"
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      מיקום
                    </Label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="תל אביב, ירושלים..."
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">תפקיד</Label>
                    <Input
                      value={profileData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      disabled={!isEditing}
                      placeholder="מנהל פרויקטים, מפתח..."
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">חברה</Label>
                    <Input
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!isEditing}
                      placeholder="שם החברה"
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">אודות</Label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="ספרו קצת על עצמכם..."
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-50 h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    אתר אישי
                  </Label>
                  <Input
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://your-website.com"
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  רשתות חברתיות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { icon: Facebook, label: 'פייסבוק', field: 'facebook_url', placeholder: 'https://www.facebook.com/your-page', color: 'text-blue-400' },
                  { icon: Instagram, label: 'אינסטגרם', field: 'instagram_url', placeholder: 'https://www.instagram.com/one.wayofc/', color: 'text-pink-400' },
                  { icon: Linkedin, label: 'לינקדאין', field: 'linkedin_url', placeholder: 'https://www.linkedin.com/in/your-profile', color: 'text-blue-600' },
                  { icon: Youtube, label: 'יוטיוב', field: 'youtube_url', placeholder: 'https://www.youtube.com/channel-or-page', color: 'text-red-500' },
                  { icon: Twitter, label: 'טוויטר', field: 'twitter_url', placeholder: 'https://twitter.com/your-handle', color: 'text-blue-400' },
                  { icon: Music, label: 'ספוטיפיי', field: 'spotify_url', placeholder: 'https://open.spotify.com/artist/your-page', color: 'text-green-500' },
                ].map((social) => (
                  <div key={social.field} className="space-y-2">
                    <Label className={`text-slate-300 flex items-center gap-2`}>
                      <social.icon className={`w-4 h-4 ${social.color}`} />
                      {social.label}
                    </Label>
                    <Input
                      value={profileData[social.field]}
                      onChange={(e) => handleInputChange(social.field, e.target.value)}
                      disabled={!isEditing}
                      placeholder={social.placeholder}
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              {/* Notification Settings */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-400" />
                    הגדרות התראות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'email_notifications', label: 'התראות באימייל', desc: 'קבלת התראות בכתובת האימייל' },
                    { key: 'push_notifications', label: 'התראות דחיפה', desc: 'התראות ישירות במכשיר' },
                    { key: 'marketing_emails', label: 'אימיילי שיווק', desc: 'הצעות והנחות בלעדיות' },
                    { key: 'event_updates', label: 'עדכוני אירועים', desc: 'התראות על אירועים חדשים' },
                    { key: 'weekly_digest', label: 'סיכום שבועי', desc: 'דו"ח שבועי על פעילות' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                      <div>
                        <p className="text-white font-medium">{setting.label}</p>
                        <p className="text-slate-400 text-sm">{setting.desc}</p>
                      </div>
                      <Switch
                        checked={profileData.notification_settings[setting.key]}
                        onCheckedChange={(checked) => handleInputChange(`notification_settings.${setting.key}`, checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Color Preferences */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">העדפות צבע</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-9 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        className={`w-12 h-12 rounded-full ${color.class} border-2 border-transparent hover:border-white transition-all ${
                          profileData.preferred_color === color.value ? 'border-white scale-110' : ''
                        }`}
                        onClick={() => isEditing && handleInputChange('preferred_color', color.value)}
                        disabled={!isEditing}
                        title={color.name}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  הגדרות פרטיות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'show_email', label: 'הצגת כתובת אימייל בפרופיל', desc: 'משתמשים אחרים יוכלו לראות את האימייל שלכם' },
                  { key: 'show_phone', label: 'הצגת מספר טלפון בפרופיל', desc: 'משתמשים אחרים יוכלו לראות את הטלפון שלכם' },
                  { key: 'allow_messages', label: 'אפשר לאנשים ליצור איתי קשר', desc: 'משתמשים יוכלו לשלוח לכם הודעות' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div>
                      <p className="text-white font-medium">{setting.label}</p>
                      <p className="text-slate-400 text-sm">{setting.desc}</p>
                    </div>
                    <Switch
                      checked={profileData.privacy_settings[setting.key]}
                      onCheckedChange={(checked) => handleInputChange(`privacy_settings.${setting.key}`, checked)}
                      disabled={!isEditing}
                    />
                  </div>
                ))}

                <Separator className="bg-slate-700" />
                
                <div className="text-center py-4">
                  <p className="text-slate-400 text-sm mb-4">
                    פרטיותכם חשובה לנו. אנחנו לא נשתף את הנתונים שלכם עם צדדים שלישיים ללא הסכמתכם.
                  </p>
                  <p className="text-red-400 text-xs">
                    לשימוש מתקדם בפלטפורמה, אנא מלאו את כל הפרטים הנדרשים.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}