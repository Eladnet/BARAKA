import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { TrendingUp } from 'lucide-react';

const processData = (leads) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(new Date(), i)).reverse();
    const leadsByDay = last30Days.map(day => ({
        date: format(day, 'MMM d'),
        leads: 0
    }));

    leads.forEach(lead => {
        const leadDate = parseISO(lead.created_date);
        const dayString = format(leadDate, 'MMM d');
        const dayData = leadsByDay.find(d => d.date === dayString);
        if (dayData) {
            dayData.leads++;
        }
    });

    return leadsByDay;
};

export default function LeadsOverTimeChart({ leads = [], isLoading = false }) {
  const chartData = React.useMemo(() => processData(leads), [leads]);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          New Leads Over Time (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full h-64" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: '#d1d5db',
                  color: '#374151',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area type="monotone" dataKey="leads" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </>
  );
}