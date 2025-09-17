import React from 'react';
import './WelcomeMessage.scss';

const WelcomeMessage = ({ onSampleQuestionClick }) => {
  const sampleQuestions = [
    "What did the Supreme Court say about UGC and caste bias?",
    "Tell me about Kashmir's fruit market shutdown",
    "What's happening with India-Pakistan in the Asia Cup?",
    "Any news about advance tax deadlines?",
    "What's the latest on BMW accident case?",
    "Tell me about India-China relations"
  ];

  return (
    <div className="welcome-message">
      <div className="welcome-content">
        <div className="welcome-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M9 9l.01 0"/>
            <path d="M13 9l.01 0"/>
            <path d="M17 9l.01 0"/>
          </svg>
        </div>

        <div className="welcome-text">
          <h2>Welcome to RAG News Chatbot</h2>
          <p>
            I'm an AI assistant powered by Retrieval-Augmented Generation.
            I can answer your questions about the latest Indian news by searching through
            my knowledge base of 50+ recent articles from trusted sources.
          </p>
        </div>

        <div className="welcome-features">
          <div className="feature">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H1l5-9 5 9z"/>
                <path d="M20 12h-8l4-7 4 7z"/>
              </svg>
            </div>
            <div className="feature-text">
              <strong>RAG-Powered</strong>
              <span>Searches real news articles for accurate answers</span>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="feature-text">
              <strong>Smart Responses</strong>
              <span>Uses Google Gemini AI for natural conversations</span>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="feature-text">
              <strong>Session Memory</strong>
              <span>Remembers context throughout our conversation</span>
            </div>
          </div>
        </div>

        <div className="sample-questions">
          <h3>Try asking me:</h3>
          <div className="questions-grid">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                className="sample-question"
                onClick={(e) => {
                  if (onSampleQuestionClick) {
                    // Add visual feedback
                    e.target.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                      e.target.style.transform = 'scale(1)';
                    }, 150);

                    // Send the question
                    onSampleQuestionClick(question);
                  }
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;