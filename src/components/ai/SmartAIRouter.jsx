import React from 'react';
import { InvokeLLM } from "@/api/integrations";
import { User } from "@/api/entities";

// פונקציה חכמה לבחירת ספק AI
export const routeAIRequest = async (prompt, options = {}) => {
  try {
    const user = await User.me();
    const aiSettings = user.settings?.ai_providers;
    
    if (!aiSettings) {
      // אם אין הגדרות - השתמש בברירת מחדל
      return await InvokeLLM({ prompt, ...options });
    }
    
    const { providers, primary_provider, fallback_provider, smart_routing } = aiSettings;
    
    // אם ניתוב חכם מופעל
    if (smart_routing) {
      const selectedProvider = selectBestProvider(prompt, providers, options);
      
      try {
        return await callAIProvider(selectedProvider, prompt, options);
      } catch (error) {
        console.warn(`Primary provider ${selectedProvider} failed, trying fallback...`);
        
        // נסה ספק גיבוי
        if (fallback_provider && fallback_provider !== selectedProvider) {
          return await callAIProvider(fallback_provider, prompt, options);
        }
        
        throw error;
      }
    } else {
      // השתמש בספק הראשי
      try {
        return await callAIProvider(primary_provider, prompt, options);
      } catch (error) {
        // נסה ספק גיבוי
        if (fallback_provider && fallback_provider !== primary_provider) {
          return await callAIProvider(fallback_provider, prompt, options);
        }
        
        throw error;
      }
    }
    
  } catch (error) {
    console.error('AI routing error:', error);
    
    // ניתוב אחרון - השתמש ב-InvokeLLM הרגיל
    return await InvokeLLM({ prompt, ...options });
  }
};

// בחירת הספק הטוב ביותר בהתבסס על סוג הבקשה
const selectBestProvider = (prompt, providers, options) => {
  const { response_json_schema, add_context_from_internet, file_urls } = options;
  
  // אם יש קבצים - Gemini טוב לחזייה
  if (file_urls && file_urls.length > 0) {
    if (providers.gemini?.enabled) return 'gemini';
  }
  
  // אם צריך JSON - Gemini מהיר וזול
  if (response_json_schema) {
    if (providers.gemini?.enabled) return 'gemini';
  }
  
  // אם צריך חיפוש באינטרנט - OpenAI טוב יותר
  if (add_context_from_internet) {
    if (providers.openai?.enabled) return 'openai';
  }
  
  // אם הפרומפט ארוך - Claude טוב לטקסט ארוך
  if (prompt.length > 2000) {
    if (providers.claude?.enabled) return 'claude';
  }
  
  // ברירת מחדל - הזול ביותר (Gemini)
  if (providers.gemini?.enabled) return 'gemini';
  if (providers.openai?.enabled) return 'openai';
  if (providers.claude?.enabled) return 'claude';
  
  return 'openai'; // fallback
};

// קריאה לספק AI ספציפי
const callAIProvider = async (provider, prompt, options) => {
  switch (provider) {
    case 'gemini':
      return await callGemini(prompt, options);
    case 'claude':
      return await callClaude(prompt, options);
    case 'openai':
    default:
      return await InvokeLLM({ prompt, ...options });
  }
};

// קריאה ל-Gemini (דרך Google AI Studio)
const callGemini = async (prompt, options) => {
  try {
    const user = await User.me();
    const geminiKey = user.settings?.ai_providers?.providers?.gemini?.api_key;
    
    if (!geminiKey) {
      throw new Error('Gemini API key not configured');
    }
    
    // בפרודקשן - זה צריך להיות דרך הבקאנד שלך!
    const response = await fetch('/api/ai/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${geminiKey}`
      },
      body: JSON.stringify({
        prompt,
        ...options,
        model: user.settings?.ai_providers?.providers?.gemini?.model || 'gemini-pro'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.response || data.text || data;
    
  } catch (error) {
    console.error('Gemini call failed:', error);
    throw error;
  }
};

// קריאה ל-Claude (דרך Anthropic)
const callClaude = async (prompt, options) => {
  try {
    const user = await User.me();
    const claudeKey = user.settings?.ai_providers?.providers?.claude?.api_key;
    
    if (!claudeKey) {
      throw new Error('Claude API key not configured');
    }
    
    // בפרודקשן - זה צריך להיות דרך הבקאנד שלך!
    const response = await fetch('/api/ai/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: user.settings?.ai_providers?.providers?.claude?.model || 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
        ...options
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content?.[0]?.text || data;
    
  } catch (error) {
    console.error('Claude call failed:', error);
    throw error;
  }
};

// רכיב UI להצגת בחירת הספק
export const AIProviderIndicator = ({ provider, cost, latency }) => {
  const getProviderColor = (p) => {
    switch (p) {
      case 'gemini': return 'text-blue-400';
      case 'claude': return 'text-purple-400';
      case 'openai': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };
  
  const getProviderIcon = (p) => {
    switch (p) {
      case 'gemini': return '💎';
      case 'claude': return '🧠';
      case 'openai': return '🤖';
      default: return '🔮';
    }
  };
  
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span className={getProviderColor(provider)}>
        {getProviderIcon(provider)} {provider?.toUpperCase()}
      </span>
      {cost && <span>${cost.toFixed(4)}</span>}
      {latency && <span>{latency}ms</span>}
    </div>
  );
};

export default { routeAIRequest, AIProviderIndicator };