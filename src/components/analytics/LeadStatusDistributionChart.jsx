import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users } from 'lucide-react';

const COLORS = {
  cold: '#64748b',
  warm: '#facc15',
  engaged: '#3b82f6',
  converted: '#10b981',
  vip: '#a855f7',
  inactive: '#ef4444'
};

const processData = (leads) => {
    const statusCounts = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
};

export default function LeadStatusDistributionChart({ leads = [], isLoading = false }) {
  const chartData = React.useMemo(() => processData(leads), [leads]);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Lead Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full h-64 rounded-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: '#d1d5db',
                  color: '#374151',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </>
  );
}