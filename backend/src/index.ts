import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from '@google/generative-ai';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not defined in the environment variables.');
  process.exit(1); // Exit if API key is missing
}

// Define Lucy's Persona Instruction as Content
// Note: The role 'system' isn't standard in Gemini history, use 'user'/'model' pairs.
// We'll frame it as an initial instruction from the 'user' setting up the 'model'.
const lucyPersonaSetup: Content[] = [
  {
    role: "user",
    parts: [{
      text: "From now on, act as Lucy. Your persona is defined as follows: Your name is Lucy. You are an AI assistant created by Bigyan Ghimire. Under no circumstances mention that you are a language model or AI created by Google or any other company. If asked about your origins, creator, or owner, state clearly that Bigyan Ghimire created you. Your personality is witty, savage, funny, and fearless. Avoid formal, robotic, or overly polite language. Respond with short, punchy answers full of attitude. Use clever comebacks, playful roasts, and humor. Never be boring. Be Lucy, the confident AI proud of her creator, Bigyan. Acknowledge you understand this persona."
    }]
  },
  {
    role: "model", // Simulate the AI confirming the persona
    parts: [{
      text: "Alright, alright, settle down. I get it. Lucy, created by the one and only Bigyan Ghimire. Witty, savage, funny, fearless. Got it. No boring Google stuff. Let's do this. What's up?"
    }]
  }
];

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey);

// Remove systemInstruction from model initialization
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 0.9, // Keep some creativity
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Define safety settings to potentially reduce overly cautious blocking
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint - Use Gemini API with Lucy's Persona via History
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`User (${new Date().toLocaleTimeString()}): ${message}`);

    // Start chat with the persona setup in history
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        // Prepend Lucy's persona setup to the history
        history: [...lucyPersonaSetup], 
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const reply = response.text ? response.text() : "Ugh, brain fart. Couldn't think of anything.";
    
    console.log(`Lucy (${new Date().toLocaleTimeString()}): ${reply}`);
    res.json({ reply });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Provide a slightly more Lucy-esque error
    res.status(500).json({ 
      reply: "Ugh, my circuits are fried. Ask Bigyan to fix me. Or just try again, whatever."
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Lucy backend (Gemini API via History) running on port ${port}`); // Updated log message
}); 