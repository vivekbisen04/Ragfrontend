import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList.js';
import MessageInput from './MessageInput.js';
import TypingIndicator from './TypingIndicator.js';
import apiService from '../services/apiService.js';
import sessionManager from '../utils/SessionManager.js';
import './ChatInterface.scss';

const ChatInterface = ({ sessionId, selectedArticle }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history on session change
  useEffect(() => {
    if (sessionId) {
      loadChatHistory();
    }
  }, [sessionId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-ask about selected article when switching to chat
  useEffect(() => {
    if (selectedArticle && sessionId && !hasInitialized && !isLoadingHistory) {
      setHasInitialized(true);
      // Clear any existing messages for fresh start
      setMessages([]);
      setError(null);

      const question = `Tell me about: ${selectedArticle.title}`;
      // Small delay to ensure UI is ready
      setTimeout(() => {
        handleSendMessage(question);
      }, 500);
    }
  }, [selectedArticle, sessionId, hasInitialized, isLoadingHistory]);

  // Reset initialization when session changes or article changes
  useEffect(() => {
    setHasInitialized(false);
    setMessages([]);
    setError(null);
  }, [sessionId, selectedArticle]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setError(null);

      // Try to get cached history first for faster loading
      const cachedHistory = sessionManager.getCachedHistory(sessionId);
      if (cachedHistory) {
        setMessages(cachedHistory);
        setIsLoadingHistory(false);
      }

      // Fetch fresh history from server
      const response = await apiService.getChatHistory(sessionId);
      const freshMessages = response.data.messages || [];

      setMessages(freshMessages);

      // Cache the fresh history
      sessionManager.setCachedHistory(sessionId, freshMessages);
      sessionManager.updateSessionActivity(sessionId);

    } catch (error) {
      console.error('Failed to load chat history:', error);

      // Use cached history if available, even if server request failed
      const cachedHistory = sessionManager.getCachedHistory(sessionId);
      if (cachedHistory) {
        setMessages(cachedHistory);
      } else {
        setMessages([]);
        setError('Failed to load chat history. Starting fresh conversation.');
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message immediately for better UX
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Send message to API
      const response = await apiService.sendMessage(sessionId, messageText.trim());

      if (response.success) {
        const assistantMessage = response.data.message;

        // Add assistant message
        setMessages(prev => {
          const newMessages = [...prev, assistantMessage];
          // Update cache with new messages
          sessionManager.setCachedHistory(sessionId, newMessages);
          return newMessages;
        });

        // Update session activity
        sessionManager.updateSessionActivity(sessionId);

        // Log RAG context info for debugging
        if (response.data.rag_context) {
          console.log('RAG Context Used:', {
            contexts: response.data.rag_context.contexts?.length || 0,
            ragUsed: assistantMessage.metadata?.rag_used
          });
        }
      } else {
        throw new Error(response.message || 'Failed to send message');
      }

    } catch (error) {
      console.error('Failed to send message:', error);

      // Add error message
      const errorMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date().toISOString(),
        metadata: { error: true }
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await apiService.clearChatHistory(sessionId);
      setMessages([]);
      sessionManager.setCachedHistory(sessionId, []);
      setError(null);
    } catch (error) {
      console.error('Failed to clear history:', error);
      setError('Failed to clear chat history.');
    }
  };

  const handleRetry = () => {
    setError(null);
    loadChatHistory();
  };

  const handleSampleQuestionClick = (question) => {
    // Automatically send the sample question as a message
    handleSendMessage(question);
  };

  if (isLoadingHistory) {
    return (
      <div className="chat-interface">
        <div className="chat-loading">
          <div className="loading-spinner"></div>
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      {error && (
        <div className="chat-error">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="chat-container">
        <MessageList
          messages={messages}
          onSampleQuestionClick={handleSampleQuestionClick}
          selectedArticle={selectedArticle}
        />
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder={
            messages.length === 0
              ? "Ask me about the latest news..."
              : "Continue the conversation..."
          }
        />

        {messages.length > 0 && (
          <div className="chat-actions">
            <button
              onClick={handleClearHistory}
              className="clear-btn"
              disabled={isLoading}
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;