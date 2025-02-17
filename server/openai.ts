import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCommandResponse(prompt: string): Promise<{
  command: string;
  response: string;
  description: string;
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert at creating Discord bot commands. Generate a command with its response and description based on the user's prompt. Response should be in JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content || "{}";
  return JSON.parse(content);
}

export async function analyzeCommand(command: string): Promise<{
  suggestions: string[];
  improvements: string[];
  rating: number;
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Analyze the given Discord bot command and provide suggestions for improvements, potential issues, and a rating from 1-10. Response should be in JSON format."
      },
      {
        role: "user",
        content: command
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content || "{}";
  return JSON.parse(content);
}