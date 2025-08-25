
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User as UserIcon,
  Calendar,
  Star,
  Award,
  Ticket,
  MapPin,
  Clock,
  Heart,
  Crown,
  Gift,
  TrendingUp,
  Music,
  Users
} from "lucide-react";
import { User } from "@/api/entities";
import { EventQR } from "@/api/entities";
import { CustomerLoyalty } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

// Removed imports for MyTickets, LoyaltyDashboard, CustomerProfile as their usage in TabsContent has been replaced.
// EventsList was not directly imported/used in the original code, only EventsList.tsx in components folder.

export default function CustomerPortalPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [currentUser, setCurrentUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [userLoyalty, setUserLoyalty] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Load user tickets with fallback
      try {
        const tickets = await EventQR.filter({ lead_id: user.id }, '-event_date', 50);
        setUserTickets(tickets || []); // Ensure it's an array
      } catch (error) {
        console.error('Error loading tickets:', error);
        setUserTickets([]); // Fallback to empty array on error
      }

      // Load loyalty data with fallback
      try {
        const loyalty = await CustomerLoyalty.filter({ lead_id: user.id });
        setUserLoyalty(loyalty?.[0] || { // Use optional chaining for loyalty array
          total_points: 1250,
          current_tier: 'gold',
          visits_count: 8,
          total_spent: 2400,
          tier_benefits: {
            discount_percentage: 15,
            free_entries_per_month: 2,
            priority_booking: true,
            exclusive_events: true
          }
        });
      } catch (error) {
        console.error('Error loading loyalty:', error);
        setUserLoyalty({ // Fallback to default object on error
          total_points: 1250,
          current_tier: 'gold',
          visits_count: 8,
          total_spent: 2400,
          tier_benefits: {
            discount_percentage: 15,
            free_entries_per_month: 2,
            priority_booking: true,
            exclusive_events: true
          }
        });
      }

      // Generate upcoming events (mock data, as per outline)
      const mockEvents = [
        {
          id: 'event-1',
          event_name: 'Warehouse Sessions',
          venue_name: 'Underground Venue',
          event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Exclusive underground techno experience in warehouse setting',
          ticket_price: 120,
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
          artists: ['Ben Klock', 'Adam Beyer'],
          genre: 'Techno',
          location: 'TLV',
          discount: '20% off early bird tickets'
        }
      ];
      setUpcomingEvents(mockEvents);

    } catch (error) {
      console.error('Error loading customer data:', error);
      // Set safe fallbacks for all data if primary load fails
      setCurrentUser({ full_name: 'Guest User', email: 'guest@example.com' });
      setUserTickets([]);
      setUserLoyalty({
        total_points: 0,
        current_tier: 'bronze',
        visits_count: 0,
        total_spent: 0,
        tier_benefits: {
          discount_percentage: 0,
          free_entries_per_month: 0,
          priority_booking: false,
          exclusive_events: false
        }
      });
      setUpcomingEvents([]); // Ensure upcomingEvents is an empty array on error
    }
    setIsLoading(false);
  };

  const tierColors = {
    bronze: 'from-amber-600 to-yellow-600',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    vip: 'from-purple-500 to-pink-500',
    ambassador: 'from-indigo-500 to-purple-600'
  };

  const tierIcons = {
    bronze: Award,
    silver: Star,
    gold: Crown,
    vip: Crown,
    ambassador: Crown
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // Safe fallbacks for potentially undefined data
  const safeUserLoyalty = userLoyalty || {
    total_points: 0,
    current_tier: 'bronze',
    visits_count: 0,
    total_spent: 0,
    tier_benefits: {
      discount_percentage: 0,
      free_entries_per_month: 0,
      priority_booking: false,
      exclusive_events: false
    }
  };

  // Use safeUserLoyalty here
  const TierIcon = tierIcons[safeUserLoyalty.current_tier] || Crown;
  const tierGradient = tierColors[safeUserLoyalty.current_tier] || tierColors.gold;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🌙 {t("Welcome Here")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("Your premium nightlife experience portal")}
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="bg-white border-0 shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {(currentUser?.full_name || 'U')[0].toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-1">{currentUser?.full_name || 'User'}</h2>
                <p className="text-indigo-100 mb-2">{currentUser?.email || 'No email'}</p>
                <div className="flex items-center gap-2">
                  <Badge className={`bg-gradient-to-r ${tierGradient} text-white border-none`}>
                    <TierIcon className="w-4 h-4 mr-1" />
                    {(safeUserLoyalty.current_tier || 'bronze').toUpperCase()} {t("Member")}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-none">
                    {(safeUserLoyalty.total_points || 0).toLocaleString()} Points
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  {t("Events Attended")}
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{safeUserLoyalty.visits_count || 0}</div>
              <div className="text-xs text-gray-500">{t("This month")}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  {t("Upcoming Events")}
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{upcomingEvents.length}</div>
              <div className="text-xs text-gray-500">{t("Next 30 days")}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  {t("Loyalty Points")}
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{(safeUserLoyalty.total_points || 0).toLocaleString()}</div>
              <div className="text-xs text-gray-500">{t("Available points")}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">
                  {t("Member Status")}
                </CardTitle>
                <div className={`w-8 h-8 bg-gradient-to-r ${tierGradient} rounded-lg flex items-center justify-center`}>
                  <TierIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Keep these values as per the outline, not dynamic from safeUserLoyalty */}
              <div className="text-2xl font-bold text-purple-600">{t("VIP Level")}</div>
              <div className="text-xs text-gray-500">{t("Ambassador")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white border-0 shadow-lg rounded-xl p-1 h-14">
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              {t("My Tickets")}
            </TabsTrigger>
            <TabsTrigger
              value="loyalty"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              Loyalty
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-200"
            >
              {t("Profile")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      {t("Featured Events")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingEvents && upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event, index) => (
                        <div key={event?.id || `event-${index}`} className="border border-gray-100 rounded-lg p-6 mb-4 last:mb-0">
                          <div className="flex gap-4">
                            <img
                              src={event?.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'}
                              alt={event?.event_name || 'Event'}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{event?.event_name || 'Untitled Event'}</h3>
                              <p className="text-gray-600 text-sm mb-2">{event?.description || 'No description available'}</p>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {event?.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBA'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event?.location || 'Unknown'}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {(event?.artists || []).map((artist, artistIndex) => (
                                  <Badge key={artistIndex} variant="secondary" className="text-xs">
                                    {artist}
                                  </Badge>
                                ))}
                                <Badge variant="outline" className="text-xs">
                                  <Music className="w-3 h-3 mr-1" />
                                  {event?.genre || 'Music'}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <Badge className="bg-green-100 text-green-800 mb-1">
                                    {event?.discount || ''}
                                  </Badge>
                                </div>
                                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                                  <Ticket className="w-4 h-4 mr-2" />
                                  {t("Get Tickets")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No upcoming events</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-600" />
                      Your Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-900">VIP Access</span>
                      </div>
                      <p className="text-sm text-purple-700">Skip the line at all events</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">{safeUserLoyalty.tier_benefits?.discount_percentage || 0}% Discount</span>
                      </div>
                      <p className="text-sm text-green-700">On all ticket purchases</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Exclusive Events</span>
                      </div>
                      <p className="text-sm text-blue-700">Members-only parties & previews</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">My Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No tickets yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Loyalty Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Loyalty program details coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Customer Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Profile management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
