
import React, { useState, useEffect } from "react";
import { Lead } from "@/api/entities";
import { LeadGroup } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Edit, Sparkles, Users, Brain } from "lucide-react";
import { useDebounce } from "@/components/hooks/useDebounce";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from '@/components/lib/translations';

import LeadsStats from "../components/leads/LeadsStats";
import LeadsTable from "../components/leads/LeadsTable";
import LeadsToolbar from "../components/leads/LeadsToolbar";
import ImportLeadsDialog from "../components/leads/ImportLeadsDialog";
import LeadEditPanel from "../components/leads/LeadEditPanel";
import IntelligentLeadCreationDialog from "../components/leads/IntelligentLeadCreationDialog";
import LeadGroupsManager from "../components/leads/LeadGroupsManager";
import SmartDocumentImporter from "../components/leads/SmartDocumentImporter";

export default function LeadsPage() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);
  
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "all", spending: "all" });
  const [sorting, setSorting] = useState({ id: "created_date", desc: true });
  const [isImporting, setIsImporting] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showIntelligentCreate, setShowIntelligentCreate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showSmartImport, setShowSmartImport] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadLeads();
  }, [debouncedSearchTerm, filters, sorting, selectedGroup]);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      let queryFilters = {
        created_by: user.email
      };

      if (selectedGroup) {
        queryFilters.lead_groups = selectedGroup.id;
      }

      if (filters.status !== "all") {
        queryFilters.status = filters.status;
      }
      if (filters.spending !== "all") {
        queryFilters.spending_category = filters.spending;
      }

      const sortString = `${sorting.desc ? '-' : ''}${sorting.id}`;
      const fetchedLeads = await Lead.filter(queryFilters, sortString, 5000);
      
      const searchedLeads = debouncedSearchTerm
        ? fetchedLeads.filter(
            (lead) =>
              (lead.first_name || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              (lead.last_name || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              (lead.email || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
        : fetchedLeads;
        
      setLeads(searchedLeads);
    } catch (error) {
      console.error("Error loading leads:", error);
    }
    setIsLoading(false);
  };
  
  const handleImportSuccess = () => {
    setIsImporting(false);
    loadLeads();
  };

  const handleUpdateLead = async (updatedLead) => {
    await autoAssignToGroups(updatedLead);
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setEditingLead(null);
    loadLeads();
  };

  const autoAssignToGroups = async (lead) => {
    try {
      const groups = await LeadGroup.list();
      const matchingGroups = [];

      for (const group of groups) {
        if (!group.filters) continue;

        let matches = true;
        
        if (group.filters.status?.length > 0) {
          matches = matches && group.filters.status.includes(lead.status);
        }
        
        if (group.filters.spending_category?.length > 0) {
          matches = matches && group.filters.spending_category.includes(lead.spending_category);
        }
        
        if (group.filters.location) {
          matches = matches && lead.location?.toLowerCase().includes(group.filters.location.toLowerCase());
        }
        
        if (group.filters.vip_potential?.length > 0) {
          matches = matches && group.filters.vip_potential.includes(lead.vip_potential);
        }

        if (matches) {
          matchingGroups.push(group.id);
        }
      }

      if (matchingGroups.length > 0) {
        const currentGroups = lead.lead_groups || [];
        const updatedGroups = [...new Set([...currentGroups, ...matchingGroups])];
        await Lead.update(lead.id, { lead_groups: updatedGroups });
      }
    } catch (error) {
      console.error('Error auto-assigning to groups:', error);
    }
  };

  const handleIntelligentCreateSuccess = (newLead) => {
    setShowIntelligentCreate(false);
    autoAssignToGroups(newLead);
    loadLeads();
    setEditingLead(newLead);
  };

  const handleSmartImportSuccess = () => {
    setShowSmartImport(false);
    loadLeads();
  };

  const handleGroupSelect = (group) => {
    console.log('handleGroupSelect called with:', group); // לצורך debug
    setSelectedGroup(group);
  };

  const handleClearFilter = () => {
    console.log('handleClearFilter called'); // לצורך debug
    setSelectedGroup(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex-shrink-0 bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {t("Lead Management")}
                  </h1>
                  <Button 
                    onClick={() => setShowCreateGroup(true)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-sm px-4 py-2 h-8"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("New Group")}
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm font-medium">{t("Active Group")}:</span>
                    <Badge 
                      variant="outline" 
                      className={`${
                        selectedGroup 
                          ? `bg-${selectedGroup.color}-50 text-${selectedGroup.color}-700 border-${selectedGroup.color}-200` 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        selectedGroup ? `bg-${selectedGroup.color}-500` : 'bg-gray-500'
                      }`}></div>
                      {selectedGroup ? selectedGroup.name : t("All Leads")}
                    </Badge>
                  </div>
                  
                  {selectedGroup && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilter}
                      className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1"
                    >
                      {t("Clear Filter")}
                    </Button>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm">
                  {selectedGroup ? 
                    `Managing ${leads.length} leads in the "${selectedGroup.name}" group` : 
                    `Your central customer database - ${leads.length} leads total`
                  }
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => setShowIntelligentCreate(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm px-4 py-2"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("Smart Create")}
                </Button>
                <Button
                  onClick={() => setShowSmartImport(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm px-4 py-2"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {t("Smart Import")}
                </Button>
                <Button 
                  onClick={() => setIsImporting(true)}
                  variant="outline" 
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm px-4 py-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t("Import CSV")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
            
            {/* Top Section - Groups and Stats */}
            <div className="flex-shrink-0 space-y-6 mb-6">
              {/* Groups Selection */}
              <div className="bg-white shadow-lg border-0 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t("Filters & Tools")}</h3>
                  <div className="text-sm text-gray-500">{t("Quick Groups")}</div>
                </div>
                <div className="max-h-32 overflow-y-auto">
                  <LeadGroupsManager 
                    onGroupSelect={handleGroupSelect}
                    selectedGroup={selectedGroup}
                    showInDialog={false}
                  />
                </div>
              </div>
              
              {/* Stats Cards - מיקום מרכזי עם פרופורציות זהות */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <LeadsStats allLeads={leads} />
              </div>
            </div>

            {/* Main Table Section - ממורכז עם גלילה פנימית */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="bg-white shadow-lg border-0 rounded-2xl flex flex-col h-full overflow-hidden">
                {/* Toolbar */}
                <div className="flex-shrink-0">
                  <LeadsToolbar 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                  />
                </div>
                
                {/* Table Container with Internal Scrolling */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <LeadsTable
                      leads={leads}
                      isLoading={isLoading}
                      sorting={sorting}
                      setSorting={setSorting}
                      onEditLead={setEditingLead}
                    />
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                  <div className="text-center text-gray-500 text-sm">
                    Showing {leads.length} leads {selectedGroup ? `from "${selectedGroup.name}" group` : 'total'} • No loading limits
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      {/* Edit Panel Overlay */}
      {editingLead && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setEditingLead(null)}
          />
          
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-50 shadow-2xl">
            <LeadEditPanel
              lead={editingLead}
              onClose={() => setEditingLead(null)}
              onUpdate={handleUpdateLead}
            />
          </div>
        </>
      )}

      {/* Group Selection Dialog */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="max-w-4xl bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{t("Manage Lead Groups")}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <LeadGroupsManager 
              onGroupSelect={(group) => {
                setSelectedGroup(group);
                setShowCreateGroup(false);
              }}
              selectedGroup={selectedGroup}
              showInDialog={true}
            />
          </div>
        </DialogContent>
      </Dialog>
        
      {/* Other Dialogs */}
      <ImportLeadsDialog
        open={isImporting}
        onOpenChange={setIsImporting}
        onSuccess={handleImportSuccess}
      />
      <IntelligentLeadCreationDialog
        open={showIntelligentCreate}
        onOpenChange={setShowIntelligentCreate}
        onSuccess={handleIntelligentCreateSuccess}
      />
      <SmartDocumentImporter
        open={showSmartImport}
        onOpenChange={setShowSmartImport}
        onSuccess={handleSmartImportSuccess}
      />
    </div>
  );
}
