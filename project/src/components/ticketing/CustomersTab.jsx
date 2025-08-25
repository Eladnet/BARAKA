import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Search, 
  Filter, 
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomersTab({ leads = [], tickets = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // חישוב נתונים עבור לקוחות - with safe defaults
  const customersData = (leads || []).map(lead => {
    const customerTickets = (tickets || []).filter(t => t.lead_id === lead.id);
    const totalSpent = customerTickets.reduce((sum, t) => sum + (t.ticket_price || 0), 0);
    const eventsAttended = customerTickets.filter(t => t.is_used).length;
    const totalTickets = customerTickets.length;

    return {
      ...lead,
      totalTickets,
      totalSpent,
      eventsAttended,
      lastPurchase: customerTickets.length > 0 ? 
        Math.max(...customerTickets.map(t => new Date(t.created_date).getTime())) : null
    };
  });

  const filteredCustomers = customersData.filter(customer =>
    (customer.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerBadge = (customer) => {
    if (customer.totalSpent > 1000) return { text: 'VIP', color: 'bg-yellow-100 text-yellow-800' };
    if (customer.totalSpent > 500) return { text: 'פרימיום', color: 'bg-purple-100 text-purple-800' };
    if (customer.eventsAttended > 3) return { text: 'נאמן', color: 'bg-blue-100 text-blue-800' };
    return { text: 'רגיל', color: 'bg-gray-100 text-gray-800' };
  };

  // Safe calculations for stats
  const totalLeads = (leads || []).length;
  const totalRevenue = customersData.reduce((sum, c) => sum + c.totalSpent, 0);
  const activeCustomers = customersData.filter(c => c.eventsAttended > 0).length;
  const vipCustomers = customersData.filter(c => c.totalSpent > 1000).length;

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                <p className="text-gray-600 text-sm">סה"כ לקוחות</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ₪{totalRevenue.toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">סה"כ הכנסות</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
                <p className="text-gray-600 text-sm">לקוחות פעילים</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Badge className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1">
                  VIP
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{vipCustomers}</p>
                <p className="text-gray-600 text-sm">לקוחות VIP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-900">רשימת לקוחות</CardTitle>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="חיפוש לקוחות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 text-gray-900 w-64 rounded-xl"
                />
              </div>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                סינון
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {totalLeads === 0 ? 'אין לקוחות במערכת' : 'לא נמצאו לקוחות המתאימים לחיפוש'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700 font-medium">לקוח</TableHead>
                  <TableHead className="text-gray-700 font-medium">פרטי קשר</TableHead>
                  <TableHead className="text-gray-700 font-medium">סטטוס</TableHead>
                  <TableHead className="text-gray-700 font-medium">כרטיסים</TableHead>
                  <TableHead className="text-gray-700 font-medium">סה"כ הוצאה</TableHead>
                  <TableHead className="text-gray-700 font-medium">אירועים</TableHead>
                  <TableHead className="text-gray-700 font-medium">רכישה אחרונה</TableHead>
                  <TableHead className="text-gray-700 font-medium">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const badge = getCustomerBadge(customer);
                  return (
                    <TableRow key={customer.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {(customer.first_name || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">
                              {customer.first_name || ''} {customer.last_name || ''}
                            </p>
                            <p className="text-gray-500 text-sm">ID: {customer.id?.slice(-8) || 'N/A'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{customer.email || 'N/A'}</span>
                          </div>
                          {customer.phone_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700">{customer.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={badge.color}>
                          {badge.text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900 font-medium">{customer.totalTickets}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-emerald-600 font-bold">
                          ₪{customer.totalSpent.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-600 font-medium">{customer.eventsAttended}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">
                          {customer.lastPurchase 
                            ? new Date(customer.lastPurchase).toLocaleDateString('he-IL')
                            : 'אין'
                          }
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white border-gray-200 shadow-lg">
                            <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                              <Eye className="w-4 h-4 mr-2" />
                              צפה בפרטים
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                              <Edit className="w-4 h-4 mr-2" />
                              עריכה
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                              <Mail className="w-4 h-4 mr-2" />
                              שלח הודעה
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}