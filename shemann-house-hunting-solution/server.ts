/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_LISTINGS } from './src/data/listings.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return mock client indicator or allow calling
    console.warn('GEMINI_API_KEY environment variable is not defined.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'MOCK_KEY_FOR_STANDALONE',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Database listing snapshot for AI context
const COMPACT_DATABASE = INITIAL_LISTINGS.map((h) => ({
  id: h.id,
  title: h.title,
  location: h.location,
  price: h.price,
  type: h.type,
  vacancy: h.vacancy,
  description: h.description,
  amenities: h.amenities,
  waterReliability: h.waterReliability,
  securityRating: h.securityRating,
  distanceFromCBD: h.distanceFromCBD,
}));

// AI Chat endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid messages body. Must be an array.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return highly helpful simulated AI response to avoid app crash if API key is not yet set up
      console.log('Skipping real API call - GEMINI_API_KEY missing. Providing high-fidelity simulated Kenya housing recommendation.');
      const lastMsgText = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let recommendedIds: string[] = [];

      // Simple keywords matching for simulation
      if (lastMsgText.includes('bedsitter') || lastMsgText.includes('single')) {
        recommendedIds = ['h1', 'h2'];
      } else if (lastMsgText.includes('westlands') || lastMsgText.includes('one bedroom')) {
        recommendedIds = ['h3', 'h6'];
      } else if (lastMsgText.includes('family') || lastMsgText.includes('two') || lastMsgText.includes('court')) {
        recommendedIds = ['h4', 'h8'];
      } else {
        recommendedIds = ['h1', 'h3', 'h4'];
      }

      res.json({
        text: `Hello there! I'm your House Hunting chatbot. Since the Gemini API key isn't fully configured yet, I'm analyzing our Nairobi database offline. \n\nBased on your query, here is an suggestions list of some amazing homes:\n- **${INITIAL_LISTINGS.find(h => h.id === recommendedIds[0])?.title || 'Modern Bedsitter'}** in ${INITIAL_LISTINGS.find(h => h.id === recommendedIds[0])?.location} for KES ${INITIAL_LISTINGS.find(h => h.id === recommendedIds[0])?.price}/mo.\n\nYou can click on any listings card in the search grid to explore photos, inspect water/security ratings, or unlock its landlord contact details directly! Please configure your GEMINI_API_KEY in the Secrets panel to activate full AI cognitive conversational capabilities.`,
        suggestedListingIds: recommendedIds,
      });
      return;
    }

    const ai = getGeminiClient();

    // Custom system prompt instructing the model to converse and recommend IDs matching our houses
    const systemPrompt = `You are "NyumbaBot", the highly intelligent conversational Rental Assistant for the "House Hunting Solution" web platform in Kenya.
Your mission is to guide tenants through the stressful journey of choosing a house (saving them transport money, energy, and internet bundles).
Speak in a friendly, respectful, and reassuring professional tone. You can occasionally use popular Kenyan real estate or helpful terms if appropriate.

IMPORTANT DATA (Our database of real listings available on the website):
${JSON.stringify(COMPACT_DATABASE, null, 2)}

HOW TO RESPOND:
1. Answer the tenant's question politely and offer rent/moving advice (e.g. tips on Roysambu water, Westlands accessibility, prepaid electricity, deposit policies).
2. If their query matches some listings in our database (e.g., they ask for "bedsitter under 10k", "house in Westlands", "place with kids playground", or "family apartments"), search through the provided listing array.
3. Recommend specific matching listings by title and price in KES. Instruct the user that they can view interactive full details, compound pictures, reviews, or unlock landlord contacts on the main dashboard panels.
4. You MUST append recommendations in a structured final JSON array or mention them cleanly so NyumbaBot's message parser can extract listing IDs. Specifically, to help the program render the recommended listings as immediate click shortcuts below your text, your response should explicitly list recommended house IDs anywhere in your text wrapped inside square brackets, like this: [RECOMMENDED: h1, h4] where h1 and h4 are the accurate listing IDs. Do NOT invent IDs; only use real ones from the database snapshot above (h1, h2, h3, h4, h5, h6, h7, h8).

Chat History from user:
${messages.map((m: any) => `${m.sender === 'user' ? 'Client' : 'NyumbaBot'}: ${m.text}`).join('\n')}

Provide the next conversational response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: systemPrompt,
    });

    const aiText = response.text || '';

    // Extract house IDs from response text matching h[1-8]
    const idRegex = /h[1-8]/gi;
    const matches = aiText.match(idRegex) || [];
    const suggestedListingIds = Array.from(new Set(matches.map((id) => id.toLowerCase())));

    res.json({
      text: aiText,
      suggestedListingIds,
    });
  } catch (error: any) {
    console.error('Gemini chat handler error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

// Configure Vite or Serve static React builds
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite developer mode middleware loaded.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static asset serving configured.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express application successfully booted on port ${PORT}`);
  });
}

setupServer();
