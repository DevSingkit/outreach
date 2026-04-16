import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize once (server-safe singleton style)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

/**
 * Core text generator
 */
export async function generateText(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Chatbot-style conversational call
 * (use this for your AI assistant / chatbot sessions)
 */
export async function callGeminiChatbot({
  message,
  context,
}: {
  message: string;
  context?: string;
}): Promise<string> {
  const prompt = `
You are a helpful veterinary clinic assistant chatbot.

Context (if any):
${context ?? 'No prior context'}

User message:
${message}

Rules:
- Be concise and helpful
- If medical, stay general and safe
- If unsure, suggest contacting clinic staff
`;

  return await generateText(prompt);
}

export async function generatePreOpMessage({
  pet,
  schedule_date,
}: {
  pet: {
    pet_name: string;
    species: string;
    sex: string;
  };
  schedule_date: string;
}): Promise<string> {
  const prompt = `
You are a veterinary assistant.

Write a clear, friendly PRE-operation instruction message for a pet owner.

Details:
- Pet Name: ${pet.pet_name}
- Species: ${pet.species}
- Sex: ${pet.sex}
- Scheduled Date: ${schedule_date}

Rules:
- Keep it short (1–3 paragraphs)
- Simple language
- Include basic pre-op instructions (fasting, preparation, etc.)
- Friendly and reassuring tone
- No medical jargon
`;

  return await generateText(prompt);
}

export async function generatePostOpMessage({
  pet,
  procedure_type,
  medications_given,
  discharge_timestamp,
}: {
  pet: {
    pet_name: string;
    species: string;
    sex: string;
  };
  procedure_type: string;
  medications_given: string[];
  discharge_timestamp: string;
}): Promise<string> {
  const prompt = `
You are a veterinary assistant.

Write a clear, friendly post-operation care message for the pet owner.

Details:
- Pet Name: ${pet.pet_name}
- Species: ${pet.species}
- Sex: ${pet.sex}
- Procedure: ${procedure_type}
- Medications: ${medications_given.join(', ') || 'None'}
- Discharge Date: ${discharge_timestamp}

Rules:
- Keep it simple and reassuring
- Include basic after-care advice
- No medical jargon
- 1–3 short paragraphs
- Friendly tone
`;

  return await generateText(prompt);
}