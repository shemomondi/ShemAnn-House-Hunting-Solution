/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, HouseListing } from '../types';
import { Sparkles, Send, Bot, User, MessageSquare, Loader, ChevronDown, Check, GraduationCap } from 'lucide-react';

interface ChatbotProps {
  listings: HouseListing[];
  onSelectListing: (listing: HouseListing) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  listings,
  onSelectListing,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: "Habari! I am **NyumbaBot**, your AI Housing Solutions Advisor. 🏡\n\nFinding vacant apartments, checking borehole water consistency, or verifying landlord reputations can be tiring. Type what you are matching for, and I will recommend listings instantly (e.g., *'Bedsitter near Roysambu under 10k'*, or *'Any 2 bedroom with secure tenant parking'*). How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prompts = [
    'Bedsitter near Roysambu under 10k',
    'One Bedroom in Westlands with security',
    'Which rooms have borehole backup water?',
    'Affordable rooms for JKUAT comrades'
  ];

  // Auto scroll to latest speech
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error status');
      }

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metadata: {
            suggestedListingIds: data.suggestedListingIds || []
          }
        }
      ]);
    } catch (err) {
      console.error('Failed to query NyumbaBot service:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I apologize, I experienced a small signal issue connecting to the AI core. However, looking at the Nairobi Database snapshot, you can easily use the top Location filters to select Westlands or Kahawa Wendani and find matching rooms instantly!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        id="btn-open-bot"
        onClick={onClose}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-slate-950 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2.5 border border-slate-800 cursor-pointer"
      >
        <Bot className="w-6 h-6 text-emerald-400 animate-pulse" />
        <span className="text-xs font-bold font-mono tracking-wider pr-1">ASK NYUMBABOT AI</span>
      </button>
    );
  }

  return (
    <div id="ai-chatbot-window" className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-2xl border border-slate-205 shadow-2xl overflow-hidden flex flex-col h-[550px] transition-all">
      {/* Upper Brand Card */}
      <div className="bg-slate-950 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">Interactive AI</span>
            <h3 className="text-sm font-bold tracking-tight">NyumbaBot Advisor</h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition cursor-pointer"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Message History area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 relative" ref={scrollRef}>
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          // Find if there are matching suggested housing cards in this message
          const suggestedIds = m.metadata?.suggestedListingIds || [];
          const matchedHouses = listings.filter(h => suggestedIds.includes(h.id));

          return (
            <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-[10px] font-semibold font-mono">
                {isUser ? (
                  <>
                    <span>Tenant (Client)</span>
                    <User className="w-3 h-3 text-emerald-600" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-emerald-400" />
                    <span>NyumbaBot Smart Engine</span>
                  </>
                )}
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium'
                }`}
              >
                {/* Parse newline to br simply */}
                {m.text.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-1 last:mb-0'}>
                    {/* Render bold sections simply */}
                    {line.includes('**') ? (
                      line.split('**').map((chunk, j) => (j % 2 === 1 ? <strong key={j} className="font-bold text-slate-950">{chunk}</strong> : chunk))
                    ) : line.includes('*') ? (
                      line.split('*').map((chunk, j) => (j % 2 === 1 ? <em key={j} className="italic">{chunk}</em> : chunk))
                    ) : (
                      line
                    )}
                  </p>
                ))}

                {/* Display click shortcut suggestion loops if matched */}
                {matchedHouses.length > 0 && (
                  <div className="mt-3.5 space-y-2 border-t border-slate-100 pt-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Click shortcut cards below to inspect:
                    </span>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {matchedHouses.map((house) => (
                        <button
                          key={house.id}
                          onClick={() => {
                            onSelectListing(house);
                            // Highlight the open event visually or trigger detail modal
                          }}
                          className="w-full text-left bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 p-2 rounded-lg flex items-center justify-between transition cursor-pointer group"
                        >
                          <div className="truncate flex-1 pr-2">
                            <span className="text-[10px] block font-semibold text-emerald-600 uppercase">
                              {house.location.split(',')[0]}
                            </span>
                            <span className="text-xs font-bold text-slate-950 truncate block group-hover:text-emerald-900">
                              {house.title}
                            </span>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-slate-850 block font-mono">
                              KES {house.price.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400 capitalize bg-white px-1.5 py-0.2 rounded border">
                              {house.type.replace('_', ' ')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-[10px] font-mono">
              <Bot className="w-3 h-3 text-emerald-400 animate-spin" />
              <span>NyumbaBot analyzing Nairobi listings...</span>
            </div>
            <div className="bg-white border border-slate-250 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-xs">
              <Loader className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-slate-500 text-xs">Formulating recommendation list...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Fast prompt badges (Only if not loading) */}
      {!isLoading && (
        <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          {prompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1.3 rounded-full bg-white border border-slate-205 text-[11px] font-semibold text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition cursor-pointer shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input controls footer */}
      <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          id="ai-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Type e.g., Bedsitter under 10k KES..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
        />
        
        <button
          onClick={() => handleSend(input)}
          id="btn-send-chat"
          disabled={!input.trim() || isLoading}
          className={`px-3.5 py-2 rounded-xl text-white font-semibold transition-all flex items-center justify-center cursor-pointer ${
            input.trim() && !isLoading
              ? 'bg-slate-950 hover:bg-slate-850 active:scale-95'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
