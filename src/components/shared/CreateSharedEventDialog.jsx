import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Settings,
  Share2,
  X,
  Plus,
  Clock
} from "lucide-react";

const VENUE_TYPES = [
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
  'תל אביב', 'ירושלים', 'חיפה', 'אילת', 'הרצליה', 'נתניה', 'באר שבע', 'רמת גן', 'פתח תקווה', 'אשדוד'
];

const DRESS_CODES = [
  { value: 'casual', label: 'קז׳ואל' },
  { value: 'smart_casual', label: 'חצי פורמלי' },
  { value: 'elegant', label: 'אלגנטי' },
  { value: 'formal', label: 'פורמלי' },
  { value: 'party', label: 'מסיבה' }
];

export default function CreateSharedEventDialog({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    event_title: '',
    event_description: '',
    venue_type: '',
    venue_name: '',
    venue_address: '',
    city: '',
    event_date: '',
    event_time: '',
    total_seats: 4,
    price_per_person: 100,
    total_table_cost: 400,
    age_restriction: { min_age: 18, max_age: null },
    gender_restriction: 'none',
    dress_code: 'casual',
    approval_type: 'manual',
    special_requirements: [],
    special_notes: '',
    meeting_point: '',
    cancellation_policy: 'moderate',
    tags: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [step, setStep] = useState(1);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate total cost when seats or price changes
    if (field === 'total_seats' || field === 'price_per_person') {
      const seats = field === 'total_seats' ? value : formData.total_seats;
      const price = field === 'price_per_person' ? value : formData.price_per_person;
      setFormData(prev => ({ ...prev, total_table_cost: seats * price }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim() && !formData.special_requirements.includes(currentRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        special_requirements: [...prev.special_requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (reqToRemove) => {
    setFormData(prev => ({
      ...prev,
      special_requirements: prev.special_requirements.filter(req => req !== reqToRemove)
    }));
  };

  const handleSubmit = () => {
    // Combine date and time
    const eventDateTime = new Date(`${formData.event_date}T${formData.event_time}`);
    
    const eventData = {
      ...formData,
      event_date: eventDateTime.toISOString(),
      commission_percentage: 10 // Default platform commission
    };
    
    onSubmit(eventData);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.event_title && formData.venue_type && formData.city;
      case 2:
        return formData.event_date && formData.event_time && formData.total_seats > 0 && formData.price_per_person > 0;
      case 3:
        return true; // Optional settings
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-900/95 backdrop-blur-xl border-purple-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-xl">
            <Users className="w-6 h-6 text-purple-400" />
            צור שולחן משותף
          </DialogTitle>
          <p className="text-slate-400">
            יצירת אירוע חדש לשיתוף שולחן עם אנשים אחרים
          </p>
        </DialogHeader>

        <div className="mt-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNum ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 ${step > stepNum ? 'bg-purple-500' : 'bg-slate-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">פרטים בסיסיים</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">שם האירוע *</Label>
                  <Input
                    value={formData.event_title}
                    onChange={(e) => handleInputChange('event_title', e.target.value)}
                    placeholder="למשל: ערב יין בנמל..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">סוג המקום *</Label>
                  <Select value={formData.venue_type} onValueChange={(value) => handleInputChange('venue_type', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="בחר סוג מקום" />
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

                <div className="space-y-2">
                  <Label className="text-slate-300">שם המקום</Label>
                  <Input
                    value={formData.venue_name}
                    onChange={(e) => handleInputChange('venue_name', e.target.value)}
                    placeholder="למשל: מסעדת תמר..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">עיר *</Label>
                  <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="בחר עיר" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {CITIES.map(city => (
                        <SelectItem key={city} value={city} className="text-slate-300">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">כתובת</Label>
                <Input
                  value={formData.venue_address}
                  onChange={(e) => handleInputChange('venue_address', e.target.value)}
                  placeholder="כתובת מלאה של המקום"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">תיאור האירוע</Label>
                <Textarea
                  value={formData.event_description}
                  onChange={(e) => handleInputChange('event_description', e.target.value)}
                  placeholder="ספר על האירוע, מה מיוחד בו..."
                  className="bg-slate-800 border-slate-700 text-white h-24"
                />
              </div>
            </div>
          )}

          {/* Step 2: Date, Time & Cost */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">תאריך, שעה ומחיר</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">תאריך *</Label>
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">שעה *</Label>
                  <Input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => handleInputChange('event_time', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">מספר מקומות *</Label>
                  <Input
                    type="number"
                    value={formData.total_seats}
                    onChange={(e) => handleInputChange('total_seats', parseInt(e.target.value))}
                    min="2"
                    max="20"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">מחיר לאדם (₪) *</Label>
                  <Input
                    type="number"
                    value={formData.price_per_person}
                    onChange={(e) => handleInputChange('price_per_person', parseInt(e.target.value))}
                    min="10"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">סיכום עלויות</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>עלות כוללת לשולחן:</span>
                    <span>₪{formData.total_table_cost}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>עמלת המערכת (10%):</span>
                    <span>₪{Math.round(formData.total_table_cost * 0.1)}</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-medium">
                    <span>תקבל:</span>
                    <span>₪{Math.round(formData.total_table_cost * 0.9)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Advanced Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">הגדרות מתקדמות</h3>
              
              <Tabs defaultValue="restrictions" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                  <TabsTrigger value="restrictions">הגבלות</TabsTrigger>
                  <TabsTrigger value="settings">הגדרות</TabsTrigger>
                  <TabsTrigger value="tags">תגיות</TabsTrigger>
                </TabsList>

                <TabsContent value="restrictions" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">גיל מינימום</Label>
                      <Input
                        type="number"
                        value={formData.age_restriction.min_age}
                        onChange={(e) => handleInputChange('age_restriction', {
                          ...formData.age_restriction,
                          min_age: parseInt(e.target.value)
                        })}
                        min="16"
                        max="99"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">קוד לבוש</Label>
                      <Select 
                        value={formData.dress_code} 
                        onValueChange={(value) => handleInputChange('dress_code', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {DRESS_CODES.map(dress => (
                            <SelectItem key={dress.value} value={dress.value} className="text-slate-300">
                              {dress.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">דרישות מיוחדות</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentRequirement}
                        onChange={(e) => setCurrentRequirement(e.target.value)}
                        placeholder="הוסף דרישה..."
                        className="bg-slate-800 border-slate-700 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                      />
                      <Button onClick={addRequirement} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.special_requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300">
                          {req}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => removeRequirement(req)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">אישור אוטומטי</Label>
                      <p className="text-sm text-slate-400">אשר משתתפים אוטומטית ללא צורך באישור ידני</p>
                    </div>
                    <Switch
                      checked={formData.approval_type === 'auto'}
                      onCheckedChange={(checked) => 
                        handleInputChange('approval_type', checked ? 'auto' : 'manual')
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">נקודת מפגש</Label>
                    <Input
                      value={formData.meeting_point}
                      onChange={(e) => handleInputChange('meeting_point', e.target.value)}
                      placeholder="איפה להיפגש לפני הכניסה..."
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">הערות מיוחדות</Label>
                    <Textarea
                      value={formData.special_notes}
                      onChange={(e) => handleInputChange('special_notes', e.target.value)}
                      placeholder="מידע נוסף שחשוב למשתתפים לדעת..."
                      className="bg-slate-800 border-slate-700 text-white h-20"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="tags" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">תגיות לאירוע</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="הוסף תגית..."
                        className="bg-slate-800 border-slate-700 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400">
                      תגיות עוזרות לאנשים למצוא את האירוע שלך (למשל: יין, מוזיקה, רווקות...)
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300">
                          {tag}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="border-slate-600 text-slate-300"
            >
              {step > 1 ? 'הקודם' : 'ביטול'}
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                הבא
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Users className="w-4 h-4 mr-2" />
                צור אירוע
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}