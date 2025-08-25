import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Sparkles, Zap, Moon, Sun, Star, Flame, Waves, Eye } from "lucide-react";
import { useTheme } from "./theme-provider";

const THEME_SKINS = {
  nocturne: {
    name: "Nocturne Purple",
    description: "הנושא המקורי בסגול כהה ועמוק",
    icon: Moon,
    preview: "from-slate-900 via-purple-900 to-slate-900",
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899", 
      accent: "#06b6d4",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f8fafc"
    }
  },
  
  galacticNeon: {
    name: "Galactic Neon",
    description: "עיצוב פוטוריסטי בצבעי ניאון גלקטיים",
    icon: Sparkles,
    preview: "from-indigo-900 via-purple-800 to-pink-900",
    colors: {
      primary: "#00ffff",
      secondary: "#ff00ff",
      accent: "#ffff00",
      background: "#0a0a0f",
      surface: "#1a1a2e",
      text: "#ffffff"
    }
  },

  tableresque: {
    name: "Tableresque Pro",
    description: "עיצוב נקי ומינימליסטי בהשראת Tabler",
    icon: Eye,
    preview: "from-slate-50 to-blue-50",
    colors: {
      primary: "#0054a6",
      secondary: "#74b816",
      accent: "#f59e0b", 
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b"
    }
  },

  cyberpunk: {
    name: "Cyberpunk Edge",
    description: "אסתטיקה סייברפאנק בירוק ורוד",
    icon: Zap,
    preview: "from-green-900 via-black to-pink-900",
    colors: {
      primary: "#00ff41",
      secondary: "#ff0080",
      accent: "#ffd700",
      background: "#000000",
      surface: "#0d1117",
      text: "#00ff41"
    }
  },

  oceanBreeze: {
    name: "Ocean Breeze",
    description: "גווני אוקיינוס רגועים וכחולים",
    icon: Waves,
    preview: "from-blue-900 via-teal-800 to-cyan-900",
    colors: {
      primary: "#0891b2",
      secondary: "#0d9488",
      accent: "#06b6d4",
      background: "#0c4a6e",
      surface: "#164e63",
      text: "#f0f9ff"
    }
  },

  sunsetFlame: {
    name: "Sunset Flame",
    description: "גווני שקיעה חמים וזוהרים",
    icon: Flame,
    preview: "from-orange-800 via-red-700 to-pink-800",
    colors: {
      primary: "#ea580c",
      secondary: "#dc2626",
      accent: "#f59e0b",
      background: "#7c2d12",
      surface: "#9a3412",
      text: "#fff7ed"
    }
  },

  cosmicDust: {
    name: "Cosmic Dust",
    description: "אבק קוסמי בסגול וזהב מסתורי",
    icon: Star,
    preview: "from-violet-900 via-purple-800 to-indigo-900",
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#fbbf24",
      background: "#2e1065",
      surface: "#3730a3",
      text: "#f3e8ff"
    }
  }
};

export default function ThemeCustomizer({ isOpen, onClose }) {
  const { theme, setTheme, customColors, setCustomColors } = useTheme();
  const [selectedSkin, setSelectedSkin] = useState('nocturne');
  const [previewSkin, setPreviewSkin] = useState(null);

  const applySkin = (skinKey) => {
    const skin = THEME_SKINS[skinKey];
    if (!skin) return;

    console.log('Applying skin:', skinKey, skin);

    // Apply custom CSS variables to root
    const root = document.documentElement;
    
    // Clear existing custom properties first
    const existingProps = ['--primary', '--secondary', '--accent', '--background', '--surface', '--text'];
    existingProps.forEach(prop => {
      root.style.removeProperty(prop);
      root.style.removeProperty(`--color${prop.replace('--', '-')}`);
    });

    // Apply new colors
    Object.entries(skin.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply specific background gradient
    if (skinKey === 'tableresque') {
      document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)');
    } else if (skinKey === 'galacticNeon') {
      document.body.style.background = 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)';
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)');
    } else if (skinKey === 'cyberpunk') {
      document.body.style.background = 'linear-gradient(135deg, #000000 0%, #0d1117 50%, #001122 100%)';
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #000000 0%, #0d1117 50%, #001122 100%)');
    } else if (skinKey === 'oceanBreeze') {
      document.body.style.background = 'linear-gradient(135deg, #0c4a6e 0%, #164e63 50%, #0891b2 100%)';
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #0c4a6e 0%, #164e63 50%, #0891b2 100%)');
    } else if (skinKey === 'sunsetFlame') {
      document.body.style.background = 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #ea580c 100%)';
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #ea580c 100%)');
    } else if (skinKey === 'cosmicDust') {
      document.body.style.background = 'linear-gradient(135deg, #2e1065 0%, #3730a3 50%, #7c3aed 100%)';
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #2e1065 0%, #3730a3 50%, #7c3aed 100%)');
    } else {
      // Default nocturne
      document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)';
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)');
    }

    // Update theme state
    setCustomColors(skin.colors);
    setSelectedSkin(skinKey);
    
    // Store in localStorage
    localStorage.setItem('nocturne-selected-skin', skinKey);
    
    // Force reload to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleUpgrade = () => {
    // Show upgrade modal or redirect
    alert('🚀 שדרוג ל-Pro בקרוב!\n\nתכונות Pro:\n✨ נושאים מותאמים אישית\n🎨 יצירת נושאים חדשים\n💾 שמירת נושאים\n🌍 שתף נושאים עם הקהילה\n\nהישאר מעודכן!');
  };

  React.useEffect(() => {
    // Load saved skin on mount
    const savedSkin = localStorage.getItem('nocturne-selected-skin');
    if (savedSkin && THEME_SKINS[savedSkin]) {
      setSelectedSkin(savedSkin);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-slate-900/95 backdrop-blur-xl border-purple-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-xl">
            <Palette className="w-6 h-6 text-purple-400" />
            TICKET PULSE Theme Studio
          </DialogTitle>
          <p className="text-slate-400">
            בחר skin שמתאים לסגנון שלך והפוך את החוויה לייחודית
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Current Active Theme */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white text-lg">🎨 נושא פעיל כרגע</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${THEME_SKINS[selectedSkin]?.preview} border-2`} 
                     style={{ borderColor: THEME_SKINS[selectedSkin]?.colors.primary }} />
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {THEME_SKINS[selectedSkin]?.name}
                  </h3>
                  <p className="text-slate-400">
                    {THEME_SKINS[selectedSkin]?.description}
                  </p>
                </div>
                <Badge className="mr-auto bg-green-500/20 text-green-300 border-green-500/30">
                  פעיל
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(THEME_SKINS).map(([key, skin]) => {
              const IconComponent = skin.icon;
              const isActive = selectedSkin === key;
              
              return (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isActive 
                      ? 'bg-slate-800/80 border-2 border-purple-500' 
                      : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
                  }`}
                  onClick={() => applySkin(key)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: skin.colors.primary + '20' }}
                        >
                          <IconComponent 
                            className="w-4 h-4" 
                            style={{ color: skin.colors.primary }}
                          />
                        </div>
                        <CardTitle className="text-white text-sm font-semibold">
                          {skin.name}
                        </CardTitle>
                      </div>
                      {isActive && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                          פעיל
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-slate-300 text-xs">
                      {skin.description}
                    </p>
                    
                    {/* Color Palette Preview */}
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20" 
                        style={{ backgroundColor: skin.colors.primary }}
                        title="Primary"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20" 
                        style={{ backgroundColor: skin.colors.secondary }}
                        title="Secondary"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20" 
                        style={{ backgroundColor: skin.colors.accent }}
                        title="Accent"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20" 
                        style={{ backgroundColor: skin.colors.surface }}
                        title="Surface"
                      />
                    </div>
                    
                    {/* Preview Mini Components */}
                    <div className="space-y-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ backgroundColor: skin.colors.primary + '40' }}
                      />
                      <div className="flex gap-1">
                        <div 
                          className="flex-1 h-1 rounded"
                          style={{ backgroundColor: skin.colors.secondary + '60' }}
                        />
                        <div 
                          className="flex-1 h-1 rounded"
                          style={{ backgroundColor: skin.colors.accent + '60' }}
                        />
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full mt-3 text-xs hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: skin.colors.primary,
                        color: skin.name === 'Tableresque Pro' ? '#ffffff' : skin.colors.background,
                        border: 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        applySkin(key);
                      }}
                    >
                      {isActive ? '✅ פעיל' : '🎨 החל נושא'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pro Features Teaser */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">TICKET PULSE Pro Themes</h3>
                  <p className="text-slate-300">
                    משתמשי Pro יכולים ליצור נושאים מותאמים אישית, לשמור את הנושאים שלהם ולייבא נושאים מהקהילה
                  </p>
                </div>
                <Button 
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  שדרג ל-Pro
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-slate-400 text-sm">
            <p>✨ חווית עיצוב מתקדמת ע"י TICKET PULSE Theme Studio</p>
            <p className="mt-1">כל הנושאים מותאמים במיוחד לחוויית המשתמש הטובה ביותר</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}