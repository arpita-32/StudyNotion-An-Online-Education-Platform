import toast from "react-hot-toast";
import { endpoints } from "../api";
import { apiConnector } from "../apiconnector";

const { AI_CHAT_API } = endpoints;

// Pre-computed knowledge about the platform
const platformKnowledge = `
- This is a learning platform for students
- Students can access courses, assignments, and resources
- The platform offers personalized recommendations
- Students can track their progress and set goals
- There are discussion forums for each course
- Instructors can provide feedback on assignments
`.trim();

/**
 * Get AI response with context preservation
 * @param {string} question - The user's question
 * @param {Function} setLoading - Function to set loading state
 * @param {Function} setAIResponse - Function to handle the AI response
 * @param {Function} setErrorMessage - Function to set error message
 * @param {Function} setIsError - Function to set error state
 * @param {Array} history - Chat history
 * @param {number} maxContextMessages - Maximum number of messages to include in context
 */
export async function getAIResponse(
    question,
    setLoading,
    setAIResponse,
    setErrorMessage,
    setIsError,
    history = [],
    maxContextMessages = 6
) {
    const toastId = toast.loading("Loading...");
    setLoading(true);
    try {
        // Format the recent messages for the API
        const recentHistory = history.slice(-maxContextMessages);
        const apiHistory = recentHistory.map(msg => ({
            parts: [{ text: msg.text }],
            role: msg.sender === 'user' ? 'user' : 'model'
        }));

        // Add system message with platform knowledge
        const systemMessage = {
            role: "model",
            parts: [{ text: `I'm a study assistant for the platform. Here's some information about our platform: ${platformKnowledge}. Please keep your answers concise (under 100 words when possible).` }]
        };

        // Add the system message at the beginning
        apiHistory.unshift(systemMessage);

        // Log the request for debugging
        console.log("Sending request to AI API with question:", question);
        
        const response = await apiConnector("POST", AI_CHAT_API, {
            prompt: question,
            history: apiHistory
        });

        console.log("AI API RESPONSE.....", response);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to get response from AI service");
        }

        toast.success("AI Response Received");
        setAIResponse(response.data.data.answer);
    } catch (error) {
        console.log("AI API ERROR.....", error);
        toast.error("Could not get AI Response");
        setIsError(true);
        setErrorMessage(error.response?.data?.message || error.message || "Unknown error occurred");
    } finally {
        setLoading(false);
        toast.dismiss(toastId);
    }
}

/**
 * Simple function to get AI response without callbacks
 * @param {string} prompt - User's question
 * @param {Array} history - Chat history
 * @returns {Promise<string>} - AI response text
 */
export async function getAIResponseWithHistory(prompt, history = []) {
    try {
        // Don't use any special role for system information
        const apiHistory = [...history];
        
        // Add platform knowledge to the user prompt instead
        const enhancedPrompt = `${prompt}\n\nContext: I'm a study assistant for the learning platform. Please keep answers concise (under 100 words).`;
        
        const response = await apiConnector("POST", AI_CHAT_API, {
            prompt: enhancedPrompt,
            history: apiHistory.filter(msg => msg.role !== "system" && msg.role !== "model")
        });
        
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to get AI response");
        }
        
        return response.data.data.answer;
    } catch (error) {
        console.error("AI API error:", error);
        throw error;
    }
}