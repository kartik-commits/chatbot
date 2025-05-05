import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertCircle, Plus, Trash2, MessageSquare, Upload, Moon, Sun } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isError?: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  documents?: string[];
}

const initialChat: Chat = {
  id: "1",
  title: "New Chat",
  messages: [],
  createdAt: new Date(),
  documents: [],
};

function App() {
  const [chats, setChats] = useState<Chat[]>([initialChat]);
  const [currentChatId, setCurrentChatId] = useState(initialChat.id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId) || chats[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [currentChat.messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, currentChatId]);

  const cleanMessageContent = (content: string) => {
    return content
      .trim()
      .replace(/^\[\s*|\s*\]$/g, "")
      .replace(/\n/g, "  \n")
      .replace(/\\\[(.*?)\\\]/g, "$$$1$$")
      .replace(/\\\((.*?)\\\)/g, "$$$1$$");
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      documents: [],
    };
    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    if (chats.length === 1) {
      createNewChat();
    }
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(chats[0].id);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((file) => file.name);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, documents: [...(chat.documents || []), ...fileNames] }
            : chat
        )
      );

      const uploadMessage: Message = {
        id: Date.now().toString(),
        content: `Uploaded documents: ${fileNames.join(", ")}`,
        role: "assistant",
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, uploadMessage] }
            : chat
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );
    setInput("");
    setIsLoading(true);

    try {
      const payload = {
        model: "deepseek-r1-distill-qwen-7b",
        messages: [
          { role: "system", content: "" },
          ...currentChat.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: "user", content: input.trim() },
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false,
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      const response = await fetch("http://localhost:1234/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const rawContent = data.choices[0]?.message?.content || "No response received.";
      const cleanContent = rawContent.replace(/<think>.*?<\/think>/gs, "").trim();

      const botMessage: Message = {
        id: Date.now().toString(),
        content: cleanContent,
        role: "assistant",
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        )
      );
    } catch (error) {
      console.error("API call failed:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "An error occurred while fetching the response.",
        role: "assistant",
        timestamp: new Date(),
        isError: true,
      };
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-screen flex ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`w-64 flex-shrink-0 border-r ${
              darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <button
                  onClick={createNewChat}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  <Plus size={20} />
                  <span>New Chat</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setCurrentChatId(chat.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      chat.id === currentChatId
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700/50 text-gray-300"
                    }`}
                  >
                    <MessageSquare size={18} />
                    <span className="flex-1 truncate text-left">{chat.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">
        <header
          className={`h-14 flex items-center justify-between px-4 border-b ${
            darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
            >
              <MessageSquare size={20} />
            </button>
            <h1 className="ml-4 font-medium">AI Chat Assistant</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            darkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          {currentChat.messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 max-w-2xl mx-auto ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`p-2 rounded-full flex-shrink-0 ${
                  message.role === "user" ? "bg-green-500" : "bg-gray-800"
                }`}
              >
                {message.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div
                className={`flex-1 px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-green-600 text-white"
                    : darkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-800"
                }`}
              >
                {message.isError ? (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      className="text-sm"
                    >
                      {cleanMessageContent(message.content)}
                    </ReactMarkdown>
                  </div>
                )}
                <span className="text-xs opacity-50 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-400 max-w-2xl mx-auto animate-fade-in">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className={`p-4 border-t ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={`flex-1 px-4 py-2 rounded-lg outline-none ${
                darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
              title="Upload Document"
            >
              <Upload size={20} />
            </button>
            <button
              type="submit"
              aria-label="Send Message"
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-lg transition-colors ${
                input.trim() && !isLoading
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;