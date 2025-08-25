import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Star,
  Users,
  TrendingUp,
  Calendar,
  MessageCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationCenter({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());

  // Safe notifications array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  // Generate sample notifications if none exist
  const sampleNotifications = [
    {
      id: 'notif-1',
      type: 'success',
      title: 'New VIP Customer!',
      message: 'Sarah Cohen just spent ₪2,500 at your event',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      action: 'view_lead',
      actionData: { leadId: 'lead-1' }
    },
    {
      id: 'notif-2',
      type: 'info',
      title: 'Campaign Update',
      message: 'Summer Party campaign has 85% response rate',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      action: 'view_campaign',
      actionData: { campaignId: 'campaign-1' }
    },
    {
      id: 'notif-3',
      type: 'warning',
      title: 'AI Promoter Attention',
      message: 'Maya AI needs response rate optimization',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      action: 'view_promoter',
      actionData: { promoterId: 'promoter-1' }
    }
  ];

  const displayNotifications = safeNotifications.length > 0 ? safeNotifications : sampleNotifications;
  const activeNotifications = displayNotifications.filter(notif => 
    notif && !dismissed.has(notif.id)
  );

  const getNotificationIcon = (type) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info,
      error: AlertTriangle
    };
    return icons[type] || Info;
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      info: 'text-blue-600 bg-blue-50 border-blue-200',
      error: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[type] || colors.info;
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      return 'Unknown time';
    }
  };

  const handleDismiss = (notificationId) => {
    if (!notificationId) return;
    setDismissed(prev => new Set([...prev, notificationId]));
  };

  const handleNotificationAction = (notification) => {
    if (!notification || !notification.action) return;
    
    // Handle different notification actions
    switch (notification.action) {
      case 'view_lead':
        console.log('Viewing lead:', notification.actionData?.leadId);
        break;
      case 'view_campaign':
        console.log('Viewing campaign:', notification.actionData?.campaignId);
        break;
      case 'view_promoter':
        console.log('Viewing promoter:', notification.actionData?.promoterId);
        break;
      default:
        console.log('Unknown action:', notification.action);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-gray-200 hover:bg-gray-50"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {activeNotifications.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
              {activeNotifications.length > 9 ? '9+' : activeNotifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {activeNotifications.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {activeNotifications.length} new
              </Badge>
            )}
          </div>
        </div>

        {activeNotifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No new notifications</p>
            <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {activeNotifications.map((notification, index) => {
              if (!notification) return null;
              
              const NotificationIcon = getNotificationIcon(notification.type);
              const colorClasses = getNotificationColor(notification.type);
              
              return (
                <div
                  key={notification.id || `notification-${index}`}
                  className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleNotificationAction(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses}`}>
                      <NotificationIcon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {notification.title || 'No title'}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {notification.message || 'No message'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeNotifications.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-600 hover:text-gray-800 text-xs"
              onClick={() => {
                const allIds = activeNotifications.map(n => n?.id).filter(Boolean);
                setDismissed(prev => new Set([...prev, ...allIds]));
              }}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}