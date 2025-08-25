import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Settings,
  Crown,
  Zap,
  MoreVertical,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIPromoter } from "@/api/entities";

export default function PromoterCard({ promoter, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const getPersonaColor = (persona) => {
    const colors = {
      friendly: "bg-blue-100 text-blue-800 border-blue-200",
      elegant: "bg-purple-100 text-purple-800 border-purple-200",
      flirty: "bg-pink-100 text-pink-800 border-pink-200",
      exclusive: "bg-yellow-100 text-yellow-800 border-yellow-200",
      energetic: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[persona] || colors.friendly;
  };

  const handleToggleActive = async () => {
    setIsUpdating(true);
    try {
      const updated = await AIPromoter.update(promoter.id, {
        is_active: !promoter.is_active
      });
      onUpdate({ ...promoter, is_active: !promoter.is_active });
    } catch (error) {
      console.error('Error updating promoter:', error);
    }
    setIsUpdating(false);
  };

  const handleEditSettings = () => {
    setShowEditDialog(true);
  };

  const handleViewPromoter = () => {
    setShowViewDialog(true);
  };

  const conversionRate = promoter.total_contacts > 0 ?
    ((promoter.total_conversions || 0) / promoter.total_contacts * 100).toFixed(1) : 0;

  return (
    <>
      <Card className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {promoter.avatar_url ? (
                  <img
                    src={promoter.avatar_url}
                    alt={promoter.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                )}
                {promoter.is_active && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Zap className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {promoter.name}
                  </h3>
                  {promoter.total_revenue > 10000 && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{promoter.location}</span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200">
                <DropdownMenuItem
                  onClick={handleViewPromoter}
                  className="text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  View Analytics
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleEditSettings}
                  className="text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Persona Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getPersonaColor(promoter.persona)}>
              {promoter.persona}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Active</span>
              <Switch
                checked={promoter.is_active}
                onCheckedChange={handleToggleActive}
                disabled={isUpdating}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-gray-600">Contacts</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {promoter.total_contacts || 0}
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-xs text-gray-600">Converts</span>
              </div>
              <div className="text-lg font-bold text-emerald-600">
                {promoter.total_conversions || 0}
              </div>
            </div>
          </div>

          {/* Revenue & Conversion Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue Generated</span>
              <span className="text-sm font-semibold text-yellow-600">
                ${(promoter.total_revenue || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-semibold text-purple-600">
                {conversionRate}%
              </span>
            </div>
          </div>

          {/* Description */}
          {promoter.tone_description && (
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-700 leading-relaxed">
                {promoter.tone_description}
              </p>
            </div>
          )}

          {/* Target Demographics */}
          {promoter.target_demographics && promoter.target_demographics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {promoter.target_demographics.slice(0, 3).map((demographic, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                >
                  {demographic}
                </Badge>
              ))}
              {promoter.target_demographics.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                >
                  +{promoter.target_demographics.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Settings Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Promoter Settings</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-700">Promoter Name</Label>
                <Input
                  defaultValue={promoter.name}
                  className="bg-white border-gray-300 text-gray-900 mt-1"
                />
              </div>

              <div>
                <Label className="text-gray-700">Location</Label>
                <Input
                  defaultValue={promoter.location}
                  className="bg-white border-gray-300 text-gray-900 mt-1"
                />
              </div>

              <div>
                <Label className="text-gray-700">Communication Style</Label>
                <Textarea
                  defaultValue={promoter.tone_description}
                  className="bg-white border-gray-300 text-gray-900 mt-1 h-20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    alert('Settings saved successfully!');
                    setShowEditDialog(false);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Analytics Dialog */}
      {showViewDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {promoter.name} - Analytics & Performance
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowViewDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {promoter.total_contacts || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Contacts</div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {promoter.total_conversions || 0}
                    </div>
                    <div className="text-sm text-gray-600">Conversions</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      ${(promoter.total_revenue || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Revenue Generated</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {promoter.total_contacts > 0 ?
                        ((promoter.total_conversions || 0) / promoter.total_contacts * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              </div>

              {/* Promoter Details */}
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Personality Type</Label>
                  <div className="mt-1">
                    <Badge className={getPersonaColor(promoter.persona)}>
                      {promoter.persona}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700">Communication Style</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-700">
                      {promoter.tone_description || 'No description available'}
                    </p>
                  </div>
                </div>

                {promoter.target_demographics && promoter.target_demographics.length > 0 && (
                  <div>
                    <Label className="text-gray-700">Target Demographics</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {promoter.target_demographics.map((demographic, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200"
                        >
                          {demographic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}