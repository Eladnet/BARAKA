import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, Calendar, DollarSign, X, Star, Zap, Award, Clock } from "lucide-react";

const VENUE_TYPES = [
  { value: 'all', label: 'כל הסוגים' },
  { value: 'nightclub', label: '🎵 מועדון לילה' },
  { value: 'yacht', label: '🛥️ יאכטה' },
  { value: 'private_party', label: '🎉 מסיבה פרטית' },
  { value: 'workshop', label: '🎨 סדנה' },
  { value: 'rooftop', label: '🏙️ גג' },
  { value: 'restaurant', label: '🍽️ מסעדה' },
  { value: 'beach_club', label: '🏖️ מועדון חוף' },
  { value: 'house_party', label: '🏠 מסיבת בית' },
  { value: 'other', label: '✨ אחר' }
];

const CITIES = [
  { value: 'all', label: 'כל הערים' },
  { value: 'תל אביב', label: 'תל אביב' },
  { value: 'ירושלים', label: 'ירושלים' },
  { value: 'חיפה', label: 'חיפה' },
  { value: 'אילת', label: 'אילת' },
  { value: 'הרצליה', label: 'הרצליה' },
  { value: 'נתניה', label: 'נתניה' }
];

const DATE_RANGES = [
  { value: 'all', label: 'כל התאריכים' },
  { value: 'today', label: 'היום' },
  { value: 'tomorrow', label: 'מחר' },
  { value: 'this_week', label: 'השבוע' },
  { value: 'next_week', label: 'השבוע הבא' },
  { value: 'this_month', label: 'החודש' }
];

const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'הכל' },
  { value: 'available', label: 'יש מקומות' },
  { value: 'full', label: 'מלא' }
];

const SORT_OPTIONS = [
  { value: 'date', label: 'לפי תאריך' },
  { value: 'price', label: 'לפי מחיר' },
  { value: 'popularity', label: 'פופולריות' },
  { value: 'rating', label: 'דירוג מארח' },
  { value: 'distance', label: 'מרחק' },
  { value: 'newest', label: 'החדשים ביותר' }
];

// New: Perk filters
const PERK_FILTERS = [
  { key: 'free_drinks', label: '🍷 משקאות חינם' },
  { key: 'photography', label: '📸 צילום' },
  { key: 'live_music', label: '🎵 מוזיקה חיה' },
  { key: 'gourmet_food', label: '🍽️ אוכל גורמה' },
  { key: 'transportation', label: '🚗 הסעות' },
  { key: 'vip_access', label: '⭐ VIP' }
];

export default function SharedEventFilters({
  filters,
  onFiltersChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange
}) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState([0, 1000]);
  const [selectedPerks, setSelectedPerks] = React.useState([]);

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all') || 
                          searchTerm || 
                          selectedPerks.length > 0 ||
                          priceRange[0] > 0 || 
                          priceRange[1] < 1000;

  const clearAllFilters = () => {
    onFiltersChange({
      city: 'all',
      venue_type: 'all',
      price_range: 'all',
      date_range: 'all',
      availability: 'all',
      instant_book: false,
      verified_hosts: false,
      trending_only: false
    });
    onSearchChange('');
    setSelectedPerks([]);
    setPriceRange([0, 1000]);
  };

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const togglePerk = (perkKey) => {
    setSelectedPerks(prev => 
      prev.includes(perkKey) 
        ? prev.filter(p => p !== perkKey)
        : [...prev, perkKey]
    );
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="חפש אירועים, מקומות או ערים..."
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Quick Filters Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={filters.trending_only ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter('trending_only', !filters.trending_only)}
          className={filters.trending_only ? "bg-orange-500 hover:bg-orange-600" : "border-orange-500/50 text-orange-400 hover:bg-orange-500/20"}
        >
          <Zap className="w-3 h-3 mr-1" />
          🔥 טרנדינג
        </Button>

        <Button
          variant={filters.instant_book ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter('instant_book', !filters.instant_book)}
          className={filters.instant_book ? "bg-green-500 hover:bg-green-600" : "border-green-500/50 text-green-400 hover:bg-green-500/20"}
        >
          <Zap className="w-3 h-3 mr-1" />
          ⚡ אישור מיידי
        </Button>

        <Button
          variant={filters.verified_hosts ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter('verified_hosts', !filters.verified_hosts)}
          className={filters.verified_hosts ? "bg-blue-500 hover:bg-blue-600" : "border-blue-500/50 text-blue-400 hover:bg-blue-500/20"}
        >
          <Award className="w-3 h-3 mr-1" />
          ✓ מארחים מאומתים
        </Button>

        <Button
          variant={filters.superhosts_only ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter('superhosts_only', !filters.superhosts_only)}
          className={filters.superhosts_only ? "bg-gradient-to-r from-pink-500 to-purple-500" : "border-pink-500/50 text-pink-400 hover:bg-pink-500/20"}
        >
          <Star className="w-3 h-3 mr-1" />
          ⭐ SUPERHOST
        </Button>
      </div>

      {/* Main Filter Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
        {/* City Filter */}
        <div>
          <Select value={filters.city} onValueChange={(value) => updateFilter('city', value)}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {CITIES.map(city => (
                <SelectItem key={city.value} value={city.value} className="text-slate-300">
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Venue Type Filter */}
        <div>
          <Select value={filters.venue_type} onValueChange={(value) => updateFilter('venue_type', value)}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {VENUE_TYPES.map(venue => (
                <SelectItem key={venue.value} value={venue.value} className="text-slate-300">
                  {venue.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div>
          <Select value={filters.date_range} onValueChange={(value) => updateFilter('date_range', value)}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {DATE_RANGES.map(date => (
                <SelectItem key={date.value} value={date.value} className="text-slate-300">
                  {date.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Availability Filter */}
        <div>
          <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {AVAILABILITY_OPTIONS.map(avail => (
                <SelectItem key={avail.value} value={avail.value} className="text-slate-300">
                  {avail.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {SORT_OPTIONS.map(sort => (
                <SelectItem key={sort.value} value={sort.value} className="text-slate-300">
                  {sort.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showAdvanced ? 'פחות' : 'עוד'}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-slate-700 pt-4 mt-4 space-y-4">
          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 text-sm font-medium">טווח מחירים</label>
              <span className="text-slate-400 text-sm">
                ₪{priceRange[0]} - ₪{priceRange[1]}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>

          {/* Perks Selection */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">הטבות באירוע</label>
            <div className="flex flex-wrap gap-2">
              {PERK_FILTERS.map(perk => (
                <Button
                  key={perk.key}
                  variant={selectedPerks.includes(perk.key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePerk(perk.key)}
                  className={selectedPerks.includes(perk.key) 
                    ? "bg-purple-500 hover:bg-purple-600" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                  }
                >
                  {perk.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">משך זמן</label>
              <Select value={filters.duration || 'all'} onValueChange={(value) => updateFilter('duration', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder="כל המשכים" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-300">כל המשכים</SelectItem>
                  <SelectItem value="short" className="text-slate-300">קצר (עד 3 שעות)</SelectItem>
                  <SelectItem value="medium" className="text-slate-300">בינוני (3-6 שעות)</SelectItem>
                  <SelectItem value="long" className="text-slate-300">ארוך (מעל 6 שעות)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">גודל קבוצה</label>
              <Select value={filters.group_size || 'all'} onValueChange={(value) => updateFilter('group_size', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="כל הגדלים" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-300">כל הגדלים</SelectItem>
                  <SelectItem value="intimate" className="text-slate-300">אינטימי (2-4)</SelectItem>
                  <SelectItem value="small" className="text-slate-300">קטן (5-8)</SelectItem>
                  <SelectItem value="medium" className="text-slate-300">בינוני (9-12)</SelectItem>
                  <SelectItem value="large" className="text-slate-300">גדול (13+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">דירוג מינימלי</label>
              <Select value={filters.min_rating || 'all'} onValueChange={(value) => updateFilter('min_rating', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="כל הדירוגים" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-slate-300">כל הדירוגים</SelectItem>
                  <SelectItem value="4" className="text-slate-300">⭐ 4.0+</SelectItem>
                  <SelectItem value="4.5" className="text-slate-300">⭐ 4.5+</SelectItem>
                  <SelectItem value="4.8" className="text-slate-300">⭐ 4.8+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters & Clear Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === 'all' || value === false) return null;
              
              let label = '';
              switch(key) {
                case 'city':
                  label = CITIES.find(c => c.value === value)?.label;
                  break;
                case 'venue_type':
                  label = VENUE_TYPES.find(v => v.value === value)?.label;
                  break;
                case 'date_range':
                  label = DATE_RANGES.find(d => d.value === value)?.label;
                  break;
                case 'availability':
                  label = AVAILABILITY_OPTIONS.find(a => a.value === value)?.label;
                  break;
                case 'trending_only':
                  label = '🔥 טרנדינג';
                  break;
                case 'instant_book':
                  label = '⚡ אישור מיידי';
                  break;
                case 'verified_hosts':
                  label = '✓ מאומתים';
                  break;
                case 'superhosts_only':
                  label = '⭐ SUPERHOST';
                  break;
                default:
                  return null;
              }
              
              return (
                <Badge key={key} variant="outline" className="border-purple-500/30 text-purple-300">
                  {label}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" 
                    onClick={() => updateFilter(key, key.includes('_only') || key.includes('_hosts') ? false : 'all')}
                  />
                </Badge>
              );
            })}
            
            {selectedPerks.map(perk => {
              const perkLabel = PERK_FILTERS.find(p => p.key === perk)?.label;
              return (
                <Badge key={perk} variant="outline" className="border-purple-500/30 text-purple-300">
                  {perkLabel}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" 
                    onClick={() => togglePerk(perk)}
                  />
                </Badge>
              );
            })}
            
            {searchTerm && (
              <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                חיפוש: "{searchTerm}"
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" 
                  onClick={() => onSearchChange('')}
                />
              </Badge>
            )}

            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                ₪{priceRange[0]}-₪{priceRange[1]}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" 
                  onClick={() => setPriceRange([0, 1000])}
                />
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-slate-400 hover:text-white"
          >
            נקה הכל
          </Button>
        </div>
      )}
    </div>
  );
}