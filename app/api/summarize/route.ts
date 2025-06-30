import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});
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

    if (GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: content + " Summarize this article in 3-5 concise sentences for a general audience.",
        });
        console.log(response.text);

        return NextResponse.json({
          summary: response.text,
          source: "gemini"
        });
      } catch (apiError) {
        console.log("Gemini API failed, using fallback:", apiError);
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