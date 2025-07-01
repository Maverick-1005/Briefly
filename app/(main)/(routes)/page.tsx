"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "../../../types/news";
import SearchIcon from '@mui/icons-material/Search';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchNews = async (query?: string) => {
    try {
      setLoading(true);
      setIsSearching(!!query);
      
      const url = query 
        ? `/api/news?query=${encodeURIComponent(query)}`
        : "/api/news";
        
      const response = await fetch(url);
      
      if (!response) {
        throw new Error("Failed to fetch news articles");
      }
      
      const data = await response.json();
      setArticles(data);
      
      // Store search results in localStorage if this is a search
      if (query && data.length > 0) {
        localStorage.setItem('searchResults', JSON.stringify(data));
        localStorage.setItem('searchQuery', query);
      } else if (!query) {
        // Clear search results when fetching main feed
        localStorage.removeItem('searchResults');
        localStorage.removeItem('searchQuery');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(localStorage.getItem('searchQuery') && localStorage.getItem('searchResults')) {
      setSearchQuery(localStorage.getItem('searchQuery') || "");
      setArticles(JSON.parse(localStorage.getItem('searchResults') || "[]"));
    }
    fetchNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchNews();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Briefly
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Stay updated with the most recent headlines
            </p>
          </div>
          
          {/* Loading State */}
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Loading latest news...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Briefly
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Stay updated with the most recent headlines
            </p>
          </div>
          
          {/* Error State */}
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Briefly
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Stay updated with the most recent headlines
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for news articles..."
                  className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
             
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Search
              </button>
              {isSearching && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* Search Results Header */}
          {isSearching && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Found {articles.length} article{articles.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
        
        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {isSearching ? "No articles found" : "No articles found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isSearching 
                  ? `No articles found for "${searchQuery}". Try a different search term.`
                  : "Check back later for the latest news"
                }
              </p>
              {isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Latest News
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Link 
                key={article.id} 
                href={`/article/${encodeURIComponent(article.id)}`}
                className="group"
              >
                <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 h-[500px] flex flex-col">
                 
                  {/* Image Container */}
                  <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-news.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                      {article.description}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                          {article.source}
                        </span>
                      </div>
                      <time className="font-medium">
                        {formatDate(article.publishedAt)}
                      </time>
                    </div>
                    
                    {/* Read More Button */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                        Read More →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Powered by NewsAPI.org • Updated every hour
          </p>
        </div>
      </div>
    </div>
  );
}
