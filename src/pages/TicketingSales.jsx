import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Ticket,
  Crown,
  Music,
  Star,
  Plus,
  Settings,
  BarChart3,
  Download,
  QrCode,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Copy
} from "lucide-react";
import { TicketEvent } from "@/api/entities";
import { TicketType } from "@/api/entities";
import { TicketPurchase } from "@/api/entities";

export default function TicketingSalesPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newEvent, setNewEvent] = useState({
    event_code: '',
    event_name_he: '',
    event_name_en: '',
    event_date: '',
    venue_name: '',
    venue_address: '',
    venue_capacity: '',
    organizer_name: '',
    organizer_email: '',
    organizer_phone: '',
    event_description: ''
  });

  const [newTicket, setNewTicket] = useState({
    ticket_code: '',
    label_he: '',
    label_en: '',
    category: 'general',
    price: '',
    quantity_total: '',
    sale_start_date: '',
    sale_end_date: '',
    perks: [],
    description: '',
    vip_level: 'standard',
    max_guests: 1
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadTicketTypes();
      loadPurchases();
    }
  }, [selectedEvent]);

  const loadEvents = async () => {
    try {
      const eventsList = await TicketEvent.list('-created_date', 50);
      setEvents(eventsList);
      if (eventsList.length > 0 && !selectedEvent) {
        setSelectedEvent(eventsList[0]);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setIsLoading(false);
  };

  const loadTicketTypes = async () => {
    if (!selectedEvent) return;
    try {
      const types = await TicketType.filter({ event_id: selectedEvent.id });
      setTicketTypes(types);
    } catch (error) {
      console.error('Error loading ticket types:', error);
    }
  };

  const loadPurchases = async () => {
    if (!selectedEvent) return;
    try {
      const purchasesList = await TicketPurchase.filter({ event_id: selectedEvent.id });
      setPurchases(purchasesList);
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  };

  const createEvent = async () => {
    try {
      const eventData = {
        ...newEvent,
        event_code: newEvent.event_code || `EVENT_${Date.now()}`,
        venue_capacity: parseInt(newEvent.venue_capacity) || 0,
        status: 'draft'
      };

      const createdEvent = await TicketEvent.create(eventData);
      await loadEvents();
      setSelectedEvent(createdEvent);
      setShowCreateEvent(false);
      setNewEvent({
        event_code: '',
        event_name_he: '',
        event_name_en: '',
        event_date: '',
        venue_name: '',
        venue_address: '',
        venue_capacity: '',
        organizer_name: '',
        organizer_email: '',
        organizer_phone: '',
        event_description: ''
      });

      // Create sample tickets for demo
      await createSampleTickets(createdEvent.id);
      await loadTicketTypes();

      alert('🎉 האירוע נוצר בהצלחה! נוספו כרטיסים לדוגמה.');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('שגיאה ביצירת האירוע');
    }
  };

  const createSampleTickets = async (eventId) => {
    const sampleTickets = [
      {
        event_id: eventId,
        ticket_code: 'GA_EARLY',
        label_he: 'כרטיס רגיל – מכירה מוקדמת',
        label_en: 'General Admission – Early Bird',
        category: 'general',
        price: 120,
        quantity_total: 300,
        quantity_available: 300,
        early_bird: true,
        perks: ['כניסה לאירוע', 'מחיר מיוחד'],
        description: 'כרטיס כניסה רגיל במחיר מכירה מוקדמת'
      },
      {
        event_id: eventId,
        ticket_code: 'GA_SECOND',
        label_he: 'כרטיס רגיל – מכירה שנייה',
        label_en: 'General Admission – Second Release',
        category: 'general',
        price: 150,
        quantity_total: 400,
        quantity_available: 400,
        sale_after_ticket: 'GA_EARLY',
        perks: ['כניסה לאירוע'],
        description: 'כרטיס כניסה רגיל - מכירה שנייה'
      },
      {
        event_id: eventId,
        ticket_code: 'VIP_TICKET',
        label_he: 'כרטיס VIP',
        label_en: 'VIP Ticket',
        category: 'vip',
        price: 350,
        quantity_total: 150,
        quantity_available: 150,
        vip_level: 'gold',
        perks: ['כניסה לאזור VIP', 'מסלול מהיר', 'גישה לבר פרטי', 'שירות אישי'],
        access_areas: ['vip_area', 'main_floor', 'bar_area'],
        description: 'חוויית VIP מלאה עם הטבות מיוחדות'
      },
      {
        event_id: eventId,
        ticket_code: 'BACKSTAGE',
        label_he: 'כרטיס Backstage',
        label_en: 'Backstage Pass',
        category: 'backstage',
        price: 600,
        quantity_total: 50,
        quantity_available: 50,
        vip_level: 'platinum',
        limited_edition: true,
        perks: ['גישה לבקסטייג׳', 'מפגש עם אמנים', 'חדר VIP אישי', 'צלמניה', 'מזכרת בלעדית'],
        access_areas: ['backstage', 'vip_area', 'main_floor', 'all_bars'],
        description: 'גישה בלעדית לבקסטייג׳ וחוויות מיוחדות'
      },
      {
        event_id: eventId,
        ticket_code: 'TABLE_SILVER',
        label_he: 'שולחן SILVER (4 אנשים)',
        label_en: 'SILVER Table (4 guests)',
        category: 'table',
        price: 2000,
        quantity_total: 10,
        quantity_available: 10,
        max_guests: 4,
        vip_level: 'silver',
        perks: ['בקבוק פרימיום', 'מלצרית אישית', 'שולחן שמור', 'כניסה מהירה'],
        description: 'שולחן פרטי ל-4 אורחים עם שירות מלא'
      },
      {
        event_id: eventId,
        ticket_code: 'TABLE_GOLD',
        label_he: 'שולחן GOLD (6 אנשים)',
        label_en: 'GOLD Table (6 guests)',
        category: 'table',
        price: 3000,
        quantity_total: 8,
        quantity_available: 8,
        max_guests: 6,
        vip_level: 'gold',
        perks: ['2 בקבוקי פרימיום', 'שלט שולחן', 'פלטת פירות', 'מלצרית אישית', 'אזור VIP'],
        description: 'שולחן מעמד גבוה ל-6 אורחים במיקום מובחר'
      },
      {
        event_id: eventId,
        ticket_code: 'TABLE_PLATINUM',
        label_he: 'שולחן PLATINUM (8 אנשים)',
        label_en: 'PLATINUM Table (8 guests)',
        category: 'table',
        price: 4500,
        quantity_total: 5,
        quantity_available: 5,
        max_guests: 8,
        vip_level: 'platinum',
        perks: ['3 בקבוקי יוקרה', 'פלטת סושי', 'שלט LED אישי', 'שירות אישי צמוד', 'צלם פרטי'],
        description: 'החוויה הכי מפוארת - שולחן פלטינום ל-8 אורחים'
      }
    ];

    for (const ticket of sampleTickets) {
      try {
        await TicketType.create(ticket);
      } catch (error) {
        console.error('Error creating sample ticket:', error);
      }
    }
  };

  const createTicketType = async () => {
    try {
      const ticketData = {
        ...newTicket,
        event_id: selectedEvent.id,
        price: parseFloat(newTicket.price),
        quantity_total: parseInt(newTicket.quantity_total),
        quantity_available: parseInt(newTicket.quantity_total),
        max_guests: parseInt(newTicket.max_guests) || 1
      };

      await TicketType.create(ticketData);
      await loadTicketTypes();
      setShowCreateTicket(false);
      setNewTicket({
        ticket_code: '',
        label_he: '',
        label_en: '',
        category: 'general',
        price: '',
        quantity_total: '',
        sale_start_date: '',
        sale_end_date: '',
        perks: [],
        description: '',
        vip_level: 'standard',
        max_guests: 1
      });

      alert('✅ סוג כרטיס נוצר בהצלחה!');
    } catch (error) {
      console.error('Error creating ticket type:', error);
      alert('שגיאה ביצירת סוג הכרטיס');
    }
  };

  const loadEladBirthdayExample = async () => {
    const eladEvent = {
      event_code: 'ELAD_BDAY_2025',
      event_name_he: 'יום הולדת אלעד 2025',
      event_name_en: 'ELAD BIRTHDAY 2025',
      event_date: '2025-07-15T22:00:00',
      venue_name: 'The Block Club',
      venue_address: 'רח׳ אלנבי 42, תל אביב',
      venue_capacity: 1500,
      organizer_name: 'אלעד כהן',
      organizer_email: 'elad@example.com',
      organizer_phone: '+972-50-1234567',
      event_description: 'מסיבת יום הולדת אגדית עם כוכבי העל הגדולים',
      status: 'published'
    };

    try {
      const createdEvent = await TicketEvent.create(eladEvent);
      await createSampleTickets(createdEvent.id);
      await loadEvents();
      setSelectedEvent(createdEvent);
      alert('🎂 אירוע יום הולדת אלעד 2025 נוצר בהצלחה!');
    } catch (error) {
      console.error('Error creating Elad birthday event:', error);
      alert('שגיאה ביצירת אירוע הדוגמה');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'vip': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'backstage': return <Music className="w-4 h-4 text-purple-500" />;
      case 'table': return <Users className="w-4 h-4 text-blue-500" />;
      default: return <Ticket className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category, vipLevel) => {
    if (category === 'table') {
      switch (vipLevel) {
        case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300';
        case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-300';
        default: return 'bg-blue-100 text-blue-800 border-blue-300';
      }
    }
    switch (category) {
      case 'vip': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'backstage': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const totalRevenue = purchases.reduce((sum, p) => sum + (p.final_amount || 0), 0);
  const totalTicketsSold = purchases.reduce((sum, p) => sum + (p.quantity || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              🎫 Ticket Sales System
            </h1>
            <p className="text-gray-600 text-lg">
              מערכת מכירת כרטיסים מתקדמת עם תמחור מדורג ו-VIP
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={loadEladBirthdayExample} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
              🎂 טען דוגמה: יום הולדת אלעד
            </Button>
            <Button onClick={() => setShowCreateEvent(true)} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              צור אירוע חדש
            </Button>
          </div>
        </div>

        {/* Event Selector */}
        {events.length > 0 && (
          <Card className="mb-8 bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                בחר אירוע לניהול
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map(event => (
                  <Card 
                    key={event.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedEvent?.id === event.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900">{event.event_name_he}</h3>
                      <p className="text-gray-600 text-sm">{event.event_name_en}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {new Date(event.event_date).toLocaleDateString('he-IL')}
                        </span>
                        <Badge className={`ml-auto ${
                          event.status === 'published' ? 'bg-green-100 text-green-800' :
                          event.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedEvent && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border-0 shadow-lg rounded-xl p-1 h-14">
              <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
                סקירה כללית
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
                ניהול כרטיסים
              </TabsTrigger>
              <TabsTrigger value="sales" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
                מכירות
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
                אנליטיקס
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Event Details */}
                <Card className="lg:col-span-2 bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      פרטי האירוע
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.event_name_he}</h2>
                      <p className="text-gray-600">{selectedEvent.event_name_en}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(selectedEvent.event_date).toLocaleDateString('he-IL', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(selectedEvent.event_date).toLocaleTimeString('he-IL', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{selectedEvent.venue_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">קיבולת: {selectedEvent.venue_capacity?.toLocaleString()}</span>
                      </div>
                    </div>
                    {selectedEvent.event_description && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">תיאור האירוע</h4>
                        <p className="text-gray-600">{selectedEvent.event_description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="space-y-6">
                  <Card className="bg-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-gray-900 text-lg">הכנסות כוללות</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">₪{totalRevenue.toLocaleString()}</div>
                      <p className="text-gray-500 text-sm">מ-{totalTicketsSold} כרטיסים שנמכרו</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-gray-900 text-lg">כרטיסים זמינים</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {ticketTypes.reduce((sum, t) => sum + (t.quantity_available || 0), 0)}
                      </div>
                      <p className="text-gray-500 text-sm">מתוך {ticketTypes.reduce((sum, t) => sum + (t.quantity_total || 0), 0)} סה״כ</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-gray-900 text-lg">סוגי כרטיסים</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{ticketTypes.length}</div>
                      <p className="text-gray-500 text-sm">קטגוריות שונות</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">ניהול כרטיסים</h2>
                <Button onClick={() => setShowCreateTicket(true)} className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  הוסף סוג כרטיס
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ticketTypes.map(ticket => (
                  <Card key={ticket.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(ticket.category)}
                          <CardTitle className="text-lg">{ticket.label_he}</CardTitle>
                        </div>
                        <Badge className={`border ${getCategoryColor(ticket.category, ticket.vip_level)}`}>
                          {ticket.category === 'table' ? ticket.vip_level?.toUpperCase() : ticket.category.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-gray-600 text-sm">{ticket.label_en}</p>
                        {ticket.description && (
                          <p className="text-gray-500 text-xs mt-1">{ticket.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-indigo-600">₪{ticket.price?.toLocaleString()}</span>
                        {ticket.category === 'table' && (
                          <span className="text-sm text-gray-500">עד {ticket.max_guests} אורחים</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">זמין:</span>
                          <span className="font-medium">{ticket.quantity_available}/{ticket.quantity_total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${((ticket.quantity_total - ticket.quantity_available) / ticket.quantity_total) * 100}%` 
                            }}
                          />
                        </div>
                      </div>

                      {ticket.perks && ticket.perks.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">הטבות כלולות:</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {ticket.perks.slice(0, 3).map((perk, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {perk}
                              </li>
                            ))}
                            {ticket.perks.length > 3 && (
                              <li className="text-gray-500">ועוד {ticket.perks.length - 3} הטבות...</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {ticket.early_bird && (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                          🐦 Early Bird
                        </Badge>
                      )}
                      {ticket.limited_edition && (
                        <Badge className="bg-red-100 text-red-800 border-red-300">
                          ⚡ מהדורה מוגבלת
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">מכירות ורכישות</h2>
              
              {purchases.length === 0 ? (
                <Card className="bg-white border-0 shadow-lg">
                  <CardContent className="py-16 text-center">
                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">אין מכירות עדיין</h3>
                    <p className="text-gray-600">כשיתחילו המכירות, תוכל לראות את כל הרכישות כאן</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {purchases.map(purchase => (
                    <Card key={purchase.id} className="bg-white border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{purchase.buyer_name}</h4>
                            <p className="text-gray-600">{purchase.buyer_email}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">₪{purchase.final_amount?.toLocaleString()}</div>
                            <Badge className={`${
                              purchase.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                              purchase.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {purchase.payment_status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">כמות:</span>
                            <span className="ml-1 font-medium">{purchase.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">מחיר ליחידה:</span>
                            <span className="ml-1 font-medium">₪{purchase.unit_price}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">תאריך רכישה:</span>
                            <span className="ml-1 font-medium">
                              {new Date(purchase.created_date).toLocaleDateString('he-IL')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">קוד אישור:</span>
                            <span className="ml-1 font-medium">{purchase.confirmation_code}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">אנליטיקס ודוחות</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      הכנסות לפי קטגוריה
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['general', 'vip', 'backstage', 'table'].map(category => {
                        const categoryTickets = ticketTypes.filter(t => t.category === category);
                        const categoryRevenue = categoryTickets.reduce((sum, t) => {
                          const sold = (t.quantity_total || 0) - (t.quantity_available || 0);
                          return sum + (sold * (t.price || 0));
                        }, 0);
                        
                        return (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-gray-600 capitalize">{category}</span>
                            <span className="font-bold text-gray-900">₪{categoryRevenue.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      מכירות לפי סוג
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ticketTypes.slice(0, 5).map(ticket => {
                        const sold = (ticket.quantity_total || 0) - (ticket.quantity_available || 0);
                        const percentage = ticket.quantity_total ? (sold / ticket.quantity_total) * 100 : 0;
                        
                        return (
                          <div key={ticket.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{ticket.label_he}</span>
                              <span className="text-gray-900">{sold}/{ticket.quantity_total}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      ביצועים
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{totalTicketsSold}</div>
                        <div className="text-gray-500 text-sm">כרטיסים נמכרו</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">₪{(totalRevenue / Math.max(totalTicketsSold, 1)).toFixed(0)}</div>
                        <div className="text-gray-500 text-sm">מחיר ממוצע לכרטיס</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {ticketTypes.length > 0 ? 
                            ((ticketTypes.reduce((sum, t) => sum + ((t.quantity_total || 0) - (t.quantity_available || 0)), 0) / 
                              ticketTypes.reduce((sum, t) => sum + (t.quantity_total || 0), 1)) * 100).toFixed(1) 
                            : 0}%
                        </div>
                        <div className="text-gray-500 text-sm">אחוז תפוסה</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Create Event Dialog */}
        <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                צור אירוע חדש
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event_code">קוד אירוע (אנגלית)</Label>
                  <Input
                    id="event_code"
                    value={newEvent.event_code}
                    onChange={(e) => setNewEvent({...newEvent, event_code: e.target.value})}
                    placeholder="PARTY_2025"
                  />
                </div>
                <div>
                  <Label htmlFor="event_name_he">שם האירוע (עברית)</Label>
                  <Input
                    id="event_name_he"
                    value={newEvent.event_name_he}
                    onChange={(e) => setNewEvent({...newEvent, event_name_he: e.target.value})}
                    placeholder="מסיבת קיץ 2025"
                  />
                </div>
                <div>
                  <Label htmlFor="event_name_en">שם האירוע (אנגלית)</Label>
                  <Input
                    id="event_name_en"
                    value={newEvent.event_name_en}
                    onChange={(e) => setNewEvent({...newEvent, event_name_en: e.target.value})}
                    placeholder="Summer Party 2025"
                  />
                </div>
                <div>
                  <Label htmlFor="event_date">תאריך ושעה</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="venue_name">שם המקום</Label>
                  <Input
                    id="venue_name"
                    value={newEvent.venue_name}
                    onChange={(e) => setNewEvent({...newEvent, venue_name: e.target.value})}
                    placeholder="מועדון הבלוק"
                  />
                </div>
                <div>
                  <Label htmlFor="venue_address">כתובת המקום</Label>
                  <Input
                    id="venue_address"
                    value={newEvent.venue_address}
                    onChange={(e) => setNewEvent({...newEvent, venue_address: e.target.value})}
                    placeholder="רח׳ אלנבי 42, תל אביב"
                  />
                </div>
                <div>
                  <Label htmlFor="venue_capacity">קיבולת המקום</Label>
                  <Input
                    id="venue_capacity"
                    type="number"
                    value={newEvent.venue_capacity}
                    onChange={(e) => setNewEvent({...newEvent, venue_capacity: e.target.value})}
                    placeholder="1500"
                  />
                </div>
                <div>
                  <Label htmlFor="organizer_name">שם המארגן</Label>
                  <Input
                    id="organizer_name"
                    value={newEvent.organizer_name}
                    onChange={(e) => setNewEvent({...newEvent, organizer_name: e.target.value})}
                    placeholder="ישראל ישראלי"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="event_description">תיאור האירוע</Label>
                <Textarea
                  id="event_description"
                  value={newEvent.event_description}
                  onChange={(e) => setNewEvent({...newEvent, event_description: e.target.value})}
                  placeholder="תיאור מפורט של האירוע..."
                  className="h-24"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                ביטול
              </Button>
              <Button onClick={createEvent} className="bg-gradient-to-r from-indigo-600 to-blue-600">
                צור אירוע
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Ticket Dialog */}
        <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-green-600" />
                הוסף סוג כרטיס חדש
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ticket_code">קוד כרטיס</Label>
                  <Input
                    id="ticket_code"
                    value={newTicket.ticket_code}
                    onChange={(e) => setNewTicket({...newTicket, ticket_code: e.target.value})}
                    placeholder="VIP_GOLD"
                  />
                </div>
                <div>
                  <Label htmlFor="label_he">שם (עברית)</Label>
                  <Input
                    id="label_he"
                    value={newTicket.label_he}
                    onChange={(e) => setNewTicket({...newTicket, label_he: e.target.value})}
                    placeholder="כרטיס VIP זהב"
                  />
                </div>
                <div>
                  <Label htmlFor="label_en">שם (אנגלית)</Label>
                  <Input
                    id="label_en"
                    value={newTicket.label_en}
                    onChange={(e) => setNewTicket({...newTicket, label_en: e.target.value})}
                    placeholder="VIP Gold Ticket"
                  />
                </div>
                <div>
                  <Label htmlFor="category">קטגוריה</Label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">רגיל</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="backstage">Backstage</SelectItem>
                      <SelectItem value="table">שולחן</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">מחיר (₪)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newTicket.price}
                    onChange={(e) => setNewTicket({...newTicket, price: e.target.value})}
                    placeholder="350"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity_total">כמות כוללת</Label>
                  <Input
                    id="quantity_total"
                    type="number"
                    value={newTicket.quantity_total}
                    onChange={(e) => setNewTicket({...newTicket, quantity_total: e.target.value})}
                    placeholder="100"
                  />
                </div>
                {newTicket.category === 'table' && (
                  <div>
                    <Label htmlFor="max_guests">מקסימום אורחים</Label>
                    <Input
                      id="max_guests"
                      type="number"
                      value={newTicket.max_guests}
                      onChange={(e) => setNewTicket({...newTicket, max_guests: e.target.value})}
                      placeholder="6"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="vip_level">רמת VIP</Label>
                  <Select value={newTicket.vip_level} onValueChange={(value) => setNewTicket({...newTicket, vip_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">רגיל</SelectItem>
                      <SelectItem value="silver">כסף</SelectItem>
                      <SelectItem value="gold">זהב</SelectItem>
                      <SelectItem value="platinum">פלטינום</SelectItem>
                      <SelectItem value="diamond">יהלום</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">תיאור</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder="תיאור הכרטיס וההטבות..."
                  className="h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateTicket(false)}>
                ביטול
              </Button>
              <Button onClick={createTicketType} className="bg-gradient-to-r from-green-600 to-emerald-600">
                צור כרטיס
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}