import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Star
} from "lucide-react";

export default function SharedEventStats({ events }) {
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active' || e.status === 'published').length;
  const totalParticipants = events.reduce((sum, event) => sum + (event.total_seats - event.available_seats), 0);
  const averagePrice = events.length > 0 ? Math.round(events.reduce((sum, event) => sum + event.price_per_person, 0) / events.length) : 0;
  const totalRevenue = events.reduce((sum, event) => sum + (event.price_per_person * (event.total_seats - event.available_seats)), 0);
  const uniqueCities = new Set(events.map(e => e.city)).size;

  const stats = [
    {
      label: "אירועים פעילים",
      value: activeEvents,
      icon: Calendar,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      label: "משתתפים הצטרפו",
      value: totalParticipants,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      label: "מחיר ממוצע",
      value: `₪${averagePrice}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      label: "ערים פעילות",
      value: uniqueCities,
      icon: MapPin,
      color: "text-red-400",
      bgColor: "bg-red-500/20"
    },
    {
      label: "הכנסות כוללות",
      value: `₪${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    },
    {
      label: "דירוג ממוצע",
      value: "4.8",
      icon: Star,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={index} className="bg-slate-900/50 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-lg leading-none">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-xs mt-1 truncate">
                    {stat.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}