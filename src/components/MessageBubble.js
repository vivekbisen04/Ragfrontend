import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SourceAttribution from './SourceAttribution.js';
import './MessageBubble.scss';

const MessageBubble = ({ message, isLastMessage }) => {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isError = message.metadata?.error;
  const ragUsed = message.metadata?.rag_used;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProcessingTime = () => {
    const time = message.metadata?.processing_time_ms || message.metadata?.total_processing_time_ms;
    if (time) {
      return time > 1000 ? `${(time / 1000).toFixed(1)}s` : `${time}ms`;
    }
    return null;
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'} ${isError ? 'error' : ''}`}>
      <div className="message-content">
        <div className="message-text">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                // Prevent code blocks from breaking layout
                code: ({ node, inline, ...props }) => (
                  inline ? (
                    <code className="inline-code" {...props} />
                  ) : (
                    <pre className="code-block">
                      <code {...props} />
                    </pre>
                  )
                ),
                // Style links
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Add Source Attribution for assistant messages with RAG */}
        {!isUser && ragUsed && message.metadata?.sources && (
          <SourceAttribution
            sources={message.metadata.sources}
            messageId={message.id}
          />
        )}

        {!isUser && (
          <div className="message-actions">
            <button
              onClick={handleCopy}
              className={`copy-btn ${copied ? 'copied' : ''}`}
              title={copied ? 'Copied!' : 'Copy message'}
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="message-metadata">
        <div className="message-info">
          <span className="message-time">
            {formatTimestamp(message.timestamp)}
          </span>

          {!isUser && ragUsed !== undefined && (
            <span className={`rag-indicator ${ragUsed ? 'rag-used' : 'no-rag'}`}>
              {ragUsed ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11H1l5-9 5 9z"/>
                    <path d="M20 12h-8l4-7 4 7z"/>
                  </svg>
                  RAG
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  General
                </>
              )}
            </span>
          )}

          {!isUser && getProcessingTime() && (
            <span className="processing-time">
              {getProcessingTime()}
            </span>
          )}

          {!isUser && message.metadata?.model && (
            <span className="model-info">
              {message.metadata.model}
            </span>
          )}
        </div>

        {isError && (
          <div className="error-indicator">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Error occurred
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;