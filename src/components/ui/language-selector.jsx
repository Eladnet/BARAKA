import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = React.useState(
    () => localStorage.getItem('nocturne-language') || 'en'
  );

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' }
  ];

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('nocturne-language', langCode);
    
    // Update document direction for RTL support
    document.documentElement.dir = langCode === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
    
    // Reload page to apply translations
    window.location.reload();
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          <Globe className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            <span className="mr-2">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {currentLang === language.code && (
              <Check className="w-4 h-4 text-emerald-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}