
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Music,
  Camera,
  Share2,
  Save,
  Settings,
  Ticket,
  Upload,
  X,
  Plus,
  Edit3,
  Palette,
  Globe,
  Link,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function CreateEventForm({ venues = [], onEventCreated }) {
  const [eventData, setEventData] = useState({
    // Basic Details
    name: '',
    description: '',
    category: '',
    venue_id: '',
    event_url: '',
    
    // Date and Time
    event_date: null,
    start_time: '',
    end_time: '',
    
    // Location
    location: '',
    address: '',
    
    // Pricing
    is_free: false,
    currency: 'USD',
    
    // Design
    primary_color: '#8b5cf6',
    secondary_color: '#ec4899',
    cover_image: '',
    logo_image: '',
    
    // Content
    music_genre: [],
    special_features: [],
    
    // Ticket Settings
    ticket_types: [
      { 
        name: 'General Entry', 
        price: 50, 
        quantity: 100, 
        description: 'Standard event ticket',
        color: 'blue'
      }
    ],
    
    // Advanced Settings
    max_capacity: '',
    min_age: 18,
    dress_code: '',
    parking_info: '',
    accessibility_info: '',
    
    // Publishing and Sharing
    is_public: true,
    allow_sharing: true,
    facebook_event: '',
    instagram_link: '',
    website_link: '',
    
    // Approval Settings
    requires_approval: false,
    auto_confirm: true,
    send_confirmation_email: true,
    send_reminder_email: true,
    
    // Security Settings
    age_restriction_enabled: true,
    id_verification_required: false,
    guest_list_only: false,
    invite_only: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');

  const handleInputChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTicketType = () => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newTicketType = {
      name: '',
      price: 0,
      quantity: 50,
      description: '',
      color: randomColor
    };
    setEventData(prev => ({
      ...prev,
      ticket_types: [...prev.ticket_types, newTicketType]
    }));
  };

  const updateTicketType = (index, field, value) => {
    setEventData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const removeTicketType = (index) => {
    setEventData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types.filter((_, i) => i !== index)
    }));
  };

  const handleSaveEvent = async () => {
    setIsLoading(true);
    try {
      console.log('Saving event:', eventData);
      alert('🎉 Event saved successfully!');
      
      if (onEventCreated) {
        onEventCreated();
      }
      
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`❌ Error saving event: ${error.message}`);
    }
    setIsLoading(false);
  };

  const musicGenres = [
    'Techno', 'House', 'Trance', 'Deep House', 'Progressive', 
    'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 'Dance'
  ];

  const specialFeatures = [
    'Open Bar', 'International DJ', 'Light Show', 'Professional Photography',
    'Table Service', 'VIP Area', 'Gifts', 'Live Performance',
    'Laser Show', 'Fireworks', 'Dancers', 'Acrobatic Show'
  ];

  const colorOptions = [
    '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b',
    '#ef4444', '#8b5cf6', '#6366f1', '#84cc16', '#f97316'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white text-xl">Create New Event</CardTitle>
          <p className="text-slate-400">Create a professional event with all required details</p>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-purple-500/30">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="design">Design & Images</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="publish">Publishing</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        {/* Basic Details */}
        <TabsContent value="basic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-400" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Event Name *</Label>
                  <Input
                    value={eventData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Summer Techno Festival 2024"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Full Description</Label>
                  <Textarea
                    value={eventData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the event in detail - what awaits guests, who's the DJ, what's the atmosphere..."
                    className="bg-slate-800 border-slate-700 text-white h-32"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Category</Label>
                    <Select 
                      value={eventData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="party">Party</SelectItem>
                        <SelectItem value="concert">Concert</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="club">Club</SelectItem>
                        <SelectItem value="rooftop">Rooftop</SelectItem>
                        <SelectItem value="private">Private Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Event URL</Label>
                    <Input
                      value={eventData.event_url}
                      onChange={(e) => handleInputChange('event_url', e.target.value)}
                      placeholder="summer-techno-2024"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 mb-3 block">Event Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left bg-slate-800 border-slate-700 text-white">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventData.event_date ? format(eventData.event_date, "PPP") : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                      <Calendar
                        mode="single"
                        selected={eventData.event_date}
                        onSelect={(date) => handleInputChange('event_date', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Start Time</Label>
                    <Input
                      type="time"
                      value={eventData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">End Time</Label>
                    <Input
                      type="time"
                      value={eventData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Event Venue</Label>
                  <Select 
                    value={eventData.venue_id} 
                    onValueChange={(value) => handleInputChange('venue_id', value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select Venue" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {venues && venues.length > 0 ? (
                        venues.map(venue => (
                          <SelectItem key={venue.id} value={venue.id} className="text-slate-300">
                            {venue.name} - {venue.city}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-venues" disabled className="text-slate-500">
                          No venues available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Design & Images */}
        <TabsContent value="design">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-400" />
                  Design & Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 mb-3 block">Primary Color</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          eventData.primary_color === color ? 'border-white' : 'border-slate-600'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleInputChange('primary_color', color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={eventData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-full h-12 bg-slate-800 border-slate-700"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300 mb-3 block">Secondary Color</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          eventData.secondary_color === color ? 'border-white' : 'border-slate-600'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleInputChange('secondary_color', color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={eventData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-full h-12 bg-slate-800 border-slate-700"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-400" />
                  Images & Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 mb-3 block">Cover Image</Label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm mb-4">Drag image or enter link</p>
                    <Input
                      type="url"
                      value={eventData.cover_image}
                      onChange={(e) => handleInputChange('cover_image', e.target.value)}
                      placeholder="https://example.com/cover.jpg"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-slate-300 mb-3 block">Event Logo</Label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center">
                    <Input
                      type="url"
                      value={eventData.logo_image}
                      onChange={(e) => handleInputChange('logo_image', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  Music Genres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {musicGenres.map(genre => (
                    <Badge
                      key={genre}
                      variant={eventData.music_genre.includes(genre) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        eventData.music_genre.includes(genre)
                          ? 'bg-purple-600 text-white'
                          : 'border-slate-600 text-slate-300 hover:bg-purple-500/20'
                      }`}
                      onClick={() => {
                        if (eventData.music_genre.includes(genre)) {
                          handleInputChange('music_genre', eventData.music_genre.filter(g => g !== genre));
                        } else {
                          handleInputChange('music_genre', [...eventData.music_genre, genre]);
                        }
                      }}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Special Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {specialFeatures.map(feature => (
                    <Badge
                      key={feature}
                      variant={eventData.special_features.includes(feature) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        eventData.special_features.includes(feature)
                          ? 'bg-emerald-600 text-white'
                          : 'border-slate-600 text-slate-300 hover:bg-emerald-500/20'
                      }`}
                      onClick={() => {
                        if (eventData.special_features.includes(feature)) {
                          handleInputChange('special_features', eventData.special_features.filter(f => f !== feature));
                        } else {
                          handleInputChange('special_features', [...eventData.special_features, feature]);
                        }
                      }}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tickets */}
        <TabsContent value="tickets">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-400" />
                Ticket Management & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-6">
                <Switch
                  checked={eventData.is_free}
                  onCheckedChange={(checked) => handleInputChange('is_free', checked)}
                />
                <Label className="text-slate-300">Free Event</Label>
              </div>
              
              {!eventData.is_free && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Label className="text-slate-300">Currency:</Label>
                    <Select 
                      value={eventData.currency} 
                      onValueChange={(value) => handleInputChange('currency', value)}
                    >
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="USD">$ USD</SelectItem>
                        <SelectItem value="ILS">₪ ILS</SelectItem>
                        <SelectItem value="EUR">€ EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {eventData.ticket_types.map((ticket, index) => (
                    <div key={index} className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <Label className="text-slate-300 text-sm">Ticket Name</Label>
                          <Input
                            value={ticket.name}
                            onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                            placeholder="General Entry"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300 text-sm">Price ({eventData.currency === 'ILS' ? '₪' : eventData.currency === 'USD' ? '$' : '€'})</Label>
                          <Input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                            placeholder="50"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300 text-sm">Quantity</Label>
                          <Input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                            placeholder="100"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300 text-sm">Ticket Color</Label>
                          <Select 
                            value={ticket.color} 
                            onValueChange={(value) => updateTicketType(index, 'color', value)}
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                              <SelectItem value="pink">Pink</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTicketType(index)}
                            className="text-red-400 hover:text-red-300"
                            disabled={eventData.ticket_types.length === 1}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label className="text-slate-300 text-sm">Ticket Description</Label>
                        <Textarea
                          value={ticket.description}
                          onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                          placeholder="Describe what's included with this ticket..."
                          className="bg-slate-800 border-slate-700 text-white h-20"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addTicketType}
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Ticket Type
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Maximum Capacity</Label>
                  <Input
                    type="number"
                    value={eventData.max_capacity}
                    onChange={(e) => handleInputChange('max_capacity', e.target.value)}
                    placeholder="500"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Minimum Age</Label>
                  <Select 
                    value={eventData.min_age.toString()} 
                    onValueChange={(value) => handleInputChange('min_age', parseInt(value))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="16">16+</SelectItem>
                      <SelectItem value="18">18+</SelectItem>
                      <SelectItem value="21">21+</SelectItem>
                      <SelectItem value="25">25+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-slate-300">Dress Code</Label>
                  <Input
                    value={eventData.dress_code}
                    onChange={(e) => handleInputChange('dress_code', e.target.value)}
                    placeholder="Elegant, Smart Casual, Casual"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Parking Information</Label>
                  <Textarea
                    value={eventData.parking_info}
                    onChange={(e) => handleInputChange('parking_info', e.target.value)}
                    placeholder="Information about parking options..."
                    className="bg-slate-800 border-slate-700 text-white h-20"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Approval Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Requires Manual Approval</Label>
                    <p className="text-xs text-slate-500">Every purchase requires admin approval</p>
                  </div>
                  <Switch
                    checked={eventData.requires_approval}
                    onCheckedChange={(checked) => handleInputChange('requires_approval', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Auto Confirmation</Label>
                    <p className="text-xs text-slate-500">Immediate confirmation for purchases</p>
                  </div>
                  <Switch
                    checked={eventData.auto_confirm}
                    onCheckedChange={(checked) => handleInputChange('auto_confirm', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Send Confirmation Email</Label>
                    <p className="text-xs text-slate-500">Email with ticket details</p>
                  </div>
                  <Switch
                    checked={eventData.send_confirmation_email}
                    onCheckedChange={(checked) => handleInputChange('send_confirmation_email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Send Reminder Email</Label>
                    <p className="text-xs text-slate-500">Reminder 24 hours before event</p>
                  </div>
                  <Switch
                    checked={eventData.send_reminder_email}
                    onCheckedChange={(checked) => handleInputChange('send_reminder_email', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Publishing */}
        <TabsContent value="publish">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-pink-400" />
                  Publishing Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Public Event</Label>
                  <Switch
                    checked={eventData.is_public}
                    onCheckedChange={(checked) => handleInputChange('is_public', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Allow Sharing</Label>
                  <Switch
                    checked={eventData.allow_sharing}
                    onCheckedChange={(checked) => handleInputChange('allow_sharing', checked)}
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Facebook Event Link</Label>
                  <Input
                    type="url"
                    value={eventData.facebook_event}
                    onChange={(e) => handleInputChange('facebook_event', e.target.value)}
                    placeholder="https://facebook.com/events/..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Instagram Link</Label>
                  <Input
                    type="url"
                    value={eventData.instagram_link}
                    onChange={(e) => handleInputChange('instagram_link', e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Event Website</Label>
                  <Input
                    type="url"
                    value={eventData.website_link}
                    onChange={(e) => handleInputChange('website_link', e.target.value)}
                    placeholder="https://..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-6 rounded-lg text-white relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(45deg, ${eventData.primary_color}, ${eventData.secondary_color})` 
                  }}
                >
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">{eventData.name || 'Event Name'}</h3>
                    <p className="text-sm opacity-90 mb-4">
                      {eventData.description || 'Event description will appear here...'}
                    </p>
                    <div className="flex gap-2 mb-4">
                      {eventData.music_genre.slice(0, 3).map(genre => (
                        <Badge key={genre} className="bg-white/20 text-white">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm">
                      📅 {eventData.event_date ? format(eventData.event_date, "dd/MM/yyyy") : 'Date'}
                      {eventData.start_time && ` • ⏰ ${eventData.start_time}`}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Validation */}
        <TabsContent value="validation">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Security Settings & Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Age Restriction Enabled</Label>
                      <p className="text-xs text-slate-500">Age verification at entry</p>
                    </div>
                    <Switch
                      checked={eventData.age_restriction_enabled}
                      onCheckedChange={(checked) => handleInputChange('age_restriction_enabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">ID Verification Required</Label>
                      <p className="text-xs text-slate-500">Must show ID document</p>
                    </div>
                    <Switch
                      checked={eventData.id_verification_required}
                      onCheckedChange={(checked) => handleInputChange('id_verification_required', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Guest List Only</Label>
                      <p className="text-xs text-slate-500">Entry only for those on the list</p>
                    </div>
                    <Switch
                      checked={eventData.guest_list_only}
                      onCheckedChange={(checked) => handleInputChange('guest_list_only', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Invite Only Event</Label>
                      <p className="text-xs text-slate-500">Only invited can purchase</p>
                    </div>
                    <Switch
                      checked={eventData.invite_only}
                      onCheckedChange={(checked) => handleInputChange('invite_only', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings Summary */}
              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-3">Security Settings Summary:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {eventData.age_restriction_enabled ? 
                      <CheckCircle className="w-4 h-4 text-green-400" /> : 
                      <X className="w-4 h-4 text-gray-400" />
                    }
                    <span className="text-slate-300">Age restriction: {eventData.min_age}+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {eventData.id_verification_required ? 
                      <CheckCircle className="w-4 h-4 text-green-400" /> : 
                      <X className="w-4 h-4 text-gray-400" />
                    }
                    <span className="text-slate-300">ID verification required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {eventData.guest_list_only ? 
                      <CheckCircle className="w-4 h-4 text-yellow-400" /> : 
                      <X className="w-4 h-4 text-gray-400" />
                    }
                    <span className="text-slate-300">Guest list only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {eventData.invite_only ? 
                      <CheckCircle className="w-4 h-4 text-red-400" /> : 
                      <X className="w-4 h-4 text-gray-400" />
                    }
                    <span className="text-slate-300">Invite only</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-600 text-slate-300">
                Save as Draft
              </Button>
              <Button variant="outline" className="border-blue-500/50 text-blue-300">
                Preview
              </Button>
            </div>
            
            <Button
              onClick={handleSaveEvent}
              disabled={isLoading || !eventData.name || !eventData.event_date}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Creating Event...' : 'Create & Publish Event'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
