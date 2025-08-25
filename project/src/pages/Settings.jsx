import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Key,
  MessageCircle,
  Globe,
  Save,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2
} from "lucide-react";
import { User } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

export default function SettingsPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  
  const [userSettings, setUserSettings] = useState({
    // Profile settings
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
    
    // Notification settings
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    event_updates: true,
    weekly_digest: true,
    
    // Privacy settings
    profile_visibility: 'public',
    show_email: false,
    show_phone: false,
    allow_messages: true,
    
    // API settings
    openai_api_key: '',
    whatsapp_api_key: '',
    facebook_api_key: '',
    instagram_api_key: '',
    
    // System settings
    preferred_language: 'en',
    timezone: 'Asia/Jerusalem',
    date_format: 'DD/MM/YYYY',
    currency: 'ILS'
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Merge user data with default settings
      setUserSettings(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        avatar_url: user.avatar_url || '',
        ...user.notification_settings,
        ...user.privacy_settings,
        ...user.settings
      }));

    } catch (error) {
      console.error('Error loading user settings:', error);
    }
    setIsLoading(false);
  };

  const handleSaveSettings = async (section) => {
    setIsSaving(true);
    try {
      let updateData = {};
      
      switch (section) {
        case 'profile':
          updateData = {
            full_name: userSettings.full_name,
            phone: userSettings.phone,
            bio: userSettings.bio,
            location: userSettings.location,
            website: userSettings.website,
            avatar_url: userSettings.avatar_url
          };
          break;
        case 'notifications':
          updateData = {
            notification_settings: {
              email_notifications: userSettings.email_notifications,
              push_notifications: userSettings.push_notifications,
              marketing_emails: userSettings.marketing_emails,
              event_updates: userSettings.event_updates,
              weekly_digest: userSettings.weekly_digest
            }
          };
          break;
        case 'privacy':
          updateData = {
            privacy_settings: {
              profile_visibility: userSettings.profile_visibility,
              show_email: userSettings.show_email,
              show_phone: userSettings.show_phone,
              allow_messages: userSettings.allow_messages
            }
          };
          break;
        case 'api':
          updateData = {
            settings: {
              openai_api_key: userSettings.openai_api_key,
              whatsapp_api_key: userSettings.whatsapp_api_key,
              facebook_api_key: userSettings.facebook_api_key,
              instagram_api_key: userSettings.instagram_api_key
            }
          };
          break;
        case 'system':
          updateData = {
            settings: {
              ...userSettings.settings,
              preferred_language: userSettings.preferred_language,
              timezone: userSettings.timezone,
              date_format: userSettings.date_format,
              currency: userSettings.currency
            }
          };
          break;
      }

      await User.updateMyUserData(updateData);
      alert('Settings saved successfully!');
      
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
    setIsSaving(false);
  };

  const handleExportData = () => {
    const dataToExport = {
      user: currentUser,
      settings: userSettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticket-pulse-data.json';
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Settings
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your account preferences and system configuration
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleExportData}
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-white border-0 shadow-lg rounded-xl p-1 h-14">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger 
              value="api" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-indigo-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={userSettings.full_name}
                      onChange={(e) => setUserSettings({...userSettings, full_name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.email}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userSettings.location}
                      onChange={(e) => setUserSettings({...userSettings, location: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={userSettings.bio}
                    onChange={(e) => setUserSettings({...userSettings, bio: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md resize-none h-24 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={userSettings.website}
                    onChange={(e) => setUserSettings({...userSettings, website: e.target.value})}
                    className="mt-1"
                    placeholder="https://..."
                  />
                </div>

                <Button 
                  onClick={() => handleSaveSettings('profile')}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive important updates via email</p>
                    </div>
                    <Switch
                      checked={userSettings.email_notifications}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, email_notifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={userSettings.push_notifications}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, push_notifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-600">Receive promotional offers and news</p>
                    </div>
                    <Switch
                      checked={userSettings.marketing_emails}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, marketing_emails: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Event Updates</Label>
                      <p className="text-sm text-gray-600">Get notified about event changes</p>
                    </div>
                    <Switch
                      checked={userSettings.event_updates}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, event_updates: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-gray-600">Receive weekly summary of your activity</p>
                    </div>
                    <Switch
                      checked={userSettings.weekly_digest}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, weekly_digest: checked})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings('notifications')}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Notifications'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Profile Visibility</Label>
                    <select
                      value={userSettings.profile_visibility}
                      onChange={(e) => setUserSettings({...userSettings, profile_visibility: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-gray-600">Display your email on your profile</p>
                    </div>
                    <Switch
                      checked={userSettings.show_email}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, show_email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Phone Number</Label>
                      <p className="text-sm text-gray-600">Display your phone on your profile</p>
                    </div>
                    <Switch
                      checked={userSettings.show_phone}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, show_phone: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Messages</Label>
                      <p className="text-sm text-gray-600">Allow other users to message you</p>
                    </div>
                    <Switch
                      checked={userSettings.allow_messages}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, allow_messages: checked})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings('privacy')}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Privacy Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-600" />
                  API Keys & Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Security Notice</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        Keep your API keys secure. Never share them publicly or commit them to version control.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="openai_api_key">OpenAI API Key</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKeys(!showApiKeys)}
                      >
                        {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Input
                      id="openai_api_key"
                      type={showApiKeys ? "text" : "password"}
                      value={userSettings.openai_api_key}
                      onChange={(e) => setUserSettings({...userSettings, openai_api_key: e.target.value})}
                      placeholder="sk-..."
                      className="font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="whatsapp_api_key">WhatsApp API Key</Label>
                    <Input
                      id="whatsapp_api_key"
                      type={showApiKeys ? "text" : "password"}
                      value={userSettings.whatsapp_api_key}
                      onChange={(e) => setUserSettings({...userSettings, whatsapp_api_key: e.target.value})}
                      className="mt-1 font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="facebook_api_key">Facebook API Key</Label>
                    <Input
                      id="facebook_api_key"
                      type={showApiKeys ? "text" : "password"}
                      value={userSettings.facebook_api_key}
                      onChange={(e) => setUserSettings({...userSettings, facebook_api_key: e.target.value})}
                      className="mt-1 font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instagram_api_key">Instagram API Key</Label>
                    <Input
                      id="instagram_api_key"
                      type={showApiKeys ? "text" : "password"}
                      value={userSettings.instagram_api_key}
                      onChange={(e) => setUserSettings({...userSettings, instagram_api_key: e.target.value})}
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings('api')}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save API Keys'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-indigo-600" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="preferred_language">Language</Label>
                    <select
                      id="preferred_language"
                      value={userSettings.preferred_language}
                      onChange={(e) => setUserSettings({...userSettings, preferred_language: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="en">English</option>
                      <option value="he">עברית</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={userSettings.timezone}
                      onChange={(e) => setUserSettings({...userSettings, timezone: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="Asia/Jerusalem">Israel Time (GMT+2)</option>
                      <option value="Europe/London">London Time (GMT+0)</option>
                      <option value="America/New_York">New York Time (GMT-5)</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date_format">Date Format</Label>
                    <select
                      id="date_format"
                      value={userSettings.date_format}
                      onChange={(e) => setUserSettings({...userSettings, date_format: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={userSettings.currency}
                      onChange={(e) => setUserSettings({...userSettings, currency: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="ILS">₪ Israeli Shekel (ILS)</option>
                      <option value="USD">$ US Dollar (USD)</option>
                      <option value="EUR">€ Euro (EUR)</option>
                    </select>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings('system')}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save System Settings'}
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-white border-0 shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-800 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}