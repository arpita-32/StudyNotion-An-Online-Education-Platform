import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useChatbot } from "../../context/ChatbotContext";
import { AiOutlineSend } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FaRobot } from "react-icons/fa";

const Chatbot = () => {
  const { isOpen, setIsOpen, messages, sendMessage, isLoading, clearChat } =
    useChatbot();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation();

  // Map pathname to a human-readable page context
  const getPageContext = (pathname) => {
    if (pathname === "/") return "Home Page";
    if (pathname.startsWith("/catalog")) return "Course Catalog";
    if (pathname.startsWith("/courses")) return "Course Details Page";
    if (pathname.startsWith("/view-course")) return "Video Lecture Player";
    if (pathname.includes("dashboard/enrolled-courses"))
      return "Enrolled Courses Dashboard";
    if (pathname.includes("dashboard/cart")) return "Cart Page";
    if (pathname.includes("dashboard/add-course"))
      return "Add Course (Instructor)";
    if (pathname.includes("dashboard/my-courses"))
      return "My Courses (Instructor)";
    if (pathname.includes("dashboard/instructor"))
      return "Instructor Dashboard";
    if (pathname.includes("dashboard/settings")) return "Account Settings";
    if (pathname.includes("dashboard/my-profile")) return "My Profile";
    if (pathname === "/about") return "About Us Page";
    if (pathname === "/contact") return "Contact Page";
    if (pathname === "/login") return "Login Page";
    if (pathname === "/signup") return "Signup Page";
    return `Page: ${pathname}`;
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        96
      )}px`;
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed, getPageContext(location.pathname));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestion chips shown when chat is empty
  const suggestions = [
    "How do I enroll in a course?",
    "Help me understand this topic",
    "Show me available courses",
    "How do I reset my password?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="w-[360px] h-[520px] bg-richblack-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-richblack-600 animate-[slideUp_0.3s_ease]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] p-[1px] rounded-t-2xl">
            <div className="bg-richblack-800 rounded-t-2xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1FA2FF] to-[#12D8FA] flex items-center justify-center shadow-md">
                  <FaRobot className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-richblack-5 font-semibold text-sm leading-none">
                    EduBot
                  </p>
                  <span className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#12D8FA] animate-pulse" />
                    <p className="text-[11px] text-[#12D8FA]">Online</p>
                  </span>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="text-richblack-300 hover:text-pink-300 p-1.5 rounded-lg hover:bg-richblack-700 transition-all duration-200"
                >
                  <MdDeleteOutline className="text-lg" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-richblack-300 hover:text-richblack-5 p-1.5 rounded-lg hover:bg-richblack-700 transition-all duration-200"
                >
                  <IoClose className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Page Context Badge */}
          <div className="px-4 py-1.5 bg-richblack-700 border-b border-richblack-600">
            <p className="text-[11px] text-richblack-300">
              📍 {getPageContext(location.pathname)}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scroll-smooth">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Bot Avatar on messages */}
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1FA2FF] to-[#12D8FA] flex items-center justify-center flex-shrink-0 mb-0.5">
                    <FaRobot className="text-white text-xs" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#1FA2FF] to-[#12D8FA] text-richblack-900 font-medium rounded-br-sm"
                      : "bg-richblack-700 text-richblack-5 rounded-bl-sm border border-richblack-600"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Suggestion Chips — shown only on first message */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      sendMessage(s, getPageContext(location.pathname))
                    }
                    className="text-xs px-3 py-1.5 rounded-full border border-[#1FA2FF] text-[#1FA2FF] hover:bg-[#1FA2FF] hover:text-richblack-900 transition-all duration-200 font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1FA2FF] to-[#12D8FA] flex items-center justify-center flex-shrink-0">
                  <FaRobot className="text-white text-xs" />
                </div>
                <div className="bg-richblack-700 border border-richblack-600 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="w-2 h-2 rounded-full bg-[#12D8FA] animate-bounce"
                      style={{ animationDelay: `${dot * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-3 py-3 border-t border-richblack-600 bg-richblack-800">
            <div className="flex items-end gap-2 bg-richblack-700 rounded-xl px-3 py-2 border border-richblack-500 focus-within:border-[#1FA2FF] transition-colors duration-200">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows={1}
                className="flex-1 bg-transparent text-richblack-5 text-sm resize-none outline-none placeholder:text-richblack-400 max-h-24 py-0.5 leading-relaxed"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="mb-0.5 w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#1FA2FF] to-[#12D8FA] text-richblack-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-150 shadow-md"
              >
                <AiOutlineSend className="text-base" />
              </button>
            </div>
            <p className="text-center text-[10px] text-richblack-400 mt-1.5">
              Powered by AI · Press Enter to send
            </p>
          </div>
        </div>
      )}

      {/* ── Floating Toggle Button ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle EduBot"
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-richblack-700 border-2 border-richblack-500 text-richblack-200"
            : "bg-gradient-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-richblack-900"
        }`}
      >
        {isOpen ? (
          <IoClose className="text-2xl" />
        ) : (
          <BsChatDotsFill className="text-2xl" />
        )}
      </button>
    </div>
  );
};

export default Chatbot;