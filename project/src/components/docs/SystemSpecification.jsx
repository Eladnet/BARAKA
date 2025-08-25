
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Printer,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Brain,
  Users,
  BarChart3,
  DollarSign,
  Search,
  Camera,
  TrendingUp,
  Calendar,
  MapPin,
  Target,
  Smartphone,
  Globe,
  CreditCard,
  Award,
  Bot, // New import
  Sparkles, // New import
  MessageSquare // New import
} from "lucide-react";

export default function SystemSpecification() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create enhanced downloadable version with SEO and improved styling
    const content = document.getElementById('system-spec-content');
    const printWindow = window.open('', '_blank');
    const formattedDate = new Date().toLocaleDateString('he-IL'); // For consistency

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TICKET PULSE - System Specification v2.2</title>
          <meta name="description" content="מערכת שיווק AI לחיי לילה – יחצנים דיגיטליים, CRM חכם, אימות זהות, תשלום אוטומטי.">
          <meta name="keywords" content="Ticket Pulse, יחצנים AI, CRM מועדונים, מערכת לידים מסיבות, nightlife marketing platform">
          <meta name="author" content="Elad Cohen">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              min-height: 100vh;
            }
            
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px 20px;
              background: white;
              border-radius: 20px;
              margin-top: 20px;
              margin-bottom: 20px;
              box-shadow: 0 25px 50px rgba(0,0,0,0.1);
              border: 1px solid #e5e7eb;
            }
            
            .header {
              text-align: center;
              margin-bottom: 50px;
              padding: 60px 0;
              background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899);
              color: white;
              border-radius: 15px;
              position: relative;
              overflow: hidden;
            }
            
            .logo {
              width: 80px;
              height: 80px;
              background: linear-gradient(45deg, #fbbf24, #f59e0b);
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
              position: relative;
              z-index: 1;
              border: 3px solid rgba(255,255,255,0.3);
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            
            h1 {
              font-size: 48px;
              font-weight: 700;
              margin-bottom: 15px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              position: relative;
              z-index: 1;
            }
            
            .subtitle {
              font-size: 20px;
              opacity: 0.95;
              position: relative;
              z-index: 1;
            }

            .badges {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 25px;
              position: relative;
              z-index: 1;
            }

            .badge {
              background: rgba(255,255,255,0.2);
              padding: 8px 16px;
              border-radius: 25px;
              font-weight: 500;
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255,255,255,0.3);
              font-size: 14px;
            }

            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }

            .section h2 {
              font-size: 32px;
              color: #4f46e5;
              margin-bottom: 25px;
              padding-bottom: 10px;
              border-bottom: 3px solid #4f46e5;
              display: flex;
              align-items: center;
              gap: 15px;
            }

            .card {
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              padding: 25px;
              border-radius: 15px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              margin: 20px 0;
            }

            .card h3, .card h4 {
                color: #4f46e5;
                margin-bottom: 15px;
                font-weight: 600;
            }
            
            .card h4 {
                font-size: 20px;
            }

            .card ul {
                list-style-type: none; /* Changed to none for custom checkmarks */
                margin-right: 0;
                color: #1f2937;
            }

            .card ul li {
                margin-bottom: 8px;
                font-size: 16px;
                display: flex; /* Added for checkmark alignment */
                align-items: flex-start;
                gap: 8px; /* Space between checkmark and text */
            }

            .card ul li .icon {
                color: #10b981; /* Tailwind emerald-500 */
                flex-shrink: 0; /* Prevent icon from shrinking */
                margin-top: 2px; /* Slight vertical adjust */
            }


            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 25px;
              margin: 25px 0;
            }

            .footer {
              text-align: center;
              margin-top: 60px;
              padding: 40px;
              background: linear-gradient(135deg, #1e293b, #334155);
              color: white;
              border-radius: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎟️</div>
              <h1>TICKET PULSE</h1>
              <div class="subtitle">מסמך איפיון מערכת מלא v2.2</div>
              <div class="subtitle">פלטפורמת AI מתקדמת לשיווק חיי לילה ואירוח יוקרתי</div>
              <div class="badges">
                <span class="badge">🤖 AI מתקדם</span>
                <span class="badge">🔍 חקירה חכמה</span>
                <span class="badge">💰 Pay-Per-Use</span>
                <span class="badge">🛡️ אבטחה מתקדמת</span>
                <span class="badge">👑 Super Admin</span>
                <span class="badge">🎨 Modern UX</span>
                <span class="badge">🎵 Voice AI</span>
                <span class="badge">🔄 Auto Follow-Up</span>
              </div>
            </div>

            ${content.innerHTML}

            <div class="footer">
              <h3>TICKET PULSE™ v2.2 by Elad Cohen</h3>
              <p>Powered by Base44 | All Rights Reserved 2025</p>
              <p><strong>Advanced AI-Powered Nightlife Marketing Revolution</strong></p>
              <p>מסמך זה נוצר אוטומטית | גרסה 2.2 | תאריך: ${formattedDate}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📋 System Specification v2.2
            </h1>
            <p className="text-gray-600 text-lg">
              Complete technical documentation for TICKET PULSE platform - Latest Version
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePrint} variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export PDF v2.2
            </Button>
          </div>
        </div>

        {/* Content */}
        <div id="system-spec-content" className="space-y-8">
          {/* Executive Summary */}
          <Card id="executive-summary" className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Award className="w-6 h-6 text-indigo-600" />
                📋 Executive Summary v2.2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong className="text-indigo-600">Ticket Pulse v2.2</strong> is a revolutionary platform in the nightlife industry, providing an AI-based marketing system for managing promoters, customers and leads – with identity verification, reliability rating, smart communication, voice AI capabilities, advanced automation, and a complete management interface for all types of events and clubs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
                    <h4 className="text-indigo-700 font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      🎯 Target Market
                    </h4>
                    <p className="text-sm text-indigo-600">Global Nightclubs, Event Managers, Promoters</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                    <h4 className="text-purple-700 font-semibold mb-2 flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      🤖 AI Core v2.2
                    </h4>
                    <p className="text-sm text-purple-600">6 AI Personalities + Voice AI + Smart Automation</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-100">
                    <h4 className="text-emerald-700 font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      💰 Revenue Model
                    </h4>
                    <p className="text-sm text-emerald-600">SaaS + Pay-Per-Use + White Label + Affiliate</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100">
                    <h4 className="text-yellow-700 font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      🚀 Version 2.2
                    </h4>
                    <p className="text-sm text-yellow-600">Voice AI + Modern UX + Auto Follow-Up</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's New in v2.2 */}
          <Card id="whats-new" className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Zap className="w-6 h-6 text-emerald-500" />
                🆕 What's New in Version 2.2
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    🎵 Voice AI Revolution
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Text-to-Speech Integration:</strong> Professional voice synthesis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Voice Message Processing:</strong> Automatic audio analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Multi-Language Support:</strong> Hebrew, English, Spanish, Russian</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Dynamic Voice Personality:</strong> Matches AI promoter character</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Studio Quality Audio:</strong> Professional-grade output</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    🔄 Smart Automation
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Auto Follow-Up:</strong> Trigger-based campaign automation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>AI Matchmaker:</strong> Customer-to-event intelligent matching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>AI Forecasting:</strong> Attendance prediction algorithms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Behavioral Triggers:</strong> Smart response to customer actions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Webhook Integration:</strong> Zapier/Make.com connectivity</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                    🎨 Enhanced UX/UI
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Modern Design:</strong> Clean, professional interface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Brand Customization:</strong> Theme per club/account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Interactive Dashboard:</strong> Real-time data visualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Live Effects:</strong> Confetti celebrations, VIP glow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Mobile Optimized:</strong> Full responsive design</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    📊 Advanced Analytics
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Interaction Heatmap:</strong> Time/day activity mapping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Return Customer Detection:</strong> Loyalty identification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Automated KPI Tracking:</strong> Real-time performance metrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Lead Dropout Analysis:</strong> Conversion optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Business Intelligence:</strong> Advanced reporting suite</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Status */}
          <Card id="production-status" className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                🚀 Production Status v2.2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-emerald-700 text-lg font-medium">
                  ✅ TICKET PULSE v2.2 is fully production-ready and deployed
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Core Platform: Ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Voice AI: Deployed</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Automation: Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Modern UX: Live</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <h4 className="text-emerald-800 font-semibold mb-2">🎯 Production Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">100%</div>
                      <div className="text-emerald-700">Ready</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">25+</div>
                      <div className="text-emerald-700">Entities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">50+</div>
                      <div className="text-emerald-700">Features</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">99.9%</div>
                      <div className="text-emerald-700">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 border-0 shadow-xl">
            <CardContent className="p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">TICKET PULSE™ v2.2</h2>
              <p className="text-lg mb-4 text-indigo-200">by Elad Cohen</p>
              <p className="text-indigo-300 mb-4">Powered by Base44 | All Rights Reserved 2025</p>
              <p className="text-purple-300 mb-6">Advanced AI-Powered Nightlife Marketing & Voice AI Revolution</p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-300/30">
                  ✅ Production Ready v2.2
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-300/30">
                  🗃️ 25+ Entities
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-300/30">
                  🤖 Voice AI-Powered
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-300/30">
                  🌍 Global Scale
                </Badge>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-300/30">
                  💰 Revenue Ready
                </Badge>
              </div>
              <p className="text-sm text-indigo-400 mt-4">
                Generated on {new Date().toLocaleDateString()} | Version 2.2
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
