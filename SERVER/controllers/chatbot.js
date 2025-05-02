const axios = require("axios");

exports.chatbotPrompt = async (req, res) => {
  try {
    const { prompt, history } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: "API key configuration error",
      });
    }

    // Try using the more widely available gemini-pro model
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`;

    let requestData = {
      contents: [],
    };

    // Format history properly
    if (history && history.length > 0) {
      requestData.contents = history.map(msg => ({
        role: msg.role || (msg.sender === 'user' ? 'user' : 'model'),
        parts: [{ text: msg.text || msg.parts[0].text }]
      }));
    }

    // Add the user's prompt
    requestData.contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    // Make the API request
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the generated text more safely
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response. Please try again.";

    res.status(200).json({
      success: true,
      data: { answer: generatedText },
    });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Error processing your request",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};