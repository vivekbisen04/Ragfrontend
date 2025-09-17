import React from 'react';
import MessageBubble from './MessageBubble.js';
import WelcomeMessage from './WelcomeMessage.js';
import './MessageList.scss';

const MessageList = ({ messages, onSampleQuestionClick, selectedArticle }) => {
  if (messages.length === 0) {
    // Only show welcome message if no article is selected
    if (!selectedArticle) {
      return (
        <div className="message-list">
          <WelcomeMessage onSampleQuestionClick={onSampleQuestionClick} />
        </div>
      );
    }
    // If article is selected but no messages yet, show loading state
    return (
      <div className="message-list">
        <div className="article-chat-intro">
          <div className="article-info">
            <h3>{selectedArticle.title}</h3>
            <p className="article-source">Source: {selectedArticle.source}</p>
            <p className="loading-text">Loading article context...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="messages-container">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message}
            isLastMessage={index === messages.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageList;