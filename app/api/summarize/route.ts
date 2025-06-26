import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Create a simple but effective summary from the content
    const createSummary = (text: string) => {
      // Clean the text and split into sentences
      const sentences = text
        .replace(/\[.*?\]/g, '') // Remove brackets content
        .replace(/\(.*?\)/g, '') // Remove parentheses content
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 20) // Only sentences with meaningful content
        .slice(0, 3); // Take first 3 sentences
      
      return sentences.join('. ') + '.';
    };

    // Try to use MeaningCloud API if API key is available
    const apiKey = process.env.MEANINGCLOUD_API_KEY;
    
    if (apiKey && apiKey !== "demo") {
      try {
        const summaryResponse = await fetch("https://api.meaningcloud.com/summarization-1.0", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            key: apiKey,
            txt: content,
            sentences: "3",
          }),
        });

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          
          if (summaryData.summary) {
            return NextResponse.json({
              summary: summaryData.summary,
              source: "meaningcloud"
            });
          }
        }
      } catch (apiError) {
        console.log("MeaningCloud API failed, using fallback:", apiError);
      }
    }

    // Fallback: create a simple summary
    const summary = createSummary(content);
    
    return NextResponse.json({
      summary,
      source: "fallback"
    });

  } catch (error) {
    console.error("Error in summarize API:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate summary",
        summary: "Summary not available at this time.",
        source: "error"
      },
      { status: 500 }
    );
  }
} 