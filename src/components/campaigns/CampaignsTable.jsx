import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Copy, Bot, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CampaignsTable({ campaigns, isLoading, onCampaignSelect, selectedCampaign, onDuplicate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className="text-gray-700">Campaign</TableHead>
            <TableHead className="text-gray-700">Status</TableHead>
            <TableHead className="text-gray-700">AI Promoter</TableHead>
            <TableHead className="text-gray-700">Messages</TableHead>
            <TableHead className="text-gray-700">Conversions</TableHead>
            <TableHead className="text-gray-700">Revenue</TableHead>
            <TableHead className="text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <TableRow key={i} className="border-gray-200">
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))
          ) : (
            campaigns.map(campaign => (
              <TableRow
                key={campaign.id}
                onClick={() => onCampaignSelect(campaign)}
                className={`cursor-pointer transition-colors border-gray-200 hover:bg-gray-50 ${selectedCampaign?.id === campaign.id ? 'bg-indigo-50' : ''}`}
              >
                <TableCell className="font-medium text-gray-900">
                  <div>
                    <div className="font-semibold">{campaign.name}</div>
                    <div className="text-sm text-gray-500">{campaign.event_name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-700">AI Agent</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-900">{campaign.messages_sent || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="text-emerald-600 font-medium">{campaign.conversions || 0}</TableCell>
                <TableCell className="text-yellow-600 font-medium">₪{campaign.revenue_generated || 0}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDuplicate(campaign); }}>
                    <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}