import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const { title, body } = await request.json();
    
    if (!title || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: title and body' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a content editor assistant. Provide clear, well-structured output in HTML format.",
        },
        {
          role: "user",
          content: body,
        },
      ],
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content || "";
    
    return NextResponse.json({ 
      success: true,
      generated: generatedText 
    });

  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to process content",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// interface GenerateRequest {
//   title: string;
//   body: string;
// }

// interface GenerateResponse {
//   success: boolean;
//   generated?: string;
//   error?: string;
//   details?: string;
// }