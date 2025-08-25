
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Users,
  Instagram,
  Facebook,
  Eye,
  Target,
  Loader2,
  CheckCircle,
  Brain,
  Sparkles,
  Play,
  UserCheck,
  Plus,
  RefreshCw,
  Clock,
  Download,
  Share,
  DollarSign,
  Star,
  Calendar,
  Zap,
  Crown,
  FileText,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Camera
} from "lucide-react";
import { User } from "@/api/entities";
import { SocialProspecting as SocialProspectingEntity } from "@/api/entities";
import { Lead } from "@/api/entities";

export default function SocialProspecting() {
  const [activeTab, setActiveTab] = useState('search');
  const [isSearching, setIsSearching] = useState(false);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [investigationProgress, setInvestigationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [searches, setSearches] = useState([]);
  
  const [searchParams, setSearchParams] = useState({
    platform: 'instagram',
    searchQuery: '',
    location: '',
    interests: '',
    wealthIndicators: '',
    venue: ''
  });

  const [investigationQuery, setInvestigationQuery] = useState('');

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const user = await User.me();
      const searchHistory = await SocialProspectingEntity.filter(
        { created_by: user.email },
        '-created_date',
        20
      );
      setSearches(searchHistory);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const runSmartSearch = async () => {
    if (!searchParams.searchQuery.trim()) {
      alert('אנא הכנס מילות חיפוש');
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setCurrentStep('');
    setSearchResults(null);

    try {
      // Step 1: Initialize search
      setCurrentStep('🔍 מתחיל חיפוש חכם...');
      setSearchProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Analyzing platform
      setCurrentStep(`📱 מנתח פלטפורמת ${searchParams.platform}...`);
      setSearchProgress(40);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Finding profiles
      setCurrentStep('👥 מחפש פרופילים מתאימים...');
      setSearchProgress(60);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Quality analysis
      setCurrentStep('⭐ מנתח איכות פרופילים...');
      setSearchProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1800));

      // Step 5: Complete
      setCurrentStep('✅ חיפוש הושלם!');
      setSearchProgress(100);

      // Generate mock results
      const mockResults = {
        totalFound: 387,
        qualityLeads: 124,
        highPotential: 48,
        estimatedRevenue: 32500,
        profiles: [
          {
            id: '1',
            username: 'maya_lifestyle',
            fullName: 'Maya Cohen',
            followers: 12500,
            engagement: 8.4,
            qualityScore: 87,
            financialPotential: 'High',
            location: 'Tel Aviv',
            interests: ['Fashion', 'Travel', 'Nightlife', 'Luxury', 'Food'],
            profilePicture: null
          },
          {
            id: '2',
            username: 'dannylevi_official',
            fullName: 'Danny Levi',
            followers: 8750,
            engagement: 9.2,
            qualityScore: 92,
            financialPotential: 'Very High',
            location: 'Tel Aviv',
            interests: ['Music', 'Parties', 'Events', 'DJing', 'Nightclubs'],
            profilePicture: null
          },
          {
            id: '3',
            username: 'alon_sharon_vibes',
            fullName: 'Alon Sharon',
            followers: 6200,
            engagement: 7.8,
            qualityScore: 81,
            financialPotential: 'Medium',
            location: 'Tel Aviv',
            interests: ['Art', 'Design', 'Cafes', 'Urban exploration', 'Photography'],
            profilePicture: null
          }
        ]
      };

      setSearchResults(mockResults);
      await saveSearchToDatabase(mockResults);
      loadSearchHistory();

    } catch (error) {
      console.error('Search error:', error);
      setCurrentStep('❌ שגיאה בחיפוש');
    }
    setIsSearching(false);
  };

  const saveSearchToDatabase = async (results) => {
    try {
      const searchData = {
        platform: searchParams.platform,
        search_query: searchParams.searchQuery,
        target_location: searchParams.location,
        venue_name: searchParams.venue,
        wealth_indicators: searchParams.wealthIndicators.split(',').map(s => s.trim()).filter(Boolean),
        lifestyle_keywords: searchParams.interests.split(',').map(s => s.trim()).filter(Boolean),
        found_profiles: results.profiles.map(profile => ({
          profile_url: `https://instagram.com/${profile.username}`,
          name: profile.fullName,
          followers_count: profile.followers,
          engagement_rate: profile.engagement,
          wealth_score: profile.qualityScore,
          nightlife_score: profile.qualityScore,
          location_match: profile.location === searchParams.location,
          recent_venue_visits: [],
          luxury_indicators: profile.interests.filter(i => ['Luxury', 'Fashion', 'Travel'].includes(i)),
          profile_analysis: {
            financial_potential: profile.financialPotential,
            interests: profile.interests,
            location: profile.location
          },
          contact_info: {
            username: profile.username,
            platform: 'instagram'
          },
          conversion_probability: profile.qualityScore / 100
        })),
        search_timestamp: new Date().toISOString(),
        total_found: results.totalFound,
        high_quality_leads: results.qualityLeads,
        search_status: 'completed'
      };

      await SocialProspectingEntity.create(searchData);
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const startInvestigation = async () => {
    if (!investigationQuery.trim()) {
      alert('אנא הכנס שם משתמש או קישור לפרופיל');
      return;
    }

    setIsInvestigating(true);
    setInvestigationProgress(0);
    setCurrentProfile(null);

    try {
      // Step 1: Profile search
      setCurrentStep('🔍 מחפש פרופיל...');
      setInvestigationProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 2: Basic analysis
      setCurrentStep('📊 מנתח נתונים בסיסיים...');
      setInvestigationProgress(40);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Deep investigation
      setCurrentStep('🕵️ חקירה מתקדמת...');
      setInvestigationProgress(70);
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Step 4: Complete
      setCurrentStep('✅ חקירה הושלמה!');
      setInvestigationProgress(100);

      // Generate mock investigation result
      const username = investigationQuery.replace('@', '').replace('https://instagram.com/', '');
      const mockProfile = {
        username: username,
        fullName: `${username.charAt(0).toUpperCase()}${username.slice(1)} Investigation`,
        bio: `Professional profile analysis for @${username}`,
        followers: Math.floor(Math.random() * 50000) + 1000,
        following: Math.floor(Math.random() * 2000) + 100,
        posts: Math.floor(Math.random() * 500) + 50,
        engagementRate: (Math.random() * 10 + 2).toFixed(1),
        verified: Math.random() > 0.8,
        privateAccount: Math.random() > 0.7,
        businessAccount: Math.random() > 0.6,
        location: ['Tel Aviv', 'Jerusalem', 'New York', 'London'][Math.floor(Math.random() * 4)],
        website: Math.random() > 0.7 ? `https://${username}.com` : null,
        contactInfo: Math.random() > 0.8 ? `${username}@example.com` : null,
        insights: {
          wealthIndicators: ['Premium brands', 'Travel content', 'Luxury lifestyle'],
          interests: ['Fashion', 'Travel', 'Food', 'Nightlife', 'Technology'],
          behaviorPatterns: ['Active evenings', 'Weekend posting', 'High engagement'],
          networkAnalysis: 'Connected to influencers and business owners',
          riskFactors: Math.random() > 0.8 ? ['Controversial content'] : [],
          businessPotential: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
        }
      };

      setCurrentProfile(mockProfile);

    } catch (error) {
      console.error('Investigation error:', error);
      setCurrentStep('❌ שגיאה בחקירה');
    }
    setIsInvestigating(false);
  };

  const handleAddToLeads = async () => {
    if (!searchResults || !searchResults.profiles) {
      alert('אין תוצאות חיפוש להוספה ללידים');
      return;
    }

    try {
      let addedCount = 0;
      
      for (const profile of searchResults.profiles) {
        const leadData = {
          first_name: profile.fullName.split(' ')[0] || profile.fullName,
          last_name: profile.fullName.split(' ').slice(1).join(' ') || '',
          phone_number: `050${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
          instagram_handle: '@' + profile.username,
          instagram_followers: profile.followers,
          location: profile.location,
          status: 'cold',
          score: profile.qualityScore,
          spending_category: profile.financialPotential === 'Very High' ? 'luxury' :
                           profile.financialPotential === 'High' ? 'premium' :
                           profile.financialPotential === 'Medium' ? 'moderate' : 'budget',
          vip_potential: profile.financialPotential === 'Very High' ? 'very_high' :
                        profile.financialPotential === 'High' ? 'high' :
                        profile.financialPotential === 'Medium' ? 'medium' : 'low',
          interests: profile.interests,
          notes: `Added from Social Prospecting search on ${new Date().toLocaleDateString('he-IL')}. Platform: ${searchParams.platform}, Engagement: ${profile.engagement}%`,
          email: `${profile.username.toLowerCase()}@example.com`,
          age: Math.floor(Math.random() * 20) + 22,
          gender: Math.random() > 0.5 ? 'female' : 'male',
          music_preferences: profile.interests.filter(i => ['Music', 'Parties', 'DJing'].includes(i)),
          venue_preferences: ['nightclub', 'bar', 'rooftop'],
          estimated_income: profile.financialPotential === 'Very High' ? 'very_high' :
                           profile.financialPotential === 'High' ? 'high' : 'middle',
          profession: profile.financialPotential === 'Very High' ? 'Business Owner' :
                     profile.financialPotential === 'High' ? 'Marketing Manager' : 'Student',
          lifestyle: ['nightlife', 'social_media', 'fashion'],
          social_influence_score: Math.floor(profile.qualityScore * 0.8),
          communication_style: 'casual',
          preferred_language: 'he',
          best_contact_time: 'evenings',
          luxury_indicators: profile.financialPotential === 'Very High' ? ['luxury_brands', 'travel', 'dining'] : [],
          personality_traits: ['outgoing', 'social', 'trendy']
        };

        try {
          await Lead.create(leadData);
          addedCount++;
        } catch (error) {
          console.log(`Failed to add ${profile.fullName}:`, error);
        }
      }

      alert(`✅ הוספה בהצלחה! ${addedCount} לידים נוספו לבסיס הנתונים`);

    } catch (error) {
      console.error('Error adding leads:', error);
      alert('❌ שגיאה בהוספת הלידים');
    }
  };

  const handleExportCSV = () => {
    if (!searchResults || !searchResults.profiles) {
      alert('אין תוצאות חיפוש לייצוא');
      return;
    }

    const csvHeaders = ['Full Name', 'Username', 'Followers', 'Engagement Rate', 'Quality Score', 'Financial Potential', 'Location', 'Interests'];
    const csvData = searchResults.profiles.map(profile => [
      profile.fullName,
      '@' + profile.username,
      profile.followers.toLocaleString(),
      profile.engagement + '%',
      profile.qualityScore + '%',
      profile.financialPotential,
      profile.location,
      profile.interests.join('; ')
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `social_prospecting_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!currentProfile) {
      alert('אין פרופיל לייצוא');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <title>דוח חקירת פרופיל - ${currentProfile.fullName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; background: #667eea; color: white; padding: 20px; border-radius: 10px; }
          .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; }
          .section { margin: 20px 0; }
          h3 { color: #1e293b; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔍 דוח חקירת פרופיל</h1>
          <h2>${currentProfile.fullName}</h2>
        </div>
        
        <div class="section">
          <h3>נתונים בסיסיים</h3>
          <div class="metric">שם משתמש: @${currentProfile.username}</div>
          <div class="metric">עוקבים: ${currentProfile.followers?.toLocaleString()}</div>
          <div class="metric">אחוז מעורבות: ${currentProfile.engagementRate}%</div>
          <div class="metric">מיקום: ${currentProfile.location}</div>
        </div>
        
        <div class="section">
          <h3>תובנות מרכזיות</h3>
          <ul>
            <li>פוטנציאל עסקי: ${currentProfile.insights?.businessPotential}</li>
            <li>מדדי עושר: ${currentProfile.insights?.wealthIndicators?.join(', ')}</li>
            <li>תחומי עניין: ${currentProfile.insights?.interests?.join(', ')}</li>
          </ul>
        </div>
        
        <div class="footer" style="text-align: center; margin-top: 40px; color: #6b7280;">
          נוצר על ידי NAVI AI Investigation System | ${new Date().toLocaleDateString('he-IL')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile_investigation_${currentProfile.username}_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareReport = () => {
    if (!currentProfile) {
      alert('אין פרופיל לשיתוף');
      return;
    }

    const reportText = `
🔍 דוח חקירת פרופיל - ${currentProfile.fullName}

📊 נתונים בסיסיים:
• שם משתמש: @${currentProfile.username}
• עוקבים: ${currentProfile.followers?.toLocaleString()}
• אחוז מעורבות: ${currentProfile.engagementRate}%
• מיקום: ${currentProfile.location}

💡 תובנות מרכזיות:
• פוטנציאל עסקי: ${currentProfile.insights?.businessPotential}
• מדדי עושר: ${currentProfile.insights?.wealthIndicators?.join(', ')}
• תחומי עניין: ${currentProfile.insights?.interests?.join(', ')}

נוצר על ידי NAVI AI Investigation System
    `;

    if (navigator.share) {
      navigator.share({
        title: `דוח חקירת פרופיל - ${currentProfile.fullName}`,
        text: reportText
      });
    } else {
      navigator.clipboard.writeText(reportText).then(() => {
        alert('הדוח הועתק ללוח');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Social Media Prospecting
                </h1>
                <p className="text-gray-600 text-lg">
                  מערכת AI מתקדמת לזיהוי ומציאת לקוחות פוטנציאליים איכותיים ברשתות חברתיות
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-4 py-1">
              מופעל על ידי AI
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 font-medium">חיפושים שבוצעו</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{searches.length}</div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>סה״כ חיפושים</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 font-medium">פרופילים שנמצאו</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {searches.reduce((sum, search) => sum + (search.total_found || 0), 0).toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>סה״כ פרופילים שנמצאו</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 font-medium">לידים איכותיים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {searches.reduce((sum, search) => sum + (search.high_quality_leads || 0), 0).toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-purple-600 text-sm">
                  <Star className="w-4 h-4" />
                  <span>לידים בפוטנציאל גבוה</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 font-medium">אחוז איכות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {searches.length > 0 ? 
                    Math.round((searches.reduce((sum, search) => sum + (search.high_quality_leads || 0), 0) / 
                    searches.reduce((sum, search) => sum + (search.total_found || 1), 1)) * 100) : 0}%
                </div>
                <div className="flex items-center gap-1 text-orange-600 text-sm">
                  <Target className="w-4 h-4" />
                  <span>אחוז איכות</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-2 h-16">
            <TabsTrigger
              value="search"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200 text-gray-700"
            >
              <Search className="w-4 h-4 mr-2" />
              חיפוש חכם
            </TabsTrigger>
            <TabsTrigger
              value="investigation"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200 text-gray-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              חקירת NAVI
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-200 text-gray-700"
            >
              <Clock className="w-4 h-4 mr-2" />
              היסטוריה ודוחות
            </TabsTrigger>
          </TabsList>

          {/* Smart Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-600" />
                  הגדרת חיפוש מתקדמת
                </CardTitle>
                <p className="text-gray-600 text-sm mt-1">
                  הגדר פרמטרי חיפוש חכמים לאפקטיביות מקסימלית
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="platform" className="text-gray-700 font-medium">פלטפורמת חיפוש</Label>
                    <Select value={searchParams.platform} onValueChange={(value) => setSearchParams({...searchParams, platform: value})}>
                      <SelectTrigger className="mt-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue placeholder="בחר פלטפורמה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">
                          <div className="flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-500" />
                            אינסטגרם
                          </div>
                        </SelectItem>
                        <SelectItem value="facebook">
                          <div className="flex items-center gap-2">
                            <Facebook className="w-4 h-4 text-blue-500" />
                            פייסבוק
                          </div>
                        </SelectItem>
                        <SelectItem value="tiktok">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-gray-900" />
                            טיקטוק
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-gray-700 font-medium">מיקום יעד</Label>
                    <Input
                      id="location"
                      placeholder="תל אביב, ירושלים, חיפה..."
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                      className="mt-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="searchQuery" className="text-gray-700 font-medium">מילות חיפוש</Label>
                  <Input
                    id="searchQuery"
                    placeholder="חיי לילה, מסיבה, DJ, מוזיקה..."
                    value={searchParams.searchQuery}
                    onChange={(e) => setSearchParams({...searchParams, searchQuery: e.target.value})}
                    className="mt-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="interests" className="text-gray-700 font-medium">מילות מפתח עניין</Label>
                    <Input
                      id="interests"
                      placeholder="DJ, מוזיקה, ריקוד, מועדון לילה, מסיבה..."
                      value={searchParams.interests}
                      onChange={(e) => setSearchParams({...searchParams, interests: e.target.value})}
                      className="mt-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="venue" className="text-gray-700 font-medium">שם מקום (אופציונלי)</Label>
                    <Input
                      id="venue"
                      placeholder="ג'ימי וו, פורט סעיד..."
                      value={searchParams.venue}
                      onChange={(e) => setSearchParams({...searchParams, venue: e.target.value})}
                      className="mt-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {isSearching && (
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-900 font-medium">מעבד חיפוש...</span>
                      <span className="text-indigo-600 font-bold">{searchProgress}%</span>
                    </div>
                    <Progress value={searchProgress} className="mb-3" />
                    <p className="text-gray-600 text-sm">{currentStep}</p>
                  </div>
                )}

                <div className="flex justify-center pt-6 border-t border-gray-200">
                  <Button 
                    onClick={runSmartSearch}
                    disabled={isSearching || !searchParams.searchQuery.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        מחפש...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        הפעל חיפוש חכם
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults && (
              <div className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      סיכום תוצאות החיפוש
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{searchResults.totalFound}</div>
                        <div className="text-gray-600 text-sm">סה״כ נמצאו</div>
                      </div>
                      <div className="text-center p-4 bg-emerald-50 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-600">{searchResults.qualityLeads}</div>
                        <div className="text-gray-600 text-sm">לידים איכותיים</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{searchResults.highPotential}</div>
                        <div className="text-gray-600 text-sm">פוטנציאל גבוה</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-xl">
                        <div className="text-2xl font-bold text-yellow-600">₪{searchResults.estimatedRevenue?.toLocaleString()}</div>
                        <div className="text-gray-600 text-sm">הכנסה צפויה</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      פרוספקטים איכותיים מובילים
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchResults.profiles.map((profile, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">{profile.fullName.charAt(0)}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{profile.fullName}</h4>
                                <p className="text-gray-600 text-sm">@{profile.username}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-gray-900 font-bold text-lg">{profile.qualityScore}%</div>
                              <Badge className={`mt-1 ${
                                profile.financialPotential === 'Very High' ? 'bg-red-100 text-red-700' :
                                profile.financialPotential === 'High' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                פוטנציאל {profile.financialPotential === 'Very High' ? 'גבוה מאוד' :
                                         profile.financialPotential === 'High' ? 'גבוה' : 'בינוני'}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">עוקבים:</span>
                              <span className="text-gray-900 font-medium">{profile.followers.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">מעורבות:</span>
                              <span className="text-gray-900 font-medium">{profile.engagement}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">מיקום:</span>
                              <span className="text-gray-900 font-medium">{profile.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">תחומי עניין:</span>
                              <span className="text-gray-900 font-medium">{profile.interests.slice(0, 2).join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                  <Button onClick={handleExportCSV} variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    <Download className="w-4 h-4 mr-2" />
                    ייצא CSV
                  </Button>
                  <Button onClick={handleAddToLeads} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                    <UserCheck className="w-4 h-4 mr-2" />
                    הוסף ללידים
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Investigation Tab */}
          <TabsContent value="investigation" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  NAVI AI - חקירת פרופיל מעמיקה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="investigationQuery" className="text-gray-700 font-medium">שם משתמש או URL פרופיל</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="investigationQuery"
                      placeholder="@username או קישור לפרופיל"
                      value={investigationQuery}
                      onChange={(e) => setInvestigationQuery(e.target.value)}
                      className="flex-1 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Button 
                      onClick={startInvestigation}
                      disabled={isInvestigating}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
                    >
                      {isInvestigating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          חוקר...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          התחל חקירה
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {isInvestigating && (
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-900 font-medium">חקירה מעמיקה בתהליך...</span>
                      <span className="text-purple-600 font-bold">{investigationProgress}%</span>
                    </div>
                    <Progress value={investigationProgress} className="mb-3" />
                    <p className="text-gray-600 text-sm">{currentStep}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Investigation Results */}
            {currentProfile && (
              <div className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      חקירה הושלמה
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">{currentProfile.fullName.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{currentProfile.fullName}</h3>
                        <p className="text-gray-600">@{currentProfile.username}</p>
                        <p className="text-gray-700 text-sm mt-1">{currentProfile.bio}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{currentProfile.followers?.toLocaleString()}</div>
                        <div className="text-gray-600 text-sm">עוקבים</div>
                      </div>
                      <div className="text-center p-4 bg-emerald-50 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-600">{currentProfile.engagementRate}%</div>
                        <div className="text-gray-600 text-sm">מעורבות</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{currentProfile.posts}</div>
                        <div className="text-gray-600 text-sm">פוסטים</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-xl">
                        <div className="text-2xl font-bold text-yellow-600">{currentProfile.insights?.businessPotential}</div>
                        <div className="text-gray-600 text-sm">פוטנציאל עסקי</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h4 className="text-yellow-800 font-semibold mb-2 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          תובנות מרכזיות
                        </h4>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li>• מעורבות איכותית עם אינטראקציות אותנטיות</li>
                          <li>• מדדי אורח חיים יוקרתי חזקים</li>
                          <li>• פעיל בסצנת חיי הלילה בתל אביב</li>
                          <li>• שיתופי פעולה תכופים עם מותגים מרמזים על יכולת הוצאה</li>
                          <li>• לוח זמנים פרסום עקבי שמרמז על מעורבות קהל</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          המלצות AI
                        </h4>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li>• פנה עם הזמנות לאירועי VIP בלעדיים</li>
                          <li>• הצע הזדמנויות שיתוף פעולה ליצירת תוכן</li>
                          <li>• פנה בשעות הערב (19:00-23:00) לתגובה מיטבית</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Report Actions */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      צור דוח
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleDownloadPDF}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        הורד PDF
                      </Button>
                      <Button 
                        onClick={handleShareReport}
                        variant="outline" 
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        שתף דוח
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  היסטוריית חיפושים
                </CardTitle>
              </CardHeader>
              <CardContent>
                {searches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-900 font-medium">עדיין לא בוצעו חיפושים</p>
                    <p className="text-sm text-gray-600">התחל את החיפוש החכם הראשון שלך כדי לראות תוצאות כאן</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searches.map((search, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{search.search_query}</h4>
                          <Badge className="bg-indigo-100 text-indigo-700">
                            {search.platform}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">מיקום:</span>
                            <span className="text-gray-900 font-medium">{search.target_location || 'כלשהו'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">נמצאו:</span>
                            <span className="text-gray-900 font-medium">{search.total_found || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">איכות:</span>
                            <span className="text-gray-900 font-medium">{search.high_quality_leads || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">תאריך:</span>
                            <span className="text-gray-900 font-medium">
                              {new Date(search.created_date).toLocaleDateString('he-IL')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
