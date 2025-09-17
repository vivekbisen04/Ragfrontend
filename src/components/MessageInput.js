import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.scss';

const MessageInput = ({ onSendMessage, disabled, placeholder = "Type your message..." }) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isComposing) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="message-input-container">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="message-textarea"
          rows={1}
          maxLength={2000}
        />

        <button
          type="submit"
          disabled={!canSend}
          className={`send-button ${canSend ? 'enabled' : 'disabled'}`}
          title={disabled ? 'Please wait...' : 'Send message (Enter)'}
        >
          {disabled ? (
            <div className="loading-spinner"></div>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9 22,2"/>
            </svg>
          )}
        </button>
      </div>

      <div className="message-input-footer">
        <div className="character-count">
          <span className={message.length > 1800 ? 'warning' : ''}>
            {message.length}/2000
          </span>
        </div>

        <div className="input-hints">
          <span className="hint">
            Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
          </span>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;