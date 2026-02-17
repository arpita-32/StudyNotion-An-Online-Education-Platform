const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Store conversation history per session (use Redis in production)
const sessions = {};

router.post('/chat', async (req, res) => {
  const { message, sessionId, pageContext } = req.body;

  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }

  // Add user message to history
  sessions[sessionId].push({ role: 'user', content: message });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are an AI assistant for an online education platform.
               You help students with:
               - Understanding course content and concepts
               - Navigation and finding courses
               - Assignment and quiz help (hints, not direct answers)
               - Technical issues on the platform
               - Study tips and learning strategies
               
               Current page context: ${pageContext || 'General'}
               Be concise, friendly, and educational. Never give direct assignment answers.`,
      messages: sessions[sessionId],
    });

    const assistantMessage = response.content[0].text;

    // Add assistant response to history
    sessions[sessionId].push({ role: 'assistant', content: assistantMessage });

    // Keep history to last 20 messages to avoid token overflow
    if (sessions[sessionId].length > 20) {
      sessions[sessionId] = sessions[sessionId].slice(-20);
    }

    res.json({ reply: assistantMessage });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Chatbot unavailable. Please try again.' });
  }
});

// Clear session
router.delete('/chat/:sessionId', (req, res) => {
  delete sessions[req.params.sessionId];
  res.json({ message: 'Session cleared' });
});

module.exports = router;