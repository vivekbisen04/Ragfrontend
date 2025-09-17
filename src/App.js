import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface.js';
import ArticleGrid from './components/ArticleGrid.js';
import Header from './components/Header.js';
import SessionManager from './utils/SessionManager.js';
import './styles/App.scss';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('articles');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    // Initialize or restore session
    const initializeSession = async () => {
      try {
        const existingSessionId = SessionManager.getCurrentSessionId();
        if (existingSessionId) {
          setSessionId(existingSessionId);
        } else {
          const newSessionId = SessionManager.createNewSession();
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        // Create new session as fallback
        const newSessionId = SessionManager.createNewSession();
        setSessionId(newSessionId);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const handleNewSession = () => {
    const newSessionId = SessionManager.createNewSession();
    setSessionId(newSessionId);
    setSelectedArticle(null);
    setCurrentView('articles');
  };

  const handleArticleSelect = (article) => {
    // Create a completely new session for each article to avoid context contamination
    const newSessionId = SessionManager.createNewSession();

    // Clear any cached data for clean start
    SessionManager.clearCachedHistory(newSessionId);

    setSessionId(newSessionId);
    setSelectedArticle(article);
    setCurrentView('chat');
  };

  const handleBackToArticles = () => {
    setCurrentView('articles');
    setSelectedArticle(null);
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Initializing RAG Chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        onNewSession={handleNewSession}
        showBackButton={currentView === 'chat'}
        onBackClick={handleBackToArticles}
        selectedArticle={selectedArticle}
      />
      <main className="main-content">
        {currentView === 'articles' ? (
          <ArticleGrid onArticleSelect={handleArticleSelect} />
        ) : (
          <ChatInterface
            sessionId={sessionId}
            selectedArticle={selectedArticle}
          />
        )}
      </main>
    </div>
  );
}

export default App;