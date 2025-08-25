import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Star,
  Ticket,
  Music,
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  Heart,
  Share2
} from "lucide-react";
import { User } from "@/api/entities";
import { EventQR } from "@/api/entities";
import { useTranslation } from "@/components/lib/translations";

export default function EventsPortalPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    date: 'all',
    price: 'all',
    location: 'all'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      // Generate sample events
      const sampleEvents = [
        {
          id: 'event-1',
          event_name: 'Warehouse Sessions',
          venue_name: 'Underground Venue',
          event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Exclusive underground techno experience in warehouse setting',
          ticket_price: 120,
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
          category: 'Electronic',
          location: 'Tel Aviv',
          rating: 4.8,
          attendees: 250,
          isFeatured: true,
          tags: ['Techno', 'Underground', 'Warehouse']
        },
        {
          id: 'event-2',
          event_name: 'Rooftop Jazz Night',
          venue_name: 'Sky Lounge',
          event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Smooth jazz under the stars with city views',
          ticket_price: 80,
          image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
          category: 'Jazz',
          location: 'Tel Aviv',
          rating: 4.6,
          attendees: 120,
          isFeatured: true,
          tags: ['Jazz', 'Rooftop', 'Views']
        },
        {
          id: 'event-3',
          event_name: 'Beach Party Sunset',
          venue_name: 'Banana Beach',
          event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Ultimate beach party with international DJs',
          ticket_price: 150,
          image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop',
          category: 'Beach',
          location: 'Tel Aviv',
          rating: 4.9,
          attendees: 500,
          isFeatured: false,
          tags: ['Beach', 'Sunset', 'International']
        }
      ];

      setEvents(sampleEvents);
      setFeaturedEvents(sampleEvents.filter(e => e.isFeatured));

    } catch (error) {
      console.error('Error loading events:', error);
      // Set empty arrays as fallback
      setEvents([]);
      setFeaturedEvents([]);
    }
    setIsLoading(false);
  };

  const filteredEvents = events.filter(event => {
    if (!event) return false;
    
    const matchesSearch = (event.event_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.venue_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'all' || event.category === filters.category;
    const matchesLocation = filters.location === 'all' || event.location === filters.location;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const EventCard = ({ event, featured = false }) => {
    if (!event) return null;

    return (
      <Card className={`bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${featured ? 'ring-2 ring-purple-200' : ''}`}>
        <div className="relative">
          <img 
            src={event.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'} 
            alt={event.event_name || 'Event'}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/80 backdrop-blur-sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/80 backdrop-blur-sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/70 text-white border-none">
              ₪{event.ticket_price || 0}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{event.event_name || 'Untitled Event'}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.venue_name || 'Unknown Venue'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{event.rating || 0}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description || 'No description available'}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {event.event_date ? new Date(event.event_date).toLocaleDateString('he-IL') : 'TBA'}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.attendees || 0}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {event.category || 'General'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {(event.tags || []).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Ticket className="w-4 h-4 mr-2" />
            Get Tickets
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🎫 Events Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing nightlife events and exclusive experiences
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search events, venues, artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-4 py-3 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="Electronic">Electronic</option>
                <option value="Jazz">Jazz</option>
                <option value="Beach">Beach</option>
                <option value="Rooftop">Rooftop</option>
              </select>
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="px-4 py-3 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Locations</option>
                <option value="Tel Aviv">Tel Aviv</option>
                <option value="Jerusalem">Jerusalem</option>
                <option value="Haifa">Haifa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents && featuredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <EventCard key={event?.id || Math.random()} event={event} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Found {filteredEvents.length} events
            </div>
          </div>
          
          {filteredEvents.length === 0 ? (
            <Card className="bg-white border-0 shadow-lg text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or check back later for new events
                </p>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event?.id || Math.random()} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{events.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {events.reduce((sum, e) => sum + (e?.attendees || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Attendees</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {events.length > 0 ? (events.reduce((sum, e) => sum + (e?.rating || 0), 0) / events.length).toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}