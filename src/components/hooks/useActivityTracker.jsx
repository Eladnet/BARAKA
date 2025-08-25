import { useState, useEffect } from 'react';
import { ActivityLog } from '@/api/entities';
import { User } from '@/api/entities';

export function useActivityTracker() {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.log('User not authenticated');
      }
    };
    loadUser();
  }, []);

  const trackActivity = async (activityData) => {
    if (!currentUser) return;

    const startTime = Date.now();
    
    try {
      const deviceInfo = {
        device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        os: navigator.platform,
        browser: navigator.userAgent.split(') ')[0].split(' (')[1] || 'Unknown',
        screen_resolution: `${screen.width}x${screen.height}`
      };

      const activity = {
        user_id: currentUser.id,
        session_id: sessionId,
        activity_type: activityData.activity_type,
        component: activityData.component,
        action_details: {
          element_id: activityData.element_id,
          element_type: activityData.element_type,
          element_text: activityData.element_text,
          page_url: window.location.href,
          referrer: document.referrer,
          data: activityData.data || {}
        },
        result: activityData.result || 'success',
        error_message: activityData.error_message,
        response_time_ms: Date.now() - startTime,
        ip_address: 'client_side', // יתמלא בצד השרת
        user_agent: navigator.userAgent,
        device_info: deviceInfo,
        related_entities: activityData.related_entities || {},
        business_impact: activityData.business_impact || {}
      };

      await ActivityLog.create(activity);
      
      return activity;
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  };

  // מעקב אוטומטי אחר לחיצות
  const trackClick = (event, additionalData = {}) => {
    const element = event.target;
    return trackActivity({
      activity_type: 'button_click',
      component: additionalData.component || 'unknown',
      element_id: element.id,
      element_type: element.tagName.toLowerCase(),
      element_text: element.textContent?.substr(0, 100),
      data: additionalData
    });
  };

  // מעקב אחר צפייה בעמוד
  const trackPageView = (component, additionalData = {}) => {
    return trackActivity({
      activity_type: 'page_view',
      component: component,
      data: {
        page_title: document.title,
        ...additionalData
      }
    });
  };

  // מעקב אחר שליחת טפסים
  const trackFormSubmit = (formName, formData, component) => {
    return trackActivity({
      activity_type: 'form_submit',
      component: component,
      data: {
        form_name: formName,
        form_data: formData
      }
    });
  };

  // מעקב אחר חיפושים
  const trackSearch = (searchTerm, filters, component) => {
    return trackActivity({
      activity_type: 'search',
      component: component,
      data: {
        search_term: searchTerm,
        filters: filters,
        results_count: filters.results_count || 0
      }
    });
  };

  // מעקב אחר המרות
  const trackConversion = (conversionData, component) => {
    return trackActivity({
      activity_type: 'conversion',
      component: component,
      data: conversionData.data || {},
      related_entities: conversionData.related_entities || {},
      business_impact: {
        revenue_generated: conversionData.revenue || 0,
        conversion_value: conversionData.value || 0
      }
    });
  };

  return {
    trackActivity,
    trackClick,
    trackPageView,
    trackFormSubmit,
    trackSearch,
    trackConversion,
    sessionId,
    currentUser
  };
}