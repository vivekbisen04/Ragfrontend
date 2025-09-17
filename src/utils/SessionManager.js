import { v4 as uuidv4 } from 'uuid';

class SessionManager {
  constructor() {
    this.storageKey = 'rag_chat_session';
    this.historyKey = 'rag_chat_history';
  }

  /**
   * Create a new chat session
   */
  createNewSession() {
    const sessionId = uuidv4();
    const sessionData = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(sessionData));
      // Clear any cached history for new session
      localStorage.removeItem(this.historyKey);
      console.log('Created new session:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to save session to localStorage:', error);
      // Return sessionId even if storage fails
      return sessionId;
    }
  }

  /**
   * Get current session ID from localStorage
   */
  getCurrentSessionId() {
    try {
      const sessionData = localStorage.getItem(this.storageKey);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        return parsed.id;
      }
      return null;
    } catch (error) {
      console.error('Failed to read session from localStorage:', error);
      return null;
    }
  }

  /**
   * Update session activity timestamp
   */
  updateSessionActivity(sessionId) {
    try {
      const sessionData = localStorage.getItem(this.storageKey);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.id === sessionId) {
          parsed.lastActivity = new Date().toISOString();
          localStorage.setItem(this.storageKey, JSON.stringify(parsed));
        }
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  /**
   * Get session info
   */
  getSessionInfo() {
    try {
      const sessionData = localStorage.getItem(this.storageKey);
      if (sessionData) {
        return JSON.parse(sessionData);
      }
      return null;
    } catch (error) {
      console.error('Failed to get session info:', error);
      return null;
    }
  }

  /**
   * Cache chat history locally for faster loading
   */
  setCachedHistory(sessionId, messages) {
    try {
      const historyData = {
        sessionId,
        messages,
        cachedAt: new Date().toISOString()
      };
      localStorage.setItem(this.historyKey, JSON.stringify(historyData));
    } catch (error) {
      console.error('Failed to cache chat history:', error);
    }
  }

  /**
   * Get cached chat history
   */
  getCachedHistory(sessionId) {
    try {
      const historyData = localStorage.getItem(this.historyKey);
      if (historyData) {
        const parsed = JSON.parse(historyData);
        if (parsed.sessionId === sessionId) {
          // Check if cache is not too old (1 hour)
          const cacheAge = Date.now() - new Date(parsed.cachedAt).getTime();
          if (cacheAge < 60 * 60 * 1000) {
            return parsed.messages;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached history:', error);
      return null;
    }
  }

  /**
   * Clear cached data
   */
  clearCache() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.historyKey);
      console.log('Session cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Clear cached history for a specific session
   */
  clearCachedHistory(sessionId) {
    try {
      const historyData = localStorage.getItem(this.historyKey);
      if (historyData) {
        const parsed = JSON.parse(historyData);
        if (parsed.sessionId === sessionId) {
          localStorage.removeItem(this.historyKey);
          console.log('Cached history cleared for session:', sessionId);
        }
      }
    } catch (error) {
      console.error('Failed to clear cached history:', error);
    }
  }

  /**
   * Generate a display name for the session
   */
  getSessionDisplayName(sessionInfo = null) {
    const info = sessionInfo || this.getSessionInfo();
    if (!info) return 'New Chat';

    const createdAt = new Date(info.createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - createdAt) / (1000 * 60));

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 24 * 60) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours}h ago`;
    } else {
      return createdAt.toLocaleDateString();
    }
  }

  /**
   * Check if session is still valid (not expired)
   */
  isSessionValid(sessionInfo = null) {
    const info = sessionInfo || this.getSessionInfo();
    if (!info) return false;

    // Consider session valid for 24 hours
    const lastActivity = new Date(info.lastActivity);
    const now = new Date();
    const diffHours = (now - lastActivity) / (1000 * 60 * 60);

    return diffHours < 24;
  }
}

// Create singleton instance
const sessionManager = new SessionManager();
export default sessionManager;