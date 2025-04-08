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

    const API_URL =
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

    let requestData = {
      contents: [],
    };

    // Add chat history if provided
    if (history && history.length > 0) {
      requestData.contents = history.filter((msg) => msg.role !== "system");
    }

    // Add system message at the beginning of conversation if history is empty
    if (!history || history.length === 0) {
      requestData.contents.push({
        role: "model",
        parts: [{ text: "I'm a helpful assistant providing clear, concise responses." }],
      });
    }

    // Add the user's prompt without additional instructions
    requestData.contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    // Configure for concise responses through API parameters instead of prompt instructions
    const generationConfig = {
      maxOutputTokens: 70, // Reduced to enforce brevity
      temperature: 0.5,    // Slightly lower for more focused responses
      topP: 0.8,
      topK: 40,
      stopSequences: [],
    };

    console.log("Sending request to Gemini API:", {
      url: API_URL,
      data: requestData,
    });

    // Make the API request using axios
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        ...requestData,
        generationConfig,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the generated text
    const generatedText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    console.log("Received response from Gemini API");

    // Send successful response
    res.status(200).json({
      success: true,
      data: { answer: generatedText },
      response: generatedText,
    });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Error processing your request",
      error: error.response?.data?.error?.message || error.toString(),
    });
  }
};