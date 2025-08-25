import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Star,
  Music,
  Users,
  Heart,
  Share2,
  Search,
  Filter,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function EventsList({ events = [], venues = [], currentUser, onTicketPurchase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVenue = selectedVenue === 'all' || event.venue === selectedVenue;
    
    return matchesSearch && matchesVenue;
  });

  const handleTicketPurchase = async (event) => {
    try {
      // כאן נוסיף לוגיקת רכישת כרטיס
      alert(`רכישת כרטיס לאירוע ${event.event_name} - בקרוב!`);
      if (onTicketPurchase) {
        onTicketPurchase();
      }
    } catch (error) {
      console.error('Ticket purchase failed:', error);
      alert('שגיאה ברכישת הכרטיס');
    }
  };

  const getEventTypeColor = (offerType) => {
    const colors = {
      'free_entry': 'bg-green-500/20 text-green-300',
      'vip_list': 'bg-purple-500/20 text-purple-300',
      'discount': 'bg-yellow-500/20 text-yellow-300',
      'table_booking': 'bg-blue-500/20 text-blue-300',
      'drink_voucher': 'bg-pink-500/20 text-pink-300'
    };
    return colors[offerType] || 'bg-gray-500/20 text-gray-300';
  };

  const getOfferText = (offerType) => {
    const texts = {
      'free_entry': 'כניסה חופשית',
      'vip_list': 'רשימת VIP',
      'discount': 'הנחה מיוחדת',
      'table_booking': 'הזמנת שולחן',
      'drink_voucher': 'שובר משקאות'
    };
    return texts[offerType] || 'הצעה מיוחדת';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="חיפוש אירועים..."
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        
        <div className="relative">
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="appearance-none bg-slate-800 border border-slate-700 text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">כל המקומות</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.name}>{venue.name}</option>
            ))}
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <Card key={event.id} className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge className={getEventTypeColor(event.offer_type)}>
                  {getOfferText(event.offer_type)}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <CardTitle className="text-white text-xl group-hover:text-purple-200 transition-colors">
                {event.event_name}
              </CardTitle>
              
              {event.description && (
                <p className="text-slate-400 text-sm line-clamp-2">
                  {event.description}
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Event Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">
                    {event.event_date && format(new Date(event.event_date), 'PPP', { locale: he })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">
                    {event.event_date && format(new Date(event.event_date), 'HH:mm')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{event.venue}</span>
                </div>
                
                {event.target_audience && event.target_audience.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">{event.target_audience.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Offer Details */}
              {event.offer_details && (
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-emerald-300 text-sm font-medium">
                    {event.offer_details}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="flex justify-between text-xs text-slate-400">
                <span>{event.contacts_reached || 0} נחשפו</span>
                <span>{event.responses_received || 0} מעוניינים</span>
                <span>{event.conversions || 0} רשומים</span>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handleTicketPurchase(event)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Ticket className="w-4 h-4 mr-2" />
                הזמנת כרטיס
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">אין אירועים מתאימים</h3>
          <p className="text-slate-400">נסו לשנות את פרמטרי החיפוש או לחזור מאוחר יותר</p>
        </div>
      )}
    </div>
  );
}