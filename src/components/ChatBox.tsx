'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { UserProfile, MatchResult } from '@/types';

interface ChatBoxProps {
  schemeId: string;
  schemeName: string;
  userProfile: UserProfile | null;
  matchResult: MatchResult | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'Why am I eligible?',
  'What documents do I need?',
  'How do I apply?',
  'What are the benefits?'
];

export default function ChatBox({ schemeId, schemeName, userProfile, matchResult }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I can help you with questions about ${schemeName}. Ask me about eligibility, documents, benefits, loan amounts, or the application process.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          schemeId,
          userProfile,
          matchResult,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-h-[600px]">
      <div className="p-4 bg-blue-600 text-white font-medium">
        AI Assistant — {schemeName}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        {messages.length < 3 && !isLoading && (
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-xs bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend(input)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 pr-12"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-1 top-1 bottom-1 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
