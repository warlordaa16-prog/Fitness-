import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Dumbbell, Apple, Flame, RefreshCcw } from 'lucide-react';
import { UserStats, UserGoals } from '../types';

interface AICoachTabProps {
  stats: UserStats;
  goals: UserGoals;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AICoachTab: React.FC<AICoachTabProps> = ({ stats, goals }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello Alex! I'm your FitPulse AI Coach. Whether you need a customized workout routine for muscle gain, advice on fueling your runs, or recovery tips, I'm here to help. What's your fitness question today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    "Design a 20-min core workout with zero equipment",
    "What should I eat for optimal muscle recovery after lifting?",
    "How can I break through my current weight plateau?",
    "Give me tips to improve my daily step count"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || inputMessage;
    if (!promptText.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: promptText };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          userStats: stats,
          goal: "General Fitness & Weight Loss"
        })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Keep crushing your goals! Stay hydrated and keep moving." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the AI coaching service right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
          <Bot className="h-7 w-7 text-orange-400" />
          <span>FitPulse AI Fitness & Nutrition Coach</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Powered by Gemini 2.5 Flash for expert, science-backed workout and nutrition guidance.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-[600px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white'
                    : 'bg-slate-800 border border-slate-700 text-orange-400'
                }`}>
                  {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>

                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-slate-800 border border-slate-700 text-orange-400 flex items-center justify-center">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-400 flex items-center space-x-2">
                <RefreshCcw className="h-4 w-4 animate-spin text-orange-400" />
                <span>Coach is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Suggestions:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl whitespace-nowrap border border-slate-700/80 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              placeholder="Ask your AI coach anything about workouts, diet, or recovery..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-lg shadow-orange-500/25 transition flex items-center space-x-2"
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
