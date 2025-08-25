

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { BarChart3, Bot, Users, Megaphone, TrendingUp, Settings, Sparkles, MessageSquare, Menu, QrCode, Package, HelpCircle, LogOut, Book, Search, Globe, Database, Plus, Crown, X, Bell, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LanguageSelector from "@/components/ui/language-selector";
import { useTranslation } from "@/components/lib/translations";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Get current language from localStorage
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);

  const navigationItems = [
    {
      title: t("Dashboard"),
      url: createPageUrl("Dashboard"),
      icon: BarChart3,
    },
    {
      title: t("Conversations"),
      url: createPageUrl("Conversations"),
      icon: MessageSquare,
    },
    {
      title: t("AI Promoters"),
      url: createPageUrl("Promoters"),
      icon: Bot,
    },
    {
      title: t("Leads"),
      url: createPageUrl("Leads"),
      icon: Users,
    },
    {
      title: t("Campaigns"),
      url: createPageUrl("Campaigns"),
      icon: Megaphone,
    },
    {
      title: t("Ticketing"),
      url: createPageUrl("Ticketing"),
      icon: QrCode,
    },
    {
      title: "🍽️ Shared Tables",
      url: createPageUrl("SharedTables"),
      icon: Users,
    },
    {
      title: t("Loyalty"),
      url: createPageUrl("Loyalty"),
      icon: Sparkles,
    },
    {
      title: t("Social Prospecting"),
      url: createPageUrl("SocialProspecting"),
      icon: Search,
    },
    {
      title: t("Analytics"),
      url: createPageUrl("Analytics"),
      icon: TrendingUp,
    },
    {
      title: t("Events Portal"),
      url: createPageUrl("EventsPortal"),  
      icon: Users,
    },
    {
      title: t("Customer Portal"),
      url: createPageUrl("CustomerPortal"),
      icon: Users,
    },
    {
      title: t("Pricing"),
      url: createPageUrl("Pricing"),
      icon: Package,
    },
    {
      title: t("Settings"),
      url: createPageUrl("Settings"),
      icon: Settings,
    },
    // Super Admin Panel - עבור Super Admins בלבד
    ...(currentUser && ['elad@bigcohen.com', 'dor.azriel@gmail.com', 'alihassanvirk.ahv@gmail.com'].includes(currentUser.email) ? [{
      title: "👑 Super Admin",
      url: createPageUrl("SuperAdmin"),
      icon: Crown,
      className: "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-200/50 text-amber-700 hover:bg-amber-50"
    },
    {
      title: "🚀 SEO Control",
      url: createPageUrl("SEOControlCenter"),
      icon: TrendingUp,
      className: "bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-200/50 text-emerald-700 hover:bg-emerald-50"
    }] : [])
  ];

  const supportItems = [
    {
      title: t("Help & Support"),
      url: createPageUrl("Help"),
      icon: HelpCircle,
    },
    {
      title: t("Documentation"),
      url: createPageUrl("Documentation"),
      icon: Book,
    }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.log("User not authenticated");
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('שגיאה בהתנתקות. אנא נסה שוב.');
    }
  };

  const handleContactSupport = () => {
    const supportEmail = 'support@ticketpulse.live';
    const subject = 'TICKET PULSE Support Request';
    const body = `Hello,%0D%0A%0D%0AI need help with:%0D%0A%0D%0A[Please describe your issue or question]%0D%0A%0D%0AUser Details:%0D%0A- Email: ${currentUser?.email || 'Unknown'}%0D%0A- Name: ${currentUser?.full_name || 'Unknown'}%0D%0A- Time: ${new Date().toLocaleString()}%0D%0A- Page: ${currentPageName || 'Unknown'}%0D%0A%0D%0AThank you!`;
    
    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}body=${encodeURIComponent(body)}`;
    try {
      window.open(mailtoLink, '_self');
    } catch (error) {
      console.error('Failed to open email client:', error);
      navigator.clipboard.writeText(supportEmail).then(() => {
        alert(`Email copied to clipboard: ${supportEmail}`);
      }).catch(() => {
        alert(`Please contact support at: ${supportEmail}`);
      });
    }
  };

  const closeMobileSidebar = () => {
    setShowMobileSidebar(false);
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className={`h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden ${currentLang === 'he' ? 'rtl' : 'ltr'}`}>
        <style>
          {`
            /* Modern Clean Styles */
            .sidebar-modern {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(20px);
              border-right: 1px solid rgba(99, 102, 241, 0.1);
              box-shadow: 0 0 40px rgba(99, 102, 241, 0.05);
            }

            .nav-item-modern {
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
              border-radius: 12px;
              margin: 2px 0;
              position: relative;
              overflow: hidden;
            }

            .nav-item-modern:hover {
              background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
              transform: translateX(2px);
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
            }

            .nav-item-modern.active {
              background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%);
              border: 1px solid rgba(99, 102, 241, 0.2);
              box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
            }

            .nav-item-modern.active::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 3px;
              background: linear-gradient(to bottom, #6366f1, #8b5cf6);
              border-radius: 0 2px 2px 0;
            }

            .mobile-hamburger {
              position: fixed;
              top: 20px;
              left: 20px;
              z-index: 1000;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(99, 102, 241, 0.1);
              border-radius: 16px;
              padding: 12px;
              color: #6366f1;
              box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
              display: none;
              transition: all 0.3s ease;
            }

            .mobile-hamburger:hover {
              background: rgba(99, 102, 241, 0.05);
              transform: scale(1.05);
            }

            @media (max-width: 768px) {
              .mobile-hamburger {
                display: block;
              }
              .desktop-sidebar {
                display: none !important;
              }
            }

            .mobile-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.4);
              backdrop-filter: blur(8px);
              z-index: 900;
              opacity: 0;
              visibility: hidden;
              transition: all 0.3s ease;
            }

            .mobile-overlay.open {
              opacity: 1;
              visibility: visible;
            }

            .mobile-sidebar {
              position: fixed;
              top: 0;
              right: 0;
              height: 100vh;
              width: 320px;
              max-width: 85vw;
              background: rgba(255, 255, 255, 0.98);
              backdrop-filter: blur(20px);
              border-left: 1px solid rgba(99, 102, 241, 0.1);
              transform: translateX(100%);
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: 950;
              overflow-y: auto;
              box-shadow: -20px 0 40px rgba(99, 102, 241, 0.1);
            }

            .mobile-sidebar.open {
              transform: translateX(0);
            }

            .desktop-sidebar {
              width: 280px;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(20px);
              border-right: 1px solid rgba(99, 102, 241, 0.1);
              flex-shrink: 0;
              overflow-y: auto;
              box-shadow: 0 0 40px rgba(99, 102, 241, 0.05);
            }

            .main-content {
              flex: 1;
              min-width: 0;
              display: flex;
              flex-direction: column;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            }

            .header-modern {
              background: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(20px);
              border-bottom: 1px solid rgba(99, 102, 241, 0.08);
              box-shadow: 0 4px 20px rgba(99, 102, 241, 0.05);
            }

            .logo-section {
              background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%);
              border-bottom: 1px solid rgba(99, 102, 241, 0.08);
            }

            .stats-card {
              background: rgba(255, 255, 255, 0.9);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(99, 102, 241, 0.08);
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(99, 102, 241, 0.05);
              transition: all 0.2s ease;
            }

            .stats-card:hover {
              box-shadow: 0 8px 30px rgba(99, 102, 241, 0.1);
              transform: translateY(-2px);
            }

            .gradient-text {
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            .user-section {
              background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.02) 100%);
              border-top: 1px solid rgba(99, 102, 241, 0.08);
              border-radius: 16px 16px 0 0;
            }
          `}
        </style>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-hamburger"
          onClick={() => setShowMobileSidebar(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Overlay */}
        <div 
          className={`mobile-overlay ${showMobileSidebar ? 'open' : ''}`}
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />

        {/* Mobile Sidebar */}
        <nav className={`mobile-sidebar ${showMobileSidebar ? 'open' : ''}`} role="navigation">
          <div className="flex justify-between items-center p-6 logo-section">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg gradient-text">TICKET PULSE</h2>
                <p className="text-xs text-gray-500">Nightlife Revolution</p>
              </div>
            </div>
            <button
              onClick={closeMobileSidebar}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                onClick={closeMobileSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all nav-item-modern ${
                  location.pathname === item.url 
                    ? 'active text-indigo-700 font-medium' 
                    : 'text-gray-600 hover:text-indigo-600'
                } ${item.className || ''}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 mt-auto user-section">
            <LanguageSelector />
            <button 
              onClick={handleLogout}
              className="w-full mt-3 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t("Logout")}
            </button>
          </div>
        </nav>

        {/* Desktop Sidebar */}
        <nav className="desktop-sidebar sidebar-modern flex flex-col h-full" role="navigation">
          {/* Logo Section */}
          <div className="logo-section p-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-xl gradient-text">TICKET PULSE</h2>
                <p className="text-xs text-gray-500 mt-0.5">Nightlife Revolution</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-8">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mb-3">
                {t("Navigation")}
              </div>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all nav-item-modern group ${
                      location.pathname === item.url 
                        ? 'active text-indigo-700 font-medium' 
                        : 'text-gray-600 hover:text-indigo-600'
                    } ${item.className || ''}`}
                  >
                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Section */}
            <div className="mb-8">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mb-3">
                {t("Support")}
              </div>
              <div className="space-y-1">
                {supportItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all nav-item-modern group ${
                      location.pathname === item.url 
                        ? 'active text-emerald-700 font-medium' 
                        : 'text-gray-600 hover:text-emerald-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Live Stats */}
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mb-3">
                {t("Live Stats")}
              </div>
              <div className="space-y-3">
                <div className="stats-card p-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{t("Active Promoters")}</span>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none px-2 py-1">3</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{t("Messages Today")}</span>
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none px-2 py-1">247</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{t("Conversions")}</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-2 py-1">31</Badge>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3"></div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t("Revenue Today")}</span>
                    <span className="text-emerald-600 font-bold">₪8,420</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="user-section p-4 flex-shrink-0">
            <div 
              className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 rounded-xl p-3 transition-colors group" 
              onClick={() => window.location.href = createPageUrl("UserProfile")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-sm">
                  {currentUser ? currentUser.full_name?.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {currentUser ? currentUser.full_name : t('Loading...')}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser ? currentUser.email : '...'}
                </p>
              </div>
            </div>
            
            <LanguageSelector />
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full mt-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("Logout")}
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <header className="header-modern px-6 py-4 sticky top-0 z-30 flex-shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold gradient-text">TICKET PULSE</h1>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none px-3 py-1 rounded-full text-xs">
                  Pro
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  <Badge className="bg-red-500 text-white border-none text-xs px-1.5 py-0.5 rounded-full ml-1">3</Badge>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactSupport}
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t("Support")}
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

