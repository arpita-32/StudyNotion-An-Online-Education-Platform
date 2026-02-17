import { createContext, useContext, useState, useCallback } from "react";

const ChatbotContext = createContext();

// Simple unique ID generator — no external package needed
const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your EduBot. I can help you with courses, concepts, assignments, and anything on this platform. What's on your mind?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateId());

  const sendMessage = useCallback(
    async (text, pageContext) => {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/v1/chatbot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, sessionId, pageContext }),
        });
        const data = await res.json();

        if (data.success) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply },
          ]);
        } else {
          throw new Error(data.message);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I'm having trouble responding right now. Please try again in a moment.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId]
  );

  const clearChat = useCallback(async () => {
    try {
      await fetch(`/api/v1/chatbot/chat/${sessionId}`, { method: "DELETE" });
    } catch {
      // silently fail
    }
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! How can I help you?",
      },
    ]);
  }, [sessionId]);

  return (
    <ChatbotContext.Provider
      value={{ isOpen, setIsOpen, messages, sendMessage, isLoading, clearChat }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);