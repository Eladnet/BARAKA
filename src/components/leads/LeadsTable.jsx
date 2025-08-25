
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Crown, Edit, Instagram, Facebook, Linkedin, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow, isValid } from "date-fns";

const getStatusColor = (status) => {
    const colors = {
      cold: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      warm: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      engaged: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      converted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      vip: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      inactive: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[status] || colors.cold;
};

const getSpendingIcon = (category) => {
  switch (category) {
    case 'luxury':
    case 'premium':
      return Crown;
    default:
      return null;
  }
};

export default function LeadsTable({ leads, isLoading, sorting, setSorting, onEditLead }) {
  const handleSort = (columnId) => {
    if (sorting.id === columnId) {
      setSorting({ ...sorting, desc: !sorting.desc });
    } else {
      setSorting({ id: columnId, desc: true });
    }
  };

  const columns = [
    { id: 'first_name', label: 'Customer' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'id_number', label: 'ID Number' },
    { id: 'status', label: 'Status' },
    { id: 'score', label: 'Score' },
    { id: 'total_spent', label: 'Total Spent' },
    { id: 'social_profiles', label: 'Social Profiles' },
    { id: 'last_interaction', label: 'Last Interaction' },
    { id: 'actions', label: 'Actions' }
  ];

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            {columns.map(col => (
              <TableHead key={col.id} className="font-medium text-gray-900">
                {col.id !== 'actions' ? (
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort(col.id)} 
                    className="text-gray-700 hover:text-gray-900 px-0 h-auto font-medium -ml-4"
                  >
                    {col.label}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  col.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(10).fill(0).map((_, i) => (
              <TableRow key={i} className="border-gray-100">
                <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-32 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-lg font-medium mb-1">No leads found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters or importing new leads</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            leads.map(lead => {
              const SpendingIcon = getSpendingIcon(lead.spending_category);
              const birthdayDate = lead.birthday ? new Date(lead.birthday) : null;

              return (
                <TableRow 
                  key={lead.id} 
                  className="hover:bg-gray-50 cursor-pointer border-gray-100 transition-colors duration-150"
                  onClick={() => onEditLead(lead)}
                >
                  {/* Avatar */}
                  <TableCell className="py-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center relative flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {(lead.first_name?.[0] || 'U') + (lead.last_name?.[0] || 'N')}
                      </span>
                      {lead.status === 'vip' && (
                        <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                  </TableCell>

                  {/* Customer Info */}
                  <TableCell className="font-medium text-gray-900 py-4">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="truncate">{lead.first_name || 'Unknown'} {lead.last_name || 'Unknown'}</span>
                          {SpendingIcon && <SpendingIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                        </div>
                        <div className="text-sm text-gray-500 truncate">{lead.phone_number}</div>
                        {lead.email && (
                          <div className="text-xs text-gray-400 truncate">{lead.email}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Birthday */}
                  <TableCell className="py-4 text-gray-700">
                    {birthdayDate && isValid(birthdayDate) ? (
                      <div>
                        <div className="text-sm">{format(birthdayDate, 'PP')}</div>
                        {lead.age && <div className="text-xs text-gray-500">{lead.age} years old</div>}
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>

                  {/* ID Number */}
                  <TableCell className="py-4 text-gray-700">
                    {lead.id_number ? (
                      <span className="font-mono text-sm">****{lead.id_number.slice(-4)}</span>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`${getStatusColor(lead.status)} capitalize`}>
                      {lead.status || 'cold'}
                    </Badge>
                  </TableCell>

                  {/* Score */}
                  <TableCell className="py-4 text-gray-900 font-bold">
                    <div className={`inline-flex items-center justify-center w-12 h-6 rounded-full text-xs font-bold ${
                      (lead.score || 0) >= 80 ? 'bg-emerald-500/20 text-emerald-500' :
                      (lead.score || 0) >= 50 ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-slate-500/20 text-gray-500'
                    }`}>
                      {lead.score || 0}
                    </div>
                  </TableCell>

                  {/* Total Spent */}
                  <TableCell className="py-4 text-emerald-600 font-semibold">
                    ₪{(lead.total_spent || 0).toLocaleString()}
                  </TableCell>

                  {/* Social Profiles */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1">
                      {lead.instagram_handle && (
                        <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/30 text-xs px-1">
                          <Instagram className="w-3 h-3 mr-1" />
                          {lead.instagram_followers && <span className="ml-1">{(lead.instagram_followers / 1000).toFixed(0)}K</span>}
                        </Badge>
                      )}
                      {lead.facebook_profile && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-1">
                          <Facebook className="w-3 h-3 mr-1" />
                          FB
                        </Badge>
                      )}
                      {lead.linkedin_profile && (
                        <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs px-1">
                          <Linkedin className="w-3 h-3 mr-1" />
                          LI
                        </Badge>
                      )}
                      {!lead.instagram_handle && !lead.facebook_profile && !lead.linkedin_profile && (
                        <span className="text-gray-500 text-xs">N/A</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Last Interaction */}
                  <TableCell className="py-4 text-gray-500">
                    {lead.last_interaction ? 
                      formatDistanceToNow(new Date(lead.last_interaction), { addSuffix: true }) : 
                      'Never'
                    }
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditLead(lead);
                      }}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
