import React from 'react';
import './Header.scss';

const Header = ({ onNewSession, showBackButton, onBackClick, selectedArticle }) => {
  return (
    <header className="header">
      <div className="header-content">
        {showBackButton && (
          <button className="back-btn" onClick={onBackClick} title="Back to articles">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        )}

        <div className="header-title">
          <h1>RAG News Chatbot</h1>
          {selectedArticle ? (
            <p className="header-subtitle">
              <span className="article-context">
                Discussing: <strong>{selectedArticle.title}</strong>
                <span className="article-source"> - {selectedArticle.source}</span>
              </span>
            </p>
          ) : (
            <p className="header-subtitle">Browse articles and ask questions using our RAG-powered AI</p>
          )}
        </div>

        <div className="header-actions">
          <button
            className="new-chat-btn"
            onClick={onNewSession}
            title="Browse articles or start new conversation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Home
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;