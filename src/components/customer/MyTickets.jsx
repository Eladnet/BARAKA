import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle,
  Download,
  Share2,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function MyTickets({ tickets = [], venues = [], onRefresh }) {
  const getTicketStatusColor = (ticket) => {
    if (ticket.is_used) return 'bg-green-500/20 text-green-300';
    
    const eventDate = new Date(ticket.event_date);
    const now = new Date();
    
    if (eventDate < now) return 'bg-red-500/20 text-red-300';
    return 'bg-blue-500/20 text-blue-300';
  };

  const getTicketStatusText = (ticket) => {
    if (ticket.is_used) return 'Used';
    
    const eventDate = new Date(ticket.event_date);
    const now = new Date();
    
    if (eventDate < now) return 'Expired';
    return 'Valid';
  };

  const getEntryTypeText = (entryType) => {
    const types = {
      'free': 'Free Entry',
      'vip': 'VIP',
      'table': 'Table',
      'discount': 'Discount'
    };
    return types[entryType] || entryType;
  };

  const handleDownloadQR = (ticket) => {
    // כאן נוסיף לוגיקת הורדת QR
    alert(`Download QR for ${ticket.event_name} ticket - Coming soon!`);
  };

  const handleShareTicket = (ticket) => {
    // כאן נוסיף לוגיקת שיתוף
    alert(`Share ${ticket.event_name} ticket - Coming soon!`);
  };

  const upcomingTickets = tickets.filter(ticket => 
    new Date(ticket.event_date) > new Date() && !ticket.is_used
  );

  const usedTickets = tickets.filter(ticket => ticket.is_used);

  const expiredTickets = tickets.filter(ticket => 
    new Date(ticket.event_date) < new Date() && !ticket.is_used
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{upcomingTickets.length}</div>
            <div className="text-slate-400 text-sm">Upcoming Tickets</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/80 backdrop-blur-xl border-green-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{usedTickets.length}</div>
            <div className="text-slate-400 text-sm">Used Tickets</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/80 backdrop-blur-xl border-red-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{expiredTickets.length}</div>
            <div className="text-slate-400 text-sm">Expired Tickets</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tickets */}
      {upcomingTickets.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Upcoming Tickets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingTickets.map(ticket => (
              <Card key={ticket.id} className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white">{ticket.event_name}</CardTitle>
                    <Badge className={getTicketStatusColor(ticket)}>
                      {getTicketStatusText(ticket)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">
                        {format(new Date(ticket.event_date), 'PPP')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">
                        {format(new Date(ticket.event_date), 'HH:mm')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-sm">
                        {venues.find(v => v.id === ticket.venue_id)?.name || 'Unknown Venue'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                      {getEntryTypeText(ticket.entry_type)}
                    </Badge>
                    {ticket.ticket_price > 0 && (
                      <span className="text-emerald-400 font-semibold">
                        ₪{ticket.ticket_price}
                      </span>
                    )}
                  </div>

                  {ticket.special_instructions && (
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-yellow-300 text-sm">{ticket.special_instructions}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownloadQR(ticket)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Ticket
                    </Button>
                    <Button
                      onClick={() => handleShareTicket(ticket)}
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Used Tickets */}
      {usedTickets.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Used Tickets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usedTickets.map(ticket => (
              <Card key={ticket.id} className="bg-slate-900/80 backdrop-blur-xl border-green-500/30 opacity-75">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{ticket.event_name}</h4>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-slate-400 text-sm">
                    {format(new Date(ticket.event_date), 'PPP')}
                  </p>
                  {ticket.used_at && (
                    <p className="text-green-300 text-xs mt-1">
                      Used on {format(new Date(ticket.used_at), 'PPP HH:mm')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Tickets Message */}
      {tickets.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tickets yet</h3>
          <p className="text-slate-400 mb-6">Discover exciting events and purchase tickets</p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
            Browse Events
          </Button>
        </div>
      )}
    </div>
  );
}