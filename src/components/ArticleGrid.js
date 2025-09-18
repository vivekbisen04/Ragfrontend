import React, { useState, useEffect } from 'react';
import './ArticleGrid.scss';
import apiService from '../services/apiService.js';

const ArticleGrid = ({ onArticleSelect }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getArticles();

      if (data.success) {
        setArticles(data.data.articles || []);
        setMetadata(data.data.metadata || null);
        setLastUpdated(data.data.metadata?.last_updated || new Date().toISOString());
      } else {
        setError('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Error loading articles. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchArticles();
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const data = await apiService.searchArticles(query, {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        limit: 50
      });

      if (data.success) {
        setArticles(data.data.articles || []);
        setMetadata({
          ...metadata,
          total_articles: data.data.search_info?.total_results || 0
        });
      } else {
        setError('Search failed');
      }
    } catch (error) {
      console.error('Error searching articles:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchArticles();
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
        <div className="header-top">
          <h2>Browse News Articles</h2>
          <div className="header-actions">
            <button
              onClick={fetchArticles}
              className="refresh-btn"
              disabled={loading}
              title="Refresh articles"
            >
              {loading ? '⟳' : '↻'} Refresh
            </button>
          </div>
        </div>

        <p>Select an article to ask questions about it using our RAG-powered AI</p>

        {metadata && (
          <div className="article-stats">
            <div className="stats-row">
              <span className="stat-item">
                <strong>{metadata.total_articles}</strong> articles
              </span>
              <span className="stat-item">
                <strong>{metadata.categories?.length || 0}</strong> categories
              </span>
              <span className="stat-item">
                <strong>{metadata.sources?.length || 0}</strong> sources
              </span>
              {lastUpdated && (
                <span className="stat-item">
                  Updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="search-section">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search articles by title or content..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="clear-search-btn"
                title="Clear search"
              >
                ✕
              </button>
            )}
            {isSearching && <div className="search-spinner">⟳</div>}
          </div>
        </div>

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
          <p>
            {searchQuery
              ? `No articles found matching "${searchQuery}"`
              : 'No articles found in this category'
            }
          </p>
          {searchQuery && (
            <button onClick={clearSearch} className="clear-search-link">
              Clear search to see all articles
            </button>
          )}
        </div>
      ) : (
        <div className="articles-container">
          <div className="articles-stats">
            <span>
              {searchQuery
                ? `${filteredArticles.length} results found`
                : `${filteredArticles.length} articles available`
              }
            </span>
            {selectedCategory !== 'all' && (
              <span className="category-filter-active">
                Filtered by: {selectedCategory.replace('_', ' ')}
              </span>
            )}
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