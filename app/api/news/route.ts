import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    console.log("apiKey", apiKey);
    if (!apiKey) {
      throw new Error("NEWS_API_KEY environment variable is not set");
    }

    // Fetch latest news articles from NewsAPI.org
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match our expected format
    const articles = data.articles?.map((article: any) => ({
      id: article.url, // Using URL as ID since NewsAPI doesn't provide a unique ID
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage || "/placeholder-news.svg",
      source: article.source?.name || "Unknown Source",
      publishedAt: article.publishedAt,
      content: article.content
    })) || [];
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news articles" },
      { status: 500 }
    );
  }
}