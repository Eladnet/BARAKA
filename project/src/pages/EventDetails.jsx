import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Heart,
  Share2,
  Ticket,
  ArrowLeft,
  Music,
  Wine,
  Camera,
  Navigation
} from "lucide-react";
import { format } from "date-fns";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = () => {
    // Since we don't have a real database of events, we'll create sample data based on eventId
    const sampleEvents = {
      'bergain-afterparty': {
        id: 'bergain-afterparty',
        title: 'Bergain Afterparty',
        subtitle: 'Tel Aviv Underground Scene',
        description: 'Three day techno festival featuring the biggest underground artists from Berlin and Tel Aviv. Experience the raw energy of industrial techno in an authentic warehouse setting.',
        longDescription: `Join us for an unforgettable night of underground techno music in the heart of Tel Aviv. This exclusive afterparty brings together the best DJs from the international scene for a night you won't forget.

The venue features state-of-the-art sound system, immersive lighting, and multiple rooms with different vibes. From deep house to hard techno, we've got something for every electronic music lover.

Special features:
• Main room with Function-One sound system
• Chill out area with ambient music
• Food trucks and premium bar service
• Professional photography throughout the night
• Coat check and secure parking available`,
        date: '2024-12-28T22:00:00Z',
        endDate: '2024-12-29T06:00:00Z',
        venue: 'Warehouse District',
        location: 'Tel Aviv, Israel',
        address: 'Industrial Zone, South Tel Aviv',
        price: 195,
        originalPrice: 250,
        currency: '₪',
        image: 'https://images.unsplash.com/photo-1470229538611-16a4609b4eda?w=1200&h=800&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1470229538611-16a4609b4eda?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1571266028243-d220c5ce8b3b?w=1200&h=800&fit=crop'
        ],
        attendees: 1200,
        capacity: 1500,
        rating: 4.8,
        reviews: 156,
        tags: ['Techno', 'Underground', 'All Night'],
        artists: ['Ben Klock', 'Adam Beyer', 'Charlotte de Witte', 'I Hate Models'],
        ageLimit: 18,
        dresscode: 'Dark colors preferred',
        category: 'nightlife',
        organizer: 'Underground Events TLV',
        isHot: true,
        isTrending: true,
        discount: 22,
        ticketTypes: [
          { name: 'Early Bird', price: 195, originalPrice: 250, available: true },
          { name: 'Regular', price: 220, originalPrice: 280, available: true },
          { name: 'VIP', price: 350, originalPrice: 450, available: true }
        ]
      },
      'warehouse-sessions': {
        id: 'warehouse-sessions',
        title: 'Warehouse Sessions',
        subtitle: 'Industrial Clubbing Experience',
        description: 'An exclusive night of underground music in an industrial venue with world-class DJs and immersive production.',
        date: '2024-12-29T23:00:00Z',
        venue: 'Serial Warehouse Location',
        location: 'Tel Aviv',
        price: 197,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop',
        attendees: 800,
        rating: 4.9,
        tags: ['Industrial', 'Exclusive', 'Underground'],
        category: 'nightlife'
      },
      'rooftop-vibes': {
        id: 'rooftop-vibes',
        title: 'Sunset Beach Vibes',
        subtitle: 'Romantic Sunset Experience',
        description: 'Chill out VIP experience with sunset views and premium cocktails on the beautiful Tel Aviv coastline.',
        longDescription: `Experience the magic of Tel Aviv's golden hour with our exclusive sunset event. Located on a premium rooftop overlooking the Mediterranean Sea, this intimate gathering combines breathtaking views with exceptional music and cocktails.

Our expert mixologists will craft signature cocktails while you enjoy the stunning sunset over the water. The evening features carefully curated music from local DJs specializing in deep house and ambient sounds.

What's included:
• Welcome cocktail upon arrival
• Premium open bar (2 hours)
• Gourmet appetizers and canapés  
• Professional sunset photography
• Exclusive rooftop access
• Blankets and comfortable seating areas`,
        date: '2024-12-30T18:00:00Z',
        endDate: '2024-12-30T23:00:00Z',
        venue: 'Rooftop Terrace',
        location: 'Tel Aviv Beachfront',
        address: 'Hayarkon Street, Tel Aviv',
        price: 112,
        originalPrice: 140,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=800&fit=crop'
        ],
        attendees: 300,
        capacity: 150,
        rating: 4.7,
        reviews: 89,
        tags: ['Sunset', 'Cocktails', 'Romantic'],
        artists: ['DJ Sunset', 'Beach Vibes Collective'],
        ageLimit: 21,
        dresscode: 'Smart casual, comfortable shoes',
        category: 'food',
        organizer: 'Sunset Events',
        isVip: true,
        discount: 20,
        ticketTypes: [
          { name: 'Couple Package', price: 200, originalPrice: 250, available: true },
          { name: 'Single Entry', price: 112, originalPrice: 140, available: true },
          { name: 'VIP Table', price: 500, originalPrice: 650, available: true }
        ]
      }
    };

    setTimeout(() => {
      setEvent(sampleEvents[eventId] || null);
      setIsLoading(false);
    }, 500);
  };

  const handleTicketPurchase = (ticketType = null) => {
    if (ticketType) {
      alert(`Purchasing ${ticketType.name} ticket for ${event.currency}${ticketType.price} - Payment system coming soon!`);
    } else {
      alert(`Purchasing ticket for ${event.title} - Payment system coming soon!`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-slate-400 mb-6">The event you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="bg-black/50 backdrop-blur-md border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${event.image})` 
          }}
        />
        
        <div className="relative h-full flex items-end">
          <div className="w-full p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {event.isHot && (
                  <Badge className="bg-red-500 text-white">
                    🔥 Hot Event
                  </Badge>
                )}
                {event.isTrending && (
                  <Badge className="bg-orange-500 text-white">
                    ⚡ Trending
                  </Badge>
                )}
                {event.isVip && (
                  <Badge className="bg-yellow-500 text-black">
                    👑 VIP
                  </Badge>
                )}
                {event.discount > 0 && (
                  <Badge className="bg-green-500 text-white">
                    -{event.discount}% OFF
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-xl text-white/80 mb-4">{event.subtitle}</p>
              
              <div className="flex flex-wrap gap-4 text-white/70">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {format(new Date(event.date), 'HH:mm')}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {event.venue}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 whitespace-pre-line">
                  {event.longDescription || event.description}
                </p>
              </CardContent>
            </Card>

            {/* Artists */}
            {event.artists && (
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-400" />
                    Featured Artists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.artists.map((artist, index) => (
                      <div key={index} className="text-center p-4 bg-slate-800/50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-white">{artist}</h3>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Details */}
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">📍 Location</h4>
                    <p className="text-slate-300">{event.address || event.location}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">👥 Capacity</h4>
                    <p className="text-slate-300">{event.capacity || 'Limited'} people</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">🔞 Age Limit</h4>
                    <p className="text-slate-300">{event.ageLimit || 18}+ only</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">👔 Dress Code</h4>
                    <p className="text-slate-300">{event.dresscode || 'Smart casual'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Purchase Card */}
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Get Your Tickets</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFavorite}
                      className={`${isFavorite ? 'text-red-400' : 'text-slate-400'} hover:text-red-400`}
                    >
                      <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="text-slate-400 hover:text-white"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.ticketTypes ? (
                  event.ticketTypes.map((ticket, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-white">{ticket.name}</h4>
                        <div className="text-right">
                          {ticket.originalPrice > ticket.price && (
                            <div className="text-sm text-slate-400 line-through">
                              {event.currency}{ticket.originalPrice}
                            </div>
                          )}
                          <div className="text-lg font-bold text-purple-400">
                            {event.currency}{ticket.price}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleTicketPurchase(ticket)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={!ticket.available}
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        {ticket.available ? 'Buy Now' : 'Sold Out'}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {event.originalPrice > event.price && (
                          <span className="text-slate-400 line-through text-lg">
                            {event.currency}{event.originalPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-purple-400">
                          {event.currency}{event.price}
                        </span>
                      </div>
                      {event.discount > 0 && (
                        <Badge className="bg-green-500 text-white mb-4">
                          Save {event.discount}%!
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => handleTicketPurchase()}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3"
                    >
                      <Ticket className="w-5 h-5 mr-2" />
                      Buy Tickets Now
                    </Button>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span>👥 {event.attendees} attending</span>
                    <span>⭐ {event.rating}/5 ({event.reviews || 0} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            {event.organizer && (
              <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Organized by</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{event.organizer}</h4>
                      <p className="text-sm text-slate-400">Event Organizer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}