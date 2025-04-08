import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiX, FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import { getAIResponseWithHistory } from "../../services/operations/aiAPI";
import toast from 'react-hot-toast';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const messagesEndRef = useRef(null);
    const MAX_CONTEXT_MESSAGES = 6; // Limit context to last 6 messages

    useEffect(() => {
        // Load chat history from localStorage on component mount
        const savedChat = localStorage.getItem('chatHistory');
        if (savedChat) setMessages(JSON.parse(savedChat));
    }, []);

    useEffect(() => {
        // Save chat history to localStorage whenever messages change
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        // Scroll to the bottom of the chat whenever new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setIsError(false);
        setErrorMessage(null);

        try {
            // Get recent chat history
            const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
            
            // Format history for API
            const apiHistory = recentMessages.map(msg => ({
                parts: [{ text: msg.text }],
                role: msg.sender === 'user' ? 'user' : 'model'
            }));

            // Call the service function
            const aiResponse = await getAIResponseWithHistory(input, apiHistory);
            
            // Add the AI response to the chat
            setMessages(prev => [...prev, { 
                text: aiResponse, 
                sender: 'bot' 
            }]);
            
        } catch (error) {
            console.error("Error getting AI response:", error);
            setIsError(true);
            setErrorMessage(error.message || "Failed to get AI response");
            toast.error("Could not get AI response");
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem('chatHistory');
        toast.success("Chat history cleared");
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isOpen ? (
                <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
                    <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Study Assistant</h3>
                        <div className="flex items-center">
                            {messages.length > 0 && (
                                <button 
                                    onClick={clearChat} 
                                    className="text-white hover:text-gray-200 mr-3"
                                    title="Clear chat history"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            )}
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="text-white hover:text-gray-200"
                                title="Close chat"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-20">Ask me anything about your courses!</div>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="text-left mb-3">
                                <div className="inline-block p-2 rounded-lg bg-gray-100 text-gray-800">Thinking...</div>
                            </div>
                        )}
                        {isError && (
                            <div className="text-center text-red-500 my-2">
                                {errorMessage || "Something went wrong"}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 border-t">
                        <div className="flex">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your question..."
                                className="flex-1 border rounded-l-lg p-2 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading || !input.trim()} 
                                className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <FiSend size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)} 
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
                    title="Open chat assistant"
                >
                    <FiMessageSquare size={24} />
                </button>
            )}
        </div>
    );
};

export default Chatbot;