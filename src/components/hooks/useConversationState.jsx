import { useState, useEffect } from 'react';
import { ConversationState } from '@/api/entities';
import { useActivityTracker } from './useActivityTracker';

export function useConversationState(conversationId, leadId, promoterId, campaignId) {
  const [conversationState, setConversationState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackActivity } = useActivityTracker();

  useEffect(() => {
    if (conversationId) {
      loadConversationState();
    }
  }, [conversationId]);

  const loadConversationState = async () => {
    setIsLoading(true);
    try {
      // חיפוש שיחה קיימת
      const existingStates = await ConversationState.filter({
        conversation_id: conversationId
      });

      if (existingStates.length > 0) {
        setConversationState(existingStates[0]);
      } else {
        // יצירת מצב שיחה חדש
        const newState = await createConversationState();
        setConversationState(newState);
      }
    } catch (error) {
      console.error('Error loading conversation state:', error);
    }
    setIsLoading(false);
  };

  const createConversationState = async () => {
    const newState = {
      conversation_id: conversationId,
      lead_id: leadId,
      promoter_id: promoterId,
      campaign_id: campaignId,
      current_stage: 'opening',
      stage_history: [{
        stage: 'opening',
        entered_at: new Date().toISOString(),
        duration_seconds: 0,
        messages_count: 0
      }],
      conversation_context: {
        customer_mood: 'neutral',
        engagement_level: 50,
        objections_raised: [],
        interests_identified: [],
        pain_points: []
      },
      ai_insights: {
        conversion_probability: 30,
        recommended_actions: [],
        sentiment_trend: 'neutral',
        engagement_score: 50,
        next_best_action: 'introduce_value_proposition'
      },
      last_interaction: new Date().toISOString(),
      status: 'active',
      conversion_outcome: {
        converted: false,
        conversion_value: 0,
        conversion_type: null,
        conversion_date: null
      }
    };

    const created = await ConversationState.create(newState);
    
    // רישום פעילות
    await trackActivity({
      activity_type: 'conversation_start',
      component: 'conversations',
      related_entities: {
        lead_id: leadId,
        promoter_id: promoterId,
        campaign_id: campaignId,
        conversation_id: conversationId
      }
    });

    return created;
  };

  const updateStage = async (newStage, additionalContext = {}) => {
    if (!conversationState) return;

    const now = new Date().toISOString();
    const currentStageHistory = conversationState.stage_history || [];
    const lastStage = currentStageHistory[currentStageHistory.length - 1];

    // עדכון משך השלב הקודם
    if (lastStage) {
      lastStage.duration_seconds = Math.floor((new Date(now) - new Date(lastStage.entered_at)) / 1000);
    }

    const updatedState = {
      ...conversationState,
      current_stage: newStage,
      stage_history: [
        ...currentStageHistory,
        {
          stage: newStage,
          entered_at: now,
          duration_seconds: 0,
          messages_count: 0
        }
      ],
      conversation_context: {
        ...conversationState.conversation_context,
        ...additionalContext
      },
      last_interaction: now
    };

    const updated = await ConversationState.update(conversationState.id, updatedState);
    setConversationState(updated);

    // רישום פעילות
    await trackActivity({
      activity_type: 'conversation_stage_change',
      component: 'conversations',
      data: {
        previous_stage: conversationState.current_stage,
        new_stage: newStage,
        stage_duration: lastStage?.duration_seconds || 0
      },
      related_entities: {
        lead_id: leadId,
        promoter_id: promoterId,
        campaign_id: campaignId,
        conversation_id: conversationId
      }
    });

    return updated;
  };

  const updateAIInsights = async (insights) => {
    if (!conversationState) return;

    const updatedState = {
      ...conversationState,
      ai_insights: {
        ...conversationState.ai_insights,
        ...insights
      },
      last_interaction: new Date().toISOString()
    };

    const updated = await ConversationState.update(conversationState.id, updatedState);
    setConversationState(updated);

    return updated;
  };

  const recordConversion = async (conversionData) => {
    if (!conversationState) return;

    const updatedState = {
      ...conversationState,
      current_stage: 'completed',
      status: 'completed',
      conversion_outcome: {
        converted: true,
        conversion_value: conversionData.value || 0,
        conversion_type: conversionData.type || 'sale',
        conversion_date: new Date().toISOString()
      },
      last_interaction: new Date().toISOString()
    };

    const updated = await ConversationState.update(conversationState.id, updatedState);
    setConversationState(updated);

    // רישום פעילות המרה
    await trackActivity({
      activity_type: 'conversion',
      component: 'conversations',
      data: conversionData,
      related_entities: {
        lead_id: leadId,
        promoter_id: promoterId,
        campaign_id: campaignId,
        conversation_id: conversationId
      },
      business_impact: {
        revenue_generated: conversionData.value || 0,
        conversion_value: conversionData.value || 0
      }
    });

    return updated;
  };

  return {
    conversationState,
    isLoading,
    updateStage,
    updateAIInsights,
    recordConversion,
    reloadState: loadConversationState
  };
}