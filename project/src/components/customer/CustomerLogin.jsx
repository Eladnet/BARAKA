import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Loader2, Crown, Eye, EyeOff } from "lucide-react";
import { Lead } from "@/api/entities";

export default function CustomerLogin({ open, onOpenChange, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('אנא הכניסו כתובת אימייל');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('פורמט אימייל לא תקין');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // בדיקה מיוחדת לאלעד
      if (email.toLowerCase() === 'elad@bigcohen.com') {
        if (password !== 'Elad123') {
          setError('סיסמה שגויה');
          setIsLoading(false);
          return;
        }
        
        // יצירת נתוני משתמש VIP לאלעד
        const userData = {
          id: 'elad_vip_001',
          full_name: 'אלעד כהן',
          email: 'elad@bigcohen.com',
          role: 'customer',
          customer_id: 'elad_vip_001',
          phone: '052-999-4040',
          location: 'תל אביב',
          birthday: '1990-01-01',
          gender: 'male',
          interests: ['מוזיקה', 'מועדונים', 'טכנולוגיה', 'השקעות'],
          music_preferences: ['אלקטרוניקה', 'היפ הופ', 'house'],
          settings: {
            marketing_consent: true,
            notifications_enabled: true,
            preferred_language: 'he'
          },
          created_date: new Date().toISOString(),
          vip_status: 'ambassador'
        };

        localStorage.setItem('nocturne_customer', JSON.stringify(userData));
        onSuccess(userData);
        setEmail('');
        setPassword('');
        return;
      }

      // חיפוש לקוח רגיל במערכת הלידים
      const leads = await Lead.filter({ email: email.toLowerCase() });
      
      if (leads.length === 0) {
        setError('כתובת אימייל לא נמצאה במערכת. אנא הירשמו כלקוח חדש.');
        setIsLoading(false);
        return;
      }

      const lead = leads[0];

      // יצירת נתוני משתמש לכניסה
      const userData = {
        id: lead.id,
        full_name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
        email: lead.email,
        role: 'customer',
        customer_id: lead.id,
        phone: lead.phone_number || '',
        location: lead.location || '',
        birthday: lead.birthday || '',
        gender: lead.gender || '',
        interests: lead.interests || [],
        music_preferences: lead.music_preferences || [],
        settings: {
          marketing_consent: lead.marketing_consent || false,
          notifications_enabled: true,
          preferred_language: 'he'
        },
        created_date: lead.created_date
      };

      localStorage.setItem('nocturne_customer', JSON.stringify(userData));
      onSuccess(userData);
      setEmail('');
      setPassword('');

    } catch (error) {
      console.error('Login failed:', error);
      setError('שגיאה בכניסה למערכת. אנא נסו שוב.');
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
            <User className="w-6 h-6 text-purple-400" />
            כניסה למועדון
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center">
            התחברו לחשבון הלקוח שלכם ב-NocturneAI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">כתובת אימייל</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elad@bigcohen.com"
                className="bg-slate-800 border-slate-700 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">סיסמה</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הכניסו סיסמה"
                  className="bg-slate-800 border-slate-700 text-white pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleLogin}
              disabled={!email || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  מתחבר...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  כניסה למועדון
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              עדיין לא חברים במועדון?
            </p>
            <Button
              variant="link"
              onClick={() => {
                onOpenChange(false);
                // כאן נפתח את דיאלוג ההרשמה
              }}
              className="text-purple-400 hover:text-purple-300 p-0 h-auto"
            >
              הצטרפו עכשיו חינם!
            </Button>
          </div>

          {/* Demo Credentials */}
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">נתוני התחברות לדוגמה:</p>
            <p className="text-xs text-purple-300 font-mono">elad@bigcohen.com</p>
            <p className="text-xs text-purple-300 font-mono">Elad123</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}