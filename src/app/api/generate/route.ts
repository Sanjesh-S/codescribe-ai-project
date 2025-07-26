import OpenAI from 'openai';
import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

// Point to the Groq API
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return new Response('Code is required', { status: 400 });
    }

    // A more robust and explicit prompt for the AI
    const systemPrompt = `You are CodeScribe AI, an expert software engineer who writes clear, concise, and professional documentation for code snippets in Markdown format.

      Your documentation must include the following sections:
      1.  **Summary**: A brief overview of what the code does.
      2.  **Functionality**: A detailed explanation of the logic.
      3.  **Parameters/Props**: A description of any function parameters.
      4.  **Return Value/Output**: A description of what is returned or rendered.
      5.  **Example Usage**: A small code block showing how to use the code.
      
      Analyze the user's code and generate the documentation. If the user provides code that is too simple or unclear, ask them to provide a more complete code snippet.`;
    
    const userPrompt = `Here is the code I need documented:\n\n\`\`\`\n${code}\n\`\`\``;

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
    });

    // Manually create the stream
    const stream = new ReadableStream({
      async start(controller) {
        const textEncoder = new TextEncoder();
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(textEncoder.encode(text));
        }
        controller.close();
      },
    });

    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('An error occurred:', error);
    return new Response('An internal error occurred', { status: 500 });
  }
}