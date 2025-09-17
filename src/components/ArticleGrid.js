import React, { useState, useEffect } from 'react';
import './ArticleGrid.scss';

const ArticleGrid = ({ onArticleSelect }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      const data = await response.json();

      if (data.success) {
        setArticles(data.data.articles || []);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Error loading articles');
    } finally {
      setLoading(false);
    }
  };

  const getUniqueCategories = () => {
    const categories = new Set(['all']);
    articles.forEach(article => {
      if (article.category) {
        categories.add(article.category);
      }
    });
    return Array.from(categories);
  };

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => {
        return article.category && article.category.toLowerCase() === selectedCategory.toLowerCase();
      });

  const handleArticleClick = (article) => {
    if (onArticleSelect) {
      onArticleSelect(article);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="article-grid">
        <div className="article-loading">
          <div className="loading-spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-grid">
        <div className="article-error">
          <p>{error}</p>
          <button onClick={fetchArticles} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-grid">
      <div className="article-header">
        <h2>Browse News Articles</h2>
        <p>Select an article to ask questions about it using our RAG-powered AI</p>

        <div className="category-filter">
          {getUniqueCategories().map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="no-articles">
          <p>No articles found in this category</p>
        </div>
      ) : (
        <div className="articles-container">
          <div className="articles-stats">
            <span>{filteredArticles.length} articles available</span>
          </div>

          <div className="articles-grid">
            {filteredArticles.map((article, index) => (
              <div
                key={`article-${article.id || article.url || article.title || index}-${index}`}
                className="article-card"
                onClick={() => handleArticleClick(article)}
              >
                <div className="article-meta">
                  <span className="article-source">{article.source || 'Unknown'}</span>
                  <span className="article-date">{formatDate(article.published_date)}</span>
                </div>

                <h3 className="article-title">{article.title}</h3>

                <div className="article-summary">
                  {article.summary ? (
                    <p>{article.summary.substring(0, 150)}...</p>
                  ) : (
                    <p>{article.content ? article.content.substring(0, 150) + '...' : 'No summary available'}</p>
                  )}
                </div>

                {article.category && (
                  <div className="article-category">
                    <span className="category-tag">{article.category.replace('_', ' ')}</span>
                  </div>
                )}

                <div className="article-actions">
                  <button className="ask-btn">
                    Ask questions about this article
                  </button>

                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="read-more-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read original
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;