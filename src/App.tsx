import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isError?: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100); // Delay to ensure smooth scrolling
  }, [messages]);

  // Auto-focus input on mount and after sending a message
  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);
  // Function to clean and format messages
  const cleanMessageContent = (content: string) => {
    return content
      .trim()
      .replace(/^\[\s*|\s*\]$/g, "") // Remove surrounding square brackets
      .replace(/\n/g, "  \n") // Preserve line breaks
      .replace(/\\\[(.*?)\\\]/g, "$$$1$$") // Convert \[...\] to block math ($$...$$)
      .replace(/\\\((.*?)\\\)/g, "$$$1$"); // Convert \(...\) to inline math ($...$)
  };
  // Handle Enter key submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      // API request payload
      const payload = {
        model: 'deepseek-r1-distill-qwen-7b', 
        messages: [
          { role: 'system', content: '' }, //TODO: Adjust later for System Prompt
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content: input.trim() },
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false,
      };
  
      console.log('Payload being sent:', JSON.stringify(payload, null, 2)); // Log payload for debugging
  
      // Make the API call
      const response = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      const data = await response.json();
  
      console.log('API Response:', data); // Log response for debugging
  
      // Process and add bot's response
      const rawContent = data.choices[0]?.message?.content || 'No response received.';
      const cleanContent = rawContent.replace(/<think>.*?<\/think>/gs, '').trim();
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: cleanContent,
        role: 'assistant',
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('API call failed:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: 'An error occurred while fetching the response.',
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-4xl h-screen p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 bg-gray-900 rounded-t-lg border-b border-gray-800">
          <Bot className="w-6 h-6 text-green-400" />
          <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 animate-fade-in ${ 
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`p-2 rounded-full flex-shrink-0 ${
                  message.role === 'user' ? 'bg-green-500' : 'bg-gray-800'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div
                className={`flex-1 px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-100'
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
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-400 animate-fade-in">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-gray-900 rounded-b-lg border-t border-gray-800"
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <button type="submit" aria-label="Send Message" disabled={!input.trim() || isLoading}>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;