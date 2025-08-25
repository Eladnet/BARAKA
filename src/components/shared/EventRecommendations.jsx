import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, TrendingUp, Users, MapPin } from "lucide-react";
import SharedEventCard from "./SharedEventCard";

export default function EventRecommendations({ currentUser, allEvents, onEventSelect }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, [currentUser, allEvents]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // AI-like recommendation logic
      const userPreferences = {
        preferredCities: currentUser?.preferences?.cities || ['תל אביב'],
        preferredVenues: currentUser?.preferences?.venues || ['restaurant', 'rooftop'],
        priceRange: currentUser?.preferences?.priceRange || [100, 300],
        ageGroup: currentUser?.age || 25,
        interests: currentUser?.interests || []
      };

      const scored = allEvents.map(event => {
        let score = 0;
        
        // City preference
        if (userPreferences.preferredCities.includes(event.city)) {
          score += 20;
        }
        
        // Venue type preference
        if (userPreferences.preferredVenues.includes(event.venue_type)) {
          score += 15;
        }
        
        // Price range fit
        if (event.price_per_person >= userPreferences.priceRange[0] && 
            event.price_per_person <= userPreferences.priceRange[1]) {
          score += 10;
        }
        
        // Age compatibility
        const ageMin = event.age_restriction?.min_age || 18;
        const ageMax = event.age_restriction?.max_age || 99;
        if (userPreferences.ageGroup >= ageMin && userPreferences.ageGroup <= ageMax) {
          score += 10;
        }
        
        // Host rating bonus
        if (event.host_rating >= 4.5) {
          score += 8;
        }
        
        // Trending bonus
        if (event.is_trending) {
          score += 12;
        }
        
        // Available spots bonus
        if (event.available_seats > 0) {
          score += 5;
        }
        
        // Interest matching
        const eventTags = event.tags || [];
        const matchingInterests = eventTags.filter(tag => 
          userPreferences.interests.some(interest => 
            interest.toLowerCase().includes(tag.toLowerCase()) ||
            tag.toLowerCase().includes(interest.toLowerCase())
          )
        );
        score += matchingInterests.length * 3;

        return { ...event, ai_match_score: score };
      });

      // Sort by score and filter available events
      const topRecommendations = scored
        .filter(event => event.available_seats > 0 && event.status === 'published')
        .sort((a, b) => b.ai_match_score - a.ai_match_score)
        .slice(0, 6);

      setRecommendations(topRecommendations);
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 mb-8">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30 mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          🎯 מומלץ בעבורך
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            AI Powered
          </Badge>
        </CardTitle>
        <p className="text-slate-400">
          אירועים שנבחרו במיוחד לפי הטעם והעדפות שלך
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Recommendation rank */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              {/* Match score indicator */}
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-green-500/90 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  {event.ai_match_score}% מתאים
                </Badge>
              </div>
              
              <SharedEventCard
                event={event}
                currentUser={currentUser}
                onJoin={onEventSelect}
                onShare={() => {}}
                onLike={() => {}}
              />
            </div>
          ))}
        </div>

        {/* Why these recommendations */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            למה האירועים האלה?
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              <MapPin className="w-3 h-3 mr-1" />
              באזור שלך
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              <Users className="w-3 h-3 mr-1" />
              מתאים לגיל שלך
            </Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-300">
              <Star className="w-3 h-3 mr-1" />
              מארחים מדורגים
            </Badge>
            {currentUser?.interests?.length > 0 && (
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                <Sparkles className="w-3 h-3 mr-1" />
                תואם את התחומי עניין שלך
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}