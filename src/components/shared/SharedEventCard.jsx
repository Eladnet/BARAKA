
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Star,
  Clock,
  Share2,
  Heart,
  MessageCircle,
  Eye,
  Settings,
  UserPlus,
  Zap,
  Award,
  Camera,
  Music,
  Utensils,
  Wine,
  Car
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

const VENUE_ICONS = {
  nightclub: "🎵",
  yacht: "🛥️", 
  private_party: "🎉",
  workshop: "🎨",
  rooftop: "🏙️",
  restaurant: "🍽️",
  beach_club: "🏖️",
  house_party: "🏠",
  other: "✨"
};

const VENUE_LABELS = {
  nightclub: "מועדון לילה",
  yacht: "יאכטה",
  private_party: "מסיבה פרטית", 
  workshop: "סדנה",
  rooftop: "גג",
  restaurant: "מסעדה",
  beach_club: "מועדון חוף",
  house_party: "מסיבת בית",
  other: "אחר"
};

const PERKS = {
  free_drinks: { icon: Wine, label: "משקאות חינם", color: "text-purple-500" },
  photography: { icon: Camera, label: "צלם מקצועי", color: "text-blue-500" },
  live_music: { icon: Music, label: "מוזיקה חיה", color: "text-green-500" },
  gourmet_food: { icon: Utensils, label: "אוכל גורמה", color: "text-yellow-500" },
  transportation: { icon: Car, label: "הסעות", color: "text-red-500" },
  vip_access: { icon: Award, label: "גישת VIP", color: "text-indigo-500" }
};

export default function SharedEventCard({ 
  event, 
  currentUser, 
  isHost = false,
  onJoin,
  onShare,
  onLike,
  onEdit,
  onManage,
  onChat // Added new prop
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 20));

  // בדיקת תקינות נתונים
  if (!event) {
    console.error('SharedEventCard: event is undefined');
    return null;
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(event);
  };

  const handleShare = () => {
    if (onShare) onShare(event);
  };

  const handleJoin = () => {
    if (onJoin) onJoin(event);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(event);
  };

  const handleManage = () => {
    if (onManage) onManage(event);
  };

  const handleChat = () => {
    if (onChat) onChat(event);
  };

  // נתונים בטוחים עם ברירות מחדל
  const eventDate = new Date(event.event_date || Date.now());
  const isEventSoon = (eventDate - new Date()) < (24 * 60 * 60 * 1000);
  const spotsLeft = event.available_seats || 0;
  const totalSpots = event.total_seats || 1;
  const occupancyRate = ((totalSpots - spotsLeft) / totalSpots) * 100;

  const privateCost = event.total_table_cost || (event.price_per_person || 0) * totalSpots;
  const sharedCost = event.price_per_person || 0;
  const savingsPerPerson = Math.round((privateCost / totalSpots) - sharedCost);

  const eventPerks = event.perks || [];

  return (
    <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group">
      {/* Event Image */}
      {event.event_images && event.event_images.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.event_images[0]} 
            alt={event.event_title || 'אירוע'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {event.is_trending && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                🔥 HOT
              </Badge>
            )}
            {savingsPerPerson > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg font-bold">
                💰 חסוך ₪{savingsPerPerson}
              </Badge>
            )}
          </div>

          {/* Status badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {isEventSoon && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                <Clock className="w-3 h-3 mr-1" />
                בקרוב!
              </Badge>
            )}
            {spotsLeft <= 2 && spotsLeft > 0 && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                <Users className="w-3 h-3 mr-1" />
                נותרו {spotsLeft}
              </Badge>
            )}
            {spotsLeft === 0 && (
              <Badge className="bg-gray-800 text-white border-0 shadow-lg">
                מלא
              </Badge>
            )}
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/70 backdrop-blur-sm text-white border-0">
              {VENUE_ICONS[event.venue_type] || "✨"} {VENUE_LABELS[event.venue_type] || "אחר"}
            </Badge>
          </div>

          {/* Participants avatars */}
          <div className="absolute bottom-3 right-3">
            <div className="flex -space-x-2">
              {[...Array(Math.min(3, totalSpots - spotsLeft))].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {totalSpots - spotsLeft > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  +{totalSpots - spotsLeft - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {event.event_title || 'אירוע ללא שם'}
            </h3>
            
            {/* Host Info */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  {currentUser?.full_name?.charAt(0) || 'H'}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-500 text-sm">מארח</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-gray-900 text-sm font-medium">
                  {(event.host_rating || 4.5).toFixed(1)}
                </span>
                <span className="text-gray-500 text-xs">
                  ({event.host_events_count || 0})
                </span>
                {(event.host_rating || 0) >= 4.8 && (event.host_events_count || 0) >= 10 && (
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0 ml-2">
                    ⭐ SUPERHOST
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`hover:bg-red-50 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-400 hover:bg-blue-50 hover:text-blue-500"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium">
              {format(eventDate, 'EEEE, d MMMM', { locale: he })}
            </span>
            <span className="text-indigo-600 font-bold">
              {format(eventDate, 'HH:mm')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-sm">{event.venue_name || 'מקום לא מוגדר'}, {event.city || 'עיר לא מוגדרת'}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              {totalSpots - spotsLeft}/{totalSpots} מקומות תפוסים
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, occupancyRate)}%` }}
          />
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-bold text-2xl">
              ₪{sharedCost}
            </span>
            <span className="text-gray-500 text-sm">לאדם</span>
            {savingsPerPerson > 0 && (
              <span className="text-gray-400 text-sm line-through ml-2">
                ₪{sharedCost + savingsPerPerson}
              </span>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-500">סה"כ שולחן</div>
            <div className="text-sm font-bold text-gray-800">₪{privateCost}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isHost ? (
            <>
              <Button
                onClick={handleManage}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl h-12 font-medium shadow-lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                נהל
              </Button>
              <Button
                variant="outline"
                onClick={handleEdit}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl h-12 px-4"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleJoin}
                disabled={spotsLeft === 0}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl h-12 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {spotsLeft === 0 ? 'מלא' : `הצטרף - ₪${sharedCost}`}
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl h-12 px-4"
                onClick={handleChat} // Updated onClick handler
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 mt-4 border-t border-gray-100">
          <span>נוצר {format(new Date(event.created_date || Date.now()), 'dd/MM')}</span>
          <div className="flex items-center gap-3">
            {event.instant_book && (
              <Badge className="bg-green-100 text-green-700 text-xs border-0">
                ⚡ אישור מיידי
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {likesCount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
