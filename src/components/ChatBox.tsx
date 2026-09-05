'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, Sparkles } from 'lucide-react';
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
  'What are the benefits?',
];

export default function ChatBox({ schemeId, schemeName, userProfile, matchResult }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I can answer any questions about **${schemeName}**. Ask me about your eligibility, required documents, benefits, loan amounts, or application steps.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

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
        body: JSON.stringify({ message: userMsg, schemeId, userProfile, matchResult }),
      });
      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden" style={{ maxHeight: '580px' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            )}
            <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-cyan-500/20'
                : 'glass-panel text-neutral-200 rounded-tl-sm border border-white/8'
            }`}>
              <div className="whitespace-pre-line">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0 mr-2">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="glass-panel text-neutral-400 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2 text-sm border border-white/8">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Analyzing scheme details...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Pills */}
      {messages.length < 3 && !isLoading && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-white/8">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button key={q} onClick={() => handleSend(q)}
              className="text-xs bg-white/5 border border-white/10 text-neutral-400 px-3 py-1.5 rounded-full hover:bg-cyan-500/15 hover:border-cyan-500/30 hover:text-cyan-300 transition-all">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="p-3 border-t border-white/8">
        <div className="flex gap-2 relative">
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend(input)}
            placeholder="Ask about this scheme..."
            disabled={isLoading}
            className="flex-1 rounded-full glass-input px-5 py-2.5 text-sm pr-12"
          />
          <button onClick={() => handleSend(input)} disabled={!input.trim() || isLoading}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 btn-quantum rounded-full disabled:opacity-30 flex items-center justify-center">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
