import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { AIPromoter } from "@/api/entities";

const PERSONAS = [
  { value: 'friendly', label: 'Friendly', description: 'Warm, approachable, and welcoming' },
  { value: 'elegant', label: 'Elegant', description: 'Sophisticated, refined, and classy' },
  { value: 'flirty', label: 'Flirty', description: 'Playful, charming, and engaging' },
  { value: 'exclusive', label: 'Exclusive', description: 'Elite, selective, and premium' },
  { value: 'energetic', label: 'Energetic', description: 'High-energy, exciting, and vibrant' }
];

const COMMON_DEMOGRAPHICS = [
  'Young Professionals', 'College Students', 'Socialites', 'Music Lovers',
  'Party Enthusiasts', 'VIP Clients', 'Influencers', 'Tourists',
  'Corporate Groups', 'Birthday Celebrants'
];

export default function CreatePromoterDialog({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    persona: '',
    location: '',
    tone_description: '',
    avatar_url: '',
    target_demographics: []
  });
  const [newDemographic, setNewDemographic] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await AIPromoter.create({
        ...formData,
        is_active: true
      });
      
      setFormData({
        name: '',
        persona: '',
        location: '',
        tone_description: '',
        avatar_url: '',
        target_demographics: []
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating promoter:', error);
    }
    
    setIsCreating(false);
  };

  const addDemographic = (demographic) => {
    if (demographic && !formData.target_demographics.includes(demographic)) {
      setFormData(prev => ({
        ...prev,
        target_demographics: [...prev.target_demographics, demographic]
      }));
    }
    setNewDemographic('');
  };

  const removeDemographic = (demographic) => {
    setFormData(prev => ({
      ...prev,
      target_demographics: prev.target_demographics.filter(d => d !== demographic)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Create AI Promoter
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Promoter Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., LiorAI, ClubberBot"
                className="bg-white border-gray-300 text-gray-900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Tel Aviv, Miami, Berlin"
                className="bg-white border-gray-300 text-gray-900"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona" className="text-gray-700">Persona</Label>
            <Select 
              value={formData.persona} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, persona: value }))}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Choose a personality type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {PERSONAS.map((persona) => (
                  <SelectItem key={persona.value} value={persona.value} className="text-gray-700">
                    <div>
                      <div className="font-medium">{persona.label}</div>
                      <div className="text-xs text-gray-500">{persona.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone_description" className="text-gray-700">Communication Style</Label>
            <Textarea
              id="tone_description"
              value={formData.tone_description}
              onChange={(e) => setFormData(prev => ({ ...prev, tone_description: e.target.value }))}
              placeholder="Describe how this AI promoter should communicate with customers..."
              className="bg-white border-gray-300 text-gray-900 h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url" className="text-gray-700">Avatar URL (Optional)</Label>
            <Input
              id="avatar_url"
              value={formData.avatar_url}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">Target Demographics</Label>
            
            {/* Quick add buttons */}
            <div className="flex flex-wrap gap-2">
              {COMMON_DEMOGRAPHICS.map((demographic) => (
                <Button
                  key={demographic}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDemographic(demographic)}
                  disabled={formData.target_demographics.includes(demographic)}
                  className="text-xs border-gray-300 text-gray-700 hover:bg-purple-50"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {demographic}
                </Button>
              ))}
            </div>

            {/* Custom demographic input */}
            <div className="flex gap-2">
              <Input
                value={newDemographic}
                onChange={(e) => setNewDemographic(e.target.value)}
                placeholder="Add custom demographic..."
                className="bg-white border-gray-300 text-gray-900"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addDemographic(newDemographic);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addDemographic(newDemographic)}
                className="border-gray-300 text-gray-700 hover:bg-purple-50"
              >
                Add
              </Button>
            </div>

            {/* Selected demographics */}
            {formData.target_demographics.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-purple-50 border border-purple-200">
                {formData.target_demographics.map((demographic) => (
                  <Badge
                    key={demographic}
                    variant="outline"
                    className="bg-purple-100 text-purple-800 border-purple-300 flex items-center gap-1"
                  >
                    {demographic}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                      onClick={() => removeDemographic(demographic)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !formData.name || !formData.persona || !formData.location}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isCreating ? 'Creating...' : 'Create Promoter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}