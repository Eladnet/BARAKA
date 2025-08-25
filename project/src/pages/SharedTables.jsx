
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  Clock,
  Zap,
  Share2,
  Heart,
  MessageCircle,
  Globe,
  Sparkles,
  UserPlus,
  X // New import for closing chat
} from "lucide-react";
import { SharedEvent } from "@/api/entities";
import { User } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";
import SharedEventCard from "../components/shared/SharedEventCard";
import CreateSharedEventDialog from "../components/shared/CreateSharedEventDialog";
import GroupChatComponent from "../components/shared/GroupChatComponent"; // New import

export default function SharedTablesPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEventForChat, setSelectedEventForChat] = useState(null); // New state
  const [showChat, setShowChat] = useState(false); // New state
  const [filters, setFilters] = useState({
    city: 'all',
    venue_type: 'all',
    price_range: 'all',
    date_range: 'all',
    availability: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [user, allEvents] = await Promise.all([
        User.me(),
        SharedEvent.list('-created_date', 100)
      ]);

      setCurrentUser(user);

      // עם נתונים לדוגמה אם אין אירועים במסד הנתונים
      const validEvents = allEvents && allEvents.length > 0 ? allEvents : generateSampleEvents();

      setEvents(validEvents.filter(e => e.status === 'published' || e.status === 'active'));
      setMyEvents(validEvents.filter(e => e.host_id === user?.id));

    } catch (error) {
      console.error('Error loading shared tables:', error);
      // טוען נתונים לדוגמה במקרה של שגיאה
      const sampleEvents = generateSampleEvents();
      setEvents(sampleEvents);
      setMyEvents([]); // My events will be empty if there's no user or real data
    }
    setIsLoading(false);
  };

  // נתונים לדוגמה
  const generateSampleEvents = () => {
    return [
      {
        id: 'demo-1',
        event_title: 'SKY Club Miami',
        event_description: 'ערב מיוחד עם יינות מובחרים וגבינות בוטיק על גג עם נוף מדהים לים',
        venue_type: 'rooftop',
        venue_name: 'SKY Club',
        venue_address: 'מרכז תל אביב',
        city: 'תל אביב',
        event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        total_seats: 8,
        available_seats: 3,
        price_per_person: 180,
        total_table_cost: 1440,
        host_id: 'demo-host-1',
        status: 'published',
        host_rating: 4.8,
        host_events_count: 12,
        host_verified: true,
        is_trending: true,
        instant_book: true,
        event_images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800&h=600&fit=crop'],
        tags: ['יין', 'גבינות', 'רומנטי', 'גג'],
        perks: ['free_drinks', 'photography'],
        age_restriction: { min_age: 21 },
        dress_code: 'smart_casual',
        approval_type: 'auto'
      },
      {
        id: 'demo-2',
        event_title: 'ENVEA Miami',
        event_description: 'שייט חלומי ביאכטה פרטית עם DJ, בר פתוח ואוכל גורמה',
        venue_type: 'yacht',
        venue_name: 'ENVEA',
        venue_address: 'מרינה הרצליה',
        city: 'מיאמי',
        event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        total_seats: 12,
        available_seats: 5,
        price_per_person: 450,
        total_table_cost: 5400,
        host_id: 'demo-host-2',
        status: 'published',
        host_rating: 4.9,
        host_events_count: 8,
        host_verified: true,
        is_premium: true,
        event_images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'],
        tags: ['יאכטה', 'בלעדי', 'VIP', 'שייט'],
        perks: ['free_drinks', 'live_music', 'gourmet_food'],
        age_restriction: { min_age: 25 },
        dress_code: 'elegant',
        approval_type: 'manual'
      },
      {
        id: 'demo-3',
        event_title: 'ערב קוקטיילים במועדון בוטיק',
        event_description: 'ערב מיוחד במועדון הבוטיק החדש עם קוקטיילים חתמיים ומוזיקה נבחרת',
        venue_type: 'nightclub',
        venue_name: 'פלמה',
        venue_address: 'דיזנגוף 123',
        city: 'תל אביב',
        event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        total_seats: 6,
        available_seats: 2,
        price_per_person: 220,
        total_table_cost: 1320,
        host_id: 'demo-host-3',
        status: 'published',
        host_rating: 4.6,
        host_events_count: 15,
        host_verified: true,
        event_images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800&h=600&fit=crop'],
        tags: ['קוקטיילים', 'מועדון', 'מוזיקה', 'לילה'],
        perks: ['free_drinks', 'vip_access'],
        age_restriction: { min_age: 23 },
        dress_code: 'party',
        approval_type: 'auto'
      }
    ];
  };

  const handleCreateEvent = async (eventData) => {
    if (!currentUser) {
      alert('יש להתחבר כדי ליצור אירוע');
      return;
    }

    try {
      const newEvent = {
        ...eventData,
        id: `event-${Date.now()}`,
        host_id: currentUser.id,
        status: 'published',
        available_seats: eventData.total_seats || 4, // Default to 4 if not provided
        host_rating: currentUser.rating || 4.5,
        host_events_count: myEvents.length,
        created_date: new Date().toISOString()
      };

      await SharedEvent.create(newEvent);

      setShowCreateDialog(false);
      loadData();
      alert('🎉 האירוע נוצר בהצלחה!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('שגיאה ביצירת האירוע');
    }
  };

  const handleJoinEvent = async (event) => {
    // בדיקת תקינות נתונים
    if (!event) {
      console.error('Event is undefined');
      alert('שגיאה: נתוני האירוע לא נמצאו');
      return;
    }

    if (!currentUser) {
      alert('יש להתחבר כדי להצטרף לאירוע');
      return;
    }

    const availableSeats = event.available_seats || 0;
    if (availableSeats <= 0) {
      alert('אין מקומות זמינים באירוע זה');
      return;
    }

    try {
      console.log('Joining event:', event.id, event.event_title);

      // כאן נוסיף לוגיקה של הצטרפות לאירוע
      const joinRequest = {
        event_id: event.id,
        participant_id: currentUser.id,
        status: event.approval_type === 'auto' ? 'approved' : 'pending',
        join_message: `מעוניין להצטרף ל${event.event_title}`,
        seats_requested: 1,
        payment_status: 'pending',
        request_date: new Date().toISOString()
      };

      // TODO: יצירת SharedParticipant record (e.g., await SharedParticipant.create(joinRequest);)
      console.log('Join request:', joinRequest);

      alert(`✅ בקשה להצטרפות ל"${event.event_title}" נשלחה בהצלחה!`);

      // עדכון מספר מקומות זמינים
      const updatedEvents = events.map(e =>
        e.id === event.id
          ? { ...e, available_seats: Math.max(0, (e.available_seats || 0) - 1) }
          : e
      );
      setEvents(updatedEvents);

    } catch (error) {
      console.error('Error joining event:', error);
      alert('שגיאה בהצטרפות לאירוע');
    }
  };

  const handleShareEvent = async (event) => {
    if (!event) {
      console.error('Event is undefined');
      return;
    }

    const shareUrl = `${window.location.origin}/shared-tables/event/${event.id}`;
    const shareText = `הצטרף אלי ל"${event.event_title}" ב${event.venue_name || 'מקום מעולה'}!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.event_title,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') { // User cancelled share
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          alert('קישור הועתק ללוח!');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('קישור הועתק ללוח!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('לא ניתן לשתף. נסה שוב.');
      }
    }
  };

  const handleLikeEvent = async (event) => {
    if (!event) {
      console.error('Event is undefined');
      return;
    }

    console.log('Liked event:', event.id, event.event_title);
    // TODO: שמירת לייק במסד הנתונים
  };

  const handleEditEvent = (event) => {
    if (!event) {
      console.error('Event is undefined');
      return;
    }

    console.log('Edit event:', event.id, event.event_title);
    alert('עריכת אירוע תתווסף בקרוב');
  };

  const handleManageEvent = (event) => {
    if (!event) {
      console.error('Event is undefined');
      return;
    }

    console.log('Manage event:', event.id, event.event_title);
    alert('ניהול אירוע יתווסף בקרוב');
  };

  const handleOpenChat = (event) => {
    setSelectedEventForChat(event);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedEventForChat(null);
  };

  const filteredAndSortedEvents = events.filter(event => {
    if (!event) return false;

    const title = event.event_title || '';
    const venueName = event.venue_name || '';
    const city = event.city || '';

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }).sort((a, b) => {
    // Default sort by date
    const dateA = new Date(a.event_date || 0);
    const dateB = new Date(b.event_date || 0);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Section */}
        <div className="py-12 text-center">
          <div className="mb-8">
            <p className="text-indigo-600 font-medium uppercase tracking-wide text-sm mb-4">
              SHARE AND JOIN TABLES WITH PEOPLE NEARBY
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Bring the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">party</span>
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              to your table
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              הצטרף לשולחנות של אחרים או צור שולחן משלך. חסוך כסף, הכר אנשים חדשים וחווה חוויות בלתי נשכחות
            </p>

            {/* Mobile App Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-12" />
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" className="h-12" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">2.5K+</div>
              <div className="text-gray-600 text-sm">שולחנות פעילים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">15K+</div>
              <div className="text-gray-600 text-sm">משתמשים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
              <div className="text-gray-600 text-sm">שביעות רצון</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 text-sm">תמיכה</div>
            </div>
          </div>
        </div>

        {/* Main Content with Chat */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Events Section */}
          <div className={`${showChat ? 'lg:col-span-2' : 'lg:col-span-4'} transition-all duration-300`}>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="חפש אירועים, מקומות או ערים..."
                    className="pl-10 h-12 text-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  צור שולחן
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="discover" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-2xl h-14">
                <TabsTrigger
                  value="discover"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl font-medium h-12"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  גלה אירועים
                </TabsTrigger>
                <TabsTrigger
                  value="my-events"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl font-medium h-12"
                >
                  <Star className="w-5 h-5 mr-2" />
                  השולחנות שלי
                </TabsTrigger>
                <TabsTrigger
                  value="joined"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl font-medium h-12"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  הצטרפתי
                </TabsTrigger>
              </TabsList>

              {/* Discover Events Tab */}
              <TabsContent value="discover">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
                    אירועים מומלצים
                  </h3>

                  {/* Events Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                      // Loading skeleton
                      [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                          <div className="h-48 bg-gray-200"></div>
                          <div className="p-6">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))
                    ) : filteredAndSortedEvents.length === 0 ? (
                      <div className="col-span-full text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-12">
                          <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">אין אירועים זמינים</h3>
                          <p className="text-gray-600 mb-8">היה הראשון ליצור שולחן באזור שלך</p>
                          <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl">
                            <Plus className="w-5 h-5 mr-2" />
                            צור שולחן ראשון
                          </Button>
                        </div>
                      </div>
                    ) : (
                      filteredAndSortedEvents.map(event => (
                        <SharedEventCard
                          key={event.id}
                          event={event}
                          currentUser={currentUser}
                          onJoin={() => handleJoinEvent(event)}
                          onShare={() => handleShareEvent(event)}
                          onLike={() => handleLikeEvent(event)}
                          onChat={() => handleOpenChat(event)} // New prop to open chat
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* How it Works Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 mb-8">
                  <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">איך זה עובד?</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">חפש אירועים</h4>
                      <p className="text-gray-600">מצא אירועים מעניינים באזור שלך</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">הצטרף לשולחן</h4>
                      <p className="text-gray-600">בקש להצטרף או קבל אישור מיידי</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">שלם ותחסוך</h4>
                      <p className="text-gray-600">חלק את העלות וחסוך כסף</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">תהנה מהחוויה</h4>
                      <p className="text-gray-600">הכר אנשים חדשים וחווה רגעים בלתי נשכחים</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* My Events Tab */}
              <TabsContent value="my-events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEvents.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <div className="bg-white rounded-2xl shadow-lg p-12">
                        <Star className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">עדיין לא יצרת שולחנות</h3>
                        <p className="text-gray-600 mb-8">התחל לארח ולהכיר אנשים חדשים</p>
                        <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl">
                          <Plus className="w-5 h-5 mr-2" />
                          צור שולחן ראשון
                        </Button>
                      </div>
                    </div>
                  ) : (
                    myEvents.map(event => (
                      <SharedEventCard
                        key={event.id}
                        event={event}
                        currentUser={currentUser}
                        isHost={true}
                        onEdit={() => handleEditEvent(event)}
                        onManage={() => handleManageEvent(event)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Joined Events Tab */}
              <TabsContent value="joined">
                <div className="text-center py-16">
                  <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                    <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">עדיין לא הצטרפת לאירועים</h3>
                    <p className="text-gray-600 mb-8">עבור לכרטיסיה "גלה אירועים" כדי להצטרף</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Section */}
          {showChat && selectedEventForChat && (
            <div className="lg:col-span-2">
              <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden h-[600px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MessageCircle className="w-5 h-5" />
                      {selectedEventForChat.event_title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseChat}
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-indigo-100 text-sm">
                    צ'אט קבוצתי עם משתתפי האירוע
                  </p>
                </CardHeader>
                <CardContent className="p-0 flex-grow overflow-hidden"> {/* Added flex-grow and overflow-hidden */}
                  <GroupChatComponent
                    eventId={selectedEventForChat.id}
                    participants={[
                      { participant_id: 'demo-1', participant_name: 'Maya Cohen' },
                      { participant_id: 'demo-2', participant_name: 'Danny Levi' },
                      { participant_id: 'demo-3', participant_name: 'Alon Sharon' },
                      { participant_id: 'demo-4', participant_name: 'Sarah Kim' }
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Create Event Dialog */}
        {showCreateDialog && (
          <CreateSharedEventDialog
            isOpen={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onSubmit={handleCreateEvent}
          />
        )}
      </div>
    </div>
  );
}
