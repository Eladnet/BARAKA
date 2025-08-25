import React, { useState, useEffect } from "react";
import { Campaign, AIPromoter, Lead, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, Copy } from "lucide-react";

import CampaignsStats from "../components/campaigns/CampaignsStats";
import CampaignsTable from "../components/campaigns/CampaignsTable";
import CampaignsToolbar from "../components/campaigns/CampaignsToolbar";
import CampaignSidePanel from "../components/campaigns/CampaignSidePanel";
import CreateCampaignDialog from "../components/campaigns/CreateCampaignDialog";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [campaignToDuplicate, setCampaignToDuplicate] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    promoter: "all",
    dateRange: "all"
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const userFilter = { created_by: user.email };

      const [campaignsData, promotersData] = await Promise.all([
        Campaign.filter(userFilter, '-created_date'),
        AIPromoter.filter(userFilter)
      ]);
      setCampaigns(campaignsData);
      setPromoters(promotersData);
      if (!selectedCampaign && campaignsData.length > 0) {
        setSelectedCampaign(campaignsData[0]);
      }
    } catch (error) {
      console.error('Error loading campaigns data:', error);
    }
    setIsLoading(false);
  };

  const handleCreateCampaign = () => {
    setShowCreateDialog(false);
    setCampaignToDuplicate(null);
    loadData();
  };

  const handleDuplicateCampaign = (campaign) => {
    setCampaignToDuplicate(campaign);
    setShowCreateDialog(true);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.event_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === "all" || campaign.status === filters.status;
    const matchesPromoter = filters.promoter === "all" || campaign.promoter_id === filters.promoter;
    
    return matchesSearch && matchesStatus && matchesPromoter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                AI Campaign Center
              </h1>
              <p className="text-gray-600 text-lg">Manage your intelligent AI promoter campaigns and direct customer engagement</p>
            </div>
            <Button 
              onClick={() => {
                setCampaignToDuplicate(null);
                setShowCreateDialog(true);
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create AI Campaign
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <CampaignsStats campaigns={campaigns} isLoading={isLoading} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          {/* Left side - Campaigns list */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CampaignsToolbar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filters={filters}
                setFilters={setFilters}
                promoters={promoters}
              />
              <CampaignsTable
                campaigns={filteredCampaigns}
                isLoading={isLoading}
                onCampaignSelect={setSelectedCampaign}
                selectedCampaign={selectedCampaign}
                onDuplicate={handleDuplicateCampaign}
              />
            </div>
          </div>

          {/* Right side - Campaign details panel */}
          <div className="lg:col-span-1">
            <CampaignSidePanel 
              campaign={selectedCampaign}
              promoters={promoters}
              onCampaignUpdate={loadData}
            />
          </div>
        </div>

        {/* Create Campaign Dialog */}
        <CreateCampaignDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={handleCreateCampaign}
          promoters={promoters}
          campaignToDuplicate={campaignToDuplicate}
        />
      </div>
    </div>
  );
}