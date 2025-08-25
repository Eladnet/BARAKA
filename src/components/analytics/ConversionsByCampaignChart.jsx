import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Megaphone } from 'lucide-react';

export default function ConversionsByCampaignChart({ campaigns = [], isLoading = false }) {
  const chartData = (campaigns || [])
    .map(c => ({ name: c.name, conversions: c.conversions || 0 }))
    .sort((a,b) => b.conversions - a.conversions)
    .slice(0, 10);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-purple-600" />
          Top 10 Campaigns by Conversions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full h-64" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={100} tick={{ fill: '#374151' }} />
              <Tooltip 
                cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: '#d1d5db',
                  color: '#374151',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="conversions" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </>
  );
}