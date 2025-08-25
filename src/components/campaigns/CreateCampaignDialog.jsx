import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Campaign } from "@/api/entities";
import { 
  Plus, 
  Target, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign,
  TestTube,
  Zap,
  Bot
} from "lucide-react";
import { format } from "date-fns";

export default function CreateCampaignDialog({ open, onOpenChange, onSuccess, promoters, campaignToDuplicate }) {
  const [formData, setFormData] = useState(
    campaignToDuplicate ? { ...campaignToDuplicate, name: `${campaignToDuplicate.name} (Copy)` } : {
      name: '',
      event_name: '',
      event_date: '',
      venue: '',
      promoter_id: '',
      target_audience: [],
      message_template: '',
      is_ab_test: false,
      message_template_b: '',
      scheduled_at: '',
      message_budget: '',
      trigger_rules: {
        day_of_week: 'any',
        weather: 'any',
        customer_status: 'any'
      }
    }
  );
  const [isCreating, setIsCreating] = useState(false);

  React.useEffect(() => {
    if (campaignToDuplicate) {
      setFormData({ ...campaignToDuplicate, name: `${campaignToDuplicate.name} (Copy)` });
    }
  }, [campaignToDuplicate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await Campaign.create({
        ...formData,
        status: formData.scheduled_at ? 'scheduled' : 'draft',
        message_budget: parseFloat(formData.message_budget) || 0
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
    
    setIsCreating(false);
  };

  const handleTriggerChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      trigger_rules: {
        ...prev.trigger_rules,
        [key]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            AI Promoter Campaign
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            Create a smart AI-driven campaign for direct customer engagement
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
          {/* Event Info */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-gray-900">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Campaign Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="e.g., Friday Night Techno Party" 
                  className="bg-white border-gray-300 text-gray-900" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_name" className="text-gray-700">Event Name</Label>
                <Input 
                  id="event_name" 
                  value={formData.event_name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))} 
                  placeholder="The main event title" 
                  className="bg-white border-gray-300 text-gray-900" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue" className="text-gray-700">Venue</Label>
                <Input 
                  id="venue" 
                  value={formData.venue} 
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))} 
                  placeholder="Club/Bar name" 
                  className="bg-white border-gray-300 text-gray-900" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promoter_id" className="text-gray-700">AI Promoter</Label>
                <Select value={formData.promoter_id} onValueChange={(value) => setFormData(prev => ({ ...prev, promoter_id: value }))} required>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Choose AI Promoter" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {promoters.map(p => <SelectItem key={p.id} value={p.id} className="text-gray-700">{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Message Templates & A/B Testing */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  AI Message Templates
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-700 text-sm">A/B Testing</Label>
                  <Switch checked={formData.is_ab_test} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_ab_test: checked }))} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="message_template" className="text-gray-700">Message Template A</Label>
                <Textarea 
                  id="message_template" 
                  value={formData.message_template} 
                  onChange={(e) => setFormData(prev => ({ ...prev, message_template: e.target.value }))} 
                  placeholder="Hey {first_name}, we have an amazing party tonight..." 
                  className="bg-white border-gray-300 text-gray-900 h-24" 
                />
              </div>
              <div className={`space-y-2 ${!formData.is_ab_test && 'opacity-50'}`}>
                <Label htmlFor="message_template_b" className="text-gray-700">Message Template B</Label>
                <Textarea 
                  id="message_template_b" 
                  value={formData.message_template_b} 
                  onChange={(e) => setFormData(prev => ({ ...prev, message_template_b: e.target.value }))} 
                  placeholder="What's up {first_name}? Heard about our event tonight?" 
                  className="bg-white border-gray-300 text-gray-900 h-24" 
                  disabled={!formData.is_ab_test} 
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Smart Triggers */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-gray-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Smart Triggers
              </CardTitle>
              <p className="text-gray-600 text-xs">AI will send messages based on these conditions</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Day of Week</Label>
                <Select value={formData.trigger_rules.day_of_week} onValueChange={(value) => handleTriggerChange('day_of_week', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="any" className="text-gray-700">Any Day</SelectItem>
                    <SelectItem value="weekday" className="text-gray-700">Weekdays</SelectItem>
                    <SelectItem value="weekend" className="text-gray-700">Weekends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Weather</Label>
                <Select value={formData.trigger_rules.weather} onValueChange={(value) => handleTriggerChange('weather', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="any" className="text-gray-700">Any Weather</SelectItem>
                    <SelectItem value="sunny" className="text-gray-700">Sunny</SelectItem>
                    <SelectItem value="rainy" className="text-gray-700">Rainy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Customer Type</Label>
                <Select value={formData.trigger_rules.customer_status} onValueChange={(value) => handleTriggerChange('customer_status', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="any" className="text-gray-700">All Customers</SelectItem>
                    <SelectItem value="new" className="text-gray-700">New Customers</SelectItem>
                    <SelectItem value="returning" className="text-gray-700">Returning</SelectItem>
                    <SelectItem value="vip" className="text-gray-700">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Schedule & Budget */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-gray-900">Schedule & Message Budget</CardTitle>
              <p className="text-gray-600 text-xs">Set when AI should start and message budget limits</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Start Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-white border-gray-300 text-gray-900">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduled_at ? format(new Date(formData.scheduled_at), "PPP HH:mm") : <span>Choose date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-gray-200">
                    <Calendar mode="single" selected={formData.scheduled_at ? new Date(formData.scheduled_at) : undefined} onSelect={(date) => setFormData(prev => ({...prev, scheduled_at: date?.toISOString()}))} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Message Budget (₪)</Label>
                <Input 
                  type="number" 
                  value={formData.message_budget} 
                  onChange={(e) => setFormData(prev => ({ ...prev, message_budget: e.target.value }))} 
                  placeholder="e.g., 500" 
                  className="bg-white border-gray-300 text-gray-900" 
                />
                <p className="text-xs text-gray-500">Maximum amount to spend on messages</p>
              </div>
            </CardContent>
          </Card>
        </form>
        
        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 text-gray-700">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isCreating} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isCreating ? 'Creating...' : 'Create AI Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}