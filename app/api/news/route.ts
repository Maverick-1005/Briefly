import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const apiKey = process.env.NEWSAPI_API_KEY;
    
    // Try NewsAPI.org first if API key is available
    if (apiKey) {
      try {
        const url = query 
          ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=10&apiKey=${apiKey}`
          : `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`;
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          
          const articles = data.articles?.map((article: any) => ({
            id: article.url,
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.urlToImage || "/placeholder-news.svg",
            source: article.source?.name || "Unknown Source",
            publishedAt: article.publishedAt,
            content: article.content
          })) || [];
          
          return NextResponse.json(articles);
        }
      } catch (error) {
        console.log("NewsAPI.org failed, trying GNews:", error);
      }
    }

    // Fallback to GNews API (free tier with full content)
    const gnewsApiKey = process.env.GNEWS_API_KEY;
    const gnewsUrl = query 
      ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${gnewsApiKey}`
      : `https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=10&apikey=${gnewsApiKey}`;
    
    const gnewsResponse = await fetch(gnewsUrl);
    
    if (!gnewsResponse) {
      throw new Error(`HTTP error! status: 500}`);
    }
    
    const gnewsData = await gnewsResponse.json();
    
    const articles = gnewsData.articles?.map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image || "/placeholder-news.svg",
      source: article.source?.name || "Unknown Source",
      publishedAt: article.publishedAt,
      content: article.content || article.description // GNews provides full content
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