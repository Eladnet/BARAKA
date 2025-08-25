import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  FileText, 
  Zap, 
  Bot,
  Users,
  MessageSquare,
  TrendingUp,
  Crown,
  Shield,
  Globe,
  Heart,
  Star,
  Download,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import SystemSpecification from '../components/docs/SystemSpecification';
import PDFGenerator from '../components/docs/PDFGenerator';

export default function DocumentationPage() {
  const features = [
    {
      icon: Bot,
      title: "AI Promoters",
      description: "6 סוגי אישיות AI עם למידה מתמשכת ותגובות דינמיות",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Lead Management",
      description: "ניהול מתקדם של לקוחות עם ציון VIP וחקירה חברתית",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Multi-Platform",
      description: "WhatsApp, Facebook, Instagram - כל הפלטפורמות במקום אחד",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "ניתוח מתקדם עם תחזיות AI וטרנדים בזמן אמת",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Crown,
      title: "VIP System",
      description: "זיהוי אוטומטי של לקוחות VIP והתאמת טיפול מיוחד",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Security",
      description: "אבטחה מתקדמת עם הצפנה מלאה ואימות דו-שלבי",
      color: "from-red-500 to-pink-500"
    }
  ];

  const stats = [
    { label: "AI Personalities", value: "6+", color: "text-purple-600" },
    { label: "Supported Platforms", value: "10+", color: "text-blue-600" },
    { label: "Active Features", value: "50+", color: "text-emerald-600" },
    { label: "Monthly Updates", value: "4", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Book className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TICKET PULSE
              </h1>
              <p className="text-lg text-gray-600 mt-1">Documentation Hub v2.2</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              מסמכי התיעוד המקיפים של פלטפורמת TICKET PULSE - מערכת השיווק המתקדמת לחיי הלילה עם בינה מלאכותית
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center pb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Star className="w-4 h-4 mr-2" />
              Get Started
            </Button>
            <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </Button>
          </div>
        </div>

        {/* Main Documentation Tabs */}
        <Card className="bg-white border-0 shadow-xl">
          <Tabs defaultValue="specification" className="p-6">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
              <TabsTrigger 
                value="specification" 
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                📋 System Specification
              </TabsTrigger>
              <TabsTrigger 
                value="pdf-generator" 
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                📄 PDF Generator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specification" className="space-y-6">
              <SystemSpecification />
            </TabsContent>

            <TabsContent value="pdf-generator" className="space-y-6">
              <PDFGenerator />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Zap className="w-5 h-5" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 mb-4">
                מדריך התחלה מהירה להקמת המערכת תוך 5 דקות
              </p>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Globe className="w-5 h-5" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-600 mb-4">
                תיעוד מלא של ה-API עם דוגמאות קוד
              </p>
              <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                <ExternalLink className="w-4 h-4 mr-2" />
                View API
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Heart className="w-5 h-5" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600 mb-4">
                הצטרף לקהילת המפתחים וקבל עזרה
              </p>
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Version Info */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-lg inline-block">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none px-3 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Production Ready v2.2
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Latest Features
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none px-3 py-1">
                  <Globe className="w-3 h-3 mr-1" />
                  Global Scale
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Last updated: {new Date().toLocaleDateString('he-IL')} | Version 2.2 | Built with ❤️ by Elad Cohen
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}