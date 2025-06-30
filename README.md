# 📰 Briefly - AI-Powered News Aggregator

A modern, responsive news application built with Next.js that aggregates the latest headlines from multiple sources and provides AI-generated summaries. Stay informed with the most recent news from around the world, enhanced with intelligent content summarization.

![Briefly App](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![AI Powered](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge)

## 🌐 Live Demo

**🚀 [View Live Application](https://brieflylatestnews.vercel.app/)**

Experience the full functionality of Briefly - search for news, read articles with AI summaries, and explore the modern interface.

## 🌟 Features

### 📱 Modern User Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects and transitions for enhanced UX
- **Uniform Card Layout**: Consistent article card sizes with flexbox

### 🔍 Smart Search Functionality
- **Real-time Search**: Instant search across multiple news sources
- **Search Results Caching**: localStorage-based caching for seamless navigation
- **Universal Article Access**: Search results work seamlessly with article detail pages

### 🤖 AI-Powered Content Enhancement
- **Intelligent Summaries**: AI-generated article summaries using Gemini (Google GenAI) API
- **Content Extraction**: Full article content scraping from original sources
- **Smart Fallbacks**: Multiple summarization methods for reliability

### 📰 News Aggregation
- **Multiple Sources**: NewsAPI.org and GNews integration
- **Latest Headlines**: Real-time top headlines from around the world
- **Full Content Access**: Complete article content with source links
- **Source Attribution**: Clear source identification and timestamps

### 🎨 Visual Design
- **Gradient Themes**: Beautiful blue-to-purple gradients throughout
- **Professional Typography**: Clean, readable fonts with proper hierarchy
- **Interactive Elements**: Hover states and loading animations
- **Brand Identity**: Custom "N" favicon representing news

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Modern state management
- **Next.js Image**: Optimized image loading

### Backend & APIs
- **Next.js API Routes**: Serverless API endpoints
- **NewsAPI.org**: Primary news data source
- **GNews API**: Secondary news source with full content
- **Gemini (Google GenAI) API**: AI-powered text summarization
- **Axios**: HTTP client for API requests

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Next.js DevTools**: Development optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for news services

### Option 1: Try the Live Demo
**🌐 [Visit Briefly Live](https://brieflylatestnews.vercel.app/)**

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/briefly-news.git
   cd briefly-news
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # News APIs
   NEWSAPI_API_KEY=your_newsapi_key_here
   GNEWS_API_KEY=your_gnews_key_here
   
   # AI Summarization
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: Base URL for deployment
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 API Setup

### Required API Keys

#### 1. NewsAPI.org
- **Purpose**: Primary news source for headlines and search
- **Sign up**: [https://newsapi.org/register](https://newsapi.org/register)
- **Free tier**: 1,000 requests/day
- **Rate limit**: 100 requests/day for free tier

#### 2. GNews API
- **Purpose**: Secondary news source with full article content
- **Sign up**: [https://gnews.io/](https://gnews.io/)
- **Free tier**: 100 requests/day
- **Features**: Full article content, multiple languages

#### 3. Gemini (Google GenAI) API
- **Purpose**: AI-powered text summarization
- **Sign up**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Free tier**: Generous free quota (see Google GenAI docs)
- **Features**: Fast, high-quality text summarization

## 📁 Project Structure

```
briefly-news/
├── app/
│   ├── (main)/
│   │   └── (routes)/
│   │       ├── page.tsx              # Homepage with news grid
│   │       └── article/
│   │           └── [articleId]/
│   │               └── page.tsx      # Article detail page
│   ├── api/
│   │   ├── news/
│   │   │   └── route.ts              # News aggregation API
│   │   ├── article-content/
│   │   │   └── route.ts              # Content scraping API
│   │   └── summarize/
│   │       └── route.ts              # AI summarization API
│   ├── globals.css                   # Global styles
│   └── layout.tsx                    # Root layout
├── components/
│   └── NewsCard.tsx                  # Reusable article card
├── types/
│   └── news.ts                       # TypeScript interfaces
├── public/
│   ├── icon.svg                      # App favicon
│   └── placeholder-news.svg          # Placeholder image
└── README.md
```

## 🔌 API Endpoints

### 1. GET `/api/news`
Fetches latest news articles or search results.

**Query Parameters:**
- `query` (optional): Search term for filtering articles

**Response:**
```json
[
  {
    "id": "article_url",
    "title": "Article Title",
    "description": "Article description",
    "url": "https://example.com/article",
    "image": "https://example.com/image.jpg",
    "source": "Source Name",
    "publishedAt": "2024-01-01T00:00:00Z",
    "content": "Article content..."
  }
]
```

### 2. POST `/api/article-content`
Scrapes full article content from original URLs.

**Request Body:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "content": "Full article content...",
  "url": "https://example.com/article"
}
```

### 3. POST `/api/summarize`
Generates AI-powered article summaries.

**Request Body:**
```json
{
  "content": "Article content to summarize",
  "title": "Article title"
}
```

**Response:**
```json
{
  "summary": "AI-generated summary...",
  "source": "gemini"
}
```

## 🤖 AI Tools & Implementation

### 1. Gemini Text Summarization
- **API**: Gemini (Google GenAI) Summarization API
- **Purpose**: Generate intelligent article summaries
- **Features**: 
  - Extractive summarization
  - Configurable summary length
  - Language detection
  - Key concept extraction

### 2. Content Extraction & Processing
- **HTML Parsing**: Intelligent content extraction from news websites
- **Text Cleaning**: Removal of ads, navigation, and unwanted elements
- **Entity Decoding**: Proper handling of HTML entities
- **Smart Truncation**: Sentence-aware content limiting

### 3. Fallback Summarization
- **Local Processing**: Basic summarization when AI services are unavailable
- **Content Analysis**: Keyword extraction and importance scoring
- **Readable Output**: Clean, formatted summaries

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradient
- **Background**: Light gray (#F8FAFC) / Dark gray (#1F2937)
- **Text**: Dark gray (#1F2937) / Light gray (#F9FAFB)
- **Accent**: Blue (#3B82F6) for interactive elements

### Typography
- **Headings**: Bold, gradient text with proper hierarchy
- **Body**: Clean, readable fonts with optimal line spacing
- **Meta**: Smaller, muted text for timestamps and sources

### Components
- **Article Cards**: Uniform height with hover effects
- **Search Bar**: Integrated with search icon and clear functionality
- **Loading States**: Smooth spinners and skeleton screens
- **Error Handling**: User-friendly error messages and fallbacks

## 🚀 Deployment

### Live Application
**🌐 [Briefly News - Live Demo](https://brieflylatestnews.vercel.app/)**

The application is successfully deployed on Vercel and ready for use.

### Vercel (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required API keys in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment with environment variables
- **AWS Amplify**: Serverless deployment with CI/CD

## 🧪 Testing

### API Testing
Use the provided Postman collection (`postman_collection.json`) to test all endpoints:

1. **Import Collection**: Load the JSON file into Postman
2. **Set Environment Variables**: Add your API keys
3. **Run Tests**: Execute all requests to verify functionality

### Manual Testing
- **Search Functionality**: Test with various search terms
- **Article Navigation**: Verify article detail page loading
- **Responsive Design**: Test on different screen sizes
- **Error Handling**: Test with invalid URLs and API failures

## 🔒 Security Considerations

- **API Key Protection**: Environment variables for sensitive data
- **Input Validation**: URL sanitization and content filtering
- **Rate Limiting**: Respect API rate limits
- **Error Handling**: Graceful degradation on failures

## 📈 Performance Optimization

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: localStorage for search results
- **CDN**: Static assets served via CDN

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NewsAPI.org**: Primary news data source
- **GNews**: Secondary news source with full content
- **Gemini (Google GenAI)**: AI-powered text analysis
- **Next.js Team**: Amazing React framework
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/briefly-news/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/briefly-news/discussions)
- **Email**: your.email@example.com

---

**Built with ❤️ using Next.js, TypeScript, and AI-powered summarization**

## 🔑 Setting up Gemini (Google GenAI) API Key

1. Go to the [Google AI Studio API Key page](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account and create a new API key.
3. Copy the API key and add it to your `.env.local` file as:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Restart your development server if it's running.

The app will now use Gemini (Google GenAI) for all AI-powered summaries.
