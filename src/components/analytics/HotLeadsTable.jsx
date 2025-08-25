import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Crown } from 'lucide-react';

const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-yellow-600";
    return "text-gray-600";
};

const getStatusColor = (status) => {
    const colors = {
      converted: "bg-green-100 text-green-800 border-green-200",
      vip: "bg-purple-100 text-purple-800 border-purple-200",
      engaged: "bg-blue-100 text-blue-800 border-blue-200",
      warm: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cold: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status] || colors.cold;
};

export default function HotLeadsTable({ leads = [], isLoading = false }) {
  const hotLeads = (leads || [])
    .filter(lead => lead && (lead.score || 0) >= 70)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-600" />
          Hot Leads
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-gray-50">
                        <TableHead className="text-gray-700">Customer</TableHead>
                        <TableHead className="text-gray-700">Score</TableHead>
                        <TableHead className="text-gray-700">Status</TableHead>
                        <TableHead className="text-gray-700">Last Interaction</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                            <TableRow key={i} className="border-gray-200">
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            </TableRow>
                        ))
                    ) : hotLeads.map(lead => (
                        <TableRow key={lead.id} className="border-gray-200 hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">
                              {lead.first_name} {lead.last_name}
                            </TableCell>
                            <TableCell className={`font-bold ${getScoreColor(lead.score)}`}>
                              {lead.score || 0}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={getStatusColor(lead.status)}>
                                  {lead.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">
                                {lead.last_interaction ? formatDistanceToNow(new Date(lead.last_interaction), { addSuffix: true }) : 'N/A'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </>
  );
}