import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Search, SlidersHorizontal, Filter } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'cold', label: 'Cold' },
  { value: 'warm', label: 'Warm' },
  { value: 'engaged', label: 'Engaged' },
  { value: 'converted', label: 'Converted' },
  { value: 'vip', label: 'VIP' },
  { value: 'inactive', label: 'Inactive' }
];

const spendingOptions = [
  { value: 'all', label: 'All Spending' },
  { value: 'budget', label: 'Budget' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' }
];

export default function LeadsToolbar({ searchTerm, setSearchTerm, filters, setFilters }) {
  return (
    <div className="p-4 border-b border-purple-500/30 bg-slate-800/30">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 flex-1 sm:flex-none">
                <Filter className="w-4 h-4 mr-2" />
                Status
                {filters.status !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded">
                    {statusOptions.find(o => o.value === filters.status)?.label}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
              {statusOptions.map(option => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.status === option.value}
                  onCheckedChange={() => setFilters(f => ({ ...f, status: option.value }))}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 flex-1 sm:flex-none">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Spending
                {filters.spending !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded">
                    {spendingOptions.find(o => o.value === filters.spending)?.label}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
              {spendingOptions.map(option => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.spending === option.value}
                  onCheckedChange={() => setFilters(f => ({ ...f, spending: option.value }))}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}