"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Article } from "../../../../../types/news";

interface SummaryData {
  summary: string;
  source: string;
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleId = decodeURIComponent(params.articleId as string);
        
        // Fetch all articles to find the specific one
        const response = await fetch("/api/news");
        
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        
        const articles = await response.json();
        const foundArticle = articles.find((a: Article) => a.id === articleId);
        
        if (!foundArticle) {
          throw new Error("Article not found");
        }

        // Check if content is truncated (contains "+800 characters" or is too short)
        if (foundArticle.content && 
            (foundArticle.content.length < 500)) {
          
          try {
            // Try to fetch full content from the original URL
            const contentResponse = await fetch("/api/article-content", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: foundArticle.url,
              }),
            });

            if (contentResponse.ok) {
              const contentData = await contentResponse.json();
              if (contentData.content) {
                foundArticle.content = contentData.content;
              }
            }
          } catch (contentError) {
            console.log("Failed to fetch full content:", contentError);
            // Continue with truncated content
          }
        }
        
        setArticle(foundArticle);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.articleId) {
      fetchArticle();
    }
  }, [params.articleId]);

  useEffect(() => {
    const generateSummary = async () => {
      if (!article?.content) return;
      
      try {
        setSummaryLoading(true);
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: article.content,
            title: article.title,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate summary");
        }

        const summaryData = await response.json();
        setSummary(summaryData);
      } catch (err) {
        console.error("Error generating summary:", err);
        // Don't set error state for summary failure, just log it
      } finally {
        setSummaryLoading(false);
      }
    };

    if (article) {
      generateSummary();
    }
  }, [article]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 dark:text-red-400 text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                Article Not Found
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error || "The article you're looking for doesn't exist."}</p>
              <Link 
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
              >
                Back to News
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </Link>
            <div className="text-right">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Briefly
              </h2>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Featured Image */}
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-news.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Article Info */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                {article.source}
              </span>
              <time className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(article.publishedAt)}
              </time>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {article.description}
            </p>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Read Full Article
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Summary
            </h2>
          </div>

          {summaryLoading ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 dark:text-gray-300">Generating summary...</p>
            </div>
          ) : summary ? (
            <div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
                {summary.summary}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                  {summary.source === "meaningcloud" ? "AI Generated" : "Smart Summary"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Summary not available for this article.
            </p>
          )}
        </div>

        {/* Article Content */}
        {article.content && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Article Content
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {article.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
