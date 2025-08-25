import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award,
  Star,
  Crown,
  Plus,
  Mail,
  Phone,
  MessageCircle,
  DollarSign,
  Ticket,
  Trophy,
  Zap
} from "lucide-react";

export default function SalesTeamTab({ tickets = [], leads = [] }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // נתונים מדומים לצוות מכירות
  const salesTeam = [
    {
      id: 1,
      name: 'דני כהן',
      email: 'danny@example.com',
      phone: '050-1234567',
      avatar: 'D',
      role: 'Senior Sales',
      totalSales: 156,
      revenue: 45200,
      conversionRate: 68,
      events: 12,
      rating: 4.8,
      badge: 'top_performer',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      name: 'שרה לוי',
      email: 'sarah@example.com', 
      phone: '052-7654321',
      avatar: 'S',
      role: 'Sales Manager',
      totalSales: 98,
      revenue: 28900,
      conversionRate: 74,
      events: 8,
      rating: 4.6,
      badge: 'rising_star',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      name: 'מיכאל רוזן',
      email: 'michael@example.com',
      phone: '054-9876543', 
      avatar: 'M',
      role: 'Junior Sales',
      totalSales: 67,
      revenue: 18500,
      conversionRate: 58,
      events: 6,
      rating: 4.2,
      badge: 'new_talent',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      name: 'רונית אברהם',
      email: 'ronit@example.com',
      phone: '053-5555555',
      avatar: 'R',
      role: 'Sales Associate', 
      totalSales: 89,
      revenue: 22100,
      conversionRate: 62,
      events: 9,
      rating: 4.4,
      badge: 'consistent',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const getBadgeStyle = (badge) => {
    const styles = {
      top_performer: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Crown },
      rising_star: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Star },
      new_talent: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: Zap },
      consistent: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Award }
    };
    return styles[badge] || styles.consistent;
  };

  const getBadgeText = (badge) => {
    const texts = {
      top_performer: 'מבצע מוביל',
      rising_star: 'כוכב עולה', 
      new_talent: 'כישרון חדש',
      consistent: 'יציב'
    };
    return texts[badge] || 'מכירות';
  };

  // חישוב סטטיסטיקות כלליות
  const totalTeamSales = salesTeam.reduce((sum, member) => sum + member.totalSales, 0);
  const totalTeamRevenue = salesTeam.reduce((sum, member) => sum + member.revenue, 0);
  const avgConversionRate = salesTeam.reduce((sum, member) => sum + member.conversionRate, 0) / salesTeam.length;
  const totalTeamEvents = salesTeam.reduce((sum, member) => sum + member.events, 0);

  return (
    <div className="space-y-6">
      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">סה״כ מכירות צוות</p>
                <p className="text-3xl font-bold text-gray-900">{totalTeamSales}</p>
                <p className="text-blue-600 text-xs flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% מהחודש הקודם
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">הכנסות צוות</p>
                <p className="text-3xl font-bold text-gray-900">₪{totalTeamRevenue.toLocaleString()}</p>
                <p className="text-emerald-600 text-xs flex items-center mt-1">
                  <DollarSign className="w-3 h-3 mr-1" />
                  ממוצע לחודש
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">אחוז המרה ממוצע</p>
                <p className="text-3xl font-bold text-gray-900">{avgConversionRate.toFixed(1)}%</p>
                <p className="text-purple-600 text-xs flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  יעד: 70%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">אירועים פעילים</p>
                <p className="text-3xl font-bold text-gray-900">{totalTeamEvents}</p>
                <p className="text-yellow-600 text-xs flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  {salesTeam.length} חברי צוות
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">צוות המכירות</h2>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          הוסף חבר צוות
        </Button>
      </div>

      {/* Sales Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salesTeam.map((member) => {
          const badgeStyle = getBadgeStyle(member.badge);
          const BadgeIcon = badgeStyle.icon;

          return (
            <Card key={member.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                      <span className="text-white font-bold text-xl">{member.avatar}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <p className="text-gray-600 font-medium">{member.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(member.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{member.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${badgeStyle.bg} ${badgeStyle.text} flex items-center gap-1 px-3 py-1`}>
                    <BadgeIcon className="w-3 h-3" />
                    {getBadgeText(member.badge)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">{member.totalSales}</p>
                    <p className="text-xs text-gray-600">כרטיסים נמכרו</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-emerald-600">₪{member.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">הכנסות</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">{member.conversionRate}%</p>
                    <p className="text-xs text-gray-600">אחוז המרה</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-yellow-600">{member.events}</p>
                    <p className="text-xs text-gray-600">אירועים</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">התקדמות יעד חודשי</span>
                    <span className="text-gray-900 font-bold">{member.conversionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${member.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${member.conversionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    צ׳אט
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                    <Mail className="w-4 h-4 mr-2" />
                    מייל
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Team Leaderboard */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            לוח המובילים החודשי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesTeam
              .sort((a, b) => b.revenue - a.revenue)
              .map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold">
                    {index + 1}
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                    <span className="text-white font-bold">{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">₪{member.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{member.totalSales} מכירות</p>
                  </div>
                  {index === 0 && <Crown className="w-6 h-6 text-yellow-500" />}
                  {index === 1 && <Star className="w-6 h-6 text-gray-400" />}
                  {index === 2 && <Award className="w-6 h-6 text-amber-600" />}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}