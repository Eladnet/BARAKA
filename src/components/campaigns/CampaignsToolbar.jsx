import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' }
];

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' }
];

export default function CampaignsToolbar({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  promoters 
}) {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row items-center gap-4 bg-white">
      {/* Search */}
      <div className="relative flex-1 w-full md:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {/* Status Filter */}
        <Select 
          value={filters.status} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-gray-700">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Promoter Filter */}
        <Select 
          value={filters.promoter} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, promoter: value }))}
        >
          <SelectTrigger className="w-40 bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="All Promoters" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all" className="text-gray-700">All Promoters</SelectItem>
            {promoters.map(promoter => (
              <SelectItem key={promoter.id} value={promoter.id} className="text-gray-700">
                {promoter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Select 
          value={filters.dateRange} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
        >
          <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-900">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {dateRangeOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-gray-700">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}