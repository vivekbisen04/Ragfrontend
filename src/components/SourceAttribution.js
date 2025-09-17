import React, { useState } from 'react';
import './SourceAttribution.scss';

const SourceAttribution = ({ sources, messageId }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const formatRelevanceScore = (score) => {
    return Math.round(score * 100);
  };

  const getScoreColor = (score) => {
    const percentage = score * 100;
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'medium';
    return 'low';
  };

  const handleSourceClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="source-attribution">
      <div className="source-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="source-info">
          <span className="source-icon">📚</span>
          <span className="source-text">
            Sources ({sources.length} article{sources.length !== 1 ? 's' : ''} used)
          </span>
        </div>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div className="source-list">
          {sources.map((source, index) => (
            <div
              key={`${messageId}-source-${index}`}
              className={`source-card ${source.url ? 'clickable' : ''}`}
              onClick={() => handleSourceClick(source.url)}
            >
              <div className="source-main">
                <div className="source-header-info">
                  <span className="source-title" title={source.title}>
                    {source.title}
                  </span>
                  <div className="source-meta">
                    <span className="source-name">{source.source}</span>
                    <span className="source-date">{formatDate(source.published_date)}</span>
                  </div>
                </div>

                <div className="relevance-score">
                  <div className="score-label">Relevance</div>
                  <div className={`score-bar score-${getScoreColor(source.relevance_score)}`}>
                    <div
                      className="score-fill"
                      style={{ width: `${formatRelevanceScore(source.relevance_score)}%` }}
                    ></div>
                    <span className="score-text">
                      {formatRelevanceScore(source.relevance_score)}%
                    </span>
                  </div>
                </div>
              </div>

              {source.content_snippet && (
                <div className="source-snippet">
                  {source.content_snippet}
                </div>
              )}

              {source.url && (
                <div className="source-actions">
                  <span className="read-more">
                    📖 Read full article
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceAttribution;