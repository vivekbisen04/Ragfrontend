import React from 'react';
import './TypingIndicator.scss';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-content">
        <div className="typing-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div className="typing-bubble">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="typing-text">AI is thinking...</div>
    </div>
  );
};

export default TypingIndicator;