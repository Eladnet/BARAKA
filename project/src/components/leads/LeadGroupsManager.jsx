
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Filter,
  X,
  Save,
  Settings
} from "lucide-react";
import { LeadGroup } from "@/api/entities";
import { Lead } from "@/api/entities";
import { useTranslation } from '@/components/lib/translations';

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' }
];

export default function LeadGroupsManager({ onGroupSelect, selectedGroup, showInDialog = false }) {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);
  
  const [groups, setGroups] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    filters: {
      status: [],
      spending_category: [],
      location: '',
      vip_potential: []
    }
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const fetchedGroups = await LeadGroup.list('-created_date');
      const groupsWithCounts = await Promise.all(
        fetchedGroups.map(async (group) => {
          try {
            const leads = await Lead.filter({ lead_groups: group.id });
            return { ...group, lead_count: leads.length };
          } catch (error) {
            console.warn(`Could not load leads for group ${group.id}:`, error);
            return { ...group, lead_count: 0 };
          }
        })
      );
      setGroups(groupsWithCounts);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setFormData({
      name: '',
      description: '',
      color: 'blue',
      filters: {
        status: [],
        spending_category: [],
        location: '',
        vip_potential: []
      }
    });
    setShowCreateDialog(true);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name || '',
      description: group.description || '',
      color: group.color || 'blue',
      filters: group.filters || {
        status: [],
        spending_category: [],
        location: '',
        vip_potential: []
      }
    });
    setShowCreateDialog(true);
  };

  const handleSaveGroup = async () => {
    try {
      const groupData = {
        ...formData,
        lead_count: 0, // This will be calculated on load, not saved
        is_active: true,
        created_date: new Date().toISOString()
      };

      if (editingGroup) {
        await LeadGroup.update(editingGroup.id, groupData);
      } else {
        await LeadGroup.create(groupData);
      }

      setShowCreateDialog(false);
      loadGroups();
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Error saving group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!confirm(t('Are you sure you want to delete this group?'))) return;

    try {
      const leads = await Lead.filter({ lead_groups: groupId });
      await Promise.all(
        leads.map(lead => {
          const updatedGroups = (lead.lead_groups || []).filter(g => g !== groupId);
          return Lead.update(lead.id, { lead_groups: updatedGroups });
        })
      );

      await LeadGroup.delete(groupId);
      loadGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Error deleting group');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value
      }
    }));
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleAllLeadsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('All Leads clicked - handler called'); // לצורך debug
    if (onGroupSelect && typeof onGroupSelect === 'function') {
      onGroupSelect(null);
    }
  };

  const handleGroupClick = (group, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Group clicked:', group); // לצורך debug
    if (onGroupSelect && typeof onGroupSelect === 'function') {
      onGroupSelect(group);
    }
  };

  return (
    <div className="space-y-3">
      {/* כפתור All Leads */}
      <Card
        className={`cursor-pointer transition-all duration-200 border hover:shadow-md ${
          !selectedGroup
            ? 'bg-purple-100 border-purple-300 ring-2 ring-purple-200'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
        onClick={handleAllLeadsClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${!selectedGroup ? 'bg-purple-500' : 'bg-gray-500'}`}></div>
              <span className={`font-medium ${!selectedGroup ? 'text-purple-700' : 'text-gray-700'}`}>
                {t("All Leads")}
              </span>
            </div>
            <Badge variant="outline" className={!selectedGroup ? 'border-purple-300 text-purple-600' : 'border-gray-300 text-gray-600'}>
              {t("Show All")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* רשימת הקבוצות */}
      {groups.map(group => (
        <Card
          key={group.id}
          className={`cursor-pointer transition-all duration-200 border hover:shadow-md ${
            selectedGroup?.id === group.id
              ? 'bg-purple-100 border-purple-300 ring-2 ring-purple-200'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
          onClick={(e) => handleGroupClick(group, e)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-3 h-3 rounded-full bg-${group.color}-500 flex-shrink-0`}></div>
                <div className="min-w-0 flex-1">
                  <span className={`font-medium block truncate ${
                    selectedGroup?.id === group.id ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {group.name}
                  </span>
                  {group.description && (
                    <p className="text-gray-500 text-sm mt-1 truncate">{group.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className={getColorClass(group.color)}>
                  <Users className="w-3 h-3 mr-1" />
                  {group.lead_count || 0}
                </Badge>
                {showInDialog && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGroup(group);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {showInDialog && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={handleCreateGroup}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("Create New Group")}
          </Button>
        </div>
      )}

      {/* Dialog עבור יצירה/עריכה */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingGroup ? t('Edit Group') : t('New Group')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">{t("Group Name")}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t("e.g., VIP Customers")}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">{t("Color")}</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {colorOptions.map(color => (
                      <SelectItem key={color.value} value={color.value} className="text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                          {t(color.label)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">{t("Description")}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t("A short description for this group...")}
                className="bg-slate-800 border-slate-700 text-white h-20"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t("Automatic Filters")}
              </h4>
              <p className="text-slate-400 text-sm">
                {t("Leads matching these filters will be automatically added to the group.")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">{t("Status")}</Label>
                  <div className="space-y-2">
                    {['cold', 'warm', 'engaged', 'converted', 'vip', 'inactive'].map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={formData.filters.status.includes(status)}
                          onCheckedChange={(checked) => {
                            const newStatus = checked
                              ? [...formData.filters.status, status]
                              : formData.filters.status.filter(s => s !== status);
                            handleFilterChange('status', newStatus);
                          }}
                        />
                        <Label htmlFor={`status-${status}`} className="text-slate-300 capitalize">{t(status)}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t("Spending Category")}</Label>
                  <div className="space-y-2">
                    {['budget', 'moderate', 'premium', 'luxury'].map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                           id={`spending-${category}`}
                          checked={formData.filters.spending_category.includes(category)}
                          onCheckedChange={(checked) => {
                            const newCategories = checked
                              ? [...formData.filters.spending_category, category]
                              : formData.filters.spending_category.filter(c => c !== category);
                            handleFilterChange('spending_category', newCategories);
                          }}
                        />
                        <Label htmlFor={`spending-${category}`} className="text-slate-300 capitalize">{t(category)}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">{t("Location")}</Label>
                <Input
                  value={formData.filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder={t("e.g., Tel Aviv, Haifa, Jerusalem...")}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleSaveGroup} className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              {editingGroup ? t('Update') : t('Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
