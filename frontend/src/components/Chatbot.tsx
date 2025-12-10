import { useState, useRef, useEffect } from "react";
import { chatAPI } from "@/lib/api";
import { ChatMessage, AIConclusion } from "@/lib/types";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface Props {
  onConclusion: (data: AIConclusion) => void;
  onClose: () => void;
}

export default function Chatbot({ onConclusion, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I'm your AI health assistant. Please describe your symptoms, and I'll help you understand your condition and find the right healthcare provider.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await chatAPI.send(userMessage);
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);

      if (data.isConclusion) {
        onConclusion({
          disease: data.disease || "",
          severity: data.severity || "medium",
          medications: data.medications || [],
          hospitals: data.hospitals || [],
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-white rounded-t-lg shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              AI Health Assistant
            </h3>
            <p className="text-xs text-gray-500">
              Powered by advanced medical AI
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50 min-h-[200px] sm:min-h-[300px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } animate-in slide-in-from-bottom duration-300`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-3 shadow-sm ${
                msg.sender === "user"
                  ? "bg-green-600 text-white rounded-l-2xl rounded-tr-2xl rounded-br-md"
                  : "bg-white text-gray-900 rounded-r-2xl rounded-tl-2xl rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
            <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-r-2xl rounded-tl-2xl rounded-bl-md shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-lg shrink-0">
        <div className="flex space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-xl bg-white text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
              placeholder="Describe your symptoms..."
              rows={1}
              style={{ minHeight: "40px", maxHeight: "100px" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-[40px] sm:h-[48px] px-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm cursor-pointer"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
