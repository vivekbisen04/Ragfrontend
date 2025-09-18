import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = 'https://ragbackend-io08.onrender.com/api';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send a chat message
   */
  async sendMessage(sessionId, message, options = {}) {
    try {
      const response = await this.client.post('/chat', {
        sessionId,
        message,
        options
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to send message');
    }
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId, limit = 50, offset = 0) {
    try {
      const response = await this.client.get(`/chat/${sessionId}/history`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch chat history');
    }
  }

  /**
   * Clear chat history
   */
  async clearChatHistory(sessionId) {
    try {
      const response = await this.client.post(`/chat/${sessionId}/clear`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to clear chat history');
    }
  }

  /**
   * Delete chat session
   */
  async deleteSession(sessionId) {
    try {
      const response = await this.client.delete(`/chat/${sessionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to delete session');
    }
  }

  /**
   * Search documents
   */
  async searchDocuments(query, options = {}) {
    try {
      const response = await this.client.post('/search', {
        query,
        options
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to search documents');
    }
  }

  /**
   * Get service health status
   */
  async getHealthStatus() {
    try {
      const response = await this.client.get('/health/services');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to check service health');
    }
  }

  /**
   * Get search statistics
   */
  async getSearchStats() {
    try {
      const response = await this.client.get('/search/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to get search statistics');
    }
  }

  /**
   * Handle API errors with user-friendly messages
   */
  handleError(error, defaultMessage) {
    if (error.response) {
      // Server responded with error status
      const serverMessage = error.response.data?.error?.message ||
                           error.response.data?.message ||
                           error.response.statusText;

      return new Error(`${defaultMessage}: ${serverMessage}`);
    } else if (error.request) {
      // Network error
      return new Error(`${defaultMessage}: Unable to connect to server. Please check your connection.`);
    } else {
      // Other error
      return new Error(`${defaultMessage}: ${error.message}`);
    }
  }

  /**
   * Get all articles
   */
  async getArticles() {
    try {
      const response = await this.client.get('/articles');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch articles');
    }
  }

  /**
   * Get article statistics
   */
  async getArticleStats() {
    try {
      const response = await this.client.get('/articles/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch article statistics');
    }
  }

  /**
   * Search articles
   */
  async searchArticles(query, filters = {}) {
    try {
      const params = { q: query, ...filters };
      const response = await this.client.get('/articles/search', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to search articles');
    }
  }

  /**
   * Check if API is available
   */
  async isApiAvailable() {
    try {
      await this.getHealthStatus();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;