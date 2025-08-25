import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

export default function ConversationFilters({ filters, setFilters, promoters }) {
  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="חפש שיחות..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Platform Filter */}
          <Select 
            value={filters.platform} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value }))}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="פלטפורמה" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-slate-300">כל הפלטפורמות</SelectItem>
              <SelectItem value="whatsapp" className="text-slate-300">WhatsApp</SelectItem>
              <SelectItem value="facebook" className="text-slate-300">Facebook</SelectItem>
              <SelectItem value="instagram" className="text-slate-300">Instagram</SelectItem>
            </SelectContent>
          </Select>

          {/* Promoter Filter */}
          <Select 
            value={filters.promoter} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, promoter: value }))}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="יחצ״ן" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-slate-300">כל היחצ״נים</SelectItem>
              {promoters.map(promoter => (
                <SelectItem key={promoter.id} value={promoter.id} className="text-slate-300">
                  {promoter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select 
            value={filters.status} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="סטטוס" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-slate-300">כל הסטטוסין</SelectItem>
              <SelectItem value="cold" className="text-slate-300">קר</SelectItem>
              <SelectItem value="warm" className="text-slate-300">חם</SelectItem>
              <SelectItem value="engaged" className="text-slate-300">מעורב</SelectItem>
              <SelectItem value="converted" className="text-slate-300">הומר</SelectItem>
              <SelectItem value="vip" className="text-slate-300">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}