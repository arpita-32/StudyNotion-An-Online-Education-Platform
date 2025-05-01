const axios = require("axios");

exports.chatbotPrompt = async (req, res) => {
  try {
    // Validate request
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
      });
    }

    const { prompt, history = [] } = req.body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Valid text prompt is required",
      });
    }

    // Validate history structure
    if (!Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        message: "History must be an array",
      });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("Missing Gemini API key");
      return res.status(500).json({
        success: false,
        message: "Server configuration error - API key missing",
      });
    }

    // API Configuration
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
    
    // Build conversation history
    const contents = [];
    
    // Add system message if no history exists
    if (history.length === 0) {
      contents.push(
        {
          role: "user",
          parts: [{ text: "You are a helpful AI assistant. Keep responses concise (1-2 sentences maximum)."}]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will provide clear and concise responses."}]
        }
      );
    }

    // Add validated conversation history
    for (const msg of history) {
      try {
        if (msg.role && msg.parts && Array.isArray(msg.parts)) {
          const validParts = msg.parts
            .filter(part => part.text && typeof part.text === 'string')
            .map(part => ({ text: part.text }));
          
          if (validParts.length > 0) {
            contents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: validParts
            });
          }
        }
      } catch (err) {
        console.warn("Invalid history message skipped:", err);
      }
    }

    // Add current prompt
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    // Request configuration
    const requestData = {
      contents,
      generationConfig: {
        maxOutputTokens: 200,  // Slightly higher for better responses
        temperature: 0.7,
        topP: 0.9,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    };

    console.debug("Sending to Gemini API:", {
      url: API_URL,
      data: requestData
    });

    // Make API call with timeout
    const response = await axios.post(API_URL, requestData, {
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      timeout: 15000  // 15 seconds timeout
    });

    // Validate and extract response
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected API response format:", response.data);
      throw new Error("Received unexpected response format from Gemini API");
    }

    const generatedText = response.data.candidates[0].content.parts[0].text;

    return res.json({ 
      success: true, 
      data: { 
        answer: generatedText,
        fullResponse: response.data  // Optional: for debugging
      } 
    });

  } catch (error) {
    console.error("API Error:", {
      error: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    // Determine appropriate status code
    const statusCode = error.response?.status || 
                      error.code === 'ECONNABORTED' ? 504 : 
                      500;

    return res.status(statusCode).json({
      success: false,
      message: "Error processing your AI request",
      error: process.env.NODE_ENV === 'development' ? 
        {
          message: error.message,
          details: error.response?.data?.error || null
        } : 
        null
    });
  }
};